# Adversarial first-read review 2 — Flex Practice Queue

**Verdict: FAIL.** Reviewed 2026-08-28 against `https://flex-practice-queue.sociobot.in` in fresh Chromium contexts at 390 × 844 and 1440 × 1000, and against a clean local clone at `/tmp/fpq-review2.Gsj6Vn`.

## Cold first read

Before scrolling on a phone, this reads as a tool for learners with short spare windows to make an extra flashcard practice round without changing their usual flashcard schedule. I would click **Try it with sample data** first. The first screen supplies all three answers in:

- “Build a useful practice round”
- “For learners with spare minutes who want extra practice without changing their flashcard schedule.”
- “Try it with sample data” and “Loads 8 prompts in a separate demo.”

This passes at 390 px and desktop. The blueprint-sheet identity is recognisable and not a generic SaaS template.

## Findings

### F-2-1 — BLOCKING — The demo-isolation claim does not test real data or the leave-demo path

**Location / quote:** `.factory/claims.json`, `demo-sandbox`: “Try it with eight sample prompts without changing real data.” Its only tagged test (`tests/product.spec.ts`, `@claim:demo-sandbox`) saves a demo plan, checks `demo:fpq:plans` exists and `fpq:plans` does not, then resets the demo. It does not create any real prompt, real round, or real plan; it does not select **Start for real**; and it does not prove that the sample records are absent on return to the real workspace.

**Why this fails:** The required sandbox promise is stronger than a key-prefix spot check. A regression that clears, overwrites, reads, or leaks real prompts/rounds while entering or leaving demo would still pass this claim test. The live manual check currently behaved correctly: a real “Real workspace sentinel” prompt stayed as the sole real prompt after demo, and no sample prompt appeared. That is not a durable clean-demo claim test.

**Concrete fix:** Expand `@claim:demo-sandbox` (or split it into exactly scoped claim tests) to seed a real prompt, round, and `fpq:plans` value; enter `/demo`; mutate and reset demo; select **Start for real**; then assert all real values are byte-for-byte unchanged, no sample value is in the real database, and every demo key/database is removed. Keep the test in a fresh browser context.

### F-2-2 — HIGH — The README and import UI make an unlisted claim about `.apkg` files

**Location / quote:** README: “Anki `.apkg` packages are not read.” In-app import help: “.apkg files are not read.” `.factory/claims.json` has `anki-csv-import`, but no claim or tagged test for the unsupported package format.

**Why this fails:** Whether an Anki package can be used is a material input-format promise a learner relies on. The claim contract requires every claim-like visitor statement to be listed and observably tested. The CSV accept filter is not a clean-demo test that an `.apkg` selection produces the documented limitation safely.

**Concrete fix:** Add an `anki-apkg-not-supported` claim and a tagged Playwright test using a tiny shipped `.apkg`-named fixture. It should assert that no prompts are imported and the exact export-to-CSV guidance appears. Alternatively remove the sentence from README and UI; do not leave the limitation uncontracted.

### F-2-3 — MEDIUM — The static 404 is not part of the required site skeleton

**Location / evidence:** Live `/missing-sheet` correctly returns HTTP 404 and renders the designed blueprint page. Its shipped source, `public/404.html`, has plain-text `<header>Flex Practice<br>Queue</header>` and a one-line footer. It has no skip link; no wordmark home link; no Demo, Privacy, or Terms navigation; no Privacy/Terms/Param Factory/footer version links; no favicon; no canonical; and no Open Graph/Twitter metadata.

**Why this fails:** A broken or mistyped address is still a product route. It drops the visitor out of the consistent navigation and legal routes that every other page supplies, contrary to the required consistent header/footer and metadata checks. The visual 404 repair is real, but it is only a partial route repair.

**Concrete fix:** Give `404.html` the same accessible static shell as the app: skip link, linked wordmark, compact navigation, footer links (Privacy, Terms, Param Factory, version), favicon/apple icon, canonical and social metadata. Retain its current HTTP 404 response and return-home control. Add assertions for those elements on the unknown-route response.

### F-2-4 — MINOR — Tag-filter buttons do not name the result of their action

**Location / quote:** Landing workbench buttons: “Any tag”, “warm-up”, “weak”, and “today”.

**Why this fails:** These are controls, but their names only describe a value. A first-time keyboard or screen-reader visitor has to infer that each filters the queue. This fails the result-naming button rule.

**Concrete fix:** Name the result: **Show all prompts**, **Show warm-up prompts**, **Show weak prompts**, and **Show today’s prompts**. Keep the selected state in `aria-pressed`.

### F-2-5 — MINOR — The round rating control is a status, not an action

**Location / quote:** Live round button: “Got it”.

**Why this fails:** It does not say what pressing it records, unlike **Try again** beside it. The user has to infer whether it advances, marks the item, or ends the round.

**Concrete fix:** Rename it **Mark as got it** (or **Mark correct and continue**) and retain the right-arrow shortcut in the visible key hint.

## Demo, privacy, and offline exercise

- The hero action entered `/?demo=1` in one click. At 390 × 844, “Explain why seasons occur.” began at y=406, inside the first viewport. The page showed eight realistic prompts, the persistent “Demo — sample data, nothing is saved” banner, **Reset demo**, and **Start for real**.
- Starting the preview immediately showed a live “1 of 3” round with the real sample prompt and 30-second timer. Reset restored eight prompts and removed the saved demo plan.
- During the manual demo flow, all observed requests were same-origin; no console or page errors occurred.
- Manual isolation check: seeded one real prompt, entered demo (eight samples), selected **Start for real**, then observed one real prompt, the sentinel still present, and no sample prompt. This is good current behaviour but does not replace F-2-1’s required automated proof.
- The listed `offline-reload` clean-clone test passed. It opens `/demo`, waits for the service worker, sets the browser context offline after first load, reloads, and asserts the demo heading and all eight prompts.

## Claims audit

`npm ci` completed in the clean clone with 0 vulnerabilities. Every exact command declared in `.factory/claims.json` completed successfully from that clone. `npm test` passed 18/18, and `npm run build` completed and produced `dist/`.

| Claim id | Exact command | Result |
| --- | --- | --- |
| demo-sandbox | `npm test -- --grep @claim:demo-sandbox` | Pass, but F-2-1 records the coverage gap |
| offline-reload | `npm test -- --grep @claim:offline-reload` | Pass |
| local-privacy | `npm test -- --grep @claim:local-privacy` | Pass |
| csv-readonly | `npm test -- --grep @claim:csv-readonly` | Pass |
| source-schedule-untouched | `npm test -- --grep @claim:source-schedule-untouched` | Pass |
| anki-csv-import | `npm test -- --grep @claim:anki-csv-import` | Pass |
| csv-export | `npm test -- --grep @claim:csv-export` | Pass |
| mixed-round | `npm test -- --grep @claim:mixed-round` | Pass |
| saved-plans | `npm test -- --grep @claim:saved-plans` | Pass |
| data-delete | `npm test -- --grep @claim:data-delete` | Pass |
| free-core | `npm test -- --grep @claim:free-core` | Pass |
| paid-price | `npm test -- --grep @claim:paid-price` | Pass; live checkout returned HTTP 303 to hosted Dodo checkout |
| license-check | `npm test -- --grep @claim:license-check` | Pass |
| license-data-minimization | `npm test -- --grep @claim:license-data-minimization` | Pass |

The `.apkg` sentence in F-2-2 is the unlisted claim. The other material landing/README statements map to declared claims (offline, local storage/privacy, CSV and Anki CSV import, source schedule, export, mixed rounds, free core, price, and license checks).

## Copy audit

Counts treat a hyphenated term, number, URL, and code-formatted value as one word. This includes headings and controls so the audit does not hide action labels. No entry exceeds 22 words. The non-result button flags are F-2-4 and F-2-5; no banned marketing adjective was found.

### Landing page (`/`, fresh empty workspace)

| Copy | Words | Result |
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
| Add prompts / Import CSV / Add one prompt / Prompt / Answer / Add prompt | 2 / 2 / 3 / 1 / 1 / 2 | Pass |
| Columns: prompt, answer, tags. | 4 | Pass |
| For Anki, export a front, back, tags CSV first; .apkg files are not read. | 14 | F-2-2 |
| Choose the mix / Use prompts tagged | 3 / 3 | Pass |
| Any tag / warm-up / weak / today | 2 / 1 / 1 / 1 | F-2-4 |
| Prompt count / Seconds each / Plan name | 2 / 2 / 2 | Pass |
| 0 prompts fit this mix. | 5 | Pass |
| Start mixed round / Save plan · paid | 3 / 3 | Pass |
| Prompt queue 0 / Export CSV / Delete local data | 3 / 2 / 3 | Pass |
| Your queue is empty | 4 | Pass |
| Import a CSV or add one prompt. | 7 | Pass |
| Your tagged prompts will appear here. | 6 | Pass |
| See the sample queue | 4 | Pass |
| Assembly notes / How optional practice works | 2 / 4 | Pass |
| Import prompts. / Use a CSV from your flashcard schedule. / Nothing writes back. | 2 / 7 / 3 | Pass |
| Mark your intent. / Tag warm-up, weak, or today. / Pick any mix. | 3 / 5 / 3 | Pass |
| Run the round. / Reveal answers at your pace. / Stop when your window closes. | 3 / 5 / 5 | Pass |
| Scope boundary / Leaves your flashcard schedule alone | 2 / 5 | Pass |
| This queue does not calculate due dates or rate cards in your flashcard schedule. | 13 | Pass |
| It stores prompts and round notes in this browser. | 9 | Pass |
| Export your prompts whenever you want. / Delete them from this device when needed. | 6 / 7 | Pass |
| Optional paid tool / Save round plans for $9 once | 3 / 6 | Pass |
| Import, tag, practice, and export stay free. / A license adds named round plans for repeated routines. | 7 / 9 | Pass |
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
| Imports `prompt,answer,tags` CSV files and Anki `front,back,tags` CSV exports. | 13 | Pass |
| Tags prompts as `warm-up`, `weak`, or `today`. | 7 | Pass |
| Runs timed mixed rounds with Space and arrow-key controls. | 9 | Pass |
| Exports every prompt as CSV. | 5 | Pass |
| Works offline after the first visit. | 6 | Pass |
| Keeps study data in local browser storage. | 7 | Pass |
| The app never writes to the selected CSV or your flashcard schedule. | 12 | Pass |
| Import, tagging, practice, and CSV export need no license. | 9 | Pass |
| Anki `.apkg` packages are not read. | 6 | F-2-2 |
| Export a `front,back,tags` CSV from Anki first. | 7 | Pass |
| A $9 one-time license adds named round plans. | 8 | Pass |
| Checkout and license checks use the Sociobot billing API. | 9 | Pass |
| Run locally / Use Node.js 20 or newer. | 2 / 5 | Pass |
| Open `http://localhost:4173`. / Open `http://localhost:4173/demo` for the sample sandbox. | 2 / 6 | Pass |
| Test and build | 3 | Pass |
| The build command is exactly `npm run build`. | 8 | Pass |
| It writes the static site to `dist/`, with `dist/index.html` at the root. | 10 | Pass |
| Claim tests use the bundled demo and CSV fixture. | 9 | Pass |
| The test suite also checks routes, mobile width, console errors, and serious accessibility issues. | 14 | Pass |
| Data and privacy | 3 | Pass |
| Prompts and round history use IndexedDB. | 6 | Pass |
| Named plans and a purchased license use localStorage. | 8 | Pass |
| Demo data uses separate `demo:` storage. | 6 | Pass, with F-2-1 coverage gap |
| Resetting or leaving the demo deletes that sample workspace. | 9 | Pass in manual exercise, with F-2-1 coverage gap |
| License checks send only the license token to Sociobot. | 9 | Pass |
| They run at most once each day. | 8 | Pass |
| See the in-app privacy policy and terms. | 7 | Pass |
| Deploy / Deploy `dist/` as a static site after `npm run build`. | 1 / 10 | Pass |
| The included fallback config serves the app routes through `index.html`. | 10 | Pass |
| The factory owns DNS, billing registration, and production deployment. | 9 | Pass |
| Do not add secrets to this repository. | 7 | Pass |
| Project records | 2 | Pass |
| `.factory/brief.json` records the researched opportunity. | 4 | Pass |
| `.factory/design.md` records the blueprint visual system and artwork provenance. | 8 | Pass |
| `.factory/claims.json` maps product claims to tests. | 5 | Pass |
| `.factory/demo.md` documents sandbox isolation. | 4 | Pass |
| `.factory/handoff.md` records verification and known gaps. | 6 | Pass |
| MIT licensed. / Built by Param Factory. | 2 / 4 | Pass |

Terminology is consistent for the protected system: **flashcard schedule**. The product-specific drawing labels support the recorded blueprint identity and do not obscure the first-screen job statement.

## Structure, routes, links, and accessibility

- Live `/`, `/demo`, `/privacy`, and `/terms` returned 200. Each had one `h1`, one `main`, `lang="en"`, route-appropriate title, description, canonical URL, no console errors, and the standard shell.
- `/missing-sheet` returned HTTP 404 with one `h1`, one `main`, a route title, and a designed recovery action. F-2-3 records its missing shell/metadata elements.
- The live hero/title metadata, social card, favicon, manifest, robots, and sitemap are present for the app shell. The sitemap lists `/`, `/demo`, `/privacy`, and `/terms`.
- Client navigation to Privacy moved focus to its `h1`; Back moved focus to the landing `h1` after route rendering. Route status updates politely. The mobile first Tab reached the skip link; no horizontal overflow or console errors were observed.
- Crawled product links were healthy: internal routes returned 200 (apart from the intentional 404), Anki export guidance returned 200, Param Factory returned 200, and checkout returned HTTP 303 to a hosted Dodo URL. The mail link is explicit.
- The full suite’s Axe scan found no serious or critical violations. No raw provider key or decorative AI feature exists. AI is not a missed leverage item for this deliberately local, non-destructive queue; CSV import/export is present.

## Earlier-finding verification

I read `.factory/review-1.md`, `.factory/polish-1.md`, both verification records, and the prior handoff. Each earlier finding was checked on the current live site and in code.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | Fixed. `/demo` displays the real sample prompt and action above the 390 px first viewport; live measured prompt y=406. |
| F-1-2 | Fixed. Unknown live paths return HTTP 404, backed by `responseOverrides["404"]` and a static `404.html`. F-2-3 is a separate incomplete-shell issue. |
| F-1-3 | Fixed. `source-schedule-untouched` is declared and its clean-demo test imports, tags, practices, stops, exports, checks source bytes, and observes no off-origin request. |
| F-1-4 | Fixed. Merchant-of-record and refund text is absent from paid copy and terms. |
| F-1-5 | Fixed. `license-data-minimization` asserts the one-token bodyless verification request. |
| F-1-6 | Fixed as the permitted honest limitation. The import UI gives Anki CSV export guidance and says `.apkg` is unsupported. F-2-2 requires that material limitation to enter the claims contract. |
| F-1-7 | Fixed. The first screen, product boundaries, footer, README, metadata, and catalog use **flashcard schedule** for the protected system. |

## What would make this perfect

Add a clean, end-to-end real-data-versus-demo isolation test; contract-test the `.apkg` limitation; complete the static 404 shell and metadata; and rename the filter and rating buttons to describe their results. Then rerun every declared claim command, the full suite, build, live offline replay, and this entire first-read audit.
