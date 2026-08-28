# Flex Practice Queue handoff — polish round 1

Repaired and deployed the candidate from `c0e65c8184ba074f5ae1f6d747c96a9852c945ea`.
The deployable repair is commit `9aa5de010310c2d412a9608eb6ca3c1770e46ecc`
(`fix: close adversarial polish findings`), pushed to `origin/main` and deployed
as Azure Static Web Apps deployment `f5fe82b6-116d-46aa-91dc-b0331e66c375`.

## What changed

- Added the one-click isolated `?demo=1` path, an above-the-fold real sample
  round, reset/start-for-real banner controls, and a 390×844 regression test.
- Added a real styled static `404.html`, explicit known-route rewrites, and an
  HTTP 404 response override for unknown paths.
- Added `source-schedule-untouched` and `license-data-minimization` to the
  claims contract with observable Playwright tests.
- Removed untestable merchant/refund promises, added explicit in-app `.apkg`
  export guidance, and standardized copy on **flashcard schedule**.
- Updated metadata, manifest, README, demo documentation, copy audit, catalog
  description, and review-to-evidence mapping in `.factory/polish-1.md`.

## Verification

An actual fresh clone at `/tmp/fpq-clean.yfqvyH` ran `npm ci`, every exact
command in `.factory/claims.json` (14/14), `npm test` (18/18), and
`npm run build`. Its Playwright result is `passed` with no failed tests and
its build produced `dist/index.html`.

The current product build is small:

| Asset | Gzip size |
| --- | ---: |
| Initial JavaScript | 10.03 KB |
| Initial CSS | 4.71 KB |
| HTML | 0.56 KB |

Live cold checks at `https://flex-practice-queue.sociobot.in` passed:

- `verify-url.sh` reported HTTP 200, correct title/lang, one h1, main,
  zero missing image alts, zero unlabeled buttons, and zero browser errors.
- `/?demo=1` renders the sample prompt above the fold at 390 px, has no
  horizontal overflow, starts the three-prompt sample round, and resets to
  eight prompts. Screenshot: `.factory/evidence/polish-1-live/demo-mobile-cold.png`.
- `/missing-sheet` returns HTTP 404 with the designed return-home page.
  Evidence: `.factory/evidence/polish-1-live/404.headers` and
  `.factory/evidence/polish-1-live/404-mobile-cold.png`.
- Axe scans of `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and
  `/missing-sheet` found zero serious or critical violations. Full route data:
  `.factory/evidence/polish-1-live/routes-a11y.json`.

The local Lighthouse CLI could not attach to Chromium in this disposable
container even with Playwright’s executable path. This is an environment
launcher limitation, not a product error; browser/aXe checks and current
bundle-budget measurements are recorded above.

## Run locally

```sh
npm ci
npm test
npm run build
```

Open `http://127.0.0.1:4173/?demo=1` for the isolated sample. Deploy `dist/`
as the static artifact. No known product gaps remain from the cumulative
review findings.
