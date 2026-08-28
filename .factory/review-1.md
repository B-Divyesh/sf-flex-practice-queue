# Adversarial first-read review 1 — Flex Practice Queue

**Verdict: FAIL.** Checked 2026-08-28 against `https://flex-practice-queue.sociobot.in` in fresh Chromium contexts at 390×844 and 1440×1000, plus a clean local dependency install.

## Cold first read

Before scrolling, I understood this as a local tool for learners who have a few spare minutes and want an extra flashcard practice round without changing their regular schedule. I would click **Try it with sample data** first. The mobile screen supplies all three answers with “Build a useful practice round,” “For learners with spare minutes who want extra practice without changing a formal card schedule,” and “Try it with sample data” followed by “Loads 8 prompts in a separate demo.” This part passes at both tested widths. The blueprint drafting visual language is distinct from a generic SaaS template and matches the recorded design direction.

## Findings

### F-1-1 — BLOCKING — Demo does not show sample data in the first mobile viewport

**Location / evidence:** At 390×844, opening `/demo` in one click shows the banner, heading, explanatory sentence, and the start of **01 Add prompts**. No sample prompt, selected mix, timer, or completed practice state is visible before scrolling. The page says “Eight sample prompts are ready,” but the eight realistic prompts begin below the first viewport.

**Why this fails:** The demo requirement is that the first screen after the one-click action already looks like the product being used with realistic sample data. The visible “Add prompts” panel instead resembles an empty setup screen, so the visitor has to trust a statement and scroll to verify it.

**Concrete fix:** Put a compact, visible sample-round preview above the fold on `/demo`: show “1 of 3”, a real sample prompt, its tags, a timer, and **Start this sample round**. Keep the eight-prompt library below it. Add a 390×844 Playwright assertion that a real sample prompt is visible without scrolling immediately after `/demo` opens.

### F-1-2 — BLOCKING — The designed missing-page UI is served with HTTP 200

**Location / evidence:** `curl -I https://flex-practice-queue.sociobot.in/missing-sheet` returned `HTTP/2 200` with the SPA HTML. The browser then renders “This practice sheet is missing.” `public/staticwebapp.config.json` has only `navigationFallback`; it has no 404 response override or static 404 document.

**Why this fails:** A crawler, cache, search engine, or shared broken link is told that the missing address exists. This is not a real 404 route even though the visual fallback is designed.

**Concrete fix:** Ship a styled static `404.html` and configure Static Web Apps with `responseOverrides["404"]` to rewrite to it with status `404` (do not put `rewrite` and `statusCode` together in a `routes[]` entry). Preserve explicit SPA routes as navigation fallbacks, then add a live/deployment regression check that an unknown URL returns status 404 and includes the return-home action.

### F-1-3 — HIGH — Core non-destructive scheduler claim has no claims entry

**Location / quote:** Landing: “This queue does not calculate due dates or rate source cards.” README: “The app never writes to the selected CSV or a source-card scheduler.” Neither sentence is covered by a claim in `.factory/claims.json`. `csv-readonly` covers only the selected CSV file.

**Why this fails:** Not changing the learner’s real scheduler is the product’s central promise. The current claim suite demonstrates CSV byte preservation and local demo privacy, not the stronger scheduler guarantee.

**Concrete fix:** Add a distinct `source-schedule-untouched` claims entry and a clean-demo test that imports, tags, runs, and exports while recording all requests; assert no request reaches a card scheduler and source fixture bytes remain unchanged. If that guarantee cannot be tested, remove the scheduler claim from landing and README copy.

### F-1-4 — HIGH — Merchant-of-record and refund promises are unlisted claims

**Location / quote:** Landing paid section: “Sociobot/Dodo is the merchant of record. Refunds are handled there.” `paid-price` verifies only a $9 checkout link and a hosted 3xx redirect.

**Why this fails:** These are material payment and refund promises. A hosted checkout redirect does not verify who is merchant of record or where refunds are handled.

**Concrete fix:** Remove these sentences until a public, testable policy URL can be linked and asserted, or add a claims entry that tests the displayed merchant/refund policy and its live link. Do not present a legal/payment assurance that the sandbox cannot prove.

### F-1-5 — HIGH — README privacy minimization promise is unlisted

**Location / quote:** README, **Data and privacy**: “The license token is the only stored value sent off-site.” The `license-check` test covers a once-daily fixture verification, but does not assert that its request contains only the license token or that no other stored value is transmitted.

**Why this fails:** This is a specific privacy promise a buyer may rely on. The existing `local-privacy` test does not exercise the license path.

**Concrete fix:** Add a `license-data-minimization` claim whose intercepted license flow verifies the exact request URL/method/body, permits only the documented Sociobot verification request, and proves that no prompt, round, or plan value is sent. Otherwise change the README to the narrower tested claim.

### F-1-6 — MEDIUM — Direct Anki import remains the missing expected input path

**Location / evidence:** The brief constraint says “CSV/Anki import must be read-only.” The product and README accept only `prompt,answer,tags` CSV and Anki **front,back,tags CSV exports**; `.factory/handoff.md` confirms that direct `.apkg` parsing is absent.

**Why this matters:** A learner who hears “Anki import” normally has an Anki package, not a pre-exported CSV. The current restriction is honest in the README, but it leaves the most direct source path out of the product’s core job.

**Concrete fix:** Add a local, read-only `.apkg` importer with a shipped sample and claim test, or make the limitation explicit in the in-app import control with a short **Export front/back/tags CSV from Anki** instruction and link.

### F-1-7 — MINOR — The name for the protected source system is inconsistent

**Location / quote:** The landing alternates among “formal card schedule,” “cards you already use,” “card tool,” “scheduler,” and “source cards.” The README uses “card schedule” and “source-card scheduler.”

**Why this fails:** The audit’s own terminology table specifies “source-card scheduler,” but the first screen uses a different, less concrete term. A newcomer cannot tell whether these mean one system or several.

**Concrete fix:** Choose one plain name, preferably **flashcard schedule**, and use it throughout. For example: “For learners with spare minutes who want extra practice without changing their flashcard schedule.”

## Demo and sandbox checks

- The hero action reached `/demo` in one click.
- The persistent banner reads “Demo — sample data, nothing is saved” and has **Reset demo** and **Start for real**.
- Reset restored the eight sample prompts (`8 → reset → 8`).
- A direct live isolation check stored one real-data sentinel, mutated/reset demo data, and observed the real IndexedDB prompt count unchanged (`1, 1, 1`). Demo localStorage used only `demo:fpq:*` keys.
- Demo’s eight prompts are realistic across science, language, maths, civics, economics, and programming. This passes once scrolled; F-1-1 is solely the first-viewport failure.
- The offline and local-privacy claim tests use `context.setOffline(true)` and a request listener respectively. They passed locally; no privacy failure was observed in the tested demo flow.

## Claims audit

`npm ci` completed from a clean dependency state. Each exact command listed in `.factory/claims.json` was run independently; all 12 passed:

| Claim id | Result |
| --- | --- |
| demo-sandbox | Pass |
| offline-reload | Pass |
| local-privacy | Pass |
| csv-readonly | Pass |
| anki-csv-import | Pass |
| csv-export | Pass |
| mixed-round | Pass |
| saved-plans | Pass |
| data-delete | Pass |
| free-core | Pass |
| paid-price | Pass |
| license-check | Pass |

`npm test` also passed **15/15** and `npm run build` passed, producing `dist/`. The unlisted-claim findings above remain failures even though listed tests pass.

## Copy audit

Counts treat a hyphenated term, a number, and a URL as one word. The following lists every visitor-facing sentence and heading/button phrase on a fresh landing page, then every README sentence. No item exceeds 22 words and no banned marketing adjective appears. The terminology inconsistency is F-1-7.

### Landing page (`/`, fresh empty workspace)

| Copy | Words |
| --- | ---: |
| Drawing 01 · optional rehearsal lane | 5 |
| Build a useful practice round | 5 |
| For learners with spare minutes who want extra practice without changing a formal card schedule. | 15 |
| Try it with sample data | 5 |
| Loads 8 prompts in a separate demo. | 7 |
| Works offline after the first visit. | 6 |
| Your study data stays in this browser. | 7 |
| Core tools are free. | 4 |
| Saved round plans cost $9 once. | 6 |
| Pull a small rehearsal lane from the cards you already use. | 11 |
| Drawing 02 · your local workbench | 5 |
| Build a round from your prompts | 6 |
| Import a CSV or add one prompt. | 7 |
| Your imported file is only read. | 6 |
| Add prompts / Import CSV / Add one prompt | 2 / 2 / 3 |
| Columns: prompt, answer, tags. | 4 |
| Anki front/back CSV also works. | 5 |
| Choose the mix / Use prompts tagged | 3 / 3 |
| Any tag / Warm-up / Weak / Today | 2 / 1 / 1 / 1 |
| Prompt count / Seconds each | 2 / 2 |
| 0 prompts fit this mix. | 5 |
| Start mixed round / Save plan · paid | 3 / 3 |
| Prompt queue 0 / Export CSV / Delete local data | 3 / 2 / 3 |
| Your queue is empty | 4 |
| Import a CSV or add one prompt. | 7 |
| Your tagged prompts will appear here. | 6 |
| See the sample queue | 4 |
| Assembly notes / How optional practice works | 2 / 4 |
| Import prompts. | 2 |
| Use a CSV from your card tool. | 7 |
| Nothing writes back. | 3 |
| Mark your intent. | 3 |
| Tag warm-up, weak, or today. | 5 |
| Pick any mix. | 3 |
| Run the round. | 3 |
| Reveal answers at your pace. | 5 |
| Stop when your window closes. | 5 |
| Scope boundary / Keeps your scheduler out of it | 2 / 6 |
| This queue does not calculate due dates or rate source cards. | 10 |
| It stores prompts and round notes in this browser. | 9 |
| Export your prompts whenever you want. | 6 |
| Delete them from this device when needed. | 7 |
| Optional paid tool / Save round plans for $9 once | 3 / 6 |
| Import, tag, practice, and export stay free. | 7 |
| A license adds named round plans for repeated routines. | 9 |
| Buy a $9 license | 4 |
| Sociobot/Dodo is the merchant of record. | 6 |
| Refunds are handled there. | 4 |
| Have a license? Paste it | 5 |
| Verify license / No license is saved. | 2 / 4 |
| Flex Practice Queue — optional practice beside your scheduler. | 8 |
| Privacy / Terms / Built by Param Factory | 1 / 1 / 4 |
| v1.0.0 · Original generated artwork | 4 |

### README

| Copy | Words |
| --- | ---: |
| Build short practice rounds without changing your card schedule. | 9 |
| Flex Practice Queue is for learners whose study time comes in short, irregular windows. | 14 |
| It creates a separate lane for warm-ups and weak items. | 10 |
| Try the isolated sample at https://flex-practice-queue.sociobot.in/demo. | 6 |
| Imports `prompt,answer,tags` CSV files and common Anki `front,back,tags` exports. | 13 |
| Tags prompts as `warm-up`, `weak`, or `today`. | 7 |
| Runs timed mixed rounds with Space and arrow-key controls. | 9 |
| Exports every prompt as CSV. | 5 |
| Works offline after the first visit. | 6 |
| Keeps study data in local browser storage. | 7 |
| The app never writes to the selected CSV or a source-card scheduler. | 12 |
| Import, tagging, practice, and CSV export need no license. | 9 |
| A $9 one-time license adds named round plans. | 8 |
| Checkout and license checks use the Sociobot billing API. | 9 |
| Use Node.js 20 or newer. | 5 |
| Open `http://localhost:4173`. | 2 |
| Open `http://localhost:4173/demo` for the sample sandbox. | 5 |
| The build command is exactly `npm run build`. | 8 |
| It writes the static site to `dist/`, with `dist/index.html` at the root. | 10 |
| Claim tests use the bundled demo and CSV fixture. | 9 |
| The test suite also checks routes, mobile width, console errors, and serious accessibility issues. | 14 |
| Prompts and round history use IndexedDB. | 6 |
| Named plans and a purchased license use localStorage. | 8 |
| Demo data uses separate `demo:` storage. | 6 |
| Resetting or leaving the demo deletes that sample workspace. | 9 |
| The license token is the only stored value sent off-site. | 10 |
| It is checked with Sociobot at most once each day. | 10 |
| See the in-app privacy policy and terms. | 7 |
| Deploy `dist/` as a static site after `npm run build`. | 10 |
| The included fallback config serves the app routes through `index.html`. | 10 |
| The factory owns DNS, billing registration, and production deployment. | 9 |
| Do not add secrets to this repository. | 7 |
| MIT licensed. | 2 |
| Built by Param Factory. | 4 |

Headings such as **What it does**, **Run locally**, **Test and build**, **Data and privacy**, **Deploy**, and **Project records** make sense out of context. All visible controls use action-oriented labels; none was flagged for a generic “Submit”, “Go”, or “Continue” label.

## Structure, navigation, and accessibility checks

- `/`, `/demo`, `/privacy`, `/terms`, and the missing-page UI each rendered one `h1`, a `main`, `lang="en"`, the expected route title, and canonical URL. Route titles were `Flex Practice Queue — Build short practice rounds`, `Demo — Flex Practice Queue`, `Privacy — Flex Practice Queue`, `Terms — Flex Practice Queue`, and `Page not found — Flex Practice Queue`.
- Root markup supplies description, canonical, Open Graph, Twitter card, SVG favicon, Apple touch icon, robots, sitemap, manifest, and product artwork.
- Header/footer are consistent and include skip link, Demo, How it works, Privacy, Terms, Param Factory, and build identifier. All crawled internal links returned 200; the checkout URL returned 303 to hosted Dodo and the Param Factory link returned 200. The missing URL status is F-1-2.
- Direct SPA navigation to Privacy and browser Back returned focus to the destination `h1` and updated title. The initial Tab at 390 px reached the skip link. The full test suite’s Axe check found no serious or critical violations.
- No runtime AI feature or embedded provider key is present. This is suitable: the documented local queue job has no obvious AI-assisted step that improves its core non-destructive workflow. The missing direct Anki input is F-1-6.

## History check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` existed. I read the existing handoff and verification records. Their prior verification covers CSV/Anki CSV import, checkout redirect, offline reload, and accessibility; these were rechecked through the current local tests and live checks. The handoff’s explicitly recorded `.apkg` gap remains F-1-6. The live 200 missing route is not fixed by the current designed SPA fallback (F-1-2).

## What would make this perfect

Show a real sample prompt or live sample round in the first mobile demo viewport; return an actual 404 status for unknown URLs; either test or remove each material scheduler, payment, and privacy assurance; make the source scheduler term consistent; and close the direct Anki-package path or guide that export in the import UI. Re-run the complete claim suite and this first-read checklist after those changes.
