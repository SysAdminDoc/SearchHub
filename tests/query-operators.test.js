const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'operator helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__operators = { normalizeOperatorValue, buildEngineQuery };`,
  context,
  { filename: 'index.html' }
);

const { normalizeOperatorValue, buildEngineQuery } = context.__operators;

assert.equal(normalizeOperatorValue('https://www.example.com/docs', 'site'), 'example.com');
assert.equal(normalizeOperatorValue('.PDF', 'filetype'), 'pdf');
assert.equal(normalizeOperatorValue('2024-01-01', 'after'), '2024-01-01');
assert.equal(normalizeOperatorValue('yesterday', 'before'), '');

const values = {
  site: 'example.com',
  filetype: 'pdf',
  after: '2024-01-01',
  before: '2024-12-31'
};

assert.equal(buildEngineQuery('cats', 'Web Search', values), 'site:example.com cats');
assert.equal(buildEngineQuery('cats', 'Academic', values), 'filetype:pdf cats');
assert.equal(buildEngineQuery('cats', 'News', values), 'after:2024-01-01 before:2024-12-31 cats');
assert.equal(buildEngineQuery('cats', 'Images', values), 'cats');
assert.equal(buildEngineQuery('site:internal.example cats', 'Web Search', values), 'site:internal.example cats');
assert.equal(buildEngineQuery('filetype:doc cats', 'Academic', values), 'filetype:doc cats');

console.log('query operator tests passed');
