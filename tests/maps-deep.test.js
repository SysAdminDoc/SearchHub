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
const maps = ENGINE_DATA.Maps;
assert.ok(maps, 'Maps category should exist');
const deepMapNames = ['Regrid', 'County GIS', 'Flightradar24', 'VesselFinder', 'OpenInfraMap'];
const deepMapEngines = maps.engines.filter(engine => deepMapNames.includes(engine.name));
assert.deepEqual(
  JSON.parse(JSON.stringify(deepMapEngines.map(engine => engine.name))),
  deepMapNames
);
deepMapEngines.forEach(engine => assert.match(engine.url, /\{q\|urlencode\}/, `${engine.name} should use a URL-encoded query template`));
assert.match(buildEngineURL(deepMapEngines[2], 'AA 100'), /AA%20100/);

console.log('deep maps tests passed');
