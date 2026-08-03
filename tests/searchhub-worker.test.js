const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('searchhub-worker.js', 'utf8');
assert.match(source, /export default worker;/);
const executable = source.replace(/export default worker;\s*$/, `this.__worker = { worker, handleRequest, parseDuckDuckGoResults, parseBingResults, parseGoogleNewsResults };`);
const context = {
  console,
  URL,
  Request,
  Response,
  AbortController,
  setTimeout,
  clearTimeout
};
vm.createContext(context);
vm.runInContext(executable, context, { filename: 'searchhub-worker.js' });

const { worker, handleRequest, parseDuckDuckGoResults, parseBingResults, parseGoogleNewsResults } = context.__worker;
assert.equal(worker.fetch, handleRequest);

const duckResults = parseDuckDuckGoResults('<a class="result__a" href="https://example.test/a">Example &amp; one</a>');
assert.deepEqual(JSON.parse(JSON.stringify(duckResults)), [{ title: 'Example & one', url: 'https://example.test/a', snippet: '' }]);

const bingResults = parseBingResults('<li class="b_algo"><h2><a href="https://bing.test/a">Bing result</a></h2><p>A useful snippet.</p></li>');
assert.deepEqual(JSON.parse(JSON.stringify(bingResults)), [{ title: 'Bing result', url: 'https://bing.test/a', snippet: 'A useful snippet.' }]);

const newsResults = parseGoogleNewsResults('<item><title>News result</title><link>https://news.test/a</link><description>News snippet</description><pubDate>Mon, 03 Aug 2026 12:00:00 GMT</pubDate></item>');
assert.deepEqual(JSON.parse(JSON.stringify(newsResults)), [{
  title: 'News result',
  url: 'https://news.test/a',
  snippet: 'News snippet',
  publishedAt: 'Mon, 03 Aug 2026 12:00:00 GMT'
}]);

const fakeFetch = async sourceURL => {
  if (sourceURL.includes('duckduckgo')) return new Response('<a class="result__a" href="https://example.test/a">Example &amp; one</a>', { status: 200 });
  if (sourceURL.includes('bing.com')) return new Response('<li class="b_algo"><h2><a href="https://bing.test/a">Bing result</a></h2><p>A useful snippet.</p></li>', { status: 200 });
  return new Response('<item><title>News result</title><link>https://news.test/a</link><description>News snippet</description></item>', { status: 200 });
};

(async () => {
  const request = new Request('https://worker.test/?q=red+fox');
  const htmlResponse = await handleRequest(request, { fetch: fakeFetch });
  assert.equal(htmlResponse.status, 200);
  const html = await htmlResponse.text();
  assert.match(html, /Merged results for/);
  assert.match(html, /Example &amp; one/);
  assert.match(html, /Google News RSS/);
  assert.match(html, /SearchHub Worker is an optional self-hostable companion/);

  const jsonResponse = await handleRequest(new Request('https://worker.test/?q=red+fox&format=json'), { fetch: fakeFetch });
  const payload = await jsonResponse.json();
  assert.equal(payload.query, 'red fox');
  assert.equal(payload.results.length, 3);
  assert.deepEqual(payload.sources.map(source => source.status), ['ok', 'ok', 'ok']);

  const health = await handleRequest(new Request('https://worker.test/health'));
  assert.deepEqual(await health.json(), { ok: true, sources: ['duckduckgo', 'bing', 'google-news'] });
  assert.equal((await handleRequest(new Request('https://worker.test/'), {})).status, 200);
  assert.equal((await handleRequest(new Request('https://worker.test/', { method: 'POST' }), {})).status, 405);
  assert.equal((await handleRequest(new Request('https://worker.test/', { method: 'OPTIONS' }), {})).status, 204);

  console.log('SearchHub worker tests passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
