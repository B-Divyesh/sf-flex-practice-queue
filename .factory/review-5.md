# Adversarial first-read review 5 — Flex Practice Queue

**Verdict: FAIL.** Reviewed 2026-08-29 against
`https://flex-practice-queue.sociobot.in` in fresh Chromium contexts at
390 × 844 and 1440 × 1000, and from the clean clone
`/tmp/fpq-review5.ZDNL0y/repo`. One blocking demo finding remains. All 15
declared claim commands, the full 20-test suite, and the production build pass.

## Cold first read

Before scrolling, I understood this as a tool for learners with spare minutes
to build an extra flashcard practice round without changing their flashcard
schedule. I would click **Try it with sample data** first.

The first screen answers all three questions at both widths:

- What it does: **“Build a useful practice round.”**
- Who it is for: **“For learners with spare minutes who want extra practice
  without changing their flashcard schedule.”**
- What to click: **“Try it with sample data,”** followed by **“Loads 8 prompts
  in a separate demo.”**

At 390 px, the action and all three product facts are visible before the 844 px
fold. The document width is exactly 390 px and no console or page error occurs.
The drafting-sheet grid, registration marks, slab/sans type, timer artwork, and
square clipped panels are recognisable and match `.factory/design.md`; this is
not a generic SaaS template.

## Findings

### F-5-1 — BLOCKING — “Start this sample round” starts a different round

**Exact location / quote:** Live `/demo`, the preview is labelled **“Sample
round · 1 of 3”** and shows **“Explain why seasons occur.”** beside the button
**“Start this sample round.”** On two fresh live runs, that button instead
opened a live round whose first prompt was respectively **“What does a pure
function avoid?”** and **“Differentiate x² sin x.”**

**Why this fails:** The primary demo action does not produce the result it
names. A first-time visitor sees one prompt presented as item 1 of a specific
three-item round, then receives a different randomly shuffled item. That makes
the sample preview misleading and weakens the required one-click demo path.
The existing Playwright check only asserts that **Recall the answer** appears;
it does not verify that the displayed sample round is the round that starts.

**Concrete fix:** Make `startSampleRound()` build a fixed three-prompt sample
queue whose first item is the previewed **“Explain why seasons occur.”** Keep
random mixing for **Start mixed round**. Alternatively relabel the preview as
**“Example prompt”** and the button as **“Start a random sample round,”** but do
not call it item 1 of the round. Extend the 390 px demo regression test to read
the preview prompt, click the button, and assert that the live first prompt is
exactly the same text.

## Copy audit

Counts use whitespace-delimited words; URLs, paths, hyphenated terms, and
code-formatted schemas count as one word. Standalone punctuation is not a word.
No landing or README sentence exceeds 22 words. No banned marketing adjective,
inconsistent product term, jargon heading, mood heading, or landing/README
button-label defect remains. F-5-1 concerns the demo action's actual result,
not its grammar.

### Landing page sentences and text alternatives

| Sentence | Words | Check |
| --- | ---: | --- |
| For learners with spare minutes who want extra practice without changing their flashcard schedule. | 14 | Pass |
| Loads 8 prompts in a separate demo. | 7 | Pass |
| Works offline after the first visit. | 6 | Pass |
| Your study data stays in this browser. | 7 | Pass |
| Import, tag, practice, and export are free. | 7 | Pass |
| Saved round plans cost $9 once. | 6 | Pass |
| Prompt cards arranged around a practice timer on blueprint paper. | 10 | Pass; image alt |
| Choose a few existing flashcards for extra practice. | 8 | Pass |
| Import a CSV or add one prompt. | 7 | Pass |
| Your imported file is only read. | 6 | Pass |
| Columns: `prompt, answer, tags`. | 4 | Pass |
| For Anki, export a front, back, tags CSV first. | 9 | Pass |
| This app cannot read .apkg packages. | 7 | Pass |
| 0 prompts fit this mix. | 5 | Pass |
| Import a CSV or add one prompt. | 7 | Pass; empty state |
| Your tagged prompts will appear here. | 6 | Pass; empty state |
| Use a CSV from your flashcard schedule. | 7 | Pass |
| Nothing writes back. | 3 | Pass |
| Tag warm-up, weak, or today. | 5 | Pass |
| Pick any mix. | 3 | Pass |
| Reveal answers at your pace. | 5 | Pass |
| Stop when your window closes. | 5 | Pass |
| This queue does not calculate due dates or rate cards in your flashcard schedule. | 13 | Pass |
| It stores prompts and round notes in this browser. | 9 | Pass |
| Export your prompts whenever you want. | 6 | Pass |
| Delete them from this device when needed. | 7 | Pass |
| Import, tag, practice, and export stay free. | 7 | Pass |
| A license adds named round plans for repeated routines. | 9 | Pass |
| Checkout opens on Sociobot after you choose to buy. | 9 | Pass |
| No license is saved. | 4 | Pass |
| Flex Practice Queue — extra practice without changing your flashcard schedule. | 10 | Pass |

### Landing headings, labels, links, and buttons

| Interface phrase | Words | Check |
| --- | ---: | --- |
| Flex Practice Queue | 3 | Pass |
| Demo / Privacy | 1 / 1 | Pass |
| How it works | 3 | Pass |
| Extra flashcard practice | 3 | Pass |
| Build a useful practice round | 5 | Pass |
| Try it with sample data | 5 | Pass |
| Your practice queue | 3 | Pass |
| Build a round from your prompts | 6 | Pass |
| Add prompts / Import CSV / Add one prompt | 2 / 2 / 3 | Pass |
| Prompt / Answer / Add prompt | 1 / 1 / 2 | Pass |
| Choose the mix / Use prompts tagged | 3 / 3 | Pass |
| Show all prompts / Show warm-up prompts / Show weak prompts / Show today’s prompts | 3 / 3 / 3 / 3 | Pass |
| Prompt count / Seconds each | 2 / 2 | Pass |
| Start mixed round / Save plan · paid | 3 / 3 | Pass |
| Prompt queue 0 / Export CSV / Delete local data | 3 / 2 / 3 | Pass |
| Your queue is empty / See the sample queue | 4 / 4 | Pass |
| How optional practice works | 4 | Pass |
| Import prompts / Tag prompts / Run the round | 2 / 2 / 3 | Pass |
| Leaves your flashcard schedule alone | 5 | Pass |
| Paid round plans | 3 | Pass |
| Save round plans for $9 once | 6 | Pass |
| Buy a $9 license | 4 | Pass |
| Have a license? Paste it / Verify license | 5 / 2 | Pass |
| Terms / Built by Param Factory | 1 / 4 | Pass |
| v1.0.0 · Original generated artwork | 4 | Pass |

### README sentences

| Sentence | Words | Check |
| --- | ---: | --- |
| Build short practice rounds without changing your flashcard schedule. | 9 | Pass |
| Flex Practice Queue is for learners whose study time comes in short, irregular windows. | 14 | Pass |
| It creates separate rounds for warm-ups and weak items. | 9 | Pass |
| Try the isolated sample at `https://flex-practice-queue.sociobot.in/demo`. | 6 | Pass |
| Imports `prompt,answer,tags` CSV files and Anki `front,back,tags` CSV exports. | 9 | Pass |
| Tags prompts as `warm-up`, `weak`, or `today`. | 7 | Pass |
| Runs timed mixed rounds with Space and arrow-key controls. | 9 | Pass |
| Exports every prompt as CSV. | 5 | Pass |
| Works offline after the first visit. | 6 | Pass |
| Keeps study data in local browser storage. | 7 | Pass |
| The app never writes to the selected CSV or your flashcard schedule. | 12 | Pass |
| Import, tagging, practice, and CSV export need no license. | 9 | Pass |
| Anki `.apkg` packages are not imported. | 6 | Pass |
| Export a `front,back,tags` CSV from Anki first. | 7 | Pass |
| A $9 one-time license adds named round plans. | 8 | Pass |
| Checkout and license checks use the Sociobot billing API. | 9 | Pass |
| Use Node.js 20 or newer. | 5 | Pass |
| Open `http://localhost:4173`. | 2 | Pass |
| Open `http://localhost:4173/demo` for the sample sandbox. | 6 | Pass |
| The build command is exactly `npm run build`. | 8 | Pass |
| It writes the static site to `dist/`, with `dist/index.html` at the root. | 12 | Pass |
| Claim tests use the bundled demo and CSV fixture. | 9 | Pass |
| The test suite also checks routes, mobile width, console errors, and serious accessibility issues. | 14 | Pass |
| Prompts and round history use IndexedDB. | 6 | Pass |
| Named plans and a purchased license use localStorage. | 8 | Pass |
| Demo data uses separate `demo:` storage. | 6 | Pass |
| Resetting or leaving the demo deletes that sample workspace. | 9 | Pass |
| License checks send only the license token to Sociobot. | 9 | Pass |
| They run at most once each day. | 8 | Pass |
| See the in-app privacy policy and terms. | 7 | Pass |
| Deploy `dist/` as a static site after `npm run build`. | 10 | Pass |
| The included fallback config serves the app routes through `index.html`. | 10 | Pass |
| The factory owns DNS, billing registration, and production deployment. | 9 | Pass |
| Do not add secrets to this repository. | 7 | Pass |
| `.factory/brief.json` records the researched opportunity. | 5 | Pass |
| `.factory/design.md` records the blueprint visual system and artwork provenance. | 9 | Pass |
| `.factory/claims.json` maps product claims to tests. | 6 | Pass |
| `.factory/demo.md` documents sandbox isolation. | 4 | Pass |
| `.factory/handoff.md` records verification and known gaps. | 6 | Pass |
| MIT licensed. | 2 | Pass |
| Built by Param Factory. | 4 | Pass |

README headings are **Flex Practice Queue** (3), **What it does** (3), **Run
locally** (2), **Test and build** (3), **Data and privacy** (3), **Deploy**
(1), and **Project records** (2). Each names its section without surrounding
context. The command blocks contain `npm ci`, `npm run dev`, `npm test`, and
`npm run build`; they are commands rather than sentences.

Terminology is consistent: protected source system = **flashcard schedule**;
try-out = **demo**; study item = **prompt**; reusable configuration = **round
plan**; paid credential = **license**. No banned word appears.

## Demo and sandbox checks

- The landing action reaches `/?demo=1` in one click.
- At 390 × 844, **“Explain why seasons occur.”** begins at y=406 and **Start
  this sample round** begins at y=488. The persistent banner reads **“Demo —
  sample data, nothing is saved”** and includes **Reset demo** and **Start for
  real**.
- The sample has eight realistic prompts across science, programming,
  language, maths, civics, and economics. A completed mutation changed the
  queue from 8 to 9 prompts; **Reset demo** returned it to 8.
- A real prompt, round record, and exact `fpq:plans` value were seeded before
  demo entry. After reset and **Start for real**, all three real values were
  unchanged, every `demo:` key was absent, the demo IndexedDB database was
  absent, and no sample prompt appeared in real storage.
- The whole live demo flow issued only same-origin requests. A fresh
  service-worker-controlled `/demo` visit reloaded offline with the demo title,
  heading, and all eight prompts.
- F-5-1 is the only demo failure: the previewed first prompt is not the live
  first prompt after its named start action.

## Claims audit

`npm ci` completed in the clean clone with no reported vulnerability. Every
exact command in `.factory/claims.json` ran independently:

| Claim id | Exact command | Result |
| --- | --- | --- |
| demo-sandbox | `npm test -- --grep @claim:demo-sandbox` | Pass |
| offline-reload | `npm test -- --grep @claim:offline-reload` | Pass |
| local-privacy | `npm test -- --grep @claim:local-privacy` | Pass |
| csv-readonly | `npm test -- --grep @claim:csv-readonly` | Pass |
| source-schedule-untouched | `npm test -- --grep @claim:source-schedule-untouched` | Pass |
| anki-csv-import | `npm test -- --grep @claim:anki-csv-import` | Pass |
| anki-apkg-not-supported | `npm test -- --grep @claim:anki-apkg-not-supported` | Pass |
| csv-export | `npm test -- --grep @claim:csv-export` | Pass |
| mixed-round | `npm test -- --grep @claim:mixed-round` | Pass |
| saved-plans | `npm test -- --grep @claim:saved-plans` | Pass |
| data-delete | `npm test -- --grep @claim:data-delete` | Pass |
| free-core | `npm test -- --grep @claim:free-core` | Pass |
| paid-price | `npm test -- --grep @claim:paid-price` | Pass |
| license-check | `npm test -- --grep @claim:license-check` | Pass |
| license-data-minimization | `npm test -- --grep @claim:license-data-minimization` | Pass |

`npm test` passed **20/20**. `npm run build` passed and produced `dist/` with
10.10 kB gzip JavaScript and 4.71 kB gzip CSS. The declared landing and README
product claims map to the entries above; no unlisted landing/README product
claim was found. F-5-1 exposes a missing assertion in the separate demo UI
regression: its current test verifies that a round starts, not that it is the
round shown by the preview.

## Structure, navigation, links, and accessibility

| Route | HTTP | Title | h1 / main | Canonical |
| --- | ---: | --- | --- | --- |
| `/` | 200 | `Flex Practice Queue — Build short practice rounds` | 1 / 1 | `/` |
| `/demo` | 200 | `Demo — Flex Practice Queue` | 1 / 1 | `/demo` |
| `/privacy` | 200 | `Privacy — Flex Practice Queue` | 1 / 1 | `/privacy` |
| `/terms` | 200 | `Terms — Flex Practice Queue` | 1 / 1 | `/terms` |
| unknown path | 404 | `Page not found — Flex Practice Queue` | 1 / 1 | `/404` |

- Every route has `lang="en"`, a plain meta description, favicon, 180 px Apple
  icon, 1200 × 630 original social image, and the consistent header/footer.
  `robots.txt` and `sitemap.xml` include the real routes.
- The static 404 has the product shell, skip link, legal links, recovery action,
  metadata, and a real HTTP 404 response.
- Direct routes load. Privacy navigation focuses its h1; browser Back focuses
  the landing h1. The route status live region is present.
- The crawl found no dead link. Product routes, Anki guidance, and the Param
  Factory link return 200. The checkout endpoint returns 303 to hosted checkout.
  The support address is an explicit `mailto:` link.
- The complete Playwright suite's Axe integration found no serious or critical
  issue. Keyboard skip-link, 390 px width, reduced motion, local asset loading,
  response-header CSP, and console checks pass. No raw AI/provider key or
  provider endpoint is embedded.

## Earlier-finding verification

Every earlier review, polish record, and handoff was read. Each earlier finding
was checked on the live site and in current code, rather than accepted from its
closure note.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: the 390 px demo first screen shows a real prompt, tags, timer, and start action. F-5-1 is a distinct mismatch after that action. |
| F-1-2 | Fixed: an unknown live path returns HTTP 404 with the designed static page. |
| F-1-3 | Fixed: `source-schedule-untouched` covers import, tagging, practice, export, source bytes, and request origin. |
| F-1-4 | Fixed: merchant-of-record and refund assurances remain absent. |
| F-1-5 | Fixed: the license-minimization test asserts the exact bodyless token-only request. |
| F-1-6 | Fixed: `.apkg` is rejected with Anki CSV guidance and a shipped-fixture test. |
| F-1-7 | Fixed: **flashcard schedule** remains the single protected-system term. |
| F-2-1 | Fixed: the sandbox test and live exercise preserve real prompt, round, and plan data through reset and exit. |
| F-2-2 | Fixed: unsupported `.apkg` behaviour is declared and tested. |
| F-2-3 | Fixed: the true 404 includes the accessible shell, metadata, and legal footer. |
| F-2-4 | Fixed: all tag filters use result-naming **Show … prompts** labels. |
| F-2-5 | Fixed: the positive rating action is **Mark as got it**. |
| F-4-1 | Fixed: the hero label is **Extra flashcard practice**. |
| F-4-2 | Fixed: the caption says **Choose a few existing flashcards for extra practice**. |
| F-4-3 | Fixed: the first-screen fact names the four free actions. |
| F-4-4 | Fixed: the section label is **Your practice queue**. |
| F-4-5 | Fixed: the decorative label is absent and the step is **Tag prompts**. |
| F-4-6 | Fixed: the scope-jargon label is absent. |
| F-4-7 | Fixed: the paid section is named **Paid round plans**. |

Review 3 had no findings. No earlier finding is half-fixed or regressed.

## Missed leverage

No additional AI step is implied by the brief. This is a local,
non-destructive selection and timed-rehearsal tool; prompt generation would be
optional content creation, not the core job. The expected import/export path,
Anki CSV guidance, offline use, and isolated demo are present. There is no
decorative AI feature or embedded provider key.

## What would make this perfect

Close F-5-1 by making the displayed sample prompt the actual first prompt of
**Start this sample round**, and add the exact prompt-identity assertion. Then
rerun all 15 claim commands and the full first-read checklist. Nothing else was
found to change.
