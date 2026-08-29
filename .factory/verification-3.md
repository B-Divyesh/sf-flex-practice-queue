# Independent verification — candidate `95eb6b055325b28f5b0b2ccc7298bc26d7dc8022`

**Verdict: PASS.** Verified on 2026-08-29 from the clean checkout at the candidate commit and against https://flex-practice-queue.sociobot.in. The deployed JS and service-worker bytes match the candidate build.

## Cold first read

**PASS.** A fresh desktop browser showed: “Build a useful practice round,” followed by “For learners with spare minutes who want extra practice without changing their flashcard schedule.” The first primary action was **Try it with sample data**, with the immediate outcome “Loads 8 prompts in a separate demo.” It plainly says what the product does, who it is for, and what to click first. The action opens the isolated demo in one click.

## Clean-checkout gates

`npm ci` installed the locked 25-package dependency set with 0 reported vulnerabilities. There is no separate lint script; `tsc --noEmit` is part of the exact production build.

| Gate | Result |
| --- | --- |
| Every exact claim command in `.factory/claims.json` | PASS — all 15 run independently against the local demo entry point |
| `npm test` | PASS — the complete 20-test Playwright suite; `test-results/.last-run.json` records `status: passed` |
| `npm run build` | PASS — type check, Vite build, and service-worker injection completed and produced `dist/` |
| Production budget | PASS — initial JS 29,277 B / 10,044 B gzip; CSS 18,331 B / 4,730 B gzip; hero WebP 105,772 B |

### Required claims

All passed as their exact configured `npm test -- --grep @claim:<id>` command:

| Claim IDs | Result |
| --- | --- |
| `demo-sandbox`, `offline-reload`, `local-privacy` | PASS |
| `csv-readonly`, `source-schedule-untouched`, `anki-csv-import`, `anki-apkg-not-supported`, `csv-export` | PASS |
| `mixed-round`, `saved-plans`, `data-delete`, `free-core` | PASS |
| `paid-price`, `license-check`, `license-data-minimization` | PASS |

## Product exercise

- **Core flow:** from `/demo`, the eight realistic sample prompts loaded; weak prompts were selected, a three-item round was started, Space revealed the answer, Arrow Right rated it, and Stop round produced the round result.
- **Boundary and recovery:** an empty CSV produced “The CSV is empty. Add a prompt column and try again.” and an unclosed quote produced the visible recovery message. Neither changed the eight sample prompts. The empty manual prompt form is blocked by native required-field validation.
- **Privacy:** recording the complete live demo practice flow found no off-origin request. A separate fresh license-return flow made exactly one bodyless GET to the documented Sociobot verify URL with only its encoded license token; the URL was then cleaned.
- **PWA:** a fresh live browser had an activated, controlling worker for the site scope. After service-worker readiness and one normal reload, an offline `/demo` reload retained the demo title and all eight prompts. The deployed worker has `skipWaiting`, `clients.claim`, an `updatefound` notice, and `Cache-Control: no-cache`; no newer deployment was available to force a real update event.
- **Billing/rate limit:** the checkout endpoint returned HTTP 303 to hosted Dodo checkout. The invalid-token verify endpoint accepted 31 sequential requests from this client, then request 32 returned **429** with `Retry-After: 4`; the observed allowance is therefore 31 requests in the tested burst window. No payment was attempted.

## Live deployment and browser quality

- **Candidate parity:** SHA-256 was identical for local/live `assets/index-FHTUDhLz.js` (`575fc652…`) and `sw.js` (`0451b6a6…`). The live HTML references the same candidate JS/CSS hashes.
- **Routes:** `/`, `/demo`, `/privacy`, and `/terms` return 200; the styled unknown route returns a real 404. Internal and external navigation targets checked successfully; the checkout target returned its expected 303.
- **Accessibility:** live Axe scans of `/`, `/demo`, `/privacy`, `/terms`, and the styled missing page found zero serious or critical violations. Each normal route had one `h1`, one `main`, English `lang`, and a route-specific title. At 390 x 844 there was no horizontal overflow; the first Tab focused the visible skip link. Keyboard round controls work as above.
- **Console:** no console/page error occurred on normal routes, demo flow, offline reload, or invalid-input recovery. Chromium logs the expected HTTP 404 console resource error only when directly navigating to the intentional missing route itself.
- **Headers/caching:** live responses include CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, Referrer-Policy, and Permissions-Policy. Hashed JS/CSS are immutable for one year; `sw.js` is `no-cache`; the manifest is served as `application/manifest+json`.
- **Identity:** no sign-in exists, so Entra tenant validation is not applicable. No analytics, third-party fonts, or third-party scripts were observed.

## Defects by severity

None found. The earlier deployment-only checkout failure is not reproducible: the live purchase endpoint now returns a valid hosted-checkout redirect.
