# Flex Practice Queue handoff — adversarial review 7

**FAIL** — candidate `29a19f6aa4698113fd348eb234b356c650247461` reviewed on 2026-08-29 at `https://flex-practice-queue.sociobot.in`.

No product code was changed. The review and this handoff are the only intended repository changes.

## What was done

- Audited the live product cold at 390 × 844 and 1440 × 1000.
- Exercised the one-click demo, fixed sample round, reset, exit, real prompt/round/plan isolation, request log, and offline reload.
- Ran every one of the 15 commands in `.factory/claims.json` independently from clean clone `/tmp/fpq-review7.gxAkcl/repo`.
- Ran the full 26-test Playwright suite, production build, live Axe route scans, URL verifier, link crawl, routing/focus checks, touch-target checks, and local/live artifact hash comparison.
- Rechecked all 24 earlier finding IDs in production and source.
- Completed the landing and README copy audit in `.factory/review-7.md`.

## Verification results

- `npm ci`: passed; 24 packages, 0 vulnerabilities.
- All 15 declared claim commands: passed independently.
- `npm test`: 26/26 passed.
- `npm run build`: passed; `dist/` produced. JS is 10.43 kB gzip and CSS is 4.86 kB gzip.
- Built `index.html`, JS, CSS, `404.html`, and `sw.js`: byte-for-byte matches to production.
- Live `/`, `/demo`, `/privacy`, `/terms`: HTTP 200. Unknown route: designed HTTP 404.
- Live Axe: zero serious/critical violations on all routes and 404.
- `/opt/fleet/lib/verify-url.sh`: passed; no landing console errors.

## Blocking gap

F-7-1 remains open. Demo mode is not fully isolated from real license state. With a real saved license, `/demo` reads the real token, contacts the Sociobot verifier, and writes the real verdict key while the banner says nothing is saved. The existing demo claim test omits license keys, while the license tests intentionally run from `/demo`.

## Next step

Skip all real license capture/read/verification/write behavior in demo mode, move license tests to the real route, and extend `@claim:demo-sandbox` to cover real license and verdict keys plus `/demo?license=fixture`. Re-run the entire review after repair.
