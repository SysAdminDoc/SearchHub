# SearchHub Roadmap

Roadmap for SearchHub, a single-file client-side launcher that fires a query across 538 search engines in 29 categories. Constraint: stay a zero-dependency static HTML file.

## Planned Features

### Search flow
- Query history dropdown (localStorage, last 50 with clear-all) and per-engine recent queries
- Query operators pre-applied per engine type (site: for web, filetype: for docs, before:/after: for news)
- Split-screen mode - open N engines in iframes side-by-side on one page (where X-Frame-Options permits) instead of spawning tabs
- "Send to focused tab" option - rewrite the last opened tab's URL instead of creating a new one
- Hotkey layer (`/` to focus, `number` keys to toggle category tabs, `Ctrl+Enter` to fire all selected)
- Query templating (`{q}`, `{q|upper}`, `{q|urlencode}`) for engines with non-trivial URL patterns

### Engine management
- Built-in engine editor UI (add/remove/reorder engines) with localStorage overlay on top of defaults
- Import/export engines as JSON for sharing curated sets
- Per-engine health check badge (HEAD request with CORS-safe fallback) that flags dead engines
- Auto-deprecate detection - crowd-sourced list of recently-broken engines, shown with strikethrough
- Preset bundles: "Privacy stack", "AI stack", "Academic stack", "OSINT stack" - one-click replace selection

### Categories to expand
- **OSINT & Threat Intel** - VirusTotal, URLScan, Shodan, Censys, AbuseIPDB, urlhaus
- **Torrents & Archives** - 1337x, Nyaa, Anna's Archive, Archive.org, Library Genesis
- **Maps deep** - tax parcel, county GIS, flight radar, ship radar, infra maps
- **AI image/video gen search** - Civitai, Replicate, HuggingFace Spaces search

### UX polish
- Keyboard-only navigation mode with roving tabindex across chip bar
- Light / OLED / Dracula / Nord theme toggle (CSS var swap, no rebuild)
- Animated tab-opening bubble overlay showing "opening 5/12" progress to clarify what popup blockers killed
- Compact vs comfy density modes
- Share-URL encoder: `searchhub.html?q=foo&e=google,bing,ddg` for shareable query snapshots

### Packaging
- Tiny PWA manifest + service worker so it installs as a desktop "app"
- Chrome omnibox provider so typing `sh tornado` fires SearchHub with default bundle
- Bookmarklet variant that opens SearchHub pre-seeded with the current page's selection
- Shortcut keyword registration via `<link rel="search">` OpenSearch descriptor

## Competitive Research

- **SearXNG** proxies multiple engines server-side and aggregates results - this repo intentionally goes the other way, but could add a toggle to hand off to a user-configured SearXNG instance.
- **Vimium / Surfingkeys** use command palettes for engine dispatch (`t <keyword> <query>`); SearchHub could add an `omnibar`-style palette over the current grid for power users.
- **DuckDuckGo bangs** (`!g foo`, `!yt bar`) are the best-known single-shot pattern; add parsing so any of SearchHub's 538 engines can be invoked by bang prefix.
- **Kagi Quickbar / Raycast extensions** show that a launcher-style UI beats a full page for quick queries; a compact popup mode (300x400) variant would fit this pattern.

## Nice-to-Haves

- Dedupe by canonical root domain (e.g. `amazon.com` vs `smile.amazon.com`) instead of exact URL match
- "Smart default" that picks 3-5 engines based on query heuristics (contains site:? contains filetype:?)
- Export search session (all opened tabs + query) as a bookmark folder via `chrome.bookmarks` API when loaded as extension
- Reverse-engine-lookup: paste a URL, get back which engine template it matches
- Server-side worker (optional, self-hostable) to return a single HTML merge of top results from a curated engine set

## Open-Source Research (Round 2)

### Related OSS Projects
- https://github.com/garywill/BigSearch — Closest peer: 60+ built-in engines, GET/POST, user-defined engines via simple JSON, browser ext + demo web-app
- https://github.com/fccview/degoog — Plugin/extension/slot/transport architecture — heavily modular aggregator with bang-commands
- https://github.com/searxng/searxng — Canonical metasearch reference (server-side), privacy stance, category/engine config format
- https://github.com/benbusby/whoogle-search — Self-hosted Google proxy, minimal JS/CSS bundling pattern
- https://github.com/e0gen/MultiSearch — `ISearchEngine` interface abstraction (C#) with HTML-parse and API dual impls
- https://github.com/noidontdig/search-engine-aggregator — Simple multi-engine merge implementation
- https://github.com/topics/metasearch-engine — Topic hub

### Features to Borrow
- Engine JSON schema: `{ "Google": "https://www.google.com/search?q={0}" }` minimal, but support POST engines via `{ method, url, body }` (BigSearch)
- "Bang commands" in the query box — `!yt cats` routes only to YouTube engine (degoog, DuckDuckGo pattern)
- Slot plugins — small panels that inject above/below results from a query trigger (weather, calc, define:) (degoog)
- Engine categories with per-category hotkeys (`1` = web, `2` = images, `3` = video) (SearXNG)
- Saved "engine packs" shareable as a URL fragment (`#pack=foo+bar+baz`) — user can bookmark a preset (new idea borrowed from Whoogle config-file pattern)
- Keyboard-first UX: `/` focus, `Tab` cycle engines, `Enter` multi-open, `Shift+Enter` single (SearXNG behavior)
- Engine health badges — auto-probe last-success, dim dead engines (SearXNG)
- Optional privacy proxy layer — rewrite target URLs through a user-provided proxy (Whoogle)

### Patterns & Architectures Worth Studying
- Plugin manifest loaded at runtime from user folder vs baked-in engines (degoog modularity)
- HTML-parse vs API dual-path abstraction for each engine (MultiSearch's ISearchEngine) — fallback when API key missing
- Single-file with `<template>` partials hydrated by tiny JS — keeps "single file, zero deps" promise while being composable
- IndexedDB persistence for user engines + packs with versioned schema migration so `searchhub.html` remains portable across updates
- Split-context loader: same file runs standalone OR as Chrome MV3 extension OR PWA, feature-detects once
