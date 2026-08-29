# Polish round 4 — finding closure

Base reviewed: `b0a05e5e9b70b031e2690958d5f2da49fe1367fd`.

The seven round-four findings were copy defects. This repair keeps the established blueprint drafting system in the grid, type, rules, and original timer artwork while replacing metaphorical interface copy with direct task language. The earlier demo, storage isolation, claims, real routes, 404, legal pages, focus, mobile, privacy, and offline repairs remain in place and are exercised by the full claim suite.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Replaced the hero eyebrow “Drawing 01 · optional rehearsal lane” with “Extra flashcard practice.” | Playwright `landing copy names the job, free tools, and paid feature in plain words`; [local desktop screenshot](evidence/polish-4-local-landing-desktop.png); post-deploy cold check: `https://flex-practice-queue.sociobot.in/`. |
| F-4-2 | Replaced the hero-art caption with “Choose a few existing flashcards for extra practice.” | Playwright `landing copy names the job, free tools, and paid feature in plain words`; [local desktop screenshot](evidence/polish-4-local-landing-desktop.png); post-deploy cold check: `https://flex-practice-queue.sociobot.in/`. |
| F-4-3 | Replaced “Core tools” with the named free actions: import, tag, practice, and export; retained the $9 saved-plan fact. | Playwright `landing copy names the job, free tools, and paid feature in plain words`; `@claim:free-core`; `@claim:paid-price`; [local desktop screenshot](evidence/polish-4-local-landing-desktop.png); post-deploy cold check: `https://flex-practice-queue.sociobot.in/`. |
| F-4-4 | Replaced the workbench eyebrow with “Your practice queue.” | Playwright `landing copy names the job, free tools, and paid feature in plain words`; post-deploy cold check: `https://flex-practice-queue.sociobot.in/`. |
| F-4-5 | Removed “Assembly notes” and renamed “Mark your intent” to “Tag prompts.” | Playwright `landing copy names the job, free tools, and paid feature in plain words`; post-deploy cold check: `https://flex-practice-queue.sociobot.in/#how`. |
| F-4-6 | Removed the “Scope boundary” eyebrow and retained the direct section heading and tested schedule-preservation explanation. | Playwright `landing copy names the job, free tools, and paid feature in plain words`; `@claim:source-schedule-untouched`; post-deploy cold check: `https://flex-practice-queue.sociobot.in/`. |
| F-4-7 | Replaced “Optional paid tool” with “Paid round plans.” | Playwright `landing copy names the job, free tools, and paid feature in plain words`; `@claim:paid-price`; post-deploy cold check: `https://flex-practice-queue.sociobot.in/`. |

Additional plain-language cleanup changes the README’s “separate lane,” legal-page “workbench,” offline fallback “sheet,” and 404 wording. The catalog description is now verb-first, 70 characters, and under the 120-character limit.

## Local evidence before deployment

- Fresh dependency install: `npm ci` — passed with 0 vulnerabilities.
- Full product/browser/accessibility suite: `npm test` — 20/20 passed. This includes the 15 declared claim tests, direct demo entry, routes, metadata, mobile width, keyboard skip link, console checks, and Axe serious/critical checks.
- Production build: `npm run build` — passed; `dist/index.html` exists; initial JavaScript is 10.10 kB gzip and CSS is 4.71 kB gzip.
- Cold local screenshots: [390 × 844 demo](evidence/polish-4-local-demo-mobile.png) and [1440 × 1000 landing](evidence/polish-4-local-landing-desktop.png). The demo screenshot shows the persistent banner, reset/exit controls, realistic prompt, tags, timer, and start action before scrolling.
- The final clean-clone claim-run and post-deployment checks are recorded in `.factory/handoff.md` after the repair commit is pushed.
