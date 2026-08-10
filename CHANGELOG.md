# Changelog

All notable changes to SearchHub will be documented in this file.

## [v0.2.0] - 2026-08-03

- Added: Local query history with a 50-entry global list and per-engine recent queries.
- Added: Optional category-aware site, file type, and news date query operators.
- Added: Opt-in split view for up to four engines with per-tile tab fallbacks.
- Added: Optional focused-tab mode that reuses the last search tab when available.
- Added: Keyboard shortcuts for search focus, category navigation, and launching searches.
- Added: Query URL templates with raw, uppercase, and URL-encoded query placeholders.
- Added: Local engine editor overlay for adding, removing, reordering, and resetting engines.
- Added: Versioned JSON import/export for sharing curated engine catalogs.
- Added: Opt-in engine health badges with CORS-safe status classification.
- Added: Automatic strikethrough deprecation after repeated dead probes, with healthy recovery.
- Added: One-click Privacy, AI, Academic, and OSINT preset stacks that replace the active selection.
- Added: OSINT & Threat Intel category with VirusTotal, URLScan, Shodan, Censys, AbuseIPDB, and urlhaus.
- Added: Torrents & Archives category with 1337x, Nyaa, Anna's Archive, Archive.org, and Library Genesis.
- Added: Deep Maps entries for parcel lookup, county GIS, flight tracking, vessel tracking, and infrastructure maps.
- Added: AI image and video discovery entries for Civitai, Replicate, and Hugging Face Spaces.
- Added: Optional persistent keyboard navigation mode with roving selected-engine chip focus.
- Added: Persistent Light, OLED, Dracula, and Nord theme palettes using CSS variable swaps.
- Added: Persistent Comfy and Compact density modes for cards, tabs, grids, and selected chips.
- Added: Shareable query snapshots encoded as `q` and compact engine-token `e` URL parameters.
- Added: Installable PWA manifest and origin-scoped offline service worker for static HTTP(S) hosts.
- Added: Optional dependency-free SearchHub Worker for merged HTML or JSON results from curated sources.
- Added: Optional Manifest V3 Chrome omnibox provider for `sh` keyword searches.
- Added: Deployment-aware draggable bookmarklet that seeds searches from selected page text.
- Added: Linked OpenSearch descriptor for browser search-provider registration.
- Added: Optional canonical-root domain dedupe mode for equivalent subdomain targets.
- Added: Query-aware Smart Default selection for specialized and general searches.
- Added: Reverse engine lookup for pasted SearchHub-generated URLs.
- Added: Chrome-extension bookmark-folder export for the latest search session.
- Added: Animated opening-progress bubble showing `Opening n/total` and popup-block counts.

## [v0.1.1] - %Y->- (HEAD -> main, origin/main, origin/HEAD)

- Changed: Update README.md
- Changed: Update README.md
- Changed: Update README.md
- Changed: Update README.md
- Added: Add files via upload
- Added: Add files via upload

## Roadmap archive — 2026-08-10 — ROADMAP.md

<details>
<summary>Original roadmap snapshot</summary>

```markdown
# SearchHub Roadmap

Roadmap for SearchHub, a single-file client-side launcher that fires a query across 538 search engines in 29 categories. Constraint: stay a zero-dependency static HTML file.

## Planned Features

### Search flow

### Engine management

### Categories to expand

### UX polish

### Packaging

## Competitive Research

- **SearXNG** proxies multiple engines server-side and aggregates results - this repo intentionally goes the other way, but could add a toggle to hand off to a user-configured SearXNG instance.
- **Vimium / Surfingkeys** use command palettes for engine dispatch (`t <keyword> <query>`); SearchHub could add an `omnibar`-style palette over the current grid for power users.
- **DuckDuckGo bangs** (`!g foo`, `!yt bar`) are the best-known single-shot pattern; add parsing so any of SearchHub's 538 engines can be invoked by bang prefix.
- **Kagi Quickbar / Raycast extensions** show that a launcher-style UI beats a full page for quick queries; a compact popup mode (300x400) variant would fit this pattern.

## Nice-to-Haves


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
```

</details>
