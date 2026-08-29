# Independent verification 8 — Flex Practice Queue

**PASS** — candidate `da0f16bd20b9d929a387b332ba0a531133f88fe3` is buildable,
the live product matches its built artifact byte-for-byte, and the researched
offline practice-queue job works end to end.

- Work order: `flex-practice-queue-verify-8`
- Candidate / local `HEAD`: `da0f16bd20b9d929a387b332ba0a531133f88fe3`
- Verified URL: <https://flex-practice-queue.sociobot.in>
- Verified: 29 August 2026 UTC
- Product code changed by this verification: **none**

## Cold first read

On a fresh desktop visit, the first screen says **“Build a short flashcard
practice round”**, identifies **learners with spare minutes** as its audience,
and explains that it adds practice without changing their flashcard schedule.
The first primary action is **“Try it with sample data”**, directly followed by
“Loads 8 prompts in a separate demo.”  It also plainly states offline, local
browser storage, free-core, and $9-plan facts. This passes the first-read and
one-click sandbox requirements.

## Required claims and clean checkout gates

`npm ci` succeeded from the supplied clean checkout (24 packages; 0
vulnerabilities). `.factory/claims.json` exists, has 15 entries, and every
entry maps to exactly one `@claim:<id>` Playwright test.

All 15 required commands were run individually in a clean installed checkout:

| Claim id | Result |
| --- | --- |
| demo-sandbox | PASS |
| offline-reload | PASS |
| local-privacy | PASS |
| csv-readonly | PASS |
| source-schedule-untouched | PASS |
| anki-csv-import | PASS |
| anki-apkg-not-supported | PASS |
| csv-export | PASS |
| mixed-round | PASS |
| saved-plans | PASS |
| data-delete | PASS |
| free-core | PASS |
| paid-price | PASS |
| license-check | PASS |
| license-data-minimization | PASS |

The complete local suite then passed **28/28** in 1.0 minute:

```sh
npm test -- --reporter=line
```

The exact production build passed:

```sh
npm run build
```

This ran strict `tsc --noEmit`, Vite, and service-worker precache injection.
There is no separate lint script; strict TypeScript is part of the required
build. The production bundle is 31,139 bytes raw / 10,630 bytes gzip JavaScript
and 19,063 bytes raw / 4,860 bytes gzip CSS, within the static/PWA budgets.

## Live deployment and functional QA

The live Playwright suite also passed **28/28** (55.7 seconds):

```sh
PLAYWRIGHT_BASE_URL=https://flex-practice-queue.sociobot.in npm test -- --reporter=line
```

A fresh build was compared directly with production. All 16 published static
files checked matched exactly by bytes: `index.html`, `404.html`, manifest,
service worker, offline page, both hashed bundles, all icons, artwork,
robots.txt, and sitemap.xml. This proves the deployed asset set is the tested
candidate build.

Independent browser checks on desktop (1440 × 900) and mobile (390 × 844)
started the eight-prompt demo round, used Space to reveal and Right Arrow to
rate it, and reached live round 2 of 3. Both widths had no horizontal overflow,
no console errors, no page errors, and no off-origin requests during the demo.
The initial Tab reaches the skip link; the round controls respond to keyboard;
the tested focus styles are visible; `prefers-reduced-motion` changes scroll
behavior to `auto`.

Malformed CSV recovery kept the eight demo prompts and announced “A quoted
field is not closed. Fix the CSV and try again.” An all-whitespace manual prompt
announced “Enter a prompt before adding it.” and returned focus to the field.
The full suite additionally covers importing normal/Anki CSV, rejecting
`.apkg`, multiline CSV export/reimport, tagging, timed rounds, stopping,
deleting data, free-core controls, named-plan save/load, license return/paste,
and revoked-license recovery.

## Privacy, PWA, accessibility, and delivery policy

- Full demo request logging recorded only the product origin; no analytics,
  remote fonts, scripts, or study-data requests were observed. The license
  regression asserts exactly one bodyless verification GET containing only the
  encoded license token.
- A fresh `/demo` visit installed the worker. After the context was made
  offline and reloaded, the page remained usable and retained all eight sample
  prompts. The worker-update simulation produced “An update is ready. Reload
  to use it.”, activated the new worker, retained eight prompts, and produced
  no errors. Because `sw.js` was byte-identical live, this verifies the shipped
  update implementation.
- Axe found **0 serious or critical** issues on `/demo` at both viewport sizes.
  `/opt/fleet/lib/verify-url.sh` passed the live root: title, `lang=en`, one
  H1, main landmark, complete image alt text, labelled buttons, and no errors.
- Live response headers include CSP with response-header `frame-ancestors
  'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer
  policy, and permissions policy. HTML has 30-second revalidation; hashed JS
  has one-year immutable caching; `sw.js` is `no-cache`.
- Mobile Lighthouse: Performance **97**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 980 ms, LCP 1,580 ms, CLS 0, TBT 199 ms.

## Billing endpoint allowance

The live Sociobot checkout endpoint was exercised from this verifier as one
client with 35 sequential `GET` requests and redirects disabled. It returned
303 hosted-checkout redirects for the first 17 requests in this immediate
sequence; request 18 returned **429** with `Retry-After: 0`. A later request
was accepted as the short window refilled, then subsequent requests again
returned 429 with the same header. Earlier suite checkout verification had run
from the same client minutes beforehand, so 17 is the observed remaining
allowance rather than a claim about the configured full-window ceiling. The
required enforcement and `Retry-After` header are present. No checkout was
completed and no payment was made.

## Defects

No release-blocking, high, medium, or low defects found. Sign-in, a library/CLI
consumer, backend persistence/health, and AI-feature checks do not apply: this
is a static local-first PWA with no account system, server backend, package API,
or AI feature.
