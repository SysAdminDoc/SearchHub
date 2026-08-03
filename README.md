# SearchHub

![Version](https://img.shields.io/badge/version-0.1.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Any%20Browser-4285F4)
![No Backend](https://img.shields.io/badge/backend-none-lightgrey)
![Engines](https://img.shields.io/badge/engines-538-6c6cff)

> Search 538 engines across 29 categories from a single page.

## Quick Start

1. Download `searchhub.html`
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
| 538 Engines | Deduplicated across 29 categories — no URL opens twice |
| Selected Engines Bar | Persistent chip bar showing all selections with one-click removal |
| Per-Category Filter | Type to narrow engines within any category tab |
| Tab Scroll Arrows | Left/right arrows with edge fades for navigating all 29 categories |
| Tab Selection Badges | Dot indicators on category tabs that contain selected engines |
| Staggered Tab Opening | 150ms delay between tabs to bypass popup blockers |
| Popup Block Detection | Toast notification when tabs are blocked, with guidance |
| Persistent Selections | localStorage saves your engine picks across sessions |
| Query History | Last 50 searches plus per-engine recent query lists, stored locally |
| Query Operators | Optional site, file type, and date filters applied by matching category |
| Split View | Show up to four selected engines side-by-side with an Open in tab fallback |
| Focused Tab | Optionally reuse the most recently opened tab for the next search |
| Keyboard Shortcuts | `/` focuses search, `1–9`/`0` switch category tabs, `Ctrl+Enter` searches |
| Engine Editor | Add, remove, reorder, and reset engines through a localStorage overlay |
| JSON Engine Sharing | Export the active catalog or import a validated catalog into matching categories |
| Engine Health | Opt-in per-engine or per-category HEAD checks with healthy, warning, dead, and unknown states |
| State Validation | Stale/broken saved state is silently discarded on load |
| Dark Theme | Deep purple accent glassmorphism UI — no light mode |
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
| Maps | 11 | Google Maps, OpenStreetMap, Apple Maps, Waze, HERE WeGo |
| Shopping | 36 | Amazon, eBay, Walmart, Etsy, Best Buy, Newegg, AliExpress |
| Social & Forums | 26 | Reddit, X/Twitter, LinkedIn, Mastodon, Bluesky, Hacker News, Quora |
| Reverse Image | 10 | Google Lens, TinEye, Yandex Reverse, SauceNAO, IQDB |
| Academic | 22 | Google Scholar, PubMed, arXiv, Semantic Scholar, JSTOR, IEEE Xplore |
| Code & Dev | 25 | GitHub, GitLab, Stack Overflow, npm, PyPI, Docker Hub, MDN |
| Reference | 21 | Wikipedia, Wolfram Alpha, Internet Archive, Wayback Machine, Britannica |
| AI Search | 11 | Perplexity, ChatGPT, Gemini, Copilot, Phind, DeepSeek, Grok |
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

**Finding engines:** Use the filter box in any category panel to search by name (e.g., type "duck" to find DuckDuckGo).

**Popup blockers:** The first tab always opens (browser considers it user-initiated). Remaining tabs stagger at 150ms intervals. If your browser blocks them, allow popups for the page — you'll see a toast notification with guidance.

**Persistence:** Your selections save to `localStorage` automatically. Clearing browser data resets them.

**Query history:** Click **History** below the search box to reuse one of your last 50 searches, or click the clock on an engine card to see queries used with that engine. Use **Clear all** to remove both lists from local storage.

**Query operators:** Open **Operators** to add a site, file type, or date range. SearchHub applies each filter only to compatible categories and leaves existing operators in your query untouched.

**Split view:** Turn on **Split view**, choose 2–4 engines, and search to load compatible results in one page. Sites that block framing can still be opened with their tile's **Open in tab** action.

**Focused tab:** Turn on **Focused tab** to reuse the most recently opened search tab for the next search. If that tab was closed, SearchHub opens a new one.

**Keyboard shortcuts:** Press `/` from anywhere outside an input to focus search, `1`–`9` or `0` to switch the first ten category tabs, and `Ctrl+Enter` to launch the current search from any control.

**Engine editor:** Open **Manage** to customize a category. Additions, removals, and ordering changes stay local to this browser; **Reset category** restores the bundled defaults.

**Engine sharing:** Use **Export JSON** in the editor to save the active catalog, then **Import JSON** on another SearchHub copy. Imports are version-checked, deduplicated, and limited to existing categories.

**Engine health:** Click an engine's `?` badge or a category's **Check health** button. CORS-readable responses are classified directly; opaque no-CORS fallbacks stay **unknown** rather than being overstated.

## Hosting

### GitHub Pages
1. Push `searchhub.html` to a repo
2. Enable Pages in Settings → point to the branch
3. Access at `https://username.github.io/repo/searchhub.html`

### Local / USB
Just double-click `searchhub.html`. Everything runs client-side.

### Any static host
Upload the single file to Netlify, Vercel, Cloudflare Pages, S3, or any web server. No build step required.

## FAQ

**Why do some tabs get blocked?**
Browsers limit how many popups a single click can open. SearchHub staggers them at 150ms intervals which helps, but aggressive blockers may still catch some. Allow popups for the site to fix this.

**Why not aggregate results on one page?**
Browser CORS restrictions prevent fetching results from other domains client-side. A server-side proxy would work but defeats the goal of a single static file with no backend.

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
