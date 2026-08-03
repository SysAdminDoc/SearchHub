const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'share helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL, URLSearchParams };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__share = { buildShareURL, parseShareParams, resolveShareEngineIDs };`,
  context,
  { filename: 'index.html' }
);

const { buildShareURL, parseShareParams, resolveShareEngineIDs } = context.__share;
const data = {
  'Web Search': { engines: [
    { name: 'Google', url: 'https://google.test', desc: '' },
    { name: 'DuckDuckGo', url: 'https://ddg.test', desc: '' }
  ] },
  Videos: { engines: [{ name: 'YouTube', url: 'https://youtube.test', desc: '' }] },
  Learning: { engines: [{ name: 'YouTube', url: 'https://youtube-learning.test', desc: '' }] }
};

const sharedURL = buildShareURL('rain storm', ['0-0', '0-1', '1-0', '2-0'], data, 'https://example.test/index.html?old=1#old');
assert.equal(sharedURL, 'https://example.test/index.html?q=rain%20storm&e=google,ddg,videos-youtube,learning-youtube');
assert.deepEqual(JSON.parse(JSON.stringify(resolveShareEngineIDs(data, 'google,ddg,videos-youtube,learning-youtube'))), ['0-0', '0-1', '1-0', '2-0']);
assert.deepEqual(JSON.parse(JSON.stringify(parseShareParams('?q=rain%20storm&e=google,ddg'))), { query: 'rain storm', engineTokens: ['google', 'ddg'] });
assert.deepEqual(JSON.parse(JSON.stringify(parseShareParams('?q=too%20long'))), { query: 'too long', engineTokens: null });

console.log('share URL tests passed');
