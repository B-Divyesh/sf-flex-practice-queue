# Adversarial first-read review 8 — Flex Practice Queue

Reviewed 29 August 2026 UTC against production at
https://flex-practice-queue.sociobot.in, commit
c1c7048c124ae593dbd9d37ed10f1d25bb5f66fb.

## Verdict: PASS

There are zero findings. The public build is clear on a cold 390 px first
screen, the one-click sample is usable and isolated, every declared claim was
tested from a fresh clone, and every earlier finding remains fixed in the
deployed artifact and current source.

## Cold first read

Fresh browser contexts were opened at 390 × 844 and 1440 × 1000. Before
scrolling, the first screen supplied all three required answers:

- What it does: build a short flashcard practice round without changing a
  flashcard schedule.
- For whom: learners with spare minutes who want extra practice.
- What to click first: Try it with sample data; adjacent copy says it loads
  eight prompts in a separate demo.

The h1, following sentence, action, and outcome text are all in the initial
mobile viewport. No normal-route console/page errors occurred. The blueprint
grid, drafting controls, and original prompt/timer art match the recorded
visual thesis and are visibly distinct from a generic SaaS template.

## Demo, sandbox, privacy, and offline

The landing action opened /?demo=1 in one click. Its first screen already
showed the product in use: persistent Demo — sample data, nothing is saved
banner, Reset demo, Start for real, a fixed three-prompt preview beginning
“Explain why seasons occur.”, a 30-second setting, and all eight realistic
prompts.

The fresh-clone @claim:demo-sandbox test seeds real prompt, round, plan,
license, and verdict values, then confirms demo mutation, Reset, and Start for
real do not read or change them. The cold public-demo request log contained
only the same-origin document, JS, CSS, and hero image. @claim:local-privacy
records the full demo flow, and @claim:offline-reload reloads the seeded demo
offline after its first visit. Both passed.

## Claims audit

A clean clone at /tmp/fpq-review8.K3jPJW/repo was made from the reviewed commit.
npm ci completed with 24 packages and no reported vulnerabilities. Each exact
.factory/claims.json command passed separately; the full suite passed (28
tests), npm run build created dist/, and Playwright's final record says status:
passed with no failed tests.

| Claim id | Result |
| --- | --- |
| demo-sandbox | Pass |
| offline-reload | Pass |
| local-privacy | Pass |
| csv-readonly | Pass |
| source-schedule-untouched | Pass |
| anki-csv-import | Pass |
| anki-apkg-not-supported | Pass |
| csv-export | Pass |
| mixed-round | Pass |
| saved-plans | Pass |
| data-delete | Pass |
| free-core | Pass |
| paid-price | Pass |
| license-check | Pass |
| license-data-minimization | Pass |

Landing and README trust statements map to these entries: demo isolation,
offline, local data, CSV/Anki CSV, .apkg limitation, schedule preservation,
export, keyboard rounds, deletion, free actions, price/plans, and daily
token-only license checks. No claim-like landing or README sentence is
unlisted.

## Copy audit

Counts are visible whitespace-delimited words. All sentences are ≤22 words.
No banned marketing adjective, unexplained metaphor, inconsistent core term,
vague heading, or non-result-naming control was found.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Extra flashcard practice | 3 | informative label |
| Build a short flashcard practice round | 6 | h1 |
| For learners with spare minutes who want extra practice without changing their flashcard schedule. | 14 | audience/outcome |
| Try it with sample data | 5 | primary action |
| Loads 8 prompts in a separate demo. | 7 | outcome |
| Works offline after the first visit. | 6 | claim |
| Your study data stays in this browser. | 7 | claim |
| Import, tag, practice, and export are free. | 7 | claim |
| Saved round plans cost $9 once. | 6 | claim |
| Choose a few existing flashcards for extra practice. | 8 | art caption |
| Your practice queue | 3 | work-area label |
| Build a round from your prompts | 6 | work-area heading |
| Import a CSV or add one prompt. | 7 | instruction |
| Your imported file is only read. | 6 | claim |
| Add prompts; Import CSV; Columns: prompt, answer, tags. | 2; 2; 4 | step/action/help |
| For Anki, export a front, back, tags CSV first. | 10 | recovery instruction |
| This app cannot read .apkg packages. | 7 | tested limitation |
| Add one prompt; Prompt; Answer | 3; 1; 1 | concrete controls |
| Choose the mix; Use prompts tagged | 3; 3 | concrete labels |
| Show all prompts; Show warm-up prompts; Show weak prompts; Show today’s prompts | 3; 3; 3; 3 | result-naming filters |
| Prompt count; Seconds each | 2; 2 | field labels |
| 0 prompts fit this mix. | 5 | state |
| Start mixed round; View $9 saved plans | 3; 5 | result-naming controls |
| Prompt queue; Export CSV; Delete local data | 2; 2; 3 | clear controls |
| Your queue is empty | 4 | empty-state heading |
| Your tagged prompts will appear here. | 6 | empty-state outcome |
| See the sample queue | 4 | result-naming link |
| How optional practice works | 4 | process heading |
| Import prompts. | 2 | step heading |
| Use a CSV from your flashcard schedule. | 8 | instruction |
| Nothing writes back. | 3 | claim |
| Tag prompts. | 2 | step heading |
| Tag warm-up, weak, or today. | 6 | instruction |
| Pick any mix. | 3 | instruction |
| Run the round. | 3 | step heading |
| Reveal answers at your pace. | 5 | instruction |
| Stop when your window closes. | 5 | instruction |
| Leaves your flashcard schedule alone | 5 | boundary heading |
| This queue does not calculate due dates or rate cards in your flashcard schedule. | 13 | boundary |
| It stores prompts and round notes in this browser. | 9 | storage statement |
| Export your prompts whenever you want. | 6 | instruction |
| Delete them from this device when needed. | 7 | instruction |
| Paid round plans; Save round plans for $9 once | 3; 6 | paid section |
| Import, tag, practice, and export stay free. | 7 | claim |
| A license adds named round plans for repeated routines. | 9 | claim |
| Buy a $9 license | 4 | result-naming action |
| Checkout opens on Sociobot after you choose to buy. | 9 | claim |
| Have a license? Paste it; Verify license; No license is saved. | 5; 2; 4 | clear recovery/state |
| Flex Practice Queue — extra practice without changing your flashcard schedule. | 9 | footer line |
| Built by Param Factory; Original generated artwork | 4; 3 | provenance |

Navigation labels Demo, How it works, Privacy, and Terms are clear route names.
Plan name is the remaining concrete input label. No button says Submit, Go, or
Continue.

### README

| Sentence or heading | Words | Check |
| --- | ---: | --- |
| Flex Practice Queue | 3 | product name |
| Build short flashcard practice rounds without changing your flashcard schedule. | 10 | summary |
| Flex Practice Queue is for learners whose study time comes in short, irregular windows. | 14 | audience |
| It creates separate rounds for warm-ups and weak items. | 9 | outcome |
| Try the isolated sample at https://flex-practice-queue.sociobot.in/demo. | 5 | demo route |
| What it does | 4 | section |
| Imports prompt,answer,tags CSV files and Anki front,back,tags CSV exports. | 7 | import claim |
| Tags prompts as warm-up, weak, or today. | 7 | feature claim |
| Runs timed mixed rounds with Space and arrow-key controls. | 9 | feature claim |
| Exports every prompt as CSV. | 5 | export claim |
| Works offline after the first visit. | 6 | claim |
| Keeps study data in local browser storage. | 7 | claim |
| The app never writes to the selected CSV or your flashcard schedule. | 12 | claim |
| Import, tagging, practice, and CSV export need no license. | 9 | claim |
| Anki .apkg packages are not imported. | 6 | limitation |
| Export a front,back,tags CSV from Anki first. | 7 | recovery |
| A $9 one-time license adds named round plans. | 8 | paid claim |
| Checkout and license checks use the Sociobot billing API. | 9 | billing statement |
| Run locally; Test and build; Data and privacy; Deploy; Project records | 2; 3; 3; 1; 2 | section headings |
| Use Node.js 20 or newer. | 5 | requirement |
| Open http://localhost:4173. | 2 | instruction |
| Open http://localhost:4173/demo for the sample sandbox. | 5 | instruction |
| The build command is exactly npm run build. | 8 | instruction |
| It writes the static site to dist/, with dist/index.html at the root. | 12 | build outcome |
| Claim tests use the bundled demo and CSV fixture. | 9 | test scope |
| The test suite also checks routes, mobile width, console errors, and serious accessibility issues. | 13 | test scope |
| Prompts and round history use IndexedDB. | 6 | storage statement |
| Named plans and a purchased license use localStorage. | 9 | storage statement |
| Demo data uses separate demo: storage. | 5 | isolation statement |
| It never reads, sends, or changes real prompts, plans, or license storage. | 12 | isolation claim |
| Resetting or leaving the demo deletes that sample workspace. | 9 | isolation claim |
| License checks send only the license token to Sociobot. | 9 | privacy claim |
| They run at most once each day. | 7 | quantitative claim |
| See the in-app privacy policy and terms. | 8 | legal links |
| Deploy dist/ as a static site after npm run build. | 10 | deployment instruction |
| The included fallback config serves the app routes through index.html. | 10 | deployment detail |
| The factory owns DNS, billing registration, and production deployment. | 9 | responsibility |
| Do not add secrets to this repository. | 8 | instruction |
| .factory/brief.json records the researched opportunity. | 4 | record purpose |
| .factory/design.md records the blueprint visual system and artwork provenance. | 8 | record purpose |
| .factory/claims.json maps product claims to tests. | 5 | record purpose |
| .factory/demo.md documents sandbox isolation. | 4 | record purpose |
| .factory/handoff.md records verification and known gaps. | 6 | record purpose |
| MIT licensed. | 2 | license |
| Built by Param Factory. | 4 | provenance |

The protected system is consistently flashcard schedule; imported units are
prompts; the try-out is a demo; a reusable paid configuration is a round plan.

## Structure, accessibility, links, and routes

At 390 px, /, /demo, /privacy, and /terms each had the correct per-route title,
one h1, one main landmark, lang="en", description, canonical, OG/Twitter
metadata, favicon, Apple touch icon, and no horizontal overflow. Axe reported
zero serious/critical violations. /missing-review-8 returned HTTP 404 with the
styled page and way home. robots.txt and sitemap.xml returned 200. CSP, HSTS,
nosniff, referrer, and permissions headers are present.

All public links crawled successfully: home, demo, hash route, Privacy, Terms,
Anki export documentation, hosted checkout, and Param Factory returned HTTP 200
after allowed redirects. The deployed asset names match the fresh build. Source
uses History API, updates title/canonical, focuses the new h1, and announces
changes; fresh-clone route, hash-focus, target-size, keyboard, reflow, and
error-recovery tests passed.

## Earlier-finding verification

Every earlier review, polish record, and retained repair handoff was read. Each
finding is confirmed fixed on the live site and current source/tests:

| Earlier id | Current verification |
| --- | --- |
| F-1-1 | Sample preview, tags, timer, and fixed start action are above the 390 px fold. |
| F-1-2 | Unknown route returns the styled document with HTTP 404. |
| F-1-3 | Import/practice/export preserve source data and make no source-schedule request. |
| F-1-4 | Merchant-of-record and refund promises remain absent. |
| F-1-5 | Token-only bodyless license verification is asserted. |
| F-1-6 | Anki CSV imports; .apkg safely gives CSV export guidance. |
| F-1-7 | Visitor copy consistently says flashcard schedule. |
| F-2-1 | Demo and real prompt/round/plan/license storage remain isolated through Reset/exit. |
| F-2-2 | .apkg limitation is claimed and tested with a shipped fixture. |
| F-2-3 | Static 404 has skip link, shell, metadata, legal footer, and return route. |
| F-2-4 | Tag filters name the prompts they show. |
| F-2-5 | Positive rating action says Mark as got it. |
| F-4-1 | First-screen label is Extra flashcard practice. |
| F-4-2 | Artwork caption plainly states its purpose. |
| F-4-3 | First screen names free actions and the $9 paid feature. |
| F-4-4 | Work area is Your practice queue. |
| F-4-5 | Step is Tag prompts; decorative assembly language is absent. |
| F-4-6 | Boundary heading plainly says the schedule is left alone. |
| F-4-7 | Paid section is Paid round plans. |
| F-5-1 | Preview and start action use the same fixed sequence, beginning with seasons. |
| F-6-1 | Hash route scrolls, focuses, and announces its destination after initialization. |
| F-6-2 | Tests measure non-overlapping 44 × 44 px mobile targets. |
| F-6-3 | Plan controls say View $9 saved plans and Load plan settings. |
| F-6-4 | H1 is concrete and has no untestable “useful” adjective. |
| F-7-1 | Demo detection occurs before any license bootstrap/storage access. |
| F-7V-1 | CSV round trip preserves multiline prompt and answer fields. |
| F-7V-2 | Fresh revoked license removes paid controls without reload. |
| F-7V-3 | One-item result says “1 prompt practiced”. |

## Missed leverage

No finding. The brief implies CSV/Anki CSV import, timed practice, export,
local-first privacy, and a non-destructive scheduler boundary; all are present
and tested. AI would not improve this small offline queue-builder’s core job,
so no AI feature is required or missing.

## What would make this perfect

Nothing is required for this release. Preserve the claim-to-test contract and
isolated demo when changing copy, storage, imports, or billing behaviour.

