const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'split helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__split = { limitSplitTargets };`,
  context,
  { filename: 'index.html' }
);

const { limitSplitTargets } = context.__split;
const targets = Array.from({ length: 6 }, (_, index) => ({ name: `Engine ${index + 1}`, url: `https://example.test/${index + 1}` }));

assert.equal(limitSplitTargets(targets, 2).length, 2);
assert.equal(limitSplitTargets(targets, 99).length, 4, 'split view should cap at four frames');
assert.equal(limitSplitTargets(targets, 0).length, 1, 'a split view should retain at least one selected engine');
assert.deepEqual(JSON.parse(JSON.stringify(limitSplitTargets(targets, 3))), targets.slice(0, 3));
assert.deepEqual(JSON.parse(JSON.stringify(limitSplitTargets(null, 3))), []);

console.log('split view tests passed');
