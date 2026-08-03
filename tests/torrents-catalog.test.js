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
const archive = ENGINE_DATA['Torrents & Archives'];
assert.ok(archive, 'Torrents & Archives category should exist');
assert.deepEqual(
  JSON.parse(JSON.stringify(archive.engines.map(engine => engine.name))),
  ['1337x', 'Nyaa', "Anna's Archive", 'Archive.org', 'Library Genesis']
);
assert.equal(new Set(archive.engines.map(engine => engine.url)).size, archive.engines.length, 'archive URLs should be unique');
archive.engines.forEach(engine => assert.match(engine.url, /\{q\|urlencode\}/, `${engine.name} should use a URL-encoded query template`));
assert.match(buildEngineURL(archive.engines[1], 'show title'), /show%20title/);

console.log('Torrents and archives catalog tests passed');
