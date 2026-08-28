# Independent verification — candidate `c0e65c8184ba074f5ae1f6d747c96a9852c945ea`

**Verdict: PASS** — verified 2026-08-28 against
https://flex-practice-queue.sociobot.in.

The prior deployment-only release blocker is resolved. The live purchase CTA
returns a hosted Dodo checkout redirect, and the deployed JavaScript, CSS, and
service-worker bytes have the same SHA-256 values as a fresh build of this
candidate. No release-blocking defects were found.

## Cold first read

On a fresh desktop browser visit, the first screen said: **“Build a useful
practice round.”** It said it is for **“learners with spare minutes”** who want
extra practice without changing a formal card schedule, and the first action
was the visible **“Try it with sample data”** link, immediately explained as
loading eight prompts in a separate demo. This answers what it does, for whom,
and what to click first in plain words. One click opened `/demo`, showed the
persistent “Demo — sample data, nothing is saved” banner, and displayed eight
sample prompts.

## Clean-checkout quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 25 packages installed; audit reported 0 vulnerabilities |
| Every exact command in `.factory/claims.json` | PASS — 12/12, each run independently against the demo entry point |
| `npm test` | PASS — 15/15 Playwright tests in 37.6 s (default two workers) |
| `npm run build` | PASS — `tsc --noEmit`, Vite build, and SW injection; produced `dist/` |
| Lint/type checks | PASS — no separate lint script exists; TypeScript checking is part of the production build |
| Initial budget | PASS — JS 28,226 B / 9,860 B gzip; CSS 16,747 B / 4,420 B gzip; hero WebP 105,772 B |

The following required claim commands all passed:

`demo-sandbox`, `offline-reload`, `local-privacy`, `csv-readonly`,
`anki-csv-import`, `csv-export`, `mixed-round`, `saved-plans`, `data-delete`,
`free-core`, `paid-price`, and `license-check`.

## Independent product exercise

- **Normal workflow:** In live `/demo`, selected `weak`, chose three prompts
  and 15 seconds, used Space to reveal and Left/Right to rate. The completed
  screen reported “3 prompts practiced.”
- **Boundary and recovery:** An empty CSV, a row without a prompt, and an
  unclosed quoted field respectively showed specific recovery text. A following
  `front,back,tags` Anki-style CSV imported successfully (ninth prompt shown)
  without a reload. With only four `weak` prompts available, a selection of 12
  was correctly limited to the four matching prompts and remained usable.
- **Data safety:** Tested only in an isolated demo browser context. The full
  demo practice flow made requests only to the product origin. Import status
  states that the selected source file is not changed; the declared CSV and
  Anki claim tests additionally compare fixture bytes before and after import.
- **Offline/PWA:** After service-worker readiness and a normal reload, setting
  the live browser context offline and reloading `/demo` retained all eight
  prompts and the demo heading. `sw.js` is `no-cache`, uses versioned precache,
  `skipWaiting`, and `clients.claim`; current deployment had no newer worker
  available to trigger the update toast.
- **Paid feature:** `GET
  https://api.sociobot.in/api/v1/products/flex-practice-queue/checkout` returned
  HTTP 303 to `https://checkout.dodopayments.com/session/...`. The returned
  license flow is fixture-covered, including URL cleanup and once-per-day
  verification. No transaction was made.

## Live deployment, browser, and policy evidence

- **Candidate match:** SHA-256 matched for live and locally built
  `assets/index-DeTBZAMd.js`, `assets/index-DwqRByY3.css`, and `sw.js`.
- **Routes and links:** `/`, `/demo`, `/privacy`, `/terms`, and the styled
  missing-page route rendered with one `h1`, one `main`, route title, and no
  console/page errors. Every ordinary site link returned HTTP 200; checkout was
  the expected HTTP 303 external redirect.
- **Accessibility:** Live Axe scans of all five routes found zero serious or
  critical violations. At 390 x 844 px there was no horizontal overflow; the
  first Tab focused the skip link with a solid focus outline. Keyboard round
  controls worked. Reduced motion produced `scroll-behavior: auto` and
  effectively zero transition duration.
- **Response policy and caching:** Live responses provide HSTS, CSP,
  `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a
  restrictive permissions policy. CSP permits same-origin resources plus the
  documented Sociobot billing endpoint. Hashed JS has `Cache-Control: public,
  max-age=31536000, immutable`; `sw.js` has `Cache-Control: no-cache`.
- **Rate limiting:** A 40-request concurrent burst to the invalid-license
  verification endpoint produced 30 HTTP 200 responses and 10 HTTP 429
  responses. Each 429 had `Retry-After: 4`; observed accepted-burst threshold:
  30 requests.
- **Identity:** Not applicable; this product has no sign-in system or identity
  provider.

## Defects by severity

| Severity | Finding |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

## Verification note

I attempted an additional Lighthouse CLI run using the preinstalled Chromium,
but the disposable container's Chrome process failed during startup (font-data
service reported a temporary no-space condition). This is a verifier-container
tooling limitation, not a product error: the direct mobile browser, Axe,
console, runtime, response-policy, and measured-bundle checks above completed
successfully. The product also has a prior checked-in mobile Lighthouse record
under `.factory/evidence/`; this report does not rely on it for the PASS.
