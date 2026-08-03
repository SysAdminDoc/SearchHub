const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'density helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__density = { DENSITY_OPTIONS, normalizeDensity };`,
  context,
  { filename: 'index.html' }
);

const { DENSITY_OPTIONS, normalizeDensity } = context.__density;
assert.deepEqual(JSON.parse(JSON.stringify(DENSITY_OPTIONS)), ['comfy', 'compact']);
assert.equal(normalizeDensity('comfy'), 'comfy');
assert.equal(normalizeDensity('compact'), 'compact');
assert.equal(normalizeDensity('unknown'), 'comfy');
assert.equal(normalizeDensity(null), 'comfy');

console.log('density tests passed');
