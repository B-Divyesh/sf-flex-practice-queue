# Independent verification 5 — Flex Practice Queue

**FAIL** — verified 2026-08-29 against candidate `2f7527bf28dcbc8784884adb76e07906a57fcaae` and `https://flex-practice-queue.sociobot.in`.

The earlier deployment-only failure is not reproducible: checkout now redirects to hosted Dodo checkout, live caching is correct, and every served build artifact matches the candidate. This candidate nevertheless fails the non-negotiable accessibility and error-state contract. At 200% text size, the landing and demo routes do not reflow within a 390px viewport; important text and form controls extend offscreen. A whitespace-only manual prompt is also silently ignored with stale success text instead of an announced error.

No product code was changed during verification.

## Release-blocking defects

### High — 200% text size pushes core content and controls offscreen

- Reproduction: open `/` or `/demo` at 390 × 844, then increase the root text size from 16px to 32px (200%).
- On `/`, `documentElement.scrollWidth` becomes **458px**. The hero headline is visibly cut at the right edge, and the paid-plan form/input becomes 438px wide from x=20 to x=458.
- On `/demo`, `documentElement.scrollWidth` becomes **469px**. Both core builder sections become 451px wide; their inputs and controls extend to x=449 from x=38.
- `/privacy` and `/terms` remain 390px wide under the same test, so this is route-specific rather than a browser artifact.
- Impact: a low-vision user who enlarges text must pan horizontally to read the job statement and operate core controls. This violates the attached requirement that text resize to 200% without loss and the responsive accessibility baseline.
- Evidence: `evidence/verify-5/text-resize-200.json`, `text-resize-offenders.json`, `text-resize-home.png`, and `text-resize-demo.png`.

### Medium — whitespace-only manual prompt fails silently

- Reproduction: enter spaces in **Prompt**, then choose **Add prompt**.
- The record is correctly not added, but no validation error appears, focus is not returned to the prompt, and the prior status remains visible. In the tested recovery flow it still said **“1 prompts imported. The source file was not changed.”**
- Empty input is caught by native `required`; the failure is specific to input that becomes empty after trimming.
- Impact: the user receives false/stale feedback and no instruction for recovery. This violates the required announced, actionable form-error behavior.
- Evidence: `evidence/verify-5/live-qa.json` → `demoFlow.whitespaceManual`.

### Medium — two inline touch targets are below the required 44px height

- The Anki export-help link on `/` and `/demo` measures **308.25 × 34.72px** at 390px.
- The support email link on `/terms` measures **153.25 × 19px**.
- Labeled checkbox controls and the visually hidden file input were not counted as defects because their associated labels provide 44px targets.
- Evidence: `evidence/verify-5/touch-targets-all.json`.

## Mandatory first gates

### Claims

`.factory/claims.json` exists. Every exact command was run individually from the clean candidate checkout against the local demo entry point. All **15/15 passed**:

| Claim IDs | Result |
| --- | --- |
| `demo-sandbox`, `offline-reload`, `local-privacy` | Pass |
| `csv-readonly`, `source-schedule-untouched`, `anki-csv-import`, `anki-apkg-not-supported`, `csv-export` | Pass |
| `mixed-round`, `saved-plans`, `data-delete`, `free-core` | Pass |
| `paid-price`, `license-check`, `license-data-minimization` | Pass |

Each claim tag occurs exactly once in `tests/product.spec.ts`. Individual command output is under `evidence/verify-5/claims/`.

### Cold first read

**PASS.** A fresh desktop browser showed:

- What: **“Build a short flashcard practice round.”**
- For whom: learners with spare minutes who want extra practice without changing their flashcard schedule.
- First click: **“Try it with sample data”**, immediately explained as loading eight prompts in a separate demo.

One click opened `?demo=1`, displayed the persistent **“Demo — sample data, nothing is saved”** banner, eight populated prompts, and a ready three-prompt round. The same primary action is visible at y=547.94 in the first 390 × 844 viewport. Evidence: `live-first-read-desktop.png`, `live-demo-after-one-click.png`, `live-mobile-first-screen.png`, and `live-mobile-demo.png`.

## Clean-checkout gates

| Gate | Result |
| --- | --- |
| Checkout | Clean at requested commit before QA; only verifier evidence/docs added afterward |
| `npm ci` | Pass — 24 packages installed, 0 vulnerabilities |
| Every `.factory/claims.json` command | Pass — 15/15 independently |
| `npm test` | Pass — 23/23 Playwright tests |
| Type check | Pass — `tsc --noEmit` is part of the build |
| Lint | No lint script exists |
| `npm run build` | Pass — exact production build produced `dist/` |

Logs: `evidence/verify-5/npm-test.log` and `npm-build.log`.

## Independent product exercise

- The live fixed sample round presented the documented prompts in order. Space revealed each answer; Left marked the first for retry; Right rated the next two. The result reported three prompts and one retry.
- A requested 12-item weak round with only four matching prompts correctly queued four rather than failing or duplicating items.
- Empty CSV, headings-only CSV, a row without a prompt, an unclosed quoted field, and a `.apkg`-named file each produced specific recovery text and kept all eight sample prompts.
- Recovery then succeeded with a BOM/CRLF Anki CSV containing commas and escaped quotation marks; its `weak` and `today` tags were preserved. A manual prompt also succeeded afterward.
- An empty saved-plan name produced an announced error and returned focus to the name field.
- The demo stayed isolated; the claim test proved exact real IndexedDB prompts/rounds and real plans survive demo mutation, reset, and Start for real.
- No sign-in exists, so Microsoft Entra tenant validation is not applicable. This is not a library, CLI, or backend product.

## Live deployment identity, routes, and links

- Every publicly served file produced by `npm run build` matched live byte-for-byte by SHA-256: HTML, JS, CSS, source map, service worker, manifest, offline/404 pages, artwork, icons, robots, and sitemap. `staticwebapp.config.json` is host configuration and is intentionally not public.
- The unknown route returned HTTP 404 with bytes identical to candidate `dist/404.html`.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200 with route-specific titles, English `lang`, one `main`, and one `h1`.
- All rendered links were live: same-origin and Anki/Sociobot links returned 200; checkout returned the expected 303; the support address is `mailto:`.
- Evidence: `evidence/verify-5/artifact-parity.tsv` and `live-qa.json`.

## Privacy, requests, headers, and billing

- A fresh live demo import/practice flow made three requests, all to the product origin. No analytics, remote fonts, or third-party scripts were observed.
- A separate explicit invalid-license action made exactly one off-origin request: a bodyless GET to `https://api.sociobot.in/api/v1/products/flex-practice-queue/verify?license=...`; the token was URL-encoded and no prompt/plan content was sent.
- Root browser response headers include HSTS, CSP with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a restrictive permissions policy.
- Hashed JS/CSS/source-map assets are `max-age=31536000, immutable`; `sw.js` is `no-cache`; the manifest has the correct MIME type.
- Checkout returned HTTP 303 to `checkout.dodopayments.com`. No transaction was attempted.
- A fresh 40-request invalid-license burst from one client produced **30 × 200** and **10 × 429**. Every 429 carried `Retry-After: 4`. Observed burst allowance: **30 requests per tested window**.
- Evidence: `live-qa.json`, `live-license-request.json`, `live-headers.txt`, and `rate-limit.json`.

## PWA and offline behavior

- A fresh live context installed and activated `/sw.js`; after a controlled reload, going offline and reloading `/demo` restored the title, heading, and all eight prompts without console/page errors.
- The live cache name was `flex-practice-queue-v1`.
- A simulated new worker deployment changed the worker bytes, triggered **“An update is ready. Reload to use it.”**, and retained all eight prompts after reload.
- Manifest validation passed for standalone display, 192/512 icons, and a 512px maskable icon. Actual icon dimensions match the declarations.
- Evidence: `live-offline.json`, `live-offline-demo.png`, `sw-update-qa.json`, and `manifest-check.json`.

## Accessibility, browser quality, and performance

- Independent Axe scans of `/`, `/demo`, `/privacy`, `/terms`, and the styled 404 found **0 serious/critical** findings.
- Normal desktop/mobile routes and all exercised flows had no console or page errors. Direct navigation to the intentional HTTP 404 logs Chromium's expected failed-document resource message only.
- The first Tab focuses the skip link. Its focus indicator is a 3px solid `rgb(197, 61, 47)` outline with 3px offset; Enter moves focus to `main`.
- At ordinary 390 × 844 size there is no horizontal overflow. Reduced motion changes smooth scrolling to `auto`. The fixed sample preview and action are in the first viewport.
- Factory URL verifier passed in 682ms with title/lang/main, one h1, image alt text, labeled buttons, and no errors.
- Mobile Lighthouse: Performance **91**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **1.03s**, LCP **1.63s**, CLS **0**, TBT **364ms**.
- Build budgets pass: initial JS **30,010 bytes** / 10.32 KB gzip, CSS **18,530 bytes** / 4.73 KB gzip, hero WebP **105,772 bytes**, fonts **0 bytes**.
- The separate 200% text and touch-target failures above are not detected by Axe/Lighthouse and remain blocking.

## Retest criteria

1. Make `/` and `/demo` reflow at 200% text size on a 390px viewport without horizontal clipping or offscreen controls.
2. Show and announce a specific error for a prompt that is empty after trimming; clear stale success text and return focus to the prompt.
3. Give the Anki help and support email links at least 44px touch height without breaking inline reading.
4. Add regression tests for all three cases, then rerun every claim, `npm test`, `npm run build`, live artifact parity, mobile Axe/Lighthouse, offline/update, and request-log checks.
