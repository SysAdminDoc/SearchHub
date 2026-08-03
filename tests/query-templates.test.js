const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'template helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__templates = { expandQueryTemplate, buildEngineURL };`,
  context,
  { filename: 'index.html' }
);

const { expandQueryTemplate, buildEngineURL } = context.__templates;
assert.equal(expandQueryTemplate('https://example.test/{q}', 'Hello World'), 'https://example.test/Hello World');
assert.equal(expandQueryTemplate('https://example.test/{q|upper}', 'Hello World'), 'https://example.test/HELLO WORLD');
assert.equal(expandQueryTemplate('https://example.test/{q|urlencode}', 'Hello World'), 'https://example.test/Hello%20World');
assert.equal(buildEngineURL({ url: 'https://example.test/search?q=' }, 'Hello World'), 'https://example.test/search?q=Hello%20World');
assert.equal(buildEngineURL({ url: 'https://example.test/search/{q|urlencode}' }, 'Hello World'), 'https://example.test/search/Hello%20World');
assert.equal(buildEngineURL({ url: '' }, 'Hello World'), '');

console.log('query template tests passed');
