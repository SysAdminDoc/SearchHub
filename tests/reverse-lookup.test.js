const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'index.html should contain the application script');
const bootstrapMarker = scriptMatch[1].indexOf('// DOM bootstrap');
assert.notEqual(bootstrapMarker, -1, 'reverse lookup helpers must be defined before DOM bootstrap');

const context = { console, Intl, URL };
vm.runInNewContext(
  `${scriptMatch[1].slice(0, bootstrapMarker)}\nthis.__lookup = { buildEngineURL, findMatchingEngines, normalizeLookupURL };`,
  context,
  { filename: 'index.html' }
);

const { buildEngineURL, findMatchingEngines, normalizeLookupURL } = context.__lookup;
const fixture = {
  Web: {
    engines: [
      { name: 'Plain', url: 'https://plain.test/search?q=' },
      { name: 'Path', url: 'https://path.test/find/{q|urlencode}/results' },
      { name: 'Upper', url: 'https://upper.test/{q|upper}' },
      { name: 'Other', url: 'https://other.test/search?q=' }
    ]
  }
};

assert.equal(normalizeLookupURL(' https://plain.test/search?q=hello%20world '), 'https://plain.test/search?q=hello%20world');
assert.equal(normalizeLookupURL('javascript:alert(1)'), '');

const plainMatches = JSON.parse(JSON.stringify(findMatchingEngines('https://plain.test/search?q=hello%20world', fixture)));
assert.deepEqual(plainMatches, [{
  category: 'Web',
  name: 'Plain',
  url: 'https://plain.test/search?q=',
  query: 'hello world',
  mode: 'encoded-prefix'
}]);

const pathURL = buildEngineURL(fixture.Web.engines[1], 'red fox');
const pathMatches = JSON.parse(JSON.stringify(findMatchingEngines(pathURL, fixture)));
assert.deepEqual(pathMatches, [{
  category: 'Web',
  name: 'Path',
  url: 'https://path.test/find/{q|urlencode}/results',
  query: 'red fox',
  mode: 'template'
}]);

const upperMatches = JSON.parse(JSON.stringify(findMatchingEngines('https://upper.test/RED%20FOX', fixture)));
assert.deepEqual(upperMatches, [{
  category: 'Web',
  name: 'Upper',
  url: 'https://upper.test/{q|upper}',
  query: 'RED FOX',
  mode: 'template'
}]);

assert.deepEqual(JSON.parse(JSON.stringify(findMatchingEngines('https://unknown.test/search?q=hello', fixture))), []);

console.log('reverse lookup tests passed');
