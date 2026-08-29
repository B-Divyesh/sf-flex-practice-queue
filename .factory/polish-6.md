# Polish round 6 — Flex Practice Queue

Repair commit: `2131213418602b995d29b9a6274e65d9a6f980cf`.

Every `review-*.md` and earlier `polish-*.md` was read before this repair.
The table maps every cumulative finding to the retained or new product change,
the named automated evidence, and the cold production check.

| Finding | Change made | Evidence and live check |
| --- | --- | --- |
| F-1-1 | Kept the isolated sample preview above the mobile fold with its real prompt, tags, 30-second setting, and fixed-round action. | Playwright `demo shows and starts the same fixed sample round in the first 390px viewport`; [cold demo preview](evidence/polish-6-live/demo-preview-mobile-cold.png); live `/?demo=1` reports preview y=405.69 and the same live prompt in `live-check.json`. |
| F-1-2 | Kept the explicit app route rewrites and static 404 response override. | Playwright `static deployment keeps known app routes, a real 404…`; [live 404 headers](evidence/polish-6-live/404.headers); live `/missing-sheet-round-6` returned HTTP 404 with the styled page. |
| F-1-3 | Kept the separately declared, source-safe practice contract. | Clean-clone `npm test -- --grep @claim:source-schedule-untouched`; live demo traffic was same-origin in `live-check.json`. |
| F-1-4 | Kept merchant-of-record and refund assurances out of product and legal copy. | Clean-clone `npm test -- --grep @claim:paid-price`; live `live-feature-check.json` confirms the hosted checkout wording and no merchant/refund promise. |
| F-1-5 | Kept the token-only license-verification contract and request assertion. | Clean-clone `npm test -- --grep @claim:license-data-minimization`; live `/privacy` passed title, main, and Axe checks in `live-check.json`. |
| F-1-6 | Kept the direct Anki CSV export instruction and safe `.apkg` rejection. | Clean-clone `npm test -- --grep @claim:anki-csv-import` and `@claim:anki-apkg-not-supported`; live `live-feature-check.json` records the exact guidance and unchanged eight-prompt count. |
| F-1-7 | Kept **flashcard schedule** as the protected-system term. | Playwright `landing copy names the job, free tools, and paid feature in plain words`; `.factory/copy-audit.md`; live `/` check in `live-feature-check.json`. |
| F-2-1 | Kept separate demo IndexedDB/localStorage namespaces; Reset and Start for real delete only demo data. | Clean-clone `npm test -- --grep @claim:demo-sandbox`; live `/?demo=1` cold check in [demo preview](evidence/polish-6-live/demo-preview-mobile-cold.png). |
| F-2-2 | Kept `.apkg` behavior in the claims contract and UI. | Clean-clone `npm test -- --grep @claim:anki-apkg-not-supported`; live `live-feature-check.json`. |
| F-2-3 | Kept the accessible static 404 shell with skip link, home wordmark, navigation, legal footer, and metadata. | Playwright `routes, mobile layout, metadata, and accessibility pass`; live 404 Axe result in `live-check.json`; [cold 404](evidence/polish-6-live/404-mobile-cold.png). |
| F-2-4 | Kept result-naming filter controls. | Clean-clone `npm test -- --grep @claim:mixed-round`; live `live-feature-check.json` lists all four **Show … prompts** controls. |
| F-2-5 | Kept the positive rating action **Mark as got it**. | Clean-clone `npm test -- --grep @claim:mixed-round`; live [started sample](evidence/polish-6-live/demo-started-mobile-cold.png). |
| F-4-1 | Kept **Extra flashcard practice** as the first-screen label. | Playwright `landing copy names the job, free tools, and paid feature in plain words`; live [cold landing](evidence/polish-6-live/screenshot-mobile.png). |
| F-4-2 | Kept the direct artwork caption **Choose a few existing flashcards for extra practice.** | Same landing-copy test; live [cold landing](evidence/polish-6-live/screenshot-desktop.png). |
| F-4-3 | Kept the named free actions and tested $9 saved-plan fact. | Clean-clone `@claim:free-core` and `@claim:paid-price`; live `/` in `live-check.json`. |
| F-4-4 | Kept **Your practice queue** as the work-area label. | Landing-copy test; live [cold landing](evidence/polish-6-live/screenshot-desktop.png). |
| F-4-5 | Kept **Tag prompts** and removed decorative assembly language. | Landing-copy test; live `/#how` in [hash viewport](evidence/polish-6-live/hash-mobile-viewport.png). |
| F-4-6 | Kept **Leaves your flashcard schedule alone** and removed scope jargon. | Clean-clone `@claim:source-schedule-untouched`; live `/` in `live-feature-check.json`. |
| F-4-7 | Kept **Paid round plans** as the paid section label. | Landing-copy test; live [plan destination](evidence/polish-6-live/plan-option-mobile-viewport.png). |
| F-5-1 | Kept the preview and action on the same fixed three-prompt sequence, beginning with **Explain why seasons occur.** | Playwright `demo shows and starts the same fixed sample round in the first 390px viewport`; live `live-check.json`; [preview](evidence/polish-6-live/demo-preview-mobile-cold.png) and [started round](evidence/polish-6-live/demo-started-mobile-cold.png). |
| F-6-1 | After IndexedDB initialization and final layout, hash navigation now instant-scrolls, focuses the destination heading without a second scroll, and announces it. Header hash links use the same client route path. | Playwright `hash routes wait for the local queue before focusing the requested section`; live `/#how` at 390px focused the heading at y=64.09 and `/privacy` → How it works did so at y=88; [mobile](evidence/polish-6-live/hash-mobile-viewport.png), [desktop](evidence/polish-6-live/hash-from-privacy-desktop-viewport.png), `live-check.json`. |
| F-6-2 | Wordmark, empty-state action, footer links, and static-404 equivalents now expose non-overlapping 44×44px hit areas. | Playwright `mobile interactive targets meet the 44px touch baseline`; live `live-check.json` measured 14 targets, minimum 44×44px, no overlap. |
| F-6-3 | The unlicensed control is now **View $9 saved plans**, a link to the price section; a saved plan now says **Load plan settings**. | Playwright `plan actions name the result they produce`; live [price destination](evidence/polish-6-live/plan-option-mobile-viewport.png) and `live-feature-check.json`. |
| F-6-4 | Replaced the evaluative headline with **Build a short flashcard practice round** and aligned title/description/Open Graph/Twitter metadata, README, catalog, and audit. | Landing-copy test; `.factory/copy-audit.md`; live `/` title and h1 in `verify.json` and `live-check.json`. |

## Verification evidence

- Clean clone: `/tmp/fpq-polish6.nOmYtR/repo` at
  `2131213418602b995d29b9a6274e65d9a6f980cf`.
- `npm ci` passed (24 packages, 0 vulnerabilities). Every one of the 15 exact
  commands from `.factory/claims.json` passed independently. `npm test` passed
  23/23 and `npm run build` produced `dist/index.html`.
- Built initial JavaScript is 30.01 kB raw / 10.32 kB gzip; CSS is 18.53 kB
  raw / 4.73 kB gzip.
- Production deploy succeeded through `deploy-static.sh` (deployment id
  `6813121e-26b3-49f1-8753-254cdd897969`). The cold verifier at
  `https://flex-practice-queue.sociobot.in/` recorded 850 ms load, no console
  errors, title/lang/main, alternate text, and labelled buttons in
  `evidence/polish-6-live/verify.json`.
- Live Playwright/Axe checks found zero serious or critical violations across
  `/`, `/demo`, `/privacy`, `/terms`, and the 404; demo reloads offline with
  eight prompts; all live demo requests were same-origin. See
  `evidence/polish-6-live/live-check.json`.
- Mobile Lighthouse recorded 100 performance, 100 accessibility, 100 best
  practices, and 100 SEO; FCP 0.9 s, LCP 1.5 s, CLS 0, TBT 30 ms in
  `evidence/polish-6-live/lighthouse-mobile.json`.
