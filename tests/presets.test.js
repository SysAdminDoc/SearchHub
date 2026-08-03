const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'preset helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__presets = { ENGINE_DATA, ENGINE_PRESETS, resolvePresetEngines };`,
  context,
  { filename: 'index.html' }
);

const { ENGINE_DATA, ENGINE_PRESETS, resolvePresetEngines } = context.__presets;
const resolve = (dataSet, preset) => JSON.parse(JSON.stringify(resolvePresetEngines(dataSet, preset)));
assert.equal(resolve(ENGINE_DATA, 'privacy').length, 8);
assert.equal(resolve(ENGINE_DATA, 'ai').length, 14);
assert.equal(resolve(ENGINE_DATA, 'academic').length, 9);
assert.equal(resolve(ENGINE_DATA, 'osint').length, 23);
const data = {
  'Web Search': { engines: [
    { name: 'Custom', url: 'https://custom.test', desc: '' },
    { name: 'DuckDuckGo', url: 'https://duck.test', desc: '' },
    { name: 'Brave Search', url: 'https://brave.test', desc: '' }
  ] },
  'AI Search': { engines: [
    { name: 'Perplexity', url: 'https://perplexity.test', desc: '' }
  ] },
  Academic: { engines: [
    { name: 'Google Scholar', url: 'https://scholar.test', desc: '' },
    { name: 'IEEE Xplore', url: 'https://ieee.test', desc: '' }
  ] }
};

assert.equal(ENGINE_PRESETS.privacy.label, 'Privacy stack');
assert.deepEqual(resolve(data, 'privacy'), ['0-1', '0-2']);
assert.deepEqual(resolve(data, 'AI stack'), ['1-0']);
assert.deepEqual(resolve(data, 'academic'), ['2-0', '2-1']);
assert.deepEqual(resolve(data, 'missing'), []);

console.log('preset tests passed');
