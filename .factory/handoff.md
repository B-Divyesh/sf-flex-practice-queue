# Flex Practice Queue handoff — polish round 5

**PASS — every cumulative finding is closed.**

Candidate `5a6ed097037e486f3b5a4973ff14fd6e51a33961` and review commit
`4418926b7952316933b6680045a6300cc47875d5` were repaired in product commit
`30a64aa65b6ba4954b92bf5811a417db1a9944e2`. The static deployment completed as
Azure deployment `459834d6-de86-41b4-95e2-0f3e089ded7e` and is live at
`https://flex-practice-queue.sociobot.in`.

## What changed

- Fixed F-5-1 at its source. The preview action now starts a fixed three-prompt
  queue instead of delegating to the shuffled mixed-round path.
- Added a 390 px regression that reads the preview prompt, starts the round,
  asserts the same first prompt, and verifies all three fixed prompts in order.
- Strengthened the route regression with exact per-route titles, canonicals,
  descriptions, social-image metadata, footer legal links, focus restoration,
  browser Back behavior, mobile width, reduced motion, and Axe scans.
- Updated the demo record, copy audit, and the 70-character verb-first catalog
  description.
- Rechecked every F-1, F-2, and F-4 repair. Demo isolation, claims, copy,
  import limits, true 404 behavior, legal links, privacy, and offline support
  remain intact. The complete mapping is in `.factory/polish-5.md`.

## How it was verified

Clean clone: `/tmp/fpq-polish5.MGWKag/repo` at `30a64aa`.

```sh
npm ci
# each of the 15 exact commands in .factory/claims.json
npm test
npm run build
```

- `npm ci`: passed with 0 vulnerabilities.
- Claims: 15/15 passed independently.
- Full Playwright unit/integration/browser suite: 20/20 passed in the clean
  clone and again through the work order build command.
- Build: passed with `dist/index.html`; initial JS 29.34 kB raw / 10.12 kB
  gzip, CSS 18.33 kB raw / 4.71 kB gzip, and hero artwork 105.77 kB.
- Accessibility: exact landmarks/titles/metadata, keyboard skip link,
  route-change focus, Back focus, 390 px layout, reduced motion, and zero
  serious/critical Axe findings on all routes and the static 404.
- Privacy: the cold live demo flow made only same-origin requests. The
  license-minimization fixture sent one bodyless GET containing only the token.
- Isolation: cold live reset restored `9 → 8`; Start for real preserved the
  seeded real prompt, round, and exact plan value, then removed all demo keys
  and the demo database.
- Offline: a service-worker-controlled cold `/demo` reload succeeded offline
  with all eight sample prompts.
- Routing: `/`, `/demo`, `/privacy`, and `/terms` returned 200 with exact
  titles/canonicals and legal links. `/missing-sheet-round-5` returned HTTP 404
  with the designed shell and recovery action.
- Factory verifier: [verify.json](evidence/polish-5-live/verify.json) records a
  954 ms load, no console errors, one h1/main, English language, alt text, and
  labelled buttons.
- Mobile Lighthouse: [report](evidence/polish-5-live/lighthouse-mobile.json)
  scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO;
  FCP 0.9 s, LCP 1.5 s, CLS 0, TBT 20 ms.

Visual evidence: [cold demo preview](evidence/polish-5-live/demo-preview-mobile-cold.png),
[matching first live prompt](evidence/polish-5-live/demo-started-mobile-cold.png),
and [true 404](evidence/polish-5-live/404-mobile-cold.png).

## Deploy

The work order command was run exactly:

```sh
npm ci && npm test && npm run build
/opt/fleet/lib/deploy-static.sh flex-practice-queue dist
```

The deployment reused the existing `sf-flex-practice-queue` Static Web App in
`centralus`, uploaded the 401,303-byte artifact, reported `Succeeded`, and
served the custom HTTPS domain with status 200.

## Known gaps and next steps

None. There are no unresolved review findings, test failures, accessibility
issues, privacy exceptions, deployment defects, or deferred minor items.
