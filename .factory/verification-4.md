# Independent verification 4 — Flex Practice Queue

**PASS** — verified 2026-08-29 against candidate `3c7ab61a9523f9a04ca4f68ccadfdef08caa3139` and `https://flex-practice-queue.sociobot.in`.

There are no open release-blocking, critical, high, medium, or low defects. The live deployment is the candidate: SHA-256 comparison matched every served artifact generated in `dist/` (HTML, JS, CSS, worker, manifest, artwork, icons, robots, sitemap, offline and 404 pages). `staticwebapp.config.json` is deployment configuration, intentionally not served (404).

## First read

Cold at 390 px and desktop, the first screen says **“Build a useful practice round”**; says it is for **“learners with spare minutes”** who want extra practice without changing their flashcard schedule; and presents **“Try it with sample data”** with the outcome **“Loads 8 prompts in a separate demo.”** The three visible facts state offline support, browser-local study data, and the $9 one-time named-plan feature. The required one-click demo therefore passes the plain-words and sandbox gates.

## Clean checkout and claims

The checkout was clean at the requested commit. `npm ci` completed with zero reported vulnerabilities. Every exact command declared in `.factory/claims.json` was run against the shipped demo entry point; all 15 passed:

| Claim ID | Exact command | Result |
| --- | --- | --- |
| demo-sandbox | `npm test -- --grep @claim:demo-sandbox` | Pass |
| offline-reload | `npm test -- --grep @claim:offline-reload` | Pass |
| local-privacy | `npm test -- --grep @claim:local-privacy` | Pass |
| csv-readonly | `npm test -- --grep @claim:csv-readonly` | Pass |
| source-schedule-untouched | `npm test -- --grep @claim:source-schedule-untouched` | Pass |
| anki-csv-import | `npm test -- --grep @claim:anki-csv-import` | Pass |
| anki-apkg-not-supported | `npm test -- --grep @claim:anki-apkg-not-supported` | Pass |
| csv-export | `npm test -- --grep @claim:csv-export` | Pass |
| mixed-round | `npm test -- --grep @claim:mixed-round` | Pass |
| saved-plans | `npm test -- --grep @claim:saved-plans` | Pass |
| data-delete | `npm test -- --grep @claim:data-delete` | Pass |
| free-core | `npm test -- --grep @claim:free-core` | Pass |
| paid-price | `npm test -- --grep @claim:paid-price` | Pass |
| license-check | `npm test -- --grep @claim:license-check` | Pass |
| license-data-minimization | `npm test -- --grep @claim:license-data-minimization` | Pass |

`npm test` then passed the complete Playwright suite: **20/20**. There is no separate lint script; the production build runs `tsc --noEmit`. `npm run build` passed and produced `dist/`.

## End-to-end and boundaries

- Demo starts with eight realistic prompts, a persistent isolated-data banner, Reset demo, and Start for real. The fixed sample round starts with “Explain why seasons occur.” and advances through all three prompts.
- Normal CSV and Anki front/back/tags CSV import, tag filtering, timed mixed rounds, keyboard Space/arrow controls, CSV export, deletion, named demo plans, and the free core were exercised by the claim suite.
- Invalid empty and unclosed-quote CSV files gave actionable recovery text and did not add records. A subsequent manual prompt worked. A zero-match tag filter stated “0 prompts fit this mix” and disabled Start mixed round.
- Demo isolation preserves real IndexedDB prompts/rounds and real plans, resets only the `demo:` namespace, and Start for real deletes the demo database. The claim suite covers this end-to-end.
- Offline after first visit: a service-worker-controlled live `/demo` reload succeeded with all eight prompts while the browser context was offline. The active worker was `/sw.js`; source uses `skipWaiting` and `clientsClaim` and the live registration had no waiting worker.

## Live quality checks

- `/`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown path returned the styled 404 with HTTP 404. Each tested route has English `lang`, one `<main>`, one `<h1>`, the correct title, no horizontal overflow at 390 px or 1440 px, and no serious/critical Axe violation.
- Normal live routes had no page or console errors. The factory `verify-url.sh` check passed: 596 ms load, title/lang/main, alt text, and labelled controls all present.
- Keyboard: the skip link receives focus with a visible `rgb(197, 61, 47)` 3 px outline; Privacy navigation and browser Back moved focus to the new route’s h1; reduced motion changes scroll behavior to `auto`.
- A full live demo-flow request log contained only same-origin requests. The documented license check is an explicit exception to `api.sociobot.in`; the dedicated claim verifies it sends only the token in a bodyless GET.
- Headers include HTTPS/HSTS, CSP with `frame-ancestors 'none'`, nosniff, Referrer-Policy, and Permissions-Policy. Hashed JS/CSS are `max-age=31536000, immutable`; `sw.js` is `no-cache`; HTML is revalidated at 30 seconds. The live service worker, manifest, icons, and offline fallback are present.
- The product-unlock verification endpoint was probed with one client. It allowed 29 consecutive invalid-token GETs, then request 30 returned **429** with `Retry-After: 0`; the documented allowance enforcement is present.
- Build budgets: JS 29.34 kB raw / 10.12 kB gzip, CSS 18.33 kB raw / 4.71 kB gzip, hero WebP 105.77 kB. All are inside the applicable budgets. A mobile Lighthouse run calculated Performance **90**, Accessibility **100**, Best Practices **100**, SEO **100** (FCP 1.0 s, LCP 1.6 s, CLS 0); Chrome crashed while capturing the final full-page screenshot after audits, so this score is corroborative rather than the sole evidence.

## Defects

None found. No sign-in is required, no AI feature is implied by the brief, and there are no product-owned server endpoints beyond the documented Sociobot license path.

## Reproduce

```sh
npm ci
# run every `test` command in .factory/claims.json independently
npm test
npm run build
```

Live evidence generated during this verification is in `/tmp/fpq-verification-4` for the disposable verifier environment.
