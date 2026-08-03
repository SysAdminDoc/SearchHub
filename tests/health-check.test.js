const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');

const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'health helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__health = { classifyHealthStatus, normalizeHealthState, nextHealthRecord };`,
  context,
  { filename: 'index.html' }
);

const { classifyHealthStatus, normalizeHealthState, nextHealthRecord } = context.__health;
assert.equal(classifyHealthStatus(200), 'healthy');
assert.equal(classifyHealthStatus(302), 'healthy');
assert.equal(classifyHealthStatus(403), 'warning');
assert.equal(classifyHealthStatus(429), 'warning');
assert.equal(classifyHealthStatus(503), 'dead');
assert.equal(classifyHealthStatus('not-a-status'), 'unknown');

const state = normalizeHealthState({
  good: { status: 'healthy', checkedAt: 10, latency: 25 },
  bad: { status: 'not-valid' },
  unknown: { status: 'unknown', checkedAt: '20', latency: '4' }
});
assert.deepEqual(JSON.parse(JSON.stringify(state)), {
  good: { status: 'healthy', checkedAt: 10, latency: 25, failures: 0, deprecated: false },
  unknown: { status: 'unknown', checkedAt: 20, latency: 4, failures: 0, deprecated: false }
});

const firstFailure = nextHealthRecord(null, 'dead', 30, 100);
const secondFailure = nextHealthRecord(firstFailure, 'dead', 40, 200);
assert.equal(firstFailure.deprecated, false);
assert.equal(secondFailure.deprecated, true, 'two consecutive dead probes should mark an engine deprecated');
assert.equal(nextHealthRecord(secondFailure, 'healthy', 20, 300).deprecated, false);

console.log('health check tests passed');
