# Independent verification 7 — Flex Practice Queue

**FAIL** — independently verified on 29 August 2026 against candidate
`106d0cd511ff6697431dbe4700fb237f48d071e9` and
`https://flex-practice-queue.sociobot.in`.

No product code was changed. The candidate is not releasable because its CSV
export cannot be imported back when a prompt or answer contains a line break.
This is data the product itself permits through its textareas and emits as
valid quoted CSV. A second defect leaves revoked-license status and paid
controls stale until reload.

## Required first gates

### Claims: PASS (15/15)

`.factory/claims.json` exists. After `npm ci`, every listed `test` command was
run separately, unchanged, against the production-build demo entry point:

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS — isolated demo values, reset, exit, and returned-license boundary |
| `offline-reload` | PASS — controlled offline reload retained all eight prompts |
| `local-privacy` | PASS — practice flow remained same-origin |
| `csv-readonly` | PASS — fixture bytes unchanged and rows imported |
| `source-schedule-untouched` | PASS — source bytes and request boundary unchanged |
| `anki-csv-import` | PASS — front/back/tags fixture mapped correctly |
| `anki-apkg-not-supported` | PASS — package rejected with CSV guidance |
| `csv-export` | PASS — filename, header, sample, and row count |
| `mixed-round` | PASS — timer plus Space/arrow controls |
| `saved-plans` | PASS — named plan saved and restored in demo |
| `data-delete` | PASS — demo data stayed deleted after reload |
| `free-core` | PASS — import, tagging, practice, and export available without a license |
| `paid-price` | PASS — $9 copy and hosted-checkout redirect |
| `license-check` | PASS — returned token stored and checked once per day |
| `license-data-minimization` | PASS — one bodyless token-only GET |

The manifest tests pass as written, but their simple one-line CSV fixtures do
not cover finding F-7V-1 below.

### Cold first read: PASS

A fresh browser profile opened the live `/` page at 1440 × 900 with service
workers blocked. The first screen plainly answered:

- What: **“Build a short flashcard practice round.”**
- For whom: **“For learners with spare minutes who want extra practice without
  changing their flashcard schedule.”**
- What to do first: **“Try it with sample data”**, beside **“Loads 8 prompts in
  a separate demo.”**

The one-click action was above the fold on desktop and at 390 × 844. It opened
the isolated demo with its persistent “Demo — sample data, nothing is saved”
banner, eight realistic prompts, and an immediately usable three-prompt round.

## Clean checkout gates

| Gate | Fresh result |
| --- | --- |
| Candidate identity | `git rev-parse HEAD` = `106d0cd511ff6697431dbe4700fb237f48d071e9` |
| Worktree before QA | Clean; `main` matched `origin/main` |
| Install | `npm ci` passed; 24 packages; 0 vulnerabilities |
| Full suite | `npm test` passed, 26/26 Playwright tests in 52.6 s |
| Type check | `tsc --noEmit` passed inside `npm run build` |
| Lint | No lint script or standalone lint configuration exists |
| Exact build | `npm run build` passed and created `dist/` |
| Bundle | JS 30.82 kB raw / 10.51 kB gzip; CSS 19.06 kB raw / 4.86 kB gzip |

## Independent end-to-end exercise

- A keyboard-only visitor reached the first-screen demo action, entered it,
  reached **Start this sample round**, revealed all answers with Space, and
  rated them with Left/Right. The result was three prompts with one retry.
- Asking for 12 weak prompts when only three matched ran three unique prompts;
  it did not duplicate cards.
- Export produced `flex-practice-prompts.csv`, heading
  `prompt,answer,tags`, and one row for each of the eight sample prompts.
- Empty CSV, missing-prompt row, unclosed quote, `.apkg`, and whitespace-only
  manual prompt paths produced specific recovery text without adding data.
- A real-workspace prompt and changed tag survived reload. Confirmed deletion
  remained empty after reload.
- The normal demo practice/export flow produced no console or page errors and
  no off-origin request.

Evidence: [live-functional.json](evidence/verification-7/live-functional.json),
[csv-roundtrip.json](evidence/verification-7/csv-roundtrip.json), and
[edge-accessibility.json](evidence/verification-7/edge-accessibility.json).

## Deployment, privacy, billing, and headers

- All 17 public files in the candidate `dist/` returned HTTP 200 with bytes and
  SHA-256 hashes identical to production. This includes HTML, hashed JS/CSS,
  maps, art, icons, manifest, offline/404 pages, robots, sitemap, and `sw.js`.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200. A fresh unknown URL
  returned the designed page with HTTP 404. Every rendered product link was
  live; the checkout endpoint returned 303 to hosted Dodo checkout.
- Cold landing requests were only same-origin HTML, JS, CSS, and artwork. A
  complete demo practice/export flow was also same-origin. There were no
  analytics, remote fonts, third-party scripts, or educational-data requests.
- Root and app-route responses supplied CSP, HSTS, `nosniff`, a restrictive
  permissions policy, and strict-origin referrer policy. CSP permits only self
  plus the documented Sociobot API connection and produced no runtime errors.
- Hashed assets return `max-age=31536000, immutable`; `sw.js` returns
  `no-cache`; HTML returns `max-age=30, must-revalidate`.
- The live license verifier allowed 30 requests from one client. Request 31
  returned HTTP 429 with `Retry-After: 3` and `X-RateLimit-After: 3`.

Evidence: [artifact-parity.json](evidence/verification-7/artifact-parity.json),
[live-functional.json](evidence/verification-7/live-functional.json), and
[rate-limit.json](evidence/verification-7/rate-limit.json).

## Accessibility, responsive behavior, and performance

- `/`, `/demo`, `/privacy`, `/terms`, and the real 404 each have `lang="en"`,
  one `<main>`, one `<h1>`, route-specific browser titles/canonicals, and zero
  Axe violations at both desktop and 390 px mobile.
- The first Tab reaches the skip link. Essential demo and round interactions
  work by keyboard. The focus indicator is a 3 px solid red outline; the outer
  indicator has sufficient contrast against the paper surface.
- No horizontal overflow appeared at desktop or 390 px. The repository's 200%
  text-reflow and 44 px target tests passed. Reduced motion computes smooth
  scrolling to `auto` and removes transitions.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, 587 ms load, correct title,
  language and main landmark, one H1, no missing image alt or unlabeled button,
  and no console errors.
- Fresh mobile Lighthouse: Performance **100**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.5 s, CLS 0, TBT 80 ms. Total
  transfer was 142 KiB; the hero was 105,917 transfer bytes.

Evidence: [edge-accessibility.json](evidence/verification-7/edge-accessibility.json),
[verify.json](evidence/verification-7/verify.json), and
[lighthouse-mobile.json](evidence/verification-7/lighthouse-mobile.json).

## PWA/offline behavior

- The manifest parsed without errors, Chrome reported no installability errors,
  and the 192, 512, and maskable icons have the declared dimensions.
- A fresh live demo registered and controlled with `/sw.js`; cache
  `flex-practice-queue-v1` existed. Explicit `registration.update()` completed.
- A controlled offline reload restored the demo heading and all eight prompts.
- A local update simulation served a changed worker from the candidate build.
  The app announced **“An update is ready. Reload to use it.”**, activated the
  new worker, removed the old cache, and retained the demo after reload.

Evidence: [pwa-installability.json](evidence/verification-7/pwa-installability.json),
[sw-update.json](evidence/verification-7/sw-update.json), and
[live-functional.json](evidence/verification-7/live-functional.json).

## Findings

### F-7V-1 — HIGH — exported multiline data cannot be imported back

The product allows line breaks in both Prompt and Answer textareas. On live
`/demo`, I added `List two states of water.` with the answer:

```text
Liquid: water
Solid: ice
```

**Export CSV** emitted a valid quoted record containing that newline. In a
fresh demo workspace, importing the untouched product-generated file left the
queue at eight items and reported **“A quoted field is not closed. Fix the CSV
and try again.”** The parser splits input on physical newlines before parsing
quoted fields. A direct valid RFC 4180 CSV with a multiline quoted prompt fails
the same way.

This breaks the core import/export ownership path and makes the broad CSV
import claim false for data the product itself creates. Fix the parser to read
quoted records across line breaks, then add a claim test that exports a manual
multiline prompt/answer and imports the untouched download into a fresh demo.

### F-7V-2 — MEDIUM — revoked license leaves stale active UI

With a saved license and an expired cached valid verdict, I returned a fresh
`{valid:false, reason:"revoked"}` verification response. The app correctly
stored an invalid verdict and blocked an attempted plan save, but the rendered
page still said **“License active.”** and continued showing Plan name and
**Save round plan**. It did not show the required “license no longer active”
notice until another reload changed the shell.

Re-render the real workspace after every completed invalid verification, show
the inactive notice, and remove paid controls immediately. Add a revoked-token
test that begins from an expired cached valid verdict.

Evidence: [revoked-license.json](evidence/verification-7/revoked-license.json).

### F-7V-3 — LOW — singular round result uses plural grammar

A one-prompt real-workspace round ends with **“1 prompts practiced.”** Use
“1 prompt practiced” for the singular case. The result remains operable: the
next Tab reaches **Build another round**.

## Scope notes

This is a static, local-first PWA, not a library, CLI, signed-in product, or
product backend. Consumer-package, Entra, server persistence, health/build
identity, and concurrency checks do not apply. The only server-side product
call is the factory billing endpoint, whose rate limit was verified above. No
purchase was made. AI would not improve this deliberate local queue workflow
and would weaken its offline/privacy boundary, so the lack of AI is not a
missed-leverage finding.

## Verdict

**FAIL.** Claims, build, deployment identity, accessibility, privacy,
performance, rate limiting, and PWA behavior pass. F-7V-1 is nevertheless a
release blocker because the product cannot restore a valid CSV that it exports
from supported user input. F-7V-2 must also be corrected before release.
