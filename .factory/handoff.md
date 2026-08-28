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

## Deploy and recheck

Build and deploy the exact static artifact:

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh flex-practice-queue dist
```

After deployment, verify the live checkout endpoint is a 303 hosted-session
redirect, `/assets/*` carries the immutable policy, `sw.js` remains no-cache,
and run `/opt/fleet/lib/verify-url.sh https://flex-practice-queue.sociobot.in`.

## Known gaps

- Direct `.apkg` parsing is not included. Anki users export a `front,back,tags`
  CSV, which is now covered by the shipped claim test.
- Data has no account sync by design; export CSV before clearing browser data.
