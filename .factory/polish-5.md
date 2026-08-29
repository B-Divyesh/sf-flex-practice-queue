# Polish round 5 — cumulative finding closure

Reviewed candidate: `5a6ed097037e486f3b5a4973ff14fd6e51a33961`.
Review record: `4418926b7952316933b6680045a6300cc47875d5`.
Product repair: `30a64aa65b6ba4954b92bf5811a417db1a9944e2`.
Deployment: `459834d6-de86-41b4-95e2-0f3e089ded7e` at
`https://flex-practice-queue.sociobot.in`.

Every earlier review and polish record was read again. Review 3 had no
findings. The table below maps every cumulative finding to its current change
and fresh round-five evidence.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the realistic prompt, tags, timer, and sample-round action above the 390 × 844 fold. The action now starts the displayed prompt. | Playwright `demo shows and starts the same fixed sample round in the first 390px viewport`; [cold preview](evidence/polish-5-live/demo-preview-mobile-cold.png); live `/?demo=1` measured prompt y=405.69 and action bottom=537.08. |
| F-1-2 | Kept explicit SPA route rewrites plus the static 404 response override. Unknown URLs return the styled document with HTTP 404. | Playwright `static deployment keeps known app routes, a real 404…`; [404 headers](evidence/polish-5-live/404.headers); [cold 404](evidence/polish-5-live/404-mobile-cold.png); live `/missing-sheet-round-5` returned 404. |
| F-1-3 | Kept the separately declared schedule-safety contract across import, tagging, practice, stop, and export. | `@claim:source-schedule-untouched`; live demo traffic remained same-origin; live `/?demo=1`. |
| F-1-4 | Merchant-of-record and refund assurances remain absent. The page states only the tested $9 price and hosted Sociobot checkout. | `@claim:paid-price`; Playwright `landing copy names the job…`; [cold landing](evidence/polish-5-local-landing-desktop.png); live `/`. |
| F-1-5 | Kept the token-only license verification claim and exact bodyless request assertion. | `@claim:license-data-minimization`; live `/privacy`; full clean suite. |
| F-1-6 | Kept explicit Anki CSV export guidance and safe `.apkg` rejection without importing records. | `@claim:anki-csv-import`; `@claim:anki-apkg-not-supported`; [cold preview](evidence/polish-5-live/demo-preview-mobile-cold.png); live `/demo`. |
| F-1-7 | Kept **flashcard schedule** as the single term for the protected source system. | Playwright `landing copy names the job…`; `.factory/copy-audit.md`; [cold landing](evidence/polish-5-local-landing-desktop.png); live `/`. |
| F-2-1 | Kept separate real/demo IndexedDB and localStorage namespaces. Reset and Start for real remove demo storage without changing a real prompt, round, or plan. | `@claim:demo-sandbox`; cold live reset `9 → 8`, real sentinel preserved, demo keys/database removed; [cold preview](evidence/polish-5-live/demo-preview-mobile-cold.png); live `/?demo=1`. |
| F-2-2 | Kept `.apkg` behavior in the claims contract with a shipped package-named fixture and exact CSV guidance. | `@claim:anki-apkg-not-supported`; live `/demo`; [cold preview](evidence/polish-5-live/demo-preview-mobile-cold.png). |
| F-2-3 | Kept the accessible static 404 shell: skip link, linked wordmark, main navigation, legal footer, icons, canonical, and social metadata. | Playwright `routes, mobile layout, metadata, and accessibility pass`; [cold 404](evidence/polish-5-live/404-mobile-cold.png); live `/missing-sheet-round-5` returned 404 with zero serious/critical Axe findings. |
| F-2-4 | Kept result-naming tag controls: **Show all/warm-up/weak/today’s prompts**, with `aria-pressed`. | `@claim:mixed-round`; full Playwright suite; live `/demo`. |
| F-2-5 | Kept the positive rating action **Mark as got it** with its arrow-key shortcut. | `@claim:mixed-round`; live fixed-round exercise; [started round](evidence/polish-5-live/demo-started-mobile-cold.png); live `/?demo=1`. |
| F-4-1 | Kept **Extra flashcard practice** in place of the decorative first-screen label. | Playwright `landing copy names the job…`; [cold landing](evidence/polish-5-local-landing-desktop.png); live `/`. |
| F-4-2 | Kept the direct artwork caption **Choose a few existing flashcards for extra practice.** | Playwright `landing copy names the job…`; [cold landing](evidence/polish-5-local-landing-desktop.png); live `/`. |
| F-4-3 | Kept the named free actions in the first-screen fact and the tested $9 saved-plan price. | `@claim:free-core`; `@claim:paid-price`; Playwright `landing copy names the job…`; live `/`. |
| F-4-4 | Kept **Your practice queue** as the work area label. | Playwright `landing copy names the job…`; [cold landing](evidence/polish-5-local-landing-desktop.png); live `/`. |
| F-4-5 | Kept **Tag prompts** and left the decorative assembly label removed. | Playwright `landing copy names the job…`; [cold landing](evidence/polish-5-local-landing-desktop.png); live `/#how`. |
| F-4-6 | Kept the jargon label removed and the direct heading **Leaves your flashcard schedule alone**. | `@claim:source-schedule-untouched`; Playwright `landing copy names the job…`; live `/`. |
| F-4-7 | Kept **Paid round plans** as the section name. | `@claim:paid-price`; `@claim:saved-plans`; [cold landing](evidence/polish-5-local-landing-desktop.png); live `/`. |
| F-5-1 | Split the fixed sample preview from the shuffled mixed-round path. **Start this sample round** now always opens the bundled first three prompts in order, beginning with the previewed **Explain why seasons occur.** | Playwright `demo shows and starts the same fixed sample round in the first 390px viewport` asserts all three prompts; [preview](evidence/polish-5-live/demo-preview-mobile-cold.png); [matching first live prompt](evidence/polish-5-live/demo-started-mobile-cold.png); cold live `/?demo=1` returned the exact sequence. |

## Verification evidence

- Clean clone: `/tmp/fpq-polish5.MGWKag/repo` at repair commit `30a64aa`.
- `npm ci`: passed; 24 packages installed, 0 vulnerabilities.
- Every exact command in `.factory/claims.json`: 15/15 passed independently.
- `npm test`: 20/20 passed in the clean clone and again in the deployment build.
- `npm run build`: passed; `dist/index.html` exists. Initial JavaScript is
  29.34 kB raw / 10.12 kB gzip; CSS is 18.33 kB raw / 4.71 kB gzip.
- Playwright Axe: zero serious or critical findings on `/`, `/demo`,
  `/privacy`, `/terms`, and the deployed 404.
- Privacy/offline: the cold live demo issued only same-origin requests; a
  service-worker-controlled `/demo` reloaded offline with all eight prompts.
- Routing: four live routes returned 200 with exact titles, canonicals, one
  h1/main, legal links, and focus restoration. The unknown route returned 404.
- Factory verifier: [verify.json](evidence/polish-5-live/verify.json) records a
  954 ms cold load, no console errors, title/lang/main, image alt text, and
  labelled controls.
- Mobile Lighthouse: [report](evidence/polish-5-live/lighthouse-mobile.json)
  records 100 performance, 100 accessibility, 100 best practices, and 100 SEO;
  FCP 0.9 s, LCP 1.5 s, CLS 0, and TBT 20 ms.

The catalog description is now: **Build short flashcard rounds without
changing your flashcard schedule.** It is verb-first and 70 characters.
