# Flex Practice Queue handoff — polish round 7

Released repair: `7169e1b6d90bc9070cf41aa84929de18283abbb9`.

Production deployment: `42499b8d-cf84-4d62-b916-2799641c2a93` at
`https://flex-practice-queue.sociobot.in`.

## What changed

- Closed F-7-1: demo-mode detection now happens before any license bootstrap.
  While the demo banner is shown, the app does not read, send, or write real
  prompt, round, plan, license, or license-verdict data. A returned `license`
  URL value is preserved for the explicit **Start for real** transition only.
- Strengthened the `demo-sandbox` claim test to seed and compare exact real
  IndexedDB, plans, license, and verdict values; instrument real license-key
  access; check both demo URLs; reset and leave demo; and prove the
  returned-license path activates only after the real transition.
- Moved both license claims to the real workspace, updated demo/privacy docs,
  completed the copy audit, and updated the verb-first catalog description.
- Retained and rechecked every earlier repair: mobile first screen, real 404,
  source-schedule protection, payment wording, Anki CSV path, names and copy,
  demo sample consistency, hash focus, targets, plan labels, metadata, legal
  routes, offline behavior, and the blueprint drafting visual identity.

## How to run and verify

```sh
npm ci
npm test
npm run build
```

Open `http://localhost:4173/?demo=1` for the isolated sample. The demo banner
offers **Reset demo** and **Start for real**. The static deployment artifact is
`dist/`, with `dist/index.html` at its root.

## Exact verification evidence

- Fresh clean clone: `/tmp/fpq-polish7-final.rcRwhh/repo` at repair commit
  `7169e1b6d90bc9070cf41aa84929de18283abbb9`.
- `npm ci`: passed, 24 packages, 0 vulnerabilities.
- Each of the 15 exact `.factory/claims.json` commands: passed independently.
  This includes offline reload, local privacy, source-schedule preservation,
  Anki CSV and `.apkg` handling, import/export, mixed keyboard round, plans,
  deletion, free core, paid-price redirect, both real-route license claims, and
  the strengthened full demo isolation test.
- `npm test`: 26/26 passed. It includes browser, mobile, accessibility, focus,
  metadata, touch-target, privacy, and offline checks.
- `npm run build`: passed. `dist/index.html` exists; initial JS is 30.82 kB
  raw / 10.51 kB gzip and CSS is 19.06 kB raw / 4.86 kB gzip.
- Production deploy: `/opt/fleet/lib/deploy-static.sh flex-practice-queue dist`
  succeeded with deployment id `42499b8d-cf84-4d62-b916-2799641c2a93`.
- Cold production verifier: `evidence/polish-7-live/verify.json` records
  HTTPS 200, 856 ms load, no console errors, title/lang/main, image alt text,
  and labelled buttons. `cold-landing-mobile.png`, `cold-demo-mobile.png`, and
  `cold-404-mobile.png` are visual evidence.
- Live browser/Axe check: `evidence/polish-7-live/live-check.json` records
  zero serious/critical violations on `/`, `/demo`, `/privacy`, `/terms`, and
  404; correct titles/canonicals/landmarks; hash focus; and 44 px targets.
  `404.headers` records HTTP 404 for the unknown path.
- Live demo boundary: the same report seeds an exact real license and verdict,
  opens both `/?demo=1` and `/demo?license=returned-live-license`, and records
  zero license-key reads/writes and zero off-origin requests while demo is
  visible. The preview is above the fold and its started prompt matches.
- Mobile Lighthouse: `lighthouse-mobile.json` records 100 performance, 100
  accessibility, 100 best practices, 100 SEO; FCP 0.9 s, LCP 1.6 s, CLS 0, and
  TBT 0 ms.

## Known gaps and next steps

None. The product remains a static, local-first PWA; deployment infrastructure,
DNS, and billing registration stay factory-owned.
