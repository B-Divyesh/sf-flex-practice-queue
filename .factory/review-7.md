# Adversarial first-read review 7 — Flex Practice Queue

**Verdict: FAIL.** Reviewed 2026-08-29 against `https://flex-practice-queue.sociobot.in` in fresh Chromium contexts at 390 × 844 and 1440 × 1000, and against clean clone `/tmp/fpq-review7.gxAkcl/repo` at `29a19f6aa4698113fd348eb234b356c650247461`. One blocking sandbox defect remains. No product code was changed.

## Cold first read

Before scrolling, I understood this as a tool that builds short extra flashcard-practice rounds for learners with spare minutes, without changing their main flashcard schedule. I would click **Try it with sample data** first.

The first screen answers all three questions at both widths:

- What it does: **“Build a short flashcard practice round.”**
- Who it is for: **“For learners with spare minutes who want extra practice without changing their flashcard schedule.”**
- What to click: **“Try it with sample data,”** followed by **“Loads 8 prompts in a separate demo.”**

At 390 px, the headline, audience sentence, action, outcome, and all three facts end at y=794 within the 844 px viewport. The document width is 390 px. The desktop first screen also contains all three answers. This check passes.

## Finding

### F-7-1 — BLOCKING — Demo mode reads, sends, and updates real license data

**Exact quote/location:** The live banner says **“Demo — sample data, nothing is saved.”** However, `src/main.ts:277-281` calls `captureLicense()`, `hasSavedLicense()`, and `verifyLicense()` globally without excluding `/demo`. `src/license.ts:25-38` reads the real `sb_license:flex-practice-queue` key, calls the Sociobot verification endpoint, and writes the real `sb_license:flex-practice-queue:verdict` key. The declared license tests reinforce the conflict: `tests/product.spec.ts:467-470` expects `/demo?license=test-license` to persist a real license, while lines 484-491 deliberately trigger a real-license check from `/demo`.

**Live evidence:** In a fresh context, I stored `sb_license:flex-practice-queue=review-7-license`, removed its verdict, intercepted the verification response, and opened `/demo`. While the demo banner was visible, the page made:

`GET https://api.sociobot.in/api/v1/products/flex-practice-queue/verify?license=review-7-license`

It then wrote the real key `sb_license:flex-practice-queue:verdict={"valid":true,"checkedAt":…}`. The prompt/round/plan exercise otherwise remained isolated: demo count changed 8 → 9 → 8, the real prompt/round/plan snapshot was byte-for-byte unchanged, **Start for real** removed all `demo:` keys and the demo database, and the real sentinel remained.

**Why this fails:** The demo contract says that real data is never read or written while the banner is shown. A visitor with a saved license gets a real-account read, an off-origin request, and a real-storage write merely by opening the demo. The passing `demo-sandbox` test does not cover the product's license keys, so it can certify isolation while the observable claim is false.

**Concrete fix:** Determine demo mode before license bootstrap. While in demo, do not call `captureLicense`, `hasSavedLicense`, `hasLicense`, `verifyLicense`, or `saveLicense`, and do not read or write any `sb_license:flex-practice-queue*` key. Handle a `license` query only after an explicit transition to the real workspace. Move `@claim:license-check` and `@claim:license-data-minimization` to the real route. Extend `@claim:demo-sandbox` to seed exact real license and verdict values, open both `/demo` and `/demo?license=fixture`, assert no `api.sociobot.in` request, and confirm both real keys remain byte-for-byte unchanged through reset and **Start for real**.

## Copy audit

Counts treat a URL, path, code token, number, and hyphenated term as one word; standalone punctuation is not a word. All fresh-landing and README copy is listed below. No item exceeds 22 words, contains a banned marketing term, changes the established terminology, or uses a non-result-naming action. F-7-1 concerns the separate demo banner's false behavior, not landing or README grammar.

### Landing sentences and text alternative

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
| This app cannot read `.apkg` packages. | 6 | Pass |
| 0 prompts fit this mix. | 5 | Pass |
| Import a CSV or add one prompt. | 7 | Pass; empty state |
| Your tagged prompts will appear here. | 6 | Pass; empty state |
| Use a CSV from your flashcard schedule. | 7 | Pass |
| Nothing writes back. | 3 | Pass |
| Tag warm-up, weak, or today. | 5 | Pass |
| Pick any mix. | 3 | Pass |
| Reveal answers at your pace. | 5 | Pass |
| Stop when your window closes. | 5 | Pass |
| This queue does not calculate due dates or rate cards in your flashcard schedule. | 14 | Pass |
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
| Demo / How it works / Privacy | 1 / 3 / 1 | Pass |
| Extra flashcard practice | 3 | Pass |
| Build a short flashcard practice round | 6 | Pass |
| Try it with sample data | 5 | Pass |
| Your practice queue | 3 | Pass |
| Build a round from your prompts | 6 | Pass |
| Add prompts / Import CSV / Add one prompt | 2 / 2 / 3 | Pass |
| Prompt / Answer / Add prompt | 1 / 1 / 2 | Pass |
| Choose the mix / Use prompts tagged | 3 / 3 | Pass |
| Show all prompts / Show warm-up prompts / Show weak prompts / Show today’s prompts | 3 / 3 / 3 / 3 | Pass |
| Prompt count / Seconds each | 2 / 2 | Pass |
| Start mixed round / View $9 saved plans | 3 / 4 | Pass |
| Prompt queue 0 / Export CSV / Delete local data | 3 / 2 / 3 | Pass |
| Your queue is empty / See the sample queue | 4 / 4 | Pass |
| How optional practice works | 4 | Pass |
| Import prompts / Tag prompts / Run the round | 2 / 2 / 3 | Pass |
| Leaves your flashcard schedule alone | 5 | Pass |
| Paid round plans / Save round plans for $9 once | 3 / 6 | Pass |
| Buy a $9 license | 4 | Pass |
| Have a license? Paste it / Verify license | 5 / 2 | Pass |
| Privacy / Terms / Built by Param Factory | 1 / 1 / 4 | Pass |
| v1.0.0 · Original generated artwork | 4 | Pass |

State-dependent result labels also pass: **Save round plan** (3), **Load plan settings** (3), **Start this sample round** (5), **Reveal answer** (2), **Try again** (2), **Mark as got it** (4), **Stop round** (2), and **Build another round** (3).

### README sentences

| Sentence | Words | Check |
| --- | ---: | --- |
| Build short flashcard practice rounds without changing your flashcard schedule. | 10 | Pass |
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
| Demo data uses separate `demo:` storage. | 6 | Pass; F-7-1 covers non-demo license access during demo |
| Resetting or leaving the demo deletes that sample workspace. | 9 | Pass |
| License checks send only the license token to Sociobot. | 9 | Pass |
| They run at most once each day. | 7 | Pass |
| See the in-app privacy policy and terms. | 7 | Pass |
| Deploy `dist/` as a static site after `npm run build`. | 10 | Pass |
| The included fallback config serves the app routes through `index.html`. | 10 | Pass |
| The factory owns DNS, billing registration, and production deployment. | 9 | Pass |
| Do not add secrets to this repository. | 7 | Pass |
| `.factory/brief.json` records the researched opportunity. | 5 | Pass |
| `.factory/design.md` records the blueprint visual system and artwork provenance. | 9 | Pass |
| `.factory/claims.json` maps product claims to tests. | 6 | Pass |
| `.factory/demo.md` documents sandbox isolation. | 4 | Pass; its absolute isolation statement is contradicted by F-7-1 |
| `.factory/handoff.md` records verification and known gaps. | 6 | Pass |
| MIT licensed. | 2 | Pass |
| Built by Param Factory. | 4 | Pass |

README headings are **Flex Practice Queue** (3), **What it does** (3), **Run locally** (2), **Test and build** (3), **Data and privacy** (3), **Deploy** (1), and **Project records** (2). Each names its section without surrounding context. Terminology is consistent: **flashcard schedule**, **demo**, **prompt**, **round plan**, and **license**.

## Demo, privacy, and offline exercise

- The hero action entered `/?demo=1` in one click.
- At 390 × 844, the banner occupied y=0–73, the realistic prompt **“Explain why seasons occur.”** was at y=406, and **Start this sample round** ended at y=537. The prompt, its `weak`/`today` tags, 30-second setting, and action were visible without scrolling.
- The action started the exact displayed prompt. The eight samples cover science, programming, language, maths, civics, and economics.
- Adding a demo prompt changed the count 8 → 9. **Reset demo** restored 8. **Start for real** removed all `demo:` keys and `demo:flex-practice-queue`; the separately seeded real prompt, round, and `fpq:plans` value were unchanged.
- The ordinary no-license demo flow issued only same-origin requests. A service-worker-controlled `/demo` reloaded offline with all eight prompts.
- F-7-1 is the failing boundary: with a real saved license, opening `/demo` contacts Sociobot and changes the real license-verdict key.

## Claims audit

After `npm ci` in the clean clone, every exact command in `.factory/claims.json` ran independently:

| Claim id | Result |
| --- | --- |
| demo-sandbox | Pass; insufficient license-state coverage causes F-7-1 |
| offline-reload | Pass |
| local-privacy | Pass; fresh no-license path only |
| csv-readonly | Pass |
| source-schedule-untouched | Pass |
| anki-csv-import | Pass |
| anki-apkg-not-supported | Pass |
| csv-export | Pass |
| mixed-round | Pass |
| saved-plans | Pass |
| data-delete | Pass |
| free-core | Pass |
| paid-price | Pass; endpoint returned 303 to hosted checkout |
| license-check | Pass; its `/demo` setup demonstrates the isolation conflict |
| license-data-minimization | Pass; its `/demo` setup also demonstrates the isolation conflict |

`npm test` passed 26/26. `npm run build` passed and produced `dist/`; initial JavaScript is 30.45 kB raw / 10.43 kB gzip and CSS is 19.06 kB raw / 4.86 kB gzip. The built `index.html`, JS, CSS, `404.html`, and `sw.js` match the live files byte-for-byte by SHA-256. No other unlisted product claim was found.

## Earlier-finding verification

Every earlier review, polish record, and handoff was read. Each earlier finding was checked in current source and on the live site.

| Earlier id | Current verification |
| --- | --- |
| F-1-1 | Fixed: the live 390 px demo first screen shows a real prompt, tags, timer, and start action. |
| F-1-2 | Fixed: `/missing-review-7` returned HTTP 404 with the designed static page. |
| F-1-3 | Fixed: the declared schedule-safety test covers import, tagging, practice, export, fixture bytes, and request origin. |
| F-1-4 | Fixed: merchant-of-record and refund assurances remain absent. |
| F-1-5 | Fixed: the minimization test asserts the bodyless, token-only verification request. |
| F-1-6 | Fixed by the accepted honest limitation: `.apkg` is rejected with direct Anki CSV export guidance and a fixture test. |
| F-1-7 | Fixed: **flashcard schedule** remains the single protected-system term. |
| F-2-1 | Fixed for its specified prompt/round/plan and leave-demo scope. F-7-1 identifies the distinct omitted real-license namespace. |
| F-2-2 | Fixed: unsupported `.apkg` behavior is declared and tested. |
| F-2-3 | Fixed: the true 404 has the accessible shell, metadata, icons, and legal footer. |
| F-2-4 | Fixed: all tag filters use result-naming **Show … prompts** labels. |
| F-2-5 | Fixed: the positive rating action is **Mark as got it**. |
| F-4-1 | Fixed: the first-screen label is **Extra flashcard practice**. |
| F-4-2 | Fixed: the caption says **Choose a few existing flashcards for extra practice.** |
| F-4-3 | Fixed: the first-screen fact names the four free actions. |
| F-4-4 | Fixed: the work-area label is **Your practice queue**. |
| F-4-5 | Fixed: decorative assembly wording is absent and the step is **Tag prompts**. |
| F-4-6 | Fixed: scope jargon is absent and the section names the flashcard-schedule boundary. |
| F-4-7 | Fixed: the paid section is **Paid round plans**. |
| F-5-1 | Fixed: the preview and live sample round both start with **Explain why seasons occur.** |
| F-6-1 | Fixed: cold `/#how`, navigation from `/privacy`, and Back focus **How optional practice works** after queue initialization. |
| F-6-2 | Fixed: the live visible mobile controls measured at least 44 × 44 px with no overlap. |
| F-6-3 | Fixed: the actions are **View $9 saved plans** and **Load plan settings**. |
| F-6-4 | Fixed: the h1 is **Build a short flashcard practice round**; the old evaluative headline is absent. |

Review 3 had no findings. None of the earlier IDs regressed within its stated repair scope.

## Structure, links, identity, and accessibility

| Route | HTTP | Title | h1 / main | Canonical |
| --- | ---: | --- | --- | --- |
| `/` | 200 | `Flex Practice Queue — Short flashcard practice rounds` | 1 / 1 | `/` |
| `/demo` | 200 | `Demo — Flex Practice Queue` | 1 / 1 | `/demo` |
| `/privacy` | 200 | `Privacy — Flex Practice Queue` | 1 / 1 | `/privacy` |
| `/terms` | 200 | `Terms — Flex Practice Queue` | 1 / 1 | `/terms` |
| unknown path | 404 | `Page not found — Flex Practice Queue` | 1 / 1 | `/404` |

- All routes have `lang="en"`, a description, canonical, Open Graph/Twitter image metadata, SVG favicon, Apple touch icon, skip link, and consistent header/footer with Privacy and Terms. `robots.txt` and `sitemap.xml` are valid and list the four public routes.
- The link crawl found no dead link. Product and documentation links returned 200; checkout returned its expected 303; the support address is explicit `mailto:`.
- Client route changes focus and announce the destination h1. Cold `/#how`, navigation from Privacy, and Back restore the hash destination after asynchronous queue rendering.
- Live Axe scans found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, and the static 404. The factory URL verifier passed in 755 ms with no landing console errors, one h1/main, English language, complete alt text, and labelled buttons. The only 404 console message was the browser's expected failed-navigation resource for the deliberate HTTP 404.
- The cyan drafting grid, slab/sans pairing, registration marks, clipped outlined panels, red drafting accents, timer still life, and asymmetric desktop layout match `.factory/design.md`. The site is visually distinct from a generic SaaS template.

## Missed leverage

No AI feature is justified by the brief. This local queue-selection and timed-recall job does not require generation or classification, and a model call would weaken the offline/privacy boundary. CSV and Anki-CSV import, CSV export, offline use, and the isolated prompt workspace are present. Remote sync conflicts with the brief's instruction to retain no educational data remotely. No decorative AI control, embedded key, Azure endpoint, or direct model-provider call is present.

## What would make this perfect

Close F-7-1 so demo mode never reads, transmits, or updates any real license state, and make the isolation claim test cover every real storage namespace and a returned-license URL. Then rerun all 15 claim commands, the full suite, the live saved-license demo request log, and this complete first-read checklist. Nothing else was found to change.
