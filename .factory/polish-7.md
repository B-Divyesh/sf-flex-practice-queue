# Polish round 7 — cumulative finding closure

Repair commit: `7169e1b6d90bc9070cf41aa84929de18283abbb9`.
Deployment: `42499b8d-cf84-4d62-b916-2799641c2a93` at
`https://flex-practice-queue.sociobot.in`.

I read every `review-*.md` and earlier `polish-*.md`. Review 3 recorded no
findings. The table maps every recorded finding to the retained or repaired
behavior and round-seven evidence. `live-check.json` covers cold routes,
metadata, focus, mobile targets, live Axe, the sample round, and the saved
license demo check; screenshots below are cold 390 × 844 captures unless noted.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the realistic prompt, tags, timer, and fixed sample action above the demo fold. | `demo shows and starts the same fixed sample round in the first 390px viewport`; `evidence/polish-7-live/cold-demo-mobile.png`; live `/?demo=1` has preview y=405.69 and action bottom=537.08 in `live-check.json`. |
| F-1-2 | Kept explicit app rewrites and the static 404 response override. | `static deployment keeps known app routes, a real 404…`; `evidence/polish-7-live/404.headers`; live `/missing-polish-7` returns 404. |
| F-1-3 | Kept the declared read-only flashcard-schedule boundary across import, practice, and export. | `@claim:source-schedule-untouched`; clean-clone claim sweep; live `/?demo=1` request log in `live-check.json`. |
| F-1-4 | Kept merchant-of-record and refund promises out of visible copy. | `@claim:paid-price`; `cold-landing-mobile.png`; live `/` copy check in `live-check.json`. |
| F-1-5 | Kept token-only, bodyless Sociobot verification and moved its test off demo. | `@claim:license-data-minimization`; clean-clone claim sweep; live `/privacy` Axe/metadata check. |
| F-1-6 | Kept direct Anki CSV-export guidance and safe `.apkg` rejection. | `@claim:anki-csv-import`, `@claim:anki-apkg-not-supported`; `cold-demo-mobile.png`; live `/demo`. |
| F-1-7 | Kept **flashcard schedule** as the protected-system term. | Landing copy test and `.factory/copy-audit.md`; `cold-landing-mobile.png`; live `/`. |
| F-2-1 | Extended full demo isolation to real license and verdict keys; demo does not read, send, or write them, and normal exit retains exact real values. | Strengthened `@claim:demo-sandbox`; `saved-license-demo-mobile.png`; live `/?demo=1` and `/demo?license=returned-live-license` show zero license touches and off-origin requests in `live-check.json`. |
| F-2-2 | Kept the testable `.apkg` limitation and CSV instruction. | `@claim:anki-apkg-not-supported`; `cold-demo-mobile.png`; live `/demo`. |
| F-2-3 | Kept the accessible static 404 shell, metadata, header, legal links, and return action. | `routes, mobile layout, metadata, and accessibility pass`; `cold-404-mobile.png`; live `/missing-polish-7` 404 and Axe pass. |
| F-2-4 | Kept result-naming **Show … prompts** filters. | `@claim:mixed-round`; `cold-demo-mobile.png`; live `/demo`. |
| F-2-5 | Kept **Mark as got it** as the positive rating action. | `@claim:mixed-round`; `sample-round-started-mobile.png`; live `/demo`. |
| F-4-1 | Kept **Extra flashcard practice** as the first-screen label. | Landing copy test; `cold-landing-mobile.png`; live `/`. |
| F-4-2 | Kept the direct art caption **Choose a few existing flashcards for extra practice.** | Landing copy test; `cold-landing-mobile.png`; live `/`. |
| F-4-3 | Kept named free actions and the tested $9 saved-plan price. | `@claim:free-core`, `@claim:paid-price`; `cold-landing-mobile.png`; live `/`. |
| F-4-4 | Kept **Your practice queue** as the work-area label. | Landing copy test; `cold-landing-mobile.png`; live `/`. |
| F-4-5 | Kept **Tag prompts** and removed decorative assembly wording. | Landing copy test; `hash-mobile.png`; live `/#how`. |
| F-4-6 | Kept **Leaves your flashcard schedule alone** and the claimed schedule boundary. | `@claim:source-schedule-untouched`; `cold-landing-mobile.png`; live `/`. |
| F-4-7 | Kept **Paid round plans** as the paid section name. | `@claim:paid-price`; `cold-landing-mobile.png`; live `/`. |
| F-5-1 | Kept the fixed three-prompt preview and made its action start that exact first prompt. | Demo fixed-round test; `sample-round-started-mobile.png`; live preview and started text are both **Explain why seasons occur.** in `live-check.json`. |
| F-6-1 | Kept post-initialization hash scrolling, focus, and announcement. | `hash routes wait for the local queue before focusing the requested section`; `hash-mobile.png`; live `/#how` focuses `how-heading` at y=64.41. |
| F-6-2 | Kept 44 × 44 px non-overlapping mobile targets. | `mobile interactive targets meet the 44px touch baseline`; live `/` reports 14 checked controls with minimum 44 × 44 px. |
| F-6-3 | Kept **View $9 saved plans** and **Load plan settings** as result-naming controls. | `plan actions name the result they produce`; `cold-landing-mobile.png`; live `/`. |
| F-6-4 | Kept **Build a short flashcard practice round** as the concrete headline. | Landing copy test and `.factory/copy-audit.md`; `cold-landing-mobile.png`; live `/`. |
| F-7-1 | Demo detection now precedes license bootstrap. Demo routes render without calling license capture/read/verify/write APIs; a returned license is carried to real storage only after **Start for real**. | Strengthened `@claim:demo-sandbox`; `saved-license-demo-mobile.png`; live `/?demo=1` and `/demo?license=returned-live-license` record no license-key touch and no off-origin request. |

## Verification evidence

- Fresh clone: `/tmp/fpq-polish7-final.rcRwhh/repo` at
  `7169e1b6d90bc9070cf41aa84929de18283abbb9`.
- `npm ci` passed with 24 packages and 0 vulnerabilities. All 15 exact
  commands from `.factory/claims.json` passed independently. `npm test` passed
  26/26, and `npm run build` produced `dist/index.html`.
- Built assets: JavaScript 30.82 kB raw / 10.51 kB gzip; CSS 19.06 kB raw /
  4.86 kB gzip.
- `/opt/fleet/lib/verify-url.sh` recorded a cold 856 ms landing load, no
  console errors, correct title/language/main, alternate text, and labelled
  buttons in `evidence/polish-7-live/verify.json`.
- Cold live route and Axe check: `/`, `/demo`, `/privacy`, `/terms` each return
  200 with the expected title, one `h1`, one `main`, and zero serious/critical
  Axe findings. `/missing-polish-7` returns 404 with the designed static page;
  see `live-check.json` and `404.headers`.
- Live mobile Lighthouse: 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; FCP 0.9 s, LCP 1.6 s, CLS 0, and TBT 0 ms in
  `evidence/polish-7-live/lighthouse-mobile.json`.

The catalog description is now **“Build short flashcard rounds without changing
your flashcard schedule.”** It is verb-first and 63 characters.
