const MAX_QUERY_LENGTH = 500;
const MAX_SOURCE_RESULTS = 5;
const MAX_TOTAL_RESULTS = 20;
const REQUEST_TIMEOUT_MS = 8000;

function encodeQuery(query) {
  return encodeURIComponent(query);
}

function getQuotedAttribute(attributes, name) {
  const doubleQuoted = new RegExp('\\b' + name + '\\s*=\\s*"([^"]*)"', 'i').exec(attributes);
  if (doubleQuoted) return doubleQuoted[1];
  const singleQuoted = new RegExp("\\b" + name + "\\s*=\\s*'([^']*)'", 'i').exec(attributes);
  return singleQuoted ? singleQuoted[1] : '';
}

function hasClass(attributes, className) {
  return getQuotedAttribute(attributes, 'class').split(/\s+/).includes(className);
}

function decodeHTML(value) {
  const named = { amp: '&', apos: "'", gt: '>', lt: '<', nbsp: ' ', quot: '"' };
  return String(value || '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] || match);
}

function stripHTML(value) {
  return decodeHTML(String(value || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function normalizeResultURL(value) {
  const raw = decodeHTML(String(value || '').trim());
  if (!raw) return '';
  const candidate = raw.startsWith('//') ? 'https:' + raw : raw;
  try {
    const parsed = new URL(candidate, 'https://searchhub.invalid');
    if (!/^https?:$/i.test(parsed.protocol) || parsed.hostname === 'searchhub.invalid') return '';
    if (parsed.hostname.endsWith('duckduckgo.com') && parsed.pathname === '/l/') {
      const redirected = parsed.searchParams.get('uddg');
      if (redirected) return normalizeResultURL(redirected);
    }
    return parsed.href;
  } catch { return ''; }
}

function parseDuckDuckGoResults(html) {
  const results = [];
  for (const match of String(html || '').matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    if (!hasClass(match[1], 'result__a')) continue;
    const url = normalizeResultURL(getQuotedAttribute(match[1], 'href'));
    const title = stripHTML(match[2]);
    if (url && title) results.push({ title, url, snippet: '' });
  }
  return results;
}

function parseBingResults(html) {
  const results = [];
  for (const item of String(html || '').matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/gi)) {
    if (!hasClass(item[1], 'b_algo')) continue;
    const heading = /<h2\b[\s\S]*?<a\b([^>]*)>([\s\S]*?)<\/a>/i.exec(item[2]);
    if (!heading) continue;
    const url = normalizeResultURL(getQuotedAttribute(heading[1], 'href'));
    const title = stripHTML(heading[2]);
    const paragraph = /<p\b[^>]*>([\s\S]*?)<\/p>/i.exec(item[2]);
    const snippet = paragraph ? stripHTML(paragraph[1]) : '';
    if (url && title) results.push({ title, url, snippet });
  }
  return results;
}

function parseGoogleNewsResults(xml) {
  const results = [];
  for (const item of String(xml || '').matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
    const block = item[1];
    const title = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(block);
    const link = /<link\b[^>]*>([\s\S]*?)<\/link>/i.exec(block);
    const description = /<description\b[^>]*>([\s\S]*?)<\/description>/i.exec(block);
    const published = /<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i.exec(block);
    const normalizedURL = normalizeResultURL(stripHTML(link?.[1] || ''));
    const normalizedTitle = stripHTML(title?.[1] || '');
    if (normalizedURL && normalizedTitle) {
      results.push({
        title: normalizedTitle,
        url: normalizedURL,
        snippet: stripHTML(description?.[1] || ''),
        publishedAt: stripHTML(published?.[1] || '')
      });
    }
  }
  return results;
}

const SEARCH_SOURCES = [
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    url: query => 'https://html.duckduckgo.com/html/?q=' + encodeQuery(query),
    parse: parseDuckDuckGoResults
  },
  {
    id: 'bing',
    name: 'Bing',
    url: query => 'https://www.bing.com/search?q=' + encodeQuery(query) + '&count=10',
    parse: parseBingResults
  },
  {
    id: 'google-news',
    name: 'Google News RSS',
    url: query => 'https://news.google.com/rss/search?q=' + encodeQuery(query) + '&hl=en-US&gl=US&ceid=US:en',
    parse: parseGoogleNewsResults
  }
];

function normalizeQuery(value) {
  return typeof value === 'string' ? value.trim().slice(0, MAX_QUERY_LENGTH) : '';
}

function dedupeResults(sourceResults) {
  const seen = new Set();
  const results = [];
  for (const source of sourceResults) {
    for (const result of source.results) {
      const key = result.url.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({ ...result, source: source.name });
      if (results.length >= MAX_TOTAL_RESULTS) return results;
    }
  }
  return results;
}

async function fetchSource(source, query, fetchImpl) {
  if (typeof fetchImpl !== 'function') throw new Error('fetch is unavailable');
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS) : null;
  try {
    const response = await fetchImpl(source.url(query), {
      headers: { accept: 'text/html,application/xhtml+xml,application/xml;q=0.9' },
      redirect: 'follow',
      ...(controller ? { signal: controller.signal } : {})
    });
    if (!response || !response.ok) throw new Error('HTTP ' + (response?.status || 0));
    const results = source.parse(await response.text()).slice(0, MAX_SOURCE_RESULTS);
    return { id: source.id, name: source.name, status: 'ok', count: results.length, results };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function searchSources(query, fetchImpl) {
  const settled = await Promise.all(SEARCH_SOURCES.map(source => fetchSource(source, query, fetchImpl).catch(error => ({
    id: source.id,
    name: source.name,
    status: 'error',
    count: 0,
    error: String(error?.message || error).slice(0, 160),
    results: []
  }))));
  return { sources: settled, results: dedupeResults(settled) };
}

function escapeHTML(value) {
  return String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function responseHeaders(contentType) {
  return {
    'content-type': contentType,
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, HEAD, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'x-content-type-options': 'nosniff'
  };
}

function makeResponse(body, status, contentType, request) {
  const emptyBody = request?.method === 'HEAD' || [204, 205, 304].includes(status);
  return new Response(emptyBody ? null : body, {
    status,
    headers: responseHeaders(contentType)
  });
}

function renderSearchPage(model) {
  const sourceSummary = model.sources.map(source => {
    const status = source.status === 'ok' ? source.count + ' results' : 'unavailable';
    return '<li><strong>' + escapeHTML(source.name) + '</strong> <span>' + escapeHTML(status) + '</span></li>';
  }).join('');
  const resultMarkup = model.results.length ? model.results.map(result => {
    const published = result.publishedAt ? '<time>' + escapeHTML(result.publishedAt) + '</time>' : '';
    const snippet = result.snippet ? '<p>' + escapeHTML(result.snippet) + '</p>' : '';
    return '<article><h2><a href="' + escapeHTML(result.url) + '" rel="noopener noreferrer">' + escapeHTML(result.title) + '</a></h2><div class="source">' + escapeHTML(result.source) + ' ' + published + '</div>' + snippet + '</article>';
  }).join('') : '<p class="empty">No results were returned. Source availability can vary by deployment and query.</p>';
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SearchHub Worker</title><style>' +
    'body{margin:0;background:#10131a;color:#e6e9ef;font:15px/1.5 system-ui,sans-serif}main{max-width:860px;margin:0 auto;padding:32px 18px}h1{font-size:24px;margin:0 0 18px}form{display:flex;gap:8px;margin-bottom:18px}input{min-width:0;flex:1;padding:10px 12px;border:1px solid #3a4352;border-radius:6px;background:#1b202b;color:inherit;font:inherit}button{padding:10px 16px;border:0;border-radius:6px;background:#6ea8fe;color:#07111f;font-weight:700;cursor:pointer}.meta{color:#a9b2c2;font-size:13px}.sources{padding:0;margin:8px 0 24px;list-style:none;display:flex;gap:12px;flex-wrap:wrap}.sources li{color:#a9b2c2}.sources span{color:#78d6a2}article{padding:14px 0;border-top:1px solid #2b3340}article h2{margin:0;font-size:18px}article a{color:#8db8ff;text-decoration:none}article a:hover{text-decoration:underline}article p{margin:6px 0 0;color:#c0c7d2}.source{color:#8b96a8;font-size:12px}.empty{color:#a9b2c2}small{color:#8b96a8}' +
    '</style></head><body><main><h1>SearchHub Worker</h1><form method="get"><input name="q" value="' + escapeHTML(model.query) + '" maxlength="500" autofocus><button type="submit">Search</button></form>' +
    (model.query ? '<div class="meta">Merged results for <strong>' + escapeHTML(model.query) + '</strong></div><ul class="sources">' + sourceSummary + '</ul>' + resultMarkup : '<p class="meta">Deploy this optional worker and visit <code>/?q=your+query</code> to merge results from the curated sources.</p>') +
    '<small>SearchHub Worker is an optional self-hostable companion to the static app.</small></main></body></html>';
}

async function handleRequest(request, env = {}) {
  if (request?.method === 'OPTIONS') return makeResponse('', 204, 'text/plain; charset=utf-8', request);
  if (!['GET', 'HEAD'].includes(request?.method)) return makeResponse('Method Not Allowed', 405, 'text/plain; charset=utf-8', request);
  const url = new URL(request.url);
  if (url.pathname === '/health') return makeResponse(JSON.stringify({ ok: true, sources: SEARCH_SOURCES.map(source => source.id) }), 200, 'application/json; charset=utf-8', request);
  const query = normalizeQuery(url.searchParams.get('q') || '');
  if (!query) return makeResponse(renderSearchPage({ query: '', sources: [], results: [] }), 200, 'text/html; charset=utf-8', request);
  const fetchImpl = env && typeof env.fetch === 'function' ? env.fetch.bind(env) : globalThis.fetch;
  const model = await searchSources(query, fetchImpl);
  if (url.searchParams.get('format') === 'json' || request.headers?.get('accept')?.includes('application/json')) {
    return makeResponse(JSON.stringify({ query, ...model }), 200, 'application/json; charset=utf-8', request);
  }
  return makeResponse(renderSearchPage({ query, ...model }), 200, 'text/html; charset=utf-8', request);
}

const worker = { fetch: handleRequest };

export default worker;
