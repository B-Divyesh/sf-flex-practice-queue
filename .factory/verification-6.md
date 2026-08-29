# Independent verification 6 — Flex Practice Queue

**PASS** — verified 2026-08-29 against candidate `40af16d2e16c220c9ac32dc1571f9386fc144d1c` at `https://flex-practice-queue.sociobot.in`.

No product code was changed. This is a fresh independent retest after the prior deployment-only concern. The deployed public artifact is the candidate build: all 17 public files in `dist/` had HTTP 200 and identical SHA-256 bytes. `staticwebapp.config.json` is deployment configuration rather than a public asset; its direct URL correctly returns the styled 404 page.

## Required first gates

### Claims

`.factory/claims.json` exists and has 15 claims. After `npm ci`, I ran every listed command individually against the local demo entry point. All passed:

| Claim IDs | Result |
| --- | --- |
| `demo-sandbox`, `offline-reload`, `local-privacy` | Pass |
| `csv-readonly`, `source-schedule-untouched`, `anki-csv-import`, `anki-apkg-not-supported`, `csv-export` | Pass |
| `mixed-round`, `saved-plans`, `data-delete`, `free-core` | Pass |
| `paid-price`, `license-check`, `license-data-minimization` | Pass |

This verifies the isolated `demo:` storage namespace, offline reload, same-origin study flow, read-only CSV/Anki CSV import, .apkg recovery text, export, keyboard practice, plans, deletion, free core, hosted checkout, and license minimization/cadence.

### Cold first read

**PASS.** A new live browser context at `/` answered all three required questions in plain words:

- What it does: “Build a short flashcard practice round.”
- For whom: “For learners with spare minutes who want extra practice without changing their flashcard schedule.”
- First action: “Try it with sample data”, with the adjacent result “Loads 8 prompts in a separate demo.”

One click opens `?demo=1`; it showed the persistent “Demo — sample data, nothing is saved” banner, eight realistic prompts, and an immediately ready sample round. The primary action was present in the first 390 × 844 viewport.

## Clean checkout and build

| Check | Evidence | Result |
| --- | --- | --- |
| Clean install | `npm ci`: 24 packages, 0 vulnerabilities | Pass |
| Unit/integration/UI suite | `npm test`: 26/26 Playwright tests | Pass |
| Type check | `tsc --noEmit` in the production build | Pass |
| Lint | No lint script is defined | N/A |
| Production build | `npm run build` created `dist/` | Pass |
| Bundle budget | JS 30.45 kB / 10.43 kB gzip; CSS 19.06 kB / 4.86 kB gzip; hero WebP 105,772 bytes; no fonts | Pass |

## Independent live product exercise

At `/demo`, the isolated banner appeared and the queue contained eight prompts. I selected weak prompts, requested 12, and the product safely started the three matching cards rather than duplicating items. With a three-card, 15-second round:

1. Space revealed each answer; Left marked one card “try again”; Right marked the remaining cards complete.
2. The result showed “3 prompts practiced” and one retry.
3. Export downloaded `flex-practice-prompts.csv` with the expected `prompt,answer,tags` heading and sample rows.

Input/recovery checks on live `/demo` passed: blank CSV, a missing-prompt row, an unclosed quoted field, an `.apkg`-named file, and a whitespace-only manual prompt each produced specific recovery text. The whitespace prompt had `aria-invalid="true"` and focus returned to the field. The demo flow issued no cross-origin request and no console or page errors.

## Deployment, privacy, PWA, accessibility, and performance

- Artifact parity: all 17 public production outputs (HTML, JS/map, CSS, images, icons, manifest, offline/404 documents, robots, sitemap, service worker) exactly match the live response bytes. The live JS/CSS filenames match the candidate (`index-B2aSMufY.js`, `index--jQaobrO.css`).
- Routes `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` each returned 200, route-specific title, `lang="en"`, exactly one `<main>`, exactly one `<h1>`, and zero serious/critical Axe findings. All rendered links resolved successfully; `mailto:` is explicit.
- Live desktop and 390 × 844 mobile had no horizontal overflow. The first Tab selected the skip link; reduced motion computed `scroll-behavior: auto`. Associated checkbox/file labels provide the 44px control target where native hidden input boxes are smaller.
- A fresh `/demo` context registered an active, controlling service worker (`flex-practice-queue-v1`). Calling `registration.update()` succeeded with no waiting worker for the unchanged version; the source uses `skipWaiting`, `clientsClaim`, update notification, and `sw.js` is served `no-cache`. After activation and a controlled offline reload, the demo heading and all eight prompts remained available.
- The full demo practice/export request log contained only the product origin. The cold landing requested only same-origin HTML, JS, CSS, and artwork: no analytics, remote fonts, third-party scripts, or study-data transmission.
- An invalid license verification is a bodyless GET to the documented Sociobot URL. The production billing verifier allowed 30 tested requests from one client and returned `429` with `Retry-After: 4` on request 31. The application itself caches a valid verdict and claims/checks at most daily.
- Live root response headers include HSTS, CSP with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and restrictive permissions policy. Hashed assets are `max-age=31536000, immutable`; `sw.js` is `no-cache`.
- Mobile Lighthouse: Performance **96**, Accessibility **100**, Best Practices **100**, SEO **100**. FCP 1.2 s, LCP 1.6 s, CLS 0, TBT 220 ms; transfer total 124,765 bytes (10,662 bytes JS, 5,203 bytes CSS, 105,908 bytes image).

## Scope notes and defects

This is a static, local-first PWA, not a library, CLI, backend, or sign-in product; consumer-package, persistence/concurrency server, and Entra checks do not apply. Checkout was followed only to its hosted redirect; no transaction was attempted.

**Defects: none.** No release-blocking, high, medium, or low defects were found in this candidate.
