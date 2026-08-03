const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'smart defaults must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__smart = { ENGINE_DATA, getSmartDefaultEngineIDs };`,
  context,
  { filename: 'index.html' }
);

const { ENGINE_DATA, getSmartDefaultEngineIDs } = context.__smart;
const idsToNames = ids => JSON.parse(JSON.stringify(ids)).map(id => {
  const [categoryIndex, engineIndex] = id.split('-').map(Number);
  const category = Object.keys(ENGINE_DATA)[categoryIndex];
  return ENGINE_DATA[category].engines[engineIndex].name;
});

assert.deepEqual(idsToNames(getSmartDefaultEngineIDs('site:example.com report', ENGINE_DATA)), ['Google', 'Bing', 'DuckDuckGo']);
assert.deepEqual(idsToNames(getSmartDefaultEngineIDs('quarterly filetype:pdf', ENGINE_DATA)), ['Google Scholar', 'Semantic Scholar', 'CORE', 'Google Books']);
assert.deepEqual(idsToNames(getSmartDefaultEngineIDs('after:2025-01-01 launch', ENGINE_DATA)), ['Google News', 'Bing News', 'Reuters']);
assert.deepEqual(idsToNames(getSmartDefaultEngineIDs('reverse image portrait', ENGINE_DATA)), ['Google Lens', 'TinEye', 'Yandex Reverse']);
assert.deepEqual(idsToNames(getSmartDefaultEngineIDs('CVE-2025-1234', ENGINE_DATA)), ['VirusTotal', 'URLScan', 'Shodan', 'AbuseIPDB', 'urlhaus']);
assert.equal(getSmartDefaultEngineIDs('ordinary query', ENGINE_DATA).length, 3);

console.log('smart default tests passed');
