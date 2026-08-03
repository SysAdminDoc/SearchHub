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
const ai = ENGINE_DATA['AI Search'];
assert.ok(ai, 'AI Search category should exist');
const mediaNames = ['Civitai', 'Replicate', 'Hugging Face Spaces'];
const mediaEngines = ai.engines.filter(engine => mediaNames.includes(engine.name));
assert.deepEqual(JSON.parse(JSON.stringify(mediaEngines.map(engine => engine.name))), mediaNames);
mediaEngines.forEach(engine => assert.match(engine.url, /\{q\|urlencode\}/, `${engine.name} should use a URL-encoded query template`));
assert.match(buildEngineURL(mediaEngines[0], 'portrait model'), /portrait%20model/);

console.log('AI media catalog tests passed');
