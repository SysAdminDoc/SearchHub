# SearchHub

![Version](https://img.shields.io/badge/version-0.1.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Any%20Browser-4285F4)
![No Backend](https://img.shields.io/badge/backend-none-lightgrey)
![Engines](https://img.shields.io/badge/engines-552-6c6cff)

> Search 552 engines across 31 categories from a single page.

## Quick Start

1. Download `index.html` (and the optional PWA files listed below)
2. Open it in any browser
3. Select engines, type a query, hit Enter

That's it. Works offline, works from a USB drive, works on GitHub Pages. Single file, zero dependencies.

**Live demo:** [https://sysadmindoc.github.io/SearchHub/](https://sysadmindoc.github.io/SearchHub/)

## How It Works

```
┌─────────────────┐    ┌──────────────────┐     ┌──────────────────┐
│  Select engines │───>│   Enter query    │────>│  Opens tabs with │
│  via checkboxes │    │   & hit Search   │     │  results from    │
│                 │    │                  │     │  each engine     │
│ Selections      │    │  URL-deduped     │     │  150ms stagger   │
│ persist in      │    │  before launch   │     │  to avoid popup  │
│ localStorage    │    │                  │     │  blockers        │
└─────────────────┘    └──────────────────┘     └──────────────────┘
```

Each selected engine opens in its own browser tab with your query pre-filled in the URL. No APIs, no CORS issues, no server — it's a client-side search launcher.

## Features

| Feature | Description |
|---------|-------------|
| 552 Engines | Deduplicated across 31 categories — no URL opens twice |
| Selected Engines Bar | Persistent chip bar showing all selections with one-click removal |
| Per-Category Filter | Type to narrow engines within any category tab |
| Tab Scroll Arrows | Left/right arrows with edge fades for navigating all 31 categories |
| Tab Selection Badges | Dot indicators on category tabs that contain selected engines |
| Staggered Tab Opening | 150ms delay between tabs to bypass popup blockers |
| Opening Progress | Live `Opening n/total` bubble with launched and blocked counts |
| Popup Block Detection | Toast notification when tabs are blocked, with guidance |
| Persistent Selections | localStorage saves your engine picks across sessions |
| Query History | Last 50 searches plus per-engine recent query lists, stored locally |
| Query Operators | Optional site, file type, and date filters applied by matching category |
| Split View | Show up to four selected engines side-by-side with an Open in tab fallback |
| Focused Tab | Optionally reuse the most recently opened tab for the next search |
| Preset Stacks | Replace the current selection with Privacy, AI, Academic, or OSINT bundles |
| Keyboard Shortcuts | `/` focuses search, `1–9`/`0` switch category tabs, `Ctrl+Enter` searches |
| Keyboard Navigation | Optional persistent roving-tabindex mode for selected-engine chips |
| Themes | Persistent Light, OLED, Dracula, and Nord palettes switched through CSS variables |
| Density Modes | Persistent Comfy and Compact spacing modes for the catalog shell |
| Share Snapshots | Encode the query and selected engines into a portable `q`/`e` URL |
| Installable PWA | Manifest and service worker provide an installable offline app shell on HTTP(S) hosts |
| Optional SearchHub Worker | Dependency-free Cloudflare Worker merges top results from curated HTML/RSS sources |
| Chrome Omnibox | Optional Manifest V3 provider maps `sh tornado` to the default Google/Bing/DuckDuckGo bundle |
| Bookmarklet | Draggable link seeds SearchHub from selected text on any page |
| OpenSearch | Linked descriptor registers SearchHub as a browser search provider |
| Domain Dedupe | Optional canonical-root dedupe avoids opening equivalent subdomain targets twice |
| Smart Default | Query-aware 3–5 engine selection for site, filetype, date, image, OSINT, and general searches |
| Reverse Lookup | Paste a generated URL to identify matching engine templates and recover its query |
| Bookmark Export | Chrome-extension mode exports the latest session into a bookmark folder |
| Engine Editor | Add, remove, reorder, and reset engines through a localStorage overlay |
| JSON Engine Sharing | Export the active catalog or import a validated catalog into matching categories |
| Engine Health | Opt-in HEAD checks with healthy, warning, dead, unknown, and repeated-failure deprecation states |
| State Validation | Stale/broken saved state is silently discarded on load |
| Glass UI | Theme-aware glassmorphism shell with responsive surfaces |
| Responsive | Adapts to mobile with 2-column grid and compact tabs |
| Zero Dependencies | Single HTML file, no build step, no npm, no frameworks |
| Auto Favicons | Pulls icons from Google's favicon service per domain |
| Dynamic Tagline | Engine/category counts generated from actual data |

## Categories

| Category | Engines | Highlights |
|----------|---------|------------|
| Web Search | 37 | Google, Bing, DuckDuckGo, Brave, Startpage, Kagi, Mojeek, Yandex, Baidu |
| Images | 24 | Google Images, Unsplash, Pexels, Flickr, DeviantArt, Getty, Adobe Stock |
| Videos | 19 | YouTube, Vimeo, Dailymotion, Rumble, Twitch, TikTok, Bilibili |
| News | 36 | Google News, Reuters, AP, BBC, CNN, Bloomberg, NYT, WSJ, TechCrunch |
| Maps | 16 | Google Maps, OpenStreetMap, Regrid, County GIS, Flightradar24, VesselFinder, OpenInfraMap |
| Shopping | 36 | Amazon, eBay, Walmart, Etsy, Best Buy, Newegg, AliExpress |
| Social & Forums | 26 | Reddit, X/Twitter, LinkedIn, Mastodon, Bluesky, Hacker News, Quora |
| Reverse Image | 10 | Google Lens, TinEye, Yandex Reverse, SauceNAO, IQDB |
| Academic | 22 | Google Scholar, PubMed, arXiv, Semantic Scholar, JSTOR, IEEE Xplore |
| Code & Dev | 25 | GitHub, GitLab, Stack Overflow, npm, PyPI, Docker Hub, MDN |
| Reference | 21 | Wikipedia, Wolfram Alpha, Internet Archive, Wayback Machine, Britannica |
| OSINT & Threat Intel | 6 | VirusTotal, URLScan, Shodan, Censys, AbuseIPDB, urlhaus |
| Torrents & Archives | 5 | 1337x, Nyaa, Anna's Archive, Archive.org, Library Genesis |
| AI Search | 14 | Perplexity, ChatGPT, Gemini, Civitai, Replicate, Hugging Face Spaces |
| Travel | 21 | Google Flights, Skyscanner, Booking.com, Airbnb, Tripadvisor |
| Jobs | 17 | Indeed, LinkedIn Jobs, Glassdoor, ZipRecruiter, Remote OK |
| Food & Recipes | 13 | DoorDash, Uber Eats, Allrecipes, Serious Eats, OpenTable |
| Music | 13 | Spotify, Apple Music, SoundCloud, Bandcamp, Discogs, Genius |
| Gaming | 21 | Steam, Epic, GOG, IGDB, Nexus Mods, itch.io, SteamDB, ProtonDB |
| Health | 13 | WebMD, Mayo Clinic, MedlinePlus, Drugs.com, GoodRx |
| Real Estate | 13 | Zillow, Redfin, Realtor.com, Apartments.com, LoopNet |
| Automotive | 14 | AutoTrader, Cars.com, CarGurus, KBB, Bring a Trailer |
| Finance | 16 | Yahoo Finance, TradingView, CoinMarketCap, SEC EDGAR, Morningstar |
| Learning | 17 | Coursera, Udemy, edX, Khan Academy, MIT OCW, freeCodeCamp |
| Movies & TV | 9 | IMDb, Rotten Tomatoes, Letterboxd, JustWatch, TMDB |
| Podcasts | 10 | Apple Podcasts, Spotify, Listen Notes, Podchaser, Pocket Casts |
| Sports | 19 | ESPN, NFL, NBA, MLB, NHL, Transfermarkt, Basketball Reference |
| Legal & Gov | 27 | Justia, CourtListener, Google Patents, USPTO, Congress.gov, NASA |
| Science | 13 | NASA Images, Nature, ScienceDirect, bioRxiv, Smithsonian |
| Business | 13 | LinkedIn Companies, Trustpilot, G2, Capterra, BuiltWith |
| Downloads | 11 | Chocolatey, WinGet, F-Droid, APKMirror, Flathub, Snap Store |

## Usage

**Basic search:** Select a few engines, type your query, press Enter or click the search button. Each engine opens in a new tab.

**Bulk selection:** Use "Select all" / "Clear" per category. The selected engines bar shows everything you've picked across all categories.

**Preset stacks:** Open **Presets** to replace the current selection with a curated Privacy, AI, Academic, or OSINT bundle. Counts reflect engines still available after local catalog edits.

**Finding engines:** Use the filter box in any category panel to search by name (e.g., type "duck" to find DuckDuckGo).

**Popup blockers:** The first tab always opens (browser considers it user-initiated). Remaining tabs stagger at 150ms intervals. If your browser blocks them, allow popups for the page — you'll see a toast notification with guidance.

**Opening progress:** Normal multi-tab searches show a live progress bubble while tabs are staggered, then summarize the launched and blocked totals.

**Persistence:** Your selections save to `localStorage` automatically. Clearing browser data resets them.

**Query history:** Click **History** below the search box to reuse one of your last 50 searches, or click the clock on an engine card to see queries used with that engine. Use **Clear all** to remove both lists from local storage.

**Query operators:** Open **Operators** to add a site, file type, or date range. SearchHub applies each filter only to compatible categories and leaves existing operators in your query untouched.

**Split view:** Turn on **Split view**, choose 2–4 engines, and search to load compatible results in one page. Sites that block framing can still be opened with their tile's **Open in tab** action.

**Focused tab:** Turn on **Focused tab** to reuse the most recently opened search tab for the next search. If that tab was closed, SearchHub opens a new one.

**Keyboard shortcuts:** Press `/` from anywhere outside an input to focus search, `1`–`9` or `0` to switch the first ten category tabs, and `Ctrl+Enter` to launch the current search from any control.

**Keyboard navigation:** Turn on **Keyboard nav** to move through selected-engine chips with arrow keys, `Home`, and `End`. `Delete`/`Backspace` removes the focused engine; `Enter` or `Space` focuses its remove control.

**Themes:** Use the **Theme** picker to switch between Light, OLED, Dracula, and Nord palettes. The selected theme is stored locally and applies without rebuilding the catalog.

**Density:** Use **Density** to switch between Comfy spacing for scanning and Compact spacing for fitting more engine cards on screen.

**Share snapshots:** Enter a query, select engines, and choose **Share**. The generated URL uses `q` for the query and compact engine tokens in `e`; opening it restores the query and selection.

**Domain dedupe:** Enable **Domain dedupe** when you want one launch per canonical root domain, including `www` and common multi-part suffix normalization. Exact URL dedupe remains the default.

**Smart default:** Enter a query and choose **Smart default** to replace the selection with the most relevant 3–5 engines. Site, filetype, date, image, and OSINT patterns choose specialized categories; other queries use Google, Bing, and DuckDuckGo.

**Reverse lookup:** Choose **Lookup**, paste an `http(s)` URL generated by SearchHub, and choose **Find matches** to see the matching engine template and recovered query. Legacy prefix templates and `{q|urlencode}`/`{q|upper}` templates are supported.

**Bookmark export:** In the Chrome extension, run a search and choose **Bookmarks** to create a folder containing the latest query’s opened targets. The standalone static page explains when extension-only export is unavailable.

**Engine editor:** Open **Manage** to customize a category. Additions, removals, and ordering changes stay local to this browser; **Reset category** restores the bundled defaults.

**Engine sharing:** Use **Export JSON** in the editor to save the active catalog, then **Import JSON** on another SearchHub copy. Imports are version-checked, deduplicated, and limited to existing categories.

**Engine health:** Click an engine's `?` badge or a category's **Check health** button. CORS-readable responses are classified directly; opaque no-CORS fallbacks stay **unknown** rather than being overstated.

**Auto-deprecation:** Two consecutive dead health checks add a strikethrough marker. A later healthy response clears it; the engine remains available until you remove it in **Manage**.

## Hosting

### GitHub Pages
1. Push `index.html`, `manifest.webmanifest`, `sw.js`, and `icon.png` to a repo
2. Enable Pages in Settings → point to the branch
3. Access at `https://username.github.io/repo/`

### Local / USB
Just double-click `index.html`. Everything runs client-side; service-worker installation requires serving the folder over HTTP(S).

### Any static host
Upload `index.html`, `manifest.webmanifest`, `sw.js`, and `icon.png` to Netlify, Vercel, Cloudflare Pages, S3, or any web server. No build step required.

### Optional SearchHub Worker
`searchhub-worker.js` is a separate, zero-dependency Cloudflare Worker companion for deployments that want one merged results page. Paste it into a module Worker, or deploy it with the platform's standard Worker tooling, then open `https://your-worker.example/?q=your+query`. Add `&format=json` for a machine-readable response. It queries fixed DuckDuckGo HTML, Bing HTML, and Google News RSS sources in parallel, caps each source, deduplicates URLs, and reports unavailable sources instead of hiding failures. The core static app does not depend on this worker.

### Chrome omnibox (optional)
Load the repository root as an unpacked extension from `chrome://extensions` with Developer mode enabled. Type `sh ` followed by a query in Chrome's address bar; the provider opens SearchHub with the default Google, Bing, and DuckDuckGo bundle.

### Bookmarklet (optional)
From a hosted SearchHub page, drag the **Bookmarklet** link to your bookmarks bar. On any page, select text and click the bookmarklet; it opens the same SearchHub deployment with that selection and the default Google, Bing, and DuckDuckGo bundle.

### OpenSearch (optional)
The linked `opensearch.xml` descriptor lets compatible browsers add SearchHub as a search provider; its template restores the query through `q` and uses the default `e=google,bing,ddg` bundle.

## FAQ

**Why do some tabs get blocked?**
Browsers limit how many popups a single click can open. SearchHub staggers them at 150ms intervals which helps, but aggressive blockers may still catch some. Allow popups for the site to fix this.

**Why not aggregate results on one page by default?**
Browser CORS restrictions prevent fetching results from other domains client-side. The primary app stays a single static file with no backend; deployments that explicitly want a server-side companion can use the optional `searchhub-worker.js` artifact.

**Can I add my own engines?**
Yes — open **Manage** to add an engine to an existing category, or edit the `ENGINE_DATA` object in the `<script>` block for source-level changes. Add entries in the format:
```js
{ name: "Engine Name", url: "https://example.com/search?q=", desc: "Short description" },
```
For non-trivial URL patterns, put a `{q}` placeholder in the URL. `{q}` inserts the raw query, `{q|upper}` uppercases it, and `{q|urlencode}` percent-encodes it. URLs without a placeholder keep the legacy behavior of appending an encoded query.

**Do favicons load from external sources?**
Yes, from `google.com/s2/favicons`. If you're fully offline, favicons won't load but everything else works fine.

## Contributing

Issues and PRs welcome. To add engines, edit the `ENGINE_DATA` object and ensure no duplicate URLs exist across categories.

## License

[MIT](LICENSE)
