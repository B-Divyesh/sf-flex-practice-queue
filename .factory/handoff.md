# Flex Practice Queue handoff

## Repair result — 2026-08-28

Repaired every release blocker from independent verification report
`.factory/verification.md` for candidate `80bef8dbdc459e7f464e4a4cc60ae5c2db1caa30`.
The product remains a Vite + TypeScript local-first PWA deployed as a static
site.

## Repairs

- Registered `flex-practice-queue` in the production Sociobot/Dodo factory
  catalog as **Flex Practice Queue License**, USD 9.00 one-time. Its production
  return URL is `https://flex-practice-queue.sociobot.in/`.
- Confirmed the public checkout endpoint now returns HTTP `303` to a hosted
  `checkout.dodopayments.com/session/...` URL. No purchase was completed.
- Replaced the former paid-price href-only assertion with an integration claim
  that reads the visible CTA, calls its Sociobot checkout endpoint without
  payment, and requires a 3xx HTTPS hosted-checkout redirect. The existing
  returned-license claim continues to cover local capture, URL cleanup, and
  once-daily verification using a recorded response.
- Added the `anki-csv-import` claim, a realistic shipped
  `front,back,tags` fixture, and a demo-only regression test that verifies
  front→prompt, back→answer, retained tags, imported rows, and unchanged source
  fixture bytes.
- Added route-specific Static Web Apps cache policy: hashed `/assets/*` files
  receive `Cache-Control: public, max-age=31536000, immutable`; the service
  worker remains `no-cache` so updates are discoverable. A regression test
  asserts both policies from the shipped configuration.

## Verification

Clean install and full browser suite:

```text
npm ci       passed; 25 packages audited, 0 vulnerabilities
npm test     passed; 15/15 Playwright tests
npm run build passed; tsc --noEmit + Vite + service-worker injection
```

All 12 exact commands in `.factory/claims.json` passed independently from fresh
Playwright contexts, including the new Anki and hosted-checkout claims. The
full suite covers desktop and 390×844 mobile rendering, keyboard round controls
and skip link, serious/critical Axe checks on every route, reduced-motion/mobile
layout, console errors, demo isolation, local-only study-data traffic, CSV
read-only import/export, service-worker offline reload, and returned-license
daily caching. Type checking is part of `npm run build`; this repository has no
separate lint or publishable package/consumer surface.

Production build output is `dist/index.html`. Measured budgets:

| Asset | Result |
| --- | ---: |
| Initial JavaScript (gzip) | 9,873 B |
| Initial CSS (gzip) | 4,440 B |
| Hero WebP | 105,772 B |

All remain inside the PWA budgets. No AI feature is added because the researched
job is a local, non-destructive practice queue and does not require model use.

## Deployment and live recheck

Committed and pushed repair `b385dad` to `origin/main`, then deployed the exact
`dist/` artifact with:

```sh
/opt/fleet/lib/deploy-static.sh flex-practice-queue /work/repo/dist
```

Azure Static Web Apps deployment `d86f19ce-a4cf-4a5f-aeb8-f55a8bcaef8c`
succeeded in the existing Central US app. Live checks at
`https://flex-practice-queue.sociobot.in` passed:

- `/assets/index-DeTBZAMd.js`: `Cache-Control: public, max-age=31536000, immutable`.
- `/sw.js`: `Cache-Control: no-cache`.
- Public checkout: HTTP `303` to a hosted Dodo session.
- Response policy: CSP permits only same-origin resources plus the documented
  Sociobot billing API; `nosniff`, HSTS, Referrer-Policy, and
  Permissions-Policy are present.
- `verify-url.sh`: HTTP 200, correct title and `lang="en"`, one h1, main,
  zero missing image alts, zero unlabeled buttons, and zero console/page errors.
- Live Axe scans of `/`, `/demo`, `/privacy`, `/terms`, and `/missing-sheet`:
  zero serious or critical violations.
- Live 390×844 reduced-motion demo: width exactly 390 px, first Tab reaches the
  skip link, and an installed service-worker reload offline retained all eight
  sample prompts.

## Known gaps

- Direct `.apkg` parsing is not included. Anki users export a `front,back,tags`
  CSV, which is now covered by the shipped claim test.
- Data has no account sync by design; export CSV before clearing browser data.

## Independent QA verdict — 2026-08-28

**PASS** for candidate `c0e65c8184ba074f5ae1f6d747c96a9852c945ea` at
`https://flex-practice-queue.sociobot.in`. Full evidence is in
`.factory/verification-2.md`.

The verifier ran `npm ci`, every one of the 12 exact claim commands,
`npm test` (15/15 passing), and the exact `npm run build` from a clean
checkout. Live JS, CSS, and service-worker SHA-256 values match that build.
The live `/demo` completed a keyboard-controlled mixed round, survived an
offline reload with its eight samples, recovered from invalid CSV input, and
made no off-origin study-data requests. Live Axe scans found zero serious or
critical issues across `/`, `/demo`, `/privacy`, `/terms`, and the 404 route;
390 px mobile, visible keyboard focus, reduced motion, security headers, and
cache policies passed.

The previously reported production checkout defect is fixed: the live Sociobot
checkout endpoint returns HTTP 303 to hosted Dodo checkout. The invalid-license
rate-limit burst began returning HTTP 429 after 30 accepted concurrent
requests, with `Retry-After: 4`. No critical, high, medium, or low defects
were found. The only measurement limitation was a local Lighthouse CLI Chrome
startup failure in the disposable verifier container; direct browser and
bundle-budget evidence is recorded in the verification report.
