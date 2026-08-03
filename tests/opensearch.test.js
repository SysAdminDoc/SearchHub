const assert = require('node:assert/strict');
const fs = require('node:fs');

const descriptor = fs.readFileSync('opensearch.xml', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
assert.match(descriptor, /<OpenSearchDescription xmlns="http:\/\/a9\.com\/-\/spec\/opensearch\/1\.1\/">/);
assert.match(descriptor, /<ShortName>SearchHub<\/ShortName>/);
assert.match(descriptor, /template="\.\/index\.html\?q=\{searchTerms\}&amp;e=google,bing,ddg"/);
assert.match(descriptor, /<InputEncoding>UTF-8<\/InputEncoding>/);
assert.match(descriptor, /<Image height="16" width="16" type="image\/png">\.\/icon\.png<\/Image>/);
assert.match(html, /<link rel="search" type="application\/opensearchdescription\+xml" title="SearchHub" href="opensearch\.xml">/);

console.log('OpenSearch tests passed');
