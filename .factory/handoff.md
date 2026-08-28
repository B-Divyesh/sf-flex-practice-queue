# Flex Practice Queue handoff

## Shipped

- Repaired the pasted-license feedback path: the persistent license result is a named, atomic polite status (`License verification status`), while the transient toast is a separately named, atomic polite status (`Application updates`). The toast now says `License verified…`, so it cannot duplicate the form result.
- Added regression coverage that locates both live regions by accessible role and name, verifies their distinct observable messages, and asserts that the exact `License active.` form result has one match.
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

## Repair verification

The candidate failure was reproduced after a clean install on 28 August 2026:

```text
npm ci       passed (0 vulnerabilities)
npm test     failed: tests/product.spec.ts:170 strict-mode violation
             getByText("License active.") resolved the license form status
             and the live application toast
```

After the repair:

```text
npm test -- --grep 'a pasted license enables saved plans without a reload'  1 passed
npm test                                                                  13 passed
npm ci && npm run build                                                   passed
```

The exact clean production build command is `npm ci && npm run build`. It produced `dist/index.html`, with 9.86 KB gzip JavaScript and 4.42 KB gzip CSS. The production build retains the PWA manifest, service worker, offline page, and Static Web Apps configuration.

The full browser suite exercises every claim in `.factory/claims.json`, including the isolated demo, CSV import/export, privacy network boundary, keyboard-only round controls, mobile 390 px layout, offline reload after service-worker installation, license caching, and the paid plan path. It checks every route plus the designed 404 view for one `h1`, `main`, `lang="en"`, title, console errors, and Axe serious/critical violations. The service worker’s cache-backed offline reload passed in the fresh demo context.

## Deployment

Deployed the built `dist/` artifact with the work-order static configuration on 28 August 2026:

```text
/opt/fleet/lib/deploy-static.sh flex-practice-queue dist
```

The factory provisioned `sf-flex-practice-queue` in Central US, uploaded the production bundle, added the `flex-practice-queue.sociobot.in` CNAME, and completed custom-domain/TLS registration (`Ready`). The live URL is https://flex-practice-queue.sociobot.in/.

The final live browser check reported the expected title, `lang="en"`, one `main`, one `h1` (`Build a useful practice round`), no console errors, and no Axe serious or critical violations. The served JavaScript contains the repaired `License verified. Saved round plans are ready.` notification text.

## Original builder verification

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

Deploy the generated `dist/` directory as the static site root. For a clean deployment build, use `npm ci && npm run build`.

## Known gaps and next steps

- The factory must register the paid product before the production checkout URL can sell licenses.
- Direct `.apkg` parsing is not included. Anki users export a front/back CSV instead.
- Data has no sync or account backup by design. Users should export CSV before clearing browser storage.
- Lighthouse was measured locally against the production preview. Deployment latency may change LCP.
