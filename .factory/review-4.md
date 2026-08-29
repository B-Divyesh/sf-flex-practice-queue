# Adversarial first-read review 4 — Flex Practice Queue

**Verdict: FAIL.** Reviewed 2026-08-29 against `https://flex-practice-queue.sociobot.in` in fresh Chromium contexts at 390 × 844 and 1440 × 1000, and from a clean clone at `/tmp/fpq-review4.Po4enB`.

## Cold first read

Before scrolling at 390 px, this reads as a tool for learners with a few spare minutes to make an extra flashcard practice round without changing their existing flashcard schedule. The first action is **Try it with sample data**. The evidence is the headline **“Build a useful practice round”**, the supporting sentence **“For learners with spare minutes who want extra practice without changing their flashcard schedule.”**, and the action plus outcome **“Try it with sample data” / “Loads 8 prompts in a separate demo.”** The same three answers are visible at desktop width. This passes.

The visual system is recognisably a drafting sheet rather than a generic SaaS template. It has a product-specific grid, drafting marks, local slab/sans type, and original blueprint-timer artwork. The identity is distinct; the text labels that carry the visual metaphor are reviewed below.

## Findings

### F-4-1 — MINOR — The first-screen drafting label is decorative jargon

**Location / quote:** Landing hero eyebrow: **“Drawing 01 · optional rehearsal lane.”**

**Why this fails:** “Rehearsal lane” is not a plain name for a practice queue, and “Drawing 01” tells a first-time visitor nothing they can use. The label is visible before the main explanation, so it spends scarce mobile attention on the visual metaphor rather than the job.

**Concrete fix:** Remove the eyebrow, or replace it with **“Extra flashcard practice”**. Keep the drafting treatment in layout, rules, and artwork rather than explanatory copy.

### F-4-2 — MINOR — The hero caption uses an unexplained metaphor

**Location / quote:** Hero-art caption: **“Pull a small rehearsal lane from the cards you already use.”**

**Why this fails:** A visitor has to translate “pull” and “rehearsal lane” before learning what happens. The sentence is a slogan-like restatement of the product rather than a direct explanation.

**Concrete fix:** Replace it with **“Choose a few existing flashcards for extra practice.”**

### F-4-3 — MINOR — “Core tools” is vague in a required first-screen fact

**Location / quote:** Hero fact: **“Core tools are free. Saved round plans cost $9 once.”**

**Why this fails:** “Core tools” does not name what is free. On the first screen, the visitor has not yet reached the paid section that explains the distinction. The required price fact should be usable without that extra context.

**Concrete fix:** Replace it with **“Import, tag, practice, and export are free. Saved round plans cost $9 once.”** The existing `free-core` and `paid-price` claim tests cover this wording.

### F-4-4 — MINOR — The workbench eyebrow is decorative rather than a section name

**Location / quote:** Workbench eyebrow: **“Drawing 02 · your local workbench.”**

**Why this fails:** “Drawing 02” is decorative numbering and “workbench” is a metaphor. Neither helps a screen-reader user hearing the heading list or a reader deciding what the section contains.

**Concrete fix:** Remove the eyebrow, or replace it with **“Your practice queue”**.

### F-4-5 — MINOR — “Assembly notes” and “Mark your intent” are mood headings

**Location / quote:** How-it-works eyebrow **“Assembly notes”** and step heading **“Mark your intent.”**

**Why this fails:** Neither phrase names the section or action in the learner’s words. The nearby text has to do the translation: this is the three-step explanation and the action is tagging prompts.

**Concrete fix:** Remove **“Assembly notes”** because the following heading already says **“How optional practice works.”** Replace **“Mark your intent.”** with **“Tag prompts.”**

### F-4-6 — MINOR — “Scope boundary” is policy jargon instead of a useful section name

**Location / quote:** Boundary eyebrow: **“Scope boundary.”**

**Why this fails:** It is an internal/product term, not an explanation a learner uses. The actual heading **“Leaves your flashcard schedule alone”** is already the clear name of this section.

**Concrete fix:** Remove the eyebrow. Retain the existing heading and the tested schedule-preservation explanation.

### F-4-7 — MINOR — “Optional paid tool” does not name the paid feature

**Location / quote:** Pricing eyebrow: **“Optional paid tool.”**

**Why this fails:** It is generic and forces the visitor to read the next heading to learn what costs money. A heading must name its section without context.

**Concrete fix:** Remove the eyebrow, or replace it with **“Paid round plans.”**

## Copy audit

Word counts use whitespace-delimited visible words. The landing inventory includes headings, labels, controls, empty states, and footer text; slash-separated controls are independently counted. No landing or README sentence exceeds 22 words. The seven flags above are the remaining copy findings. No banned marketing adjective was found in the README.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Drawing 01 · optional rehearsal lane | 5 | F-4-1 |
| Build a useful practice round | 5 | Pass |
| For learners with spare minutes who want extra practice without changing their flashcard schedule. | 14 | Pass |
| Try it with sample data | 5 | Pass |
| Loads 8 prompts in a separate demo. | 7 | Pass |
| Works offline after the first visit. | 6 | Pass |
| Your study data stays in this browser. | 7 | Pass |
| Core tools are free. | 4 | F-4-3 |
| Saved round plans cost $9 once. | 6 | Pass |
| Pull a small rehearsal lane from the cards you already use. | 11 | F-4-2 |
| Drawing 02 · your local workbench | 5 | F-4-4 |
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
| Prompt queue 0 / Export CSV / Delete local data | 2 / 2 / 3 | Pass |
| Your queue is empty | 4 | Pass |
| Your tagged prompts will appear here. | 6 | Pass |
| See the sample queue | 4 | Pass |
| Assembly notes | 2 | F-4-5 |
| How optional practice works | 4 | Pass |
| Import prompts. | 2 | Pass |
| Use a CSV from your flashcard schedule. | 7 | Pass |
| Nothing writes back. | 3 | Pass |
| Mark your intent. | 4 | F-4-5 |
| Tag warm-up, weak, or today. | 5 | Pass |
| Pick any mix. | 3 | Pass |
| Run the round. | 3 | Pass |
| Reveal answers at your pace. | 5 | Pass |
| Stop when your window closes. | 5 | Pass |
| Scope boundary | 2 | F-4-6 |
| Leaves your flashcard schedule alone | 5 | Pass |
| This queue does not calculate due dates or rate cards in your flashcard schedule. | 13 | Pass |
| It stores prompts and round notes in this browser. | 9 | Pass |
| Export your prompts whenever you want. | 6 | Pass |
| Delete them from this device when needed. | 7 | Pass |
| Optional paid tool | 3 | F-4-7 |
| Save round plans for $9 once | 6 | Pass |
| Import, tag, practice, and export stay free. | 7 | Pass |
| A license adds named round plans for repeated routines. | 8 | Pass |
| Buy a $9 license / Checkout opens on Sociobot after you choose to buy. | 4 / 9 | Pass |
| Have a license? Paste it / Verify license / No license is saved. | 5 / 2 / 4 | Pass |
| Flex Practice Queue — optional practice beside your flashcard schedule. | 9 | Pass |
| Privacy / Terms / Built by Param Factory / v1.0.0 · Original generated artwork | 1 / 1 / 4 / 4 | Pass |

### README

| Copy | Words | Result |
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
| Anki .apkg packages are not imported. | 6 | Pass |
| Export a front,back,tags CSV from Anki first. | 7 | Pass |
| A $9 one-time license adds named round plans. | 8 | Pass |
| Checkout and license checks use the Sociobot billing API. | 9 | Pass |
| Run locally / Use Node.js 20 or newer. | 2 / 5 | Pass |
| Open http://localhost:4173. | 2 | Pass |
| Open http://localhost:4173/demo for the sample sandbox. | 6 | Pass |
| Test and build / The build command is exactly npm run build. | 3 / 8 | Pass |
| It writes the static site to dist/, with dist/index.html at the root. | 10 | Pass |
| Claim tests use the bundled demo and CSV fixture. | 9 | Pass |
| The test suite also checks routes, mobile width, console errors, and serious accessibility issues. | 14 | Pass |
| Data and privacy / Prompts and round history use IndexedDB. | 3 / 6 | Pass |
| Named plans and a purchased license use localStorage. | 8 | Pass |
| Demo data uses separate demo: storage. | 6 | Pass |
| Resetting or leaving the demo deletes that sample workspace. | 9 | Pass |
| License checks send only the license token to Sociobot. | 9 | Pass |
| They run at most once each day. | 8 | Pass |
| See the in-app privacy policy and terms. | 7 | Pass |
| Deploy / Deploy dist/ as a static site after npm run build. | 1 / 10 | Pass |
| The included fallback config serves the app routes through index.html. | 10 | Pass |
| The factory owns DNS, billing registration, and production deployment. | 9 | Pass |
| Do not add secrets to this repository. | 7 | Pass |
| Project records | 2 | Pass |
| .factory/brief.json records the researched opportunity. | 4 | Pass |
| .factory/design.md records the blueprint visual system and artwork provenance. | 8 | Pass |
| .factory/claims.json maps product claims to tests. | 5 | Pass |
| .factory/demo.md documents sandbox isolation. | 4 | Pass |
| .factory/handoff.md records verification and known gaps. | 6 | Pass |
| MIT licensed. | 2 | Pass |
| Built by Param Factory. | 4 | Pass |

Terminology remains consistent where it matters: protected source system = **flashcard schedule**; try-out = **demo**; study item = **prompt**; reusable configuration = **round plan**; paid credential = **license**.

## Demo, sandbox, claims, and privacy

- The landing action reaches `/?demo=1` in one click. At 390 × 844, the first screen already shows **“Explain why seasons occur.”**, its tags, **30 seconds**, and **Start this sample round** at y=406 px. The banner is present: **“Demo — sample data, nothing is saved”**, with **Reset demo** and **Start for real**.
- Reset returned the demo to eight prompts. After allowing the asynchronous reset to settle, Start for real removed every `demo:` local-storage key and the `demo:flex-practice-queue` database. A separately persisted real prompt remained through a demo entry and exit.
- A fresh `/demo` service-worker visit reloaded offline with the mixed-round heading and all eight sample prompts. The complete demo-flow request log contained only same-origin requests.
- `.factory/claims.json` contains 15 entries. Every exact command listed in it passed from the clean clone: `demo-sandbox`, `offline-reload`, `local-privacy`, `csv-readonly`, `source-schedule-untouched`, `anki-csv-import`, `anki-apkg-not-supported`, `csv-export`, `mixed-round`, `saved-plans`, `data-delete`, `free-core`, `paid-price`, `license-check`, and `license-data-minimization`.
- `npm test` passed 19/19 and `npm run build` passed. The production JS is 10.15 kB gzip. The checkout test observed the declared Sociobot checkout endpoint return a 303 to hosted checkout; no payment was attempted.
- All live claim-like landing and README statements map to the contract. The new findings are wording/heading issues, not unlisted behavioural claims.

## Earlier-finding verification

Read every `.factory/review-*.md`, `.factory/polish-*.md`, `.factory/verification*.md`, and the prior handoff. The previous remedies remain real in both code and production:

| Earlier id | Current verification |
| --- | --- |
| F-1-1 | Fixed: the 390 px demo first screen has a real prompt, tags, timer, and start action. |
| F-1-2 | Fixed: an unknown live route returned HTTP 404 with the designed static page. |
| F-1-3 | Fixed: the source-schedule claim test imports, tags, practices, stops, exports, preserves fixture bytes, and observes same-origin traffic. |
| F-1-4 | Fixed: no merchant-of-record or refund assurance remains in live copy. |
| F-1-5 | Fixed: the separate minimization claim asserts the exact one-token license request. |
| F-1-6 | Fixed: `.apkg` is safely rejected with CSV export guidance and a declared fixture test. |
| F-1-7 | Fixed: **flashcard schedule** is the consistent protected-system term. |
| F-2-1 | Fixed: the declared demo test seeds real prompts, rounds, and plans and verifies reset/exit isolation. |
| F-2-2 | Fixed: unsupported `.apkg` behaviour is declared and tested. |
| F-2-3 | Fixed: the true static 404 has the accessible header, navigation, legal footer, favicon, and social metadata. |
| F-2-4 | Fixed: filters are result-naming **Show … prompts** controls. |
| F-2-5 | Fixed: the rating control says **Mark as got it**. |

## Structure, routes, accessibility, and links

- `/`, `/demo`, `/privacy`, and `/terms` each returned 200; the test missing route returned 404. All have `lang="en"`, exactly one `<main>`, exactly one `<h1>`, route-appropriate title, description, canonical, original social image, and favicon. Titles are **Flex Practice Queue — Build short practice rounds**, **Demo — Flex Practice Queue**, **Privacy — Flex Practice Queue**, **Terms — Flex Practice Queue**, and **Page not found — Flex Practice Queue**.
- The live route crawl found no dead links: internal routes returned 200, Anki guidance and Param Factory returned 200, and the explicit checkout link returned its expected 303. No purchase was made.
- Privacy navigation moved focus to its h1; after Back and route rendering settled, focus moved to the landing h1. Direct route loads and the 390 px layout worked without horizontal overflow.
- Fresh live axe scans reported no serious or critical violations on all application routes and the 404. Normal routes had no console errors. The browser records the expected failed-resource console message for the deliberately HTTP-404 page itself.
- Live headers include CSP with response-header `frame-ancestors`, `X-Content-Type-Options`, referrer policy, and permissions policy. `robots.txt`, `sitemap.xml`, service-worker caching, the static 404 override, reduced-motion CSS, and local-only assets are present.

## Missed leverage

No additional AI feature is implied by the brief. This is a local, non-destructive selection and timed-practice tool; content generation would be decorative. The obvious CSV/Anki-CSV import, CSV export, offline support, and isolated sample workspace exist. No provider key or direct model-provider endpoint is embedded.

## What would make this perfect

Remove or rewrite F-4-1 through F-4-7 while retaining the visual drafting system in the nonverbal design. Then rerun the copy audit and the existing claim suite. No behavioural, routing, privacy, demo, accessibility, or test failure was found in this round.
