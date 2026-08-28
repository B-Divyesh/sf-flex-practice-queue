# Adversarial first-read review 3 — Flex Practice Queue

**Verdict: PASS.** Reviewed 2026-08-28 against `https://flex-practice-queue.sociobot.in` in fresh Chromium contexts at 390 × 844 and 1440 × 1000, plus a clean dependency install in this checkout. There are no findings of any severity and no untested declared claim.

## Cold first read

Before scrolling, I understood this as a tool for learners with a few spare minutes to make an optional flashcard practice round without changing their normal flashcard schedule. I would click **Try it with sample data** first.

The first screen answers all three questions in plain text: “Build a useful practice round”; “For learners with spare minutes who want extra practice without changing their flashcard schedule”; and **“Try it with sample data”** followed by “Loads 8 prompts in a separate demo.” This passed at both widths. At 390 px there was no horizontal overflow or console/page error. The blueprint drafting-sheet treatment is distinct and consistent with `.factory/design.md`, not a generic SaaS template.

## Demo, sandbox, privacy, and offline checks

- The cold action opened `/?demo=1` with title `Demo — Flex Practice Queue`, the persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**.
- In the 390 × 844 viewport, the realistic prompt **“Explain why seasons occur.”** started at y=406. The same first screen showed tags, a 30-second sample round, and **Start this sample round**; that control immediately showed a live 1-of-3 round.
- A live isolation exercise seeded real data, entered demo, then selected **Start for real**. The real workspace retained only its sentinel prompt and no `demo:` local-storage key or `demo:flex-practice-queue` database remained. The declared claim test additionally preserves a real prompt, round, and byte-exact plan through mutation, reset, and exit.
- After a fresh live `/demo` page became service-worker controlled, an offline reload retained the demo heading and all eight prompts.
- The full live practice flow made no off-origin request and emitted no console/page error. Explicit license/checkout traffic is tested separately.

## Claims audit

Ran `npm ci`, then every exact command in `.factory/claims.json` independently. All 15 passed: `demo-sandbox`, `offline-reload`, `local-privacy`, `csv-readonly`, `source-schedule-untouched`, `anki-csv-import`, `anki-apkg-not-supported`, `csv-export`, `mixed-round`, `saved-plans`, `data-delete`, `free-core`, `paid-price`, `license-check`, and `license-data-minimization`.

`npm test` passed **19/19** and `npm run build` passed, producing `dist/` (10.15 kB gzip JavaScript and 4.71 kB gzip CSS).

All claim-like landing and README statements have a contract: demo isolation, offline operation, data locality, CSV/Anki input and source safety, export/deletion, keyboard rounds, free core, named-plan price, and license behavior/minimization map respectively to the named tests above. No unlisted claim remains.

## Copy audit

Counts use the plain-words convention: a hyphenated term, number, URL, or code-formatted value is one word. The full visitor-facing landing and README audit follows. No sentence exceeds 22 words, uses a banned marketing word, has inconsistent protected-system terminology, or leaves an action button unnamed. The protected system is consistently **flashcard schedule**.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Drawing 01 · optional rehearsal lane | 5 | Pass |
| Build a useful practice round | 5 | Pass |
| For learners with spare minutes who want extra practice without changing their flashcard schedule. | 14 | Pass |
| Try it with sample data | 5 | Pass |
| Loads 8 prompts in a separate demo. | 7 | Pass |
| Works offline after the first visit. | 6 | Pass |
| Your study data stays in this browser. | 7 | Pass |
| Core tools are free. | 4 | Pass |
| Saved round plans cost $9 once. | 6 | Pass |
| Pull a small rehearsal lane from the cards you already use. | 11 | Pass |
| Drawing 02 · your local workbench | 5 | Pass |
| Build a round from your prompts | 6 | Pass |
| Import a CSV or add one prompt. | 7 | Pass |
| Your imported file is only read. | 6 | Pass |
| Add prompts / Import CSV / Columns: prompt, answer, tags. | 2 / 2 / 4 | Pass |
| For Anki, export a front, back, tags CSV first. | 10 | Pass |
| This app cannot read .apkg packages. | 7 | Pass |
| Add one prompt / Prompt / Answer / Add prompt | 3 / 1 / 1 / 2 | Pass |
| Choose the mix / Use prompts tagged | 3 / 3 | Pass |
| Show all prompts / Show warm-up prompts / Show weak prompts / Show today’s prompts | 3 / 3 / 3 / 3 | Pass |
| Prompt count / Seconds each / Plan name | 2 / 2 / 2 | Pass |
| 0 prompts fit this mix. | 5 | Pass |
| Start mixed round / Save plan · paid | 3 / 3 | Pass |
| Prompt queue 0 / Export CSV / Delete local data | 3 / 2 / 3 | Pass |
| Your queue is empty / Your tagged prompts will appear here. / See the sample queue | 4 / 6 / 4 | Pass |
| Assembly notes / How optional practice works | 2 / 4 | Pass |
| Import prompts. / Use a CSV from your flashcard schedule. / Nothing writes back. | 2 / 7 / 3 | Pass |
| Mark your intent. / Tag warm-up, weak, or today. / Pick any mix. | 3 / 5 / 3 | Pass |
| Run the round. / Reveal answers at your pace. / Stop when your window closes. | 3 / 5 / 5 | Pass |
| Scope boundary / Leaves your flashcard schedule alone | 2 / 5 | Pass |
| This queue does not calculate due dates or rate cards in your flashcard schedule. | 13 | Pass |
| It stores prompts and round notes in this browser. | 9 | Pass |
| Export your prompts whenever you want. / Delete them from this device when needed. | 6 / 7 | Pass |
| Optional paid tool / Save round plans for $9 once | 3 / 6 | Pass |
| Import, tag, practice, and export stay free. / A license adds named round plans for repeated routines. | 7 / 8 | Pass |
| Buy a $9 license / Checkout opens on Sociobot after you choose to buy. | 4 / 9 | Pass |
| Have a license? Paste it / Verify license / No license is saved. | 5 / 2 / 4 | Pass |
| Flex Practice Queue — optional practice beside your flashcard schedule. | 9 | Pass |
| Privacy / Terms / Built by Param Factory / v1.0.0 · Original generated artwork | 1 / 1 / 4 / 4 | Pass |

The demo-only sentences and controls also pass: “Eight sample prompts are ready. Start with this three-prompt round.” (10), “Start this sample round” (5), “Reset demo” (2), “Start for real” (3), and “Mark as got it” (4).

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Flex Practice Queue | 3 | Pass |
| Build short practice rounds without changing your flashcard schedule. | 9 | Pass |
| Flex Practice Queue is for learners whose study time comes in short, irregular windows. | 14 | Pass |
| It creates a separate lane for warm-ups and weak items. | 10 | Pass |
| Try the isolated sample at https://flex-practice-queue.sociobot.in/demo. | 6 | Pass |
| What it does | 3 | Pass |
| Imports prompt,answer,tags CSV files and Anki front,back,tags CSV exports. | 13 | Pass |
| Tags prompts as warm-up, weak, or today. | 7 | Pass |
| Runs timed mixed rounds with Space and arrow-key controls. | 9 | Pass |
| Exports every prompt as CSV. | 5 | Pass |
| Works offline after the first visit. | 6 | Pass |
| Keeps study data in local browser storage. | 7 | Pass |
| The app never writes to the selected CSV or your flashcard schedule. | 12 | Pass |
| Import, tagging, practice, and CSV export need no license. | 9 | Pass |
| Anki .apkg packages are not imported. / Export a front,back,tags CSV from Anki first. | 6 / 7 | Pass |
| A $9 one-time license adds named round plans. / Checkout and license checks use the Sociobot billing API. | 8 / 9 | Pass |
| Run locally / Use Node.js 20 or newer. | 2 / 5 | Pass |
| Open http://localhost:4173. / Open http://localhost:4173/demo for the sample sandbox. | 2 / 6 | Pass |
| Test and build / The build command is exactly npm run build. | 3 / 8 | Pass |
| It writes the static site to dist/, with dist/index.html at the root. | 10 | Pass |
| Claim tests use the bundled demo and CSV fixture. | 9 | Pass |
| The test suite also checks routes, mobile width, console errors, and serious accessibility issues. | 14 | Pass |
| Data and privacy / Prompts and round history use IndexedDB. | 3 / 6 | Pass |
| Named plans and a purchased license use localStorage. | 8 | Pass |
| Demo data uses separate demo: storage. / Resetting or leaving the demo deletes that sample workspace. | 6 / 9 | Pass |
| License checks send only the license token to Sociobot. / They run at most once each day. | 9 / 8 | Pass |
| See the in-app privacy policy and terms. | 7 | Pass |
| Deploy / Deploy dist/ as a static site after npm run build. | 1 / 10 | Pass |
| The included fallback config serves the app routes through index.html. | 10 | Pass |
| The factory owns DNS, billing registration, and production deployment. / Do not add secrets to this repository. | 9 / 7 | Pass |
| Project records | 2 | Pass |
| .factory/brief.json records the researched opportunity. | 4 | Pass |
| .factory/design.md records the blueprint visual system and artwork provenance. | 8 | Pass |
| .factory/claims.json maps product claims to tests. | 5 | Pass |
| .factory/demo.md documents sandbox isolation. / .factory/handoff.md records verification and known gaps. | 4 / 6 | Pass |
| MIT licensed. / Built by Param Factory. | 2 / 4 | Pass |

## Structure, routes, links, and accessibility

- `/`, `/demo`, `/privacy`, and `/terms` returned 200 with `lang="en"`, one `<main>`, one `<h1>`, route title, description, canonical, Open Graph image, favicon, and no browser error.
- The title pattern is correct: **“Flex Practice Queue — Build short practice rounds”**, **“Demo — Flex Practice Queue”**, **“Privacy — Flex Practice Queue”**, and **“Terms — Flex Practice Queue.”**
- An unknown live address returned HTTP 404 with the designed static 404 and its skip link, home wordmark, navigation, legal/footer links, favicon, canonical, and social metadata.
- Client navigation to Privacy focused its `<h1>`; Back focused the landing `<h1>`. Deep `/demo`, `/privacy`, and `/terms` links loaded directly.
- Crawled internal links, Anki export guidance, and Param Factory returned 200. The checkout route returned the expected HTTP 303 to hosted Dodo checkout; no purchase was made.
- Live headers include the expected CSP, `X-Content-Type-Options`, referrer policy, permissions policy, HSTS, immutable hashed assets, and `no-cache` `sw.js`.
- Axe checks in the suite found no serious or critical issue. Live mobile showed a visible skip-link focus state and no overflow; reduced motion is covered by the local suite.

## Earlier-finding verification

Read every earlier review, polish record, verification record, and handoff. Each earlier finding was rechecked in live behavior and code.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: real sample-round preview is above the 390 px fold and starts in one click. |
| F-1-2 | Fixed: unknown live paths return HTTP 404 through the static 404 response. |
| F-1-3 | Fixed: source-schedule test covers import, tag, practice, stop, export, fixture bytes, and same-origin traffic. |
| F-1-4 | Fixed: merchant-of-record and refund assurances are absent. |
| F-1-5 | Fixed: one-token license minimization is asserted. |
| F-1-6 | Fixed: `.apkg` is rejected with CSV guidance and a shipped-fixture test. |
| F-1-7 | Fixed: **flashcard schedule** is used consistently. |
| F-2-1 | Fixed: sandbox test preserves real prompt, round, and plan through reset/exit and removes demo storage. |
| F-2-2 | Fixed: `.apkg` has a declared claim and test. |
| F-2-3 | Fixed: static 404 has the accessible shell and route metadata. |
| F-2-4 | Fixed: tag controls name the result they show. |
| F-2-5 | Fixed: positive rating says **Mark as got it**. |

## Missed leverage

No extra AI step is implied by the brief: this is a local, non-destructive queue and timed rehearsal tool, not a content-generation task. CSV/Anki-CSV import, CSV export, offline use, and isolated sample data are present. There is no decorative AI feature, provider key, or direct provider endpoint.

## What would make this perfect

Nothing remains required by this review. Preserve the existing clean-demo coverage, live offline regression check, and explicit CSV-only Anki limitation as the product changes.
