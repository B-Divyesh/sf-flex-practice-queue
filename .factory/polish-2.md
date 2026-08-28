# Polish round 2 — complete finding closure

Reviewed candidate: `3a448d84305c4f37fa0e8b080cf1c90e1eaa1d52`.
Review record: `9ccc00527f0bbb6f8d844d3ffdd551d02ed99b8b`.
Repair commits: `d1f4d23a5968b8910c031b281404cf3c1e94062b`, `0e6d845c` (service-worker registration race), and `b79995686e9afbc5dfdb9351820097e854c43975` (production precache correction). The final commit is deployed to `https://flex-practice-queue.sociobot.in`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the compact real sample-round panel in the isolated `?demo=1` route: prompt, tags, timer, banner, reset, exit, and one-click start are above the 390 px fold. | Playwright `demo shows a real sample prompt in the first 390px viewport and starts it in one click`; cold live [demo screenshot](evidence/polish-2-live/demo-mobile-cold.png); live `/?demo=1` smoke check. |
| F-1-2 | Preserved the real HTTP 404 deployment rule and completed its static page. | `static deployment keeps known app routes, a real 404…`; live [404 headers](evidence/polish-2-live/404.headers) report HTTP 404. |
| F-1-3 | Kept the separately declared `source-schedule-untouched` contract that imports, tags, practices, stops, exports, preserves source bytes, and records only same-origin traffic. | `npm test -- --grep @claim:source-schedule-untouched` in final clean clone. |
| F-1-4 | Kept merchant-of-record and refund assurances out of product and legal copy; only the testable hosted Sociobot checkout wording remains. | `npm test -- --grep @claim:paid-price`; live landing smoke check. |
| F-1-5 | Kept the distinct one-token `license-data-minimization` contract. | `npm test -- --grep @claim:license-data-minimization` in final clean clone. |
| F-1-6 | Made the honest `.apkg` limitation safe and testable: selecting a package never imports data and gives the CSV-export instruction. | New `@claim:anki-apkg-not-supported`; live `/demo` smoke check. |
| F-1-7 | Retained **flashcard schedule** as the single protected-system term across first screen, app, legal text, metadata, README, and catalog. | `.factory/copy-audit.md`; live landing check. |
| F-2-1 | Rewrote `@claim:demo-sandbox` to seed a real prompt, real round, and byte-exact real plans; it mutates and resets demo, exits it, then checks real IndexedDB/plans, sample absence, and removal of every demo key/database. | `npm test -- --grep @claim:demo-sandbox` in final clean clone. |
| F-2-2 | Added `anki-apkg-not-supported` to claims, a shipped `.apkg`-named fixture, safe rejection code, exact status guidance, and matching README copy. | `npm test -- --grep @claim:anki-apkg-not-supported` in final clean clone; live `/demo` smoke check. |
| F-2-3 | Expanded static `404.html` with skip link, linked wordmark, main navigation, legal/footer links, version, favicon/apple touch icon, canonical, Open Graph, and Twitter metadata while retaining the blueprint style and true 404 status. | `routes, mobile layout, metadata, and accessibility pass`; live [404 document](evidence/polish-2-live/404.html), [mobile screenshot](evidence/polish-2-live/404-mobile-cold.png), and `/missing-sheet` check. |
| F-2-4 | Renamed filter controls to **Show all prompts**, **Show warm-up prompts**, **Show weak prompts**, and **Show today’s prompts**, retaining `aria-pressed`. | Full Playwright suite; live `/demo` smoke check. |
| F-2-5 | Renamed the rating action to **Mark as got it** while retaining the right-arrow hint. | `npm test -- --grep @claim:mixed-round`; live `/demo` smoke check. |

## Additional live finding closed

Cold production verification found that the worker could attach its `load` listener after the event and that the generated cache included host-hidden `staticwebapp.config.json`. The first now registers immediately when the document is already complete; the second excludes that deployment-only file from generated precache lists and is regression-tested against `dist/sw.js`. A fresh live browser reports an active controlling service worker, and an offline `/demo` reload retains all eight prompts.
