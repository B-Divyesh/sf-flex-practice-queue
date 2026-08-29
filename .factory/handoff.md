# Flex Practice Queue handoff — adversarial review 5

**FAIL — one blocking demo finding remains.**

Review 5 tested the live product on 2026-08-29 in fresh 390 × 844 and
1440 × 1000 Chromium contexts and tested commit `5a6ed097037e486f3b5a4973ff14fd6e51a33961`
from the clean clone `/tmp/fpq-review5.ZDNL0y/repo`. No product code was
modified.

## Finding

- **F-5-1:** `/demo` presents **“Explain why seasons occur.”** as **“Sample
  round · 1 of 3”** beside **Start this sample round**, but the action shuffles
  all prompts and starts with a different item. Two fresh live runs opened with
  **“What does a pure function avoid?”** and **“Differentiate x² sin x.”** Fix
  the sample queue order or rename the preview/action, then assert exact prompt
  identity after the click.

Full evidence, copy counts, claim results, route checks, and earlier-finding
verification are in `.factory/review-5.md`.

## Verification completed

- Every exact command in `.factory/claims.json`: 15/15 passed independently.
- `npm test`: 20/20 passed.
- `npm run build`: passed; `dist/index.html` exists; initial JavaScript is
  10.10 kB gzip and CSS is 4.71 kB gzip.
- Live cold read: the job, audience, and first action are visible before
  scrolling at phone and desktop widths.
- Live demo: eight realistic prompts, banner, reset 9 → 8, offline reload, and
  real/demo storage isolation all passed.
- Live traffic: the full demo request log was same-origin.
- Routes: `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route
  returns the designed 404. Titles, one h1/main, metadata, deep links,
  route-change focus, browser Back focus, link crawl, and consistent shell pass.
- Accessibility: the suite's Axe serious/critical scan, skip link, mobile
  width, reduced-motion, and console checks pass.
- History: F-1-1 through F-1-7, F-2-1 through F-2-5, and F-4-1 through F-4-7
  remain fixed in live behaviour and code.

## Reproduce

```sh
npm ci
npm test
npm run build
```

For F-5-1, open `https://flex-practice-queue.sociobot.in/demo`, note the
preview prompt, select **Start this sample round**, and compare it with the
first live prompt. Because selection is random, repeat from a fresh context if
the preview prompt happens to be selected first.

## Known gaps

F-5-1 is the only open review finding.
