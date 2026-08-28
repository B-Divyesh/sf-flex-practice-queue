# Independent verification — FAIL

**Candidate:** `80bef8dbdc459e7f464e4a4cc60ae5c2db1caa30` (`docs: record repair deployment evidence`)  
**Verified:** 2026-08-28 14:35–14:43 UTC  
**Live URL:** https://flex-practice-queue.sociobot.in  
**Verifier:** independent factory QA, clean checkout; no product code changed.

## Release decision

**FAIL.** The free, local-first practice queue is working and the deployed client bytes match the candidate. However, the product advertises a paid $9 license and its only purchase link is broken in production:

```text
GET https://api.sociobot.in/api/v1/products/flex-practice-queue/checkout
HTTP/2 404
{"error":"enabled factory product","status":404}
```

That prevents a buyer from obtaining the advertised named-round-plan feature. It is an end-to-end failure of an in-scope product feature. The deployment also does not provide the required immutable caching for hashed static assets, and a material Anki import claim is not listed/tested in the claims contract.

## Blocking defects

### P1 — paid checkout is not registered or reachable in production

- Evidence: live `Buy a $9 license` link resolves to the URL above and returns `404`, not checkout or a redirect.
- Impact: users cannot purchase the advertised paid feature; a valid production license cannot be acquired through the product.
- Required fix: register/enable `flex-practice-queue` with the Sociobot billing API, set its return URL, and prove a test checkout/returned-license flow. Replace the shallow `@claim:paid-price` href assertion with an observable checkout-route integration check appropriate to the environment.

### P1 — deployed static assets lack immutable caching

- Evidence: `HEAD /assets/index-DeTBZAMd.js` (a content-hashed file) returned `Cache-Control: public, must-revalidate, max-age=30`; the same policy applies to CSS, manifest, service worker, and the root document. The required PWA policy is long-lived immutable caching for hashed assets.
- Impact: repeat loads revalidate the application bundle every 30 seconds, defeating the stated static-PWA cache policy and degrading resilience/performance outside an already-installed service worker.
- Required fix: configure the production static host for `Cache-Control: public, max-age=31536000, immutable` on hashed assets; keep HTML and `sw.js` short-lived so updates are discoverable. Recheck live response headers after deployment.

### P1 — unlisted, uncontracted Anki import claim

- Evidence: the landing workbench and README say “Anki front/back CSV also works” / “common Anki `front,back,tags` exports”, but `.factory/claims.json` has no Anki claim and no `@claim` test. `@claim:csv-readonly` only declares `prompt,answer,tags` CSV.
- Independent manual smoke test did import `front,back,tags\nCapital of Japan?,Tokyo,weak` successfully (one prompt, `weak` tag). That does not meet the claims rule: a user-facing claim must have exactly one declared, demo-entry-point test.
- Required fix: add an `anki-csv-import` claim and tagged test using a realistic Anki fixture, including a read-only assertion, or remove the Anki promise from page and README.

## Required claims — all passed from the clean checkout

`npm ci` completed with 0 vulnerabilities. Before broader QA, every exact command in `.factory/claims.json` was run against its Playwright demo entry point. All 11 passed; the final Playwright status was `{"status":"passed","failedTests":[]}`.

| Claim | Exact command | Result |
| --- | --- | --- |
| demo-sandbox | `npm test -- --grep @claim:demo-sandbox` | PASS — 8 isolated prompts, reset/storage assertions |
| offline-reload | `npm test -- --grep @claim:offline-reload` | PASS — fresh demo reload offline |
| local-privacy | `npm test -- --grep @claim:local-privacy` | PASS — full demo flow only same-origin requests |
| csv-readonly | `npm test -- --grep @claim:csv-readonly` | PASS — fixture bytes unchanged, imported rows |
| csv-export | `npm test -- --grep @claim:csv-export` | PASS — CSV heading, filename, rows, sample prompt |
| mixed-round | `npm test -- --grep @claim:mixed-round` | PASS — timer, Space/arrow controls, result |
| saved-plans | `npm test -- --grep @claim:saved-plans` | PASS — save/change/reload demo plan |
| data-delete | `npm test -- --grep @claim:data-delete` | PASS — confirmation, empty/reload state |
| free-core | `npm test -- --grep @claim:free-core` | PASS — no-license import/tag/practice/export |
| paid-price | `npm test -- --grep @claim:paid-price` | PASS — text and configured href only; it did **not** exercise the live checkout |
| license-check | `npm test -- --grep @claim:license-check` | PASS — fixture verification, URL cleanup, daily cache |

The full local suite then passed **13/13** (`npm test`). There is no separate lint script; the exact build includes `tsc --noEmit`. `npm run build` passed and produced `dist/`.

## First-read test (cold live browser)

**PASS.** On a fresh desktop browser context, the first screen said:

- What: “Build a useful practice round.”
- For whom: “For learners with spare minutes who want extra practice without changing a formal card schedule.”
- What to click: visible “Try it with sample data”, immediately followed by “Loads 8 prompts in a separate demo.”

It also presents the three plain facts (offline, local browser storage, and free core/$9 plans). The action goes directly to `/demo`; no account or setup is required.

## Live artifact and end-to-end checks

- **Candidate parity: PASS.** Every deployable file (HTML, JS, CSS, both WebP assets, manifest, service worker, icons, robots, sitemap, offline page) was byte-for-byte identical to the fresh `dist/` build. Live hashed asset SHA-256 prefix: JS `c1370a2689913e99`; CSS `0af4a32c023d1956`.
- **Core live workflow: PASS.** In `/demo`, selected `weak`, set 3 prompts/15 seconds, used Space to reveal and Left/Right to rate. Result: `3 prompts practiced`, `1` marked try again; the round note persisted. Reset demo then restored eight samples and removed the round record after the async reset completed.
- **Boundary/recovery: PASS.** Empty CSV, missing prompt row, and unclosed quote each delivered the expected visible error with `.error` status. A valid front/back Anki-style row then imported successfully. The one-click sample was available at 390 px with `body.scrollWidth === 390`.
- **Demo isolation/privacy: PASS.** The shipped claim test observed only same-origin traffic during a practice flow. Browser inspection showed the documented demo IndexedDB/localStorage namespace. No analytics or remote fonts/scripts loaded. The only runtime cross-origin destination in code/CSP is the Sociobot license API after an explicit license action.
- **Offline/PWA: PASS for reload.** On the live `/demo`, after service-worker readiness and a normal reload, turning the browser context offline and reloading kept title `Demo — Flex Practice Queue` and all 8 prompts. The service worker has precache, `skipWaiting`, `clientsClaim`, and an update-available toast implementation. No newer deployment existed to force an actual update event.
- **Routes/links: PASS except checkout.** `/`, `/demo`, `/privacy`, `/terms`, and the styled missing route all returned/loaded correctly with one h1 and one main. All rendered links returned 200 except the checkout link (404 above).
- **Rate limit: PASS.** A 40-request concurrent burst of the invalid-license verification endpoint returned 30 × 200 and then 10 × 429. Every 429 included `Retry-After: 4`; observed burst threshold was 30 accepted requests.
- **Sign-in: N/A.** The product has no sign-in or identity provider; only optional billing-license verification.

## Accessibility, browser quality, and policies

- **Axe: PASS.** Independent `@axe-core/playwright` scans of `/`, `/demo`, `/privacy`, `/terms`, and `/missing-sheet` found zero serious/critical violations. The repository has no `verify-url.sh`; the full suite and independent scan covered title, lang, main, h1, alt/accessibility, and console checks instead.
- **Keyboard: PASS.** The first Tab lands on the skip link; its computed focus indicator is a visible `rgb(197, 61, 47) solid 3px` outline with `3px` offset. Enter moves focus to `main`. The live round workflow worked with Space and arrow keys.
- **Reduced motion/mobile: PASS.** Fresh 390 × 844 context with `prefers-reduced-motion: reduce` had no horizontal overflow and no console/page errors. The complete test suite also covers this width.
- **Console/page errors: PASS.** No errors observed during independent cold-load, route, demo, offline, input-error, or round-flow checks.
- **Response policies: PARTIAL.** Live responses contain CSP (`default-src 'self'`; only `https://api.sociobot.in` in `connect-src`), `X-Content-Type-Options: nosniff`, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and correct manifest MIME type. The cache policy defect above remains blocking.

## Bundle and Lighthouse evidence

- Fresh build gzip sizes: JS **9,866 bytes** (≤200 KB) and CSS **4,430 bytes** (≤50 KB); hero WebP **105,772 bytes** (≤300 KB).
- Independent live mobile Lighthouse emitted scores of Performance **93**, Accessibility **100**, Best Practices **100**, SEO **100**, LCP **1.6 s**, CLS **0**. Chromium crashed during Lighthouse’s final screenshot/BFCache collection, so these are informative but not a clean, authoritative Lighthouse completion. The deployment’s short static cache header is independently confirmed by `curl` and is a release blocker regardless.

## Retest commands

```sh
npm ci
npm test
npm run build
```

Then verify the live checkout responds with a checkout redirect (not 404), inspect asset cache headers, and rerun every command in the claims table from a clean browser context.
