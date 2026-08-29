# Flex Practice Queue

Build short flashcard practice rounds without changing your flashcard schedule.

Flex Practice Queue is for learners whose study time comes in short, irregular windows. It creates separate rounds for warm-ups and weak items.

Try the isolated sample at [https://flex-practice-queue.sociobot.in/demo](https://flex-practice-queue.sociobot.in/demo).

## What it does

- Imports `prompt,answer,tags` CSV files and Anki `front,back,tags` CSV exports.
- Tags prompts as `warm-up`, `weak`, or `today`.
- Runs timed mixed rounds with Space and arrow-key controls.
- Exports every prompt as CSV.
- Works offline after the first visit.
- Keeps study data in local browser storage.

The app never writes to the selected CSV or your flashcard schedule. Import, tagging, practice, and CSV export need no license.

Anki `.apkg` packages are not imported. Export a `front,back,tags` CSV from Anki first.

A $9 one-time license adds named round plans. Checkout and license checks use the Sociobot billing API.

## Run locally

Use Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:4173`. Open `http://localhost:4173/demo` for the sample sandbox.

## Test and build

```sh
npm test
npm run build
```

The build command is exactly `npm run build`. It writes the static site to `dist/`, with `dist/index.html` at the root.

Claim tests use the bundled demo and CSV fixture. The test suite also checks routes, mobile width, console errors, and serious accessibility issues.

## Data and privacy

Prompts and round history use IndexedDB. Named plans and a purchased license use localStorage.

Demo data uses separate `demo:` storage. Resetting or leaving the demo deletes that sample workspace.

License checks send only the license token to Sociobot. They run at most once each day.

See the in-app [privacy policy](https://flex-practice-queue.sociobot.in/privacy) and [terms](https://flex-practice-queue.sociobot.in/terms).

## Deploy

Deploy `dist/` as a static site after `npm run build`. The included fallback config serves the app routes through `index.html`.

The factory owns DNS, billing registration, and production deployment. Do not add secrets to this repository.

## Project records

- `.factory/brief.json` records the researched opportunity.
- `.factory/design.md` records the blueprint visual system and artwork provenance.
- `.factory/claims.json` maps product claims to tests.
- `.factory/demo.md` documents sandbox isolation.
- `.factory/handoff.md` records verification and known gaps.

MIT licensed. Built by Param Factory.
