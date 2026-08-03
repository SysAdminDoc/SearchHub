const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'catalog data must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__catalog = { ENGINE_DATA, buildEngineURL };`,
  context,
  { filename: 'index.html' }
);

const { ENGINE_DATA, buildEngineURL } = context.__catalog;
const osint = ENGINE_DATA['OSINT & Threat Intel'];
assert.ok(osint, 'OSINT & Threat Intel category should exist');
assert.deepEqual(
  JSON.parse(JSON.stringify(osint.engines.map(engine => engine.name))),
  ['VirusTotal', 'URLScan', 'Shodan', 'Censys', 'AbuseIPDB', 'urlhaus']
);
assert.equal(new Set(osint.engines.map(engine => engine.url)).size, osint.engines.length, 'OSINT URLs should be unique');
osint.engines.forEach(engine => assert.match(engine.url, /\{q\|urlencode\}/, `${engine.name} should use a URL-encoded query template`));
assert.match(buildEngineURL(osint.engines[0], 'example.test/path value'), /example\.test%2Fpath%20value/);

console.log('OSINT catalog tests passed');
