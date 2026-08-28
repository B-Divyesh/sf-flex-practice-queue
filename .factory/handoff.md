# Flex Practice Queue handoff

## Shipped

- Built the full local-first queue with CSV and Anki-style CSV import.
- Added manual prompts and `warm-up`, `weak`, and `today` tags.
- Added mixed rounds with timers, reveal controls, keyboard ratings, and round results.
- Added CSV export, local deletion, empty states, import errors, and offline notices.
- Added an isolated eight-prompt demo at `/demo`, with reset and exit controls.
- Added named round plans behind the $9 one-time Sociobot license.
- Added checkout, returned-license capture, daily verification caching, and pasted-license restore.
- Added `/privacy`, `/terms`, and a designed fallback route.
- Added the manifest, icons, service worker, offline fallback, metadata, sitemap, and security headers.
- Added original blueprint artwork and recorded its prompt and provenance in `.factory/design.md`.

## Verification

Clean dependency install and production checks passed on 28 August 2026:

```text
npm ci       passed
npm test     13 passed
npm run build passed; dist/index.html exists
npm audit    0 vulnerabilities
```

The test suite covers every entry in `.factory/claims.json`. It also checks all routes, the 404 view, keyboard use, 390 px layout, console errors, and axe serious or critical findings.

Offline reload passed in a fresh browser context after service-worker installation. The demo retained all eight bundled prompts with the network disabled.

The worker URL verifier reported one title, `lang="en"`, one main landmark, one h1, no missing alt text, no unlabeled buttons, and no console errors. Evidence is in `.factory/evidence/verify.json` and the two screenshots beside it.

Mobile Lighthouse results from the local production build:

| Measure | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| LCP | 2.0 s |
| Total blocking time | 0 ms |
| CLS | 0 |

The production JavaScript is 9.83 KB gzip. CSS is 4.42 KB gzip, and the hero WebP is 105,772 bytes.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy the generated `dist/` directory as the static site root. The exact build command is `npm run build`.

## Known gaps and next steps

- The factory must register the paid product before the production checkout URL can sell licenses.
- Direct `.apkg` parsing is not included. Anki users export a front/back CSV instead.
- Data has no sync or account backup by design. Users should export CSV before clearing browser storage.
- Lighthouse was measured locally against the production preview. Deployment latency may change LCP.
