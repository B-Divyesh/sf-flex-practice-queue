# Flex Practice Queue handoff — polish round 4

## Delivered

Repair commit `a2ee8f663dec16605f27af1fdec2753b8ca8139e` closes every finding in `.factory/review-1.md` through `.factory/review-4.md` and preserves the product’s blueprint drafting identity.

- Closed F-4-1 through F-4-7 with direct, plain labels: **Extra flashcard practice**, **Choose a few existing flashcards for extra practice**, named free actions, **Your practice queue**, **Tag prompts**, no scope-jargon eyebrow, and **Paid round plans**.
- Kept the real one-click `?demo=1` sandbox: a persistent “Demo — sample data, nothing is saved” banner, Reset demo, Start for real, a realistic prompt/tags/30-second round above the 390 px fold, and separately namespaced demo data.
- Retained the earlier fixes: claimed and tested scheduler preservation, CSV/Anki-CSV read-only import, safe `.apkg` guidance, exact CSV export, timed keyboard rounds, paid-plan/license tests, real 404, route metadata/focus, local privacy, service-worker offline use, and legal links.
- Removed related metaphor copy from README, privacy copy, offline fallback, 404, and footer. The catalog description is verb-first and 70 characters: “Build extra flashcard rounds without changing your flashcard schedule.”

## Verification

### Clean clone

A fresh clone of `a2ee8f6` in `/tmp/fpq-polish4-clean.cbyadH/repo` completed `npm ci` with 0 vulnerabilities. Every exact command in `.factory/claims.json` was then run independently and passed:

- `demo-sandbox`, `offline-reload`, `local-privacy`, `csv-readonly`, `source-schedule-untouched`
- `anki-csv-import`, `anki-apkg-not-supported`, `csv-export`, `mixed-round`, `saved-plans`
- `data-delete`, `free-core`, `paid-price`, `license-check`, `license-data-minimization`

The clean clone then passed `npm test` (**20/20**) and `npm run build`. The build produces `dist/index.html`; initial JavaScript is **10.10 kB gzip** and CSS is **4.71 kB gzip**.

The Playwright suite covers all declared claims plus the 390 px one-click demo, the round-four copy regression, mobile width, focus/skip link, route metadata, console errors, static 404 structure, reduced motion, service worker, and Axe serious/critical results.

### Deployment and live checks

Deployed through `/opt/fleet/lib/deploy-static.sh flex-practice-queue dist`.

- Azure Static Web Apps deployment ID: `0cdada7f-18e0-4fcd-9107-5d7177f544d5`
- Static host: `https://zealous-smoke-07ee53610.7.azurestaticapps.net`
- Live product: `https://flex-practice-queue.sociobot.in/`

The factory `verify-url.sh` report is [here](evidence/polish-4-live/verify.json): HTTPS 200; title, `lang`, main, one h1, and image-alt checks pass; no console error. Cold live Playwright/Axe checks passed `/`, `/?demo=1`, `/privacy`, `/terms`, and `/missing-sheet`. Each normal route has one h1/main, the correct title, no serious/critical Axe violation, and no console/page error. The intentional missing page returns **HTTP 404** ([headers](evidence/polish-4-live/404.headers)) with the complete accessible static shell.

On a fresh live `?demo=1` visit, the banner, Reset demo, Start for real, realistic sample prompt, tags, timer, and sample action were visible before the 390 × 844 fold ([screenshot](evidence/polish-4-live/demo-mobile-cold.png)). The live exercise started the sample round, reset it to eight prompts, exited demo mode, and reloaded `/demo` offline with all eight prompts. The cold 404 visual check is [here](evidence/polish-4-live/404-mobile-cold.png).

Live mobile Lighthouse recorded **100 performance**, **100 accessibility**, **911 ms FCP**, **1,511 ms LCP**, and **0 CLS** ([report](evidence/polish-4-live/lighthouse-mobile.json)).

## Run locally

```sh
npm ci
npm test
npm run build
```

Use `npm run dev` for local development. Open `/?demo=1` to use the isolated sample workspace.

## Known gaps

None. No review finding of any severity remains open.
