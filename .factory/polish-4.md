# Polish round 4 — finding closure

Base reviewed: `b0a05e5e9b70b031e2690958d5f2da49fe1367fd`.

The seven round-four findings were copy defects. This repair keeps the established blueprint drafting system in the grid, type, rules, and original timer artwork while replacing metaphorical interface copy with direct task language. The earlier demo, storage isolation, claims, real routes, 404, legal pages, focus, mobile, privacy, and offline repairs remain in place and are exercised by the full claim suite.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Replaced the hero eyebrow “Drawing 01 · optional rehearsal lane” with “Extra flashcard practice.” | Playwright `landing copy names the job, free tools, and paid feature in plain words`; [live full-page screenshot](evidence/polish-4-live/screenshot-desktop.png); cold live `https://flex-practice-queue.sociobot.in/` passed. |
| F-4-2 | Replaced the hero-art caption with “Choose a few existing flashcards for extra practice.” | Playwright `landing copy names the job, free tools, and paid feature in plain words`; [live full-page screenshot](evidence/polish-4-live/screenshot-desktop.png); cold live `https://flex-practice-queue.sociobot.in/` passed. |
| F-4-3 | Replaced “Core tools” with the named free actions: import, tag, practice, and export; retained the $9 saved-plan fact. | Playwright `landing copy names the job, free tools, and paid feature in plain words`; `@claim:free-core`; `@claim:paid-price`; [live full-page screenshot](evidence/polish-4-live/screenshot-desktop.png); cold live `https://flex-practice-queue.sociobot.in/` passed. |
| F-4-4 | Replaced the workbench eyebrow with “Your practice queue.” | Playwright `landing copy names the job, free tools, and paid feature in plain words`; [live full-page screenshot](evidence/polish-4-live/screenshot-desktop.png); cold live `https://flex-practice-queue.sociobot.in/` passed. |
| F-4-5 | Removed “Assembly notes” and renamed “Mark your intent” to “Tag prompts.” | Playwright `landing copy names the job, free tools, and paid feature in plain words`; [live full-page screenshot](evidence/polish-4-live/screenshot-desktop.png); cold live `https://flex-practice-queue.sociobot.in/#how` passed. |
| F-4-6 | Removed the “Scope boundary” eyebrow and retained the direct section heading and tested schedule-preservation explanation. | Playwright `landing copy names the job, free tools, and paid feature in plain words`; `@claim:source-schedule-untouched`; [live full-page screenshot](evidence/polish-4-live/screenshot-desktop.png); cold live `https://flex-practice-queue.sociobot.in/` passed. |
| F-4-7 | Replaced “Optional paid tool” with “Paid round plans.” | Playwright `landing copy names the job, free tools, and paid feature in plain words`; `@claim:paid-price`; [live full-page screenshot](evidence/polish-4-live/screenshot-desktop.png); cold live `https://flex-practice-queue.sociobot.in/` passed. |

Additional plain-language cleanup changes the README’s “separate lane,” legal-page “workbench,” offline fallback “sheet,” and 404 wording. The catalog description is now verb-first, 70 characters, and under the 120-character limit.

## Verification evidence

- Fresh dependency install: `npm ci` — passed with 0 vulnerabilities.
- Full product/browser/accessibility suite: `npm test` — 20/20 passed. This includes the 15 declared claim tests, direct demo entry, routes, metadata, mobile width, keyboard skip link, console checks, and Axe serious/critical checks.
- Production build: `npm run build` — passed; `dist/index.html` exists; initial JavaScript is 10.10 kB gzip and CSS is 4.71 kB gzip.
- Cold local screenshots: [390 × 844 demo](evidence/polish-4-local-demo-mobile.png) and [1440 × 1000 landing](evidence/polish-4-local-landing-desktop.png). The demo screenshot shows the persistent banner, reset/exit controls, realistic prompt, tags, timer, and start action before scrolling.
- Fresh live verification: [`verify.json`](evidence/polish-4-live/verify.json) records HTTPS 200, no console error, one h1/main, English language, title, and image-alt checks. [Cold demo at 390 px](evidence/polish-4-live/demo-mobile-cold.png) shows the banner, Reset demo, Start for real, realistic sample prompt, tags, timer, and start action before scrolling. [Cold 404 at 390 px](evidence/polish-4-live/404-mobile-cold.png) retains the styled navigation and legal footer; [`404.headers`](evidence/polish-4-live/404.headers) records HTTP 404.
- The cold live browser/axe review passed `/`, `/?demo=1`, `/privacy`, `/terms`, and `/missing-sheet`: one h1/main, correct route titles, no serious/critical Axe issue, no application console error, new copy present, and old F-4 wording absent. It started the sample round, reset it to eight prompts, exited to the real workspace, and reloaded `/demo` offline with eight prompts.
- Live mobile Lighthouse: [100 performance / 100 accessibility, 911 ms FCP, 1,511 ms LCP, 0 CLS](evidence/polish-4-live/lighthouse-mobile.json).
