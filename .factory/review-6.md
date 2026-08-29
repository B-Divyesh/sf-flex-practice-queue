# Adversarial first-read review 6 — Flex Practice Queue

**Verdict: FAIL.** Reviewed 2026-08-29 against
`https://flex-practice-queue.sociobot.in` in fresh Chromium contexts at
390 × 844 and 1440 × 900, and from the clean clone
`/tmp/fpq-review6-VQBxxx`. One blocking routing defect, one accessibility
defect, and two copy/control defects remain. All 15 declared claim commands,
the full 20-test suite, and the production build pass.

## Cold first read

Before scrolling, I understood this as a tool that builds short extra
flashcard-practice rounds. It is for learners with spare minutes who do not
want to change their main flashcard schedule. I would click **Try it with
sample data** first.

The first screen answers all three questions at both widths:

- What it does: **“Build a useful practice round.”**
- Who it is for: **“For learners with spare minutes who want extra practice
  without changing their flashcard schedule.”**
- What to click: **“Try it with sample data,”** followed by **“Loads 8 prompts
  in a separate demo.”**

At 390 px, the action and all three product facts are visible before the
844 px fold. The document width is 390 px and no console or page error occurs.
The cold first-screen clarity check passes. F-6-4 separately addresses the
headline’s untestable adjective; it does not prevent understanding the job.

## Findings

### F-6-1 — BLOCKING — The `/#how` deep link loses its destination

**Exact location / evidence:** Cold-open
`https://flex-practice-queue.sociobot.in/#how` at 390 × 844. After network
idle and another 500 ms, `#how` starts at y=1086, entirely below the 844 px
viewport, while `scrollY=1756`. At 1440 × 900 it starts at y=437 rather than
the top. Following desktop **How it works** from `/privacy` leaves it at y=738.
In `src/main.ts`, initial `renderRoute()` does not handle `location.hash`, and
the queue expands asynchronously above `#how` after the browser’s native hash
scroll.

**Why this fails:** This is a linked destination and a required deep link. A
visitor opening it on a phone does not see the section they requested. The
site-structure contract classifies broken routing as blocking.

**Concrete fix:** After `activePractice.init()` and all route content has its
final layout, resolve `location.hash`, call `scrollIntoView({ block: 'start' })`,
and focus the destination heading or announce it. Apply this on cold loads,
client navigation, reload, Back, and Forward. Add a 390 × 844 Playwright test
that opens `/#how` directly and from `/privacy`, waits for queue rendering,
and asserts the section heading is inside the viewport and receives the
intended focus/announcement.

### F-6-2 — MEDIUM — Several mobile click targets are under 44 px

**Exact location / evidence:** Live `/` at 390 px, measured rendered boxes:
the home wordmark is 163 × 40 px, **See the sample queue** is 160 × 17 px, and
footer **Privacy**, **Terms**, and **Built by Param Factory** links are 43 × 20,
36 × 20, and 133 × 20 px. `src/style.css` gives 44 px minimums to most buttons
but not these links.

**Why this fails:** These controls are harder to hit accurately with a thumb
and violate the attached accessibility baseline’s 44 px target requirement.
Axe does not test this product requirement, so its clean result does not close
the defect.

**Concrete fix:** Give the wordmark, empty-state action, and footer links a
minimum 44 × 44 px hit area, using `inline-flex`, alignment, and padding without
overlapping adjacent targets. Add a mobile test that checks rendered target
boxes for header, footer, empty-state, and app actions.

### F-6-3 — MINOR — Plan buttons do not name the result they produce

**Exact location / quote:** Fresh landing button **“Save plan · paid”** does
not save a plan. In a license-free context, clicking it leaves the saved-plan
count at zero, scrolls to pricing, and announces “A $9 license adds saved round
plans.” A saved demo plan later has a **“Use plan”** button that only loads its
filter/count/timer settings; it does not start or otherwise use the plan.

**Why this fails:** Both labels make the visitor infer a different outcome.
The plain-words contract requires verbs that name the actual result.

**Concrete fix:** Make the unlicensed action a link labelled **“View $9 saved
plans”** (or **“See the $9 plan option”**) and label the saved-plan action
**“Load plan settings.”** Test that each label matches its observable result.

### F-6-4 — MINOR — “Useful” is an untestable marketing adjective in the headline

**Exact location / quote:** Landing h1: **“Build a useful practice round.”**

**Why this fails:** “Useful” does not say what kind of practice round is built
or provide a measurable outcome. It is also a claim-like quality with no
possible `claims.json` assertion. The nearby copy supplies the missing
flashcard context, but the headline should name the job on its own.

**Concrete fix:** Replace it with **“Build a short flashcard practice round.”**
This remains verb-first, is six words, and names the concrete output without
an evaluative claim. Update the landing heading assertion and title only if
the title wording is intentionally changed.

## Copy audit

Counts treat a hyphenated term, URL, path, number, or code-formatted schema as
one word. Standalone punctuation is not a word. No sentence exceeds 22 words
and no banned term appears. F-6-3 flags two action labels; F-6-4 flags the one
marketing adjective. The consistent terms are **flashcard schedule**, **demo**,
**prompt**, **round plan**, and **license**.

### Landing-page sentences and text alternatives

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
| Demo / How it works / Privacy | 1 / 3 / 1 | Pass |
| Extra flashcard practice | 3 | Pass |
| Build a useful practice round | 5 | F-6-4 |
| Try it with sample data | 5 | Pass |
| Your practice queue | 3 | Pass |
| Build a round from your prompts | 6 | Pass |
| Add prompts / Import CSV / Add one prompt | 2 / 2 / 3 | Pass |
| Prompt / Answer / Add prompt | 1 / 1 / 2 | Pass |
| Choose the mix / Use prompts tagged | 3 / 3 | Pass |
| Show all prompts / Show warm-up prompts / Show weak prompts / Show today’s prompts | 3 / 3 / 3 / 3 | Pass |
| Prompt count / Seconds each / Plan name | 2 / 2 / 2 | Pass |
| Start mixed round | 3 | Pass |
| Save plan · paid | 3 | F-6-3 |
| Prompt queue 0 / Export CSV / Delete local data | 3 / 2 / 3 | Pass |
| Your queue is empty / See the sample queue | 4 / 4 | Pass; F-6-2 is target size only |
| How optional practice works | 4 | Pass |
| Import prompts / Tag prompts / Run the round | 2 / 2 / 3 | Pass |
| Leaves your flashcard schedule alone | 5 | Pass |
| Paid round plans | 3 | Pass |
| Save round plans for $9 once | 6 | Pass |
| Buy a $9 license | 4 | Pass |
| Have a license? Paste it / Verify license | 5 / 2 | Pass |
| Saved round plans / Use plan | 3 / 2 | F-6-3 for Use plan |
| Privacy / Terms / Built by Param Factory | 1 / 1 / 4 | Pass; F-6-2 is target size only |
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
| They run at most once each day. | 7 | Pass |
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
context. The command blocks contain commands rather than sentences.

## Demo and sandbox checks

- The first-screen action enters `/?demo=1` in one click.
- At 390 × 844, the first demo screen shows the persistent **“Demo — sample
  data, nothing is saved”** banner, Reset/exit controls, **“Explain why seasons
  occur.”**, its tags, 30 seconds, and **Start this sample round**.
- The sample contains eight realistic prompts across science, programming,
  language, maths, civics, and economics. The preview action starts the exact
  displayed prompt and then the documented second prompt, **“What does a pure
  function avoid?”**
- A saved demo plan was removed by **Reset demo**, which restored eight
  prompts. **Start for real** removed all `demo:` keys and the
  `demo:flex-practice-queue` IndexedDB database.
- A separately seeded real prompt remained byte-for-byte unchanged after the
  demo mutation, reset, and exit.
- The whole live flow issued only same-origin requests. A fresh
  service-worker-controlled demo reloaded offline with the demo h1 and all
  eight prompts.

The demo requirements pass; none of F-6-1 through F-6-4 weakens sandbox
isolation.

## Claims audit

Every exact command in `.factory/claims.json` ran independently from the clean
clone. All declared tests pass:

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

The landing and README behavioral claims map to these entries: demo isolation,
offline use, local privacy, CSV/Anki behavior, source safety, export, mixed
rounds, deletion, free core, the $9 plan, and license handling. No declared
claim is untested. F-6-4 identifies the remaining unlisted, untestable
evaluative claim and proposes removing it rather than adding a false test.

`npm test` passes 20/20. `npm run build` passes and produces `dist/`; initial
JavaScript is 29.34 kB raw / 10.12 kB gzip and CSS is 18.33 kB raw / 4.71 kB
gzip.

## Earlier-finding verification

Every earlier review, polish record, and handoff was read. Review 3 had no
findings. Each earlier finding was checked in current source and on the live
site rather than accepted from its closure note.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: the 390 px demo first screen shows a real prompt, tags, timer, and start action. |
| F-1-2 | Fixed: an unknown live path returns HTTP 404 with the designed static page. |
| F-1-3 | Fixed: `source-schedule-untouched` covers import, tagging, practice, export, source bytes, and request origin. |
| F-1-4 | Fixed: merchant-of-record and refund assurances remain absent. |
| F-1-5 | Fixed: license minimization asserts the exact bodyless token-only request. |
| F-1-6 | Fixed: `.apkg` is rejected with Anki CSV guidance and a shipped-fixture test. |
| F-1-7 | Fixed: **flashcard schedule** is the single protected-system term in current visitor copy. |
| F-2-1 | Fixed: sandbox behavior and its claim test preserve real prompts, rounds, and plans through reset and exit. |
| F-2-2 | Fixed: unsupported `.apkg` behavior is declared and tested. |
| F-2-3 | Fixed: the HTTP 404 includes the accessible shell, metadata, icons, and legal footer. |
| F-2-4 | Fixed: all tag filters use result-naming **Show … prompts** labels. |
| F-2-5 | Fixed: the positive rating action is **Mark as got it**. |
| F-4-1 | Fixed: the hero label is **Extra flashcard practice**. |
| F-4-2 | Fixed: the caption directly says **Choose a few existing flashcards for extra practice.** |
| F-4-3 | Fixed: the first-screen fact names the four free actions. |
| F-4-4 | Fixed: the work-area label is **Your practice queue**. |
| F-4-5 | Fixed: decorative assembly wording is absent and the step is **Tag prompts**. |
| F-4-6 | Fixed: the scope-jargon label is absent. |
| F-4-7 | Fixed: the paid section is named **Paid round plans**. |
| F-5-1 | Fixed: **Start this sample round** starts the displayed first prompt and the fixed three-prompt sequence. |

None of the four new findings is a regression of an earlier id.

## Structure, links, visual identity, and accessibility

| Route | HTTP | Title | h1 / main | Canonical |
| --- | ---: | --- | --- | --- |
| `/` | 200 | `Flex Practice Queue — Build short practice rounds` | 1 / 1 | `/` |
| `/demo` | 200 | `Demo — Flex Practice Queue` | 1 / 1 | `/demo` |
| `/privacy` | 200 | `Privacy — Flex Practice Queue` | 1 / 1 | `/privacy` |
| `/terms` | 200 | `Terms — Flex Practice Queue` | 1 / 1 | `/terms` |
| unknown path | 404 | `Page not found — Flex Practice Queue` | 1 / 1 | `/404` |

- Every route has `lang="en"`, a description, favicon, 180 px Apple icon,
  1200 × 630 original social image, and the consistent product shell.
  `robots.txt` and `sitemap.xml` list the public routes.
- Privacy client navigation focuses its h1 and announces its title. Back
  restores the landing route, h1 focus, and announcement. F-6-1 is the
  separate hash/deep-link failure.
- Every crawled internal route, Anki guidance, and Param Factory link resolves
  successfully. The checkout endpoint begins with the expected hosted 303 and
  resolves successfully without making a purchase. The support link is an
  explicit `mailto:` address.
- Live response headers contain CSP with response-header `frame-ancestors`,
  `X-Content-Type-Options`, referrer policy, permissions policy, HSTS,
  immutable hashed assets, and `no-cache` for `sw.js`.
- The worker `verify-url.sh` passes: 782 ms load, no console errors, title,
  English language, one h1/main, zero missing alts, and zero unlabeled buttons.
- Live Axe scans report zero violations on `/`, `/demo`, `/privacy`, `/terms`,
  and the designed 404. Reduced motion computes `scroll-behavior: auto` and
  near-zero transition/animation durations. F-6-2 remains because Axe does not
  enforce the 44 px baseline.
- The cyan drafting grid, slab/sans pairing, registration marks, clipped
  outlined panels, red drafting accents, mechanical timer artwork, and
  asymmetric desktop layout match `.factory/design.md`. The 390 px and desktop
  compositions are recognisable and are not a generic SaaS template. Artwork
  provenance and original source are recorded.

## Missed leverage

No extra AI feature is justified by the brief. This is a local,
non-destructive queue-selection and timed-practice tool; generation or
classification would add network/privacy cost without closing the stated job.
CSV and Anki-CSV import, CSV export, offline use, and isolated sample data are
present. Remote sync would contradict the current “retain no educational data
remotely” constraint unless the product scope changed. There is no decorative
runtime AI feature, embedded provider key, Azure endpoint, or direct model
provider call.

## What would make this perfect

Make `/#how` land on and focus the intended section after asynchronous queue
rendering; enlarge every mobile click target to at least 44 px; rename the plan
controls for their actual results; and replace the untestable “useful” headline
with the concrete flashcard output. Then rerun the direct/hash navigation tests,
target-size checks, complete copy audit, all 15 claim commands, full suite, and
the full first-read checklist. Nothing else was found to change.
