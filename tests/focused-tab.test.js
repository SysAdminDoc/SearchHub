const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'focused-tab helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__focused = { isReusableTab };`,
  context,
  { filename: 'index.html' }
);

const { isReusableTab } = context.__focused;
assert.equal(isReusableTab({ closed: false }), true);
assert.equal(isReusableTab({ closed: true }), false);
assert.equal(isReusableTab(null), false);

const throwingTab = {};
Object.defineProperty(throwingTab, 'closed', { get() { throw new Error('closed state unavailable'); } });
assert.equal(isReusableTab(throwingTab), false, 'unreadable tab state should fall back safely');

console.log('focused tab tests passed');
