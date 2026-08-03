const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'domain dedupe helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__dedupe = { getCanonicalRootDomain };`,
  context,
  { filename: 'index.html' }
);

const { getCanonicalRootDomain } = context.__dedupe;
assert.equal(getCanonicalRootDomain('https://www.amazon.com/search?q=book'), 'amazon.com');
assert.equal(getCanonicalRootDomain('https://smile.amazon.com/item'), 'amazon.com');
assert.equal(getCanonicalRootDomain('https://maps.example.co.uk/place'), 'example.co.uk');
assert.equal(getCanonicalRootDomain('https://192.0.2.10/search'), '192.0.2.10');
assert.equal(getCanonicalRootDomain('not a URL'), '');

console.log('domain dedupe tests passed');
