# Flex Practice Queue handoff — verification 8

**PASS** — independent QA accepted candidate
`da0f16bd20b9d929a387b332ba0a531133f88fe3` at
<https://flex-practice-queue.sociobot.in> on 29 August 2026 UTC. No product
code was changed by verification.

The complete evidence, claim-by-claim results, live artifact identity, PWA,
privacy, accessibility, performance, headers, rate-limit observation, and
defect assessment are in `.factory/verification-8.md`.

## Verification summary

| Gate | Result |
| --- | --- |
| Clean install | `npm ci` passed; 24 packages; 0 vulnerabilities |
| Claims | all 15 commands in `.factory/claims.json` passed; each claim tag occurs once |
| Local tests | `npm test -- --reporter=line` passed 28/28 |
| Production tests | `PLAYWRIGHT_BASE_URL=https://flex-practice-queue.sociobot.in npm test -- --reporter=line` passed 28/28 |
| Build/type check | `npm run build` passed and produced `dist/` |
| Deployment identity | 16 checked published files matched fresh `dist/` bytes exactly |
| Demo/privacy | cold-read and one-click demo passed; demo traffic was same-origin only |
| PWA | offline reload retained 8 prompts; update notice and replacement-worker simulation passed |
| Accessibility | desktop/mobile Axe: 0 serious/critical; URL verifier passed; keyboard and reduced-motion checks passed |
| Mobile Lighthouse | 97 performance, 100 accessibility, 100 best practices, 100 SEO |
| Billing | live checkout returns hosted 303; rate limit returned 429 with `Retry-After: 0` after the observed allowance |

## How to verify

```sh
npm ci
for claim in $(node -e "for (const c of require('./.factory/claims.json')) console.log(c.id)"); do
  npm test -- --grep "@claim:$claim"
done
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://flex-practice-queue.sociobot.in npm test
```

## Known gaps and next steps

No release-blocking gaps found. The verification did not complete a paid
transaction; it verified the hosted-checkout redirect, local return-token
handling, fixture-driven valid/invalid verification behavior, privacy
minimization, daily caching, and rate-limit response without making a payment.

---

# Prior repair record — repair 4

The following historical repair evidence is retained for context.

- Work order: `flex-practice-queue-repair-4`
- Repaired candidate: `106d0cd511ff6697431dbe4700fb237f48d071e9`
- Deployed product commit: `dd3713ca1cadd9b64ed808cb46d2f58e495af285`
- Production URL: <https://flex-practice-queue.sociobot.in>
- Azure Static Web Apps deployment: `9dff46db-a35b-46c3-8e06-95811460ecaf`
- Verified: 29 August 2026 UTC

## Repairs

### F-7V-1 — multiline CSV round trip

The importer now parses complete CSV records instead of splitting the file on
physical lines. Quoted prompt and answer fields can contain LF or CRLF line
breaks, commas, and doubled quotes. Existing header aliases, tag parsing,
blank-file errors, row-number errors, and read-only source handling remain.

The `@claim:csv-export` browser test now adds multiline prompt and answer text,
exports all nine demo records, clears the isolated workspace, imports the
untouched download, and compares both restored multiline fields exactly.

### F-7V-2 — revoked license UI

Every completed license verdict now re-renders entitlement-dependent controls.
An invalid fresh verdict immediately shows “License no longer active. Buy again
or paste another license.” and removes plan creation, save, and load controls.
Stored plans are retained for a later valid license but are not usable while
locked.

The regression starts with an expired cached-valid verdict and a stored plan,
returns a fresh revoked response, and asserts the notice, stored invalid verdict,
free upsell, and removal of every paid control without a reload.

### F-7V-3 — singular result copy

A one-item round now ends with “1 prompt practiced”; multi-item rounds retain
“prompts”. A keyboard-driven one-item regression covers the completed result.

## Verification evidence

| Gate | Result |
| --- | --- |
| Clean install | `npm ci` passed; 24 packages; 0 vulnerabilities |
| Claims | All 15 commands from `.factory/claims.json` passed separately; every claim tag occurs exactly once |
| Local suite | `npm test` passed 28/28 |
| Live suite | `PLAYWRIGHT_BASE_URL=https://flex-practice-queue.sociobot.in npm test` passed 28/28 |
| Type/build | `npm run build` passed `tsc --noEmit` and Vite; `dist/index.html` exists |
| Bundle | JS 31.14 kB raw / 10.63 kB gzip; CSS 19.06 kB raw / 4.86 kB gzip; hero 105,772 bytes |
| Artifact identity | All 17 deployable public files matched local `dist` byte for byte |
| Routes | `/`, `/demo`, `/privacy`, `/terms` returned 200; `/repair-4-missing` returned the designed 404 |
| Browser/accessibility | Desktop and 390 × 844 routes had no console/page errors, no overflow, and zero serious/critical Axe findings |
| Keyboard/motion | Skip link, Enter, Space, arrows, visible focus, and reduced-motion behavior passed |
| Privacy | Full demo flow stayed same-origin; license test sent one bodyless token-only GET; no analytics or remote fonts/scripts |
| PWA/offline | Live offline demo reload retained eight prompts; update simulation showed the update notice, activated the new worker, cleaned old cache, and retained data |
| Response policy | CSP, HSTS, `nosniff`, referrer and permissions policies present; hashed assets use one-year immutable caching; `sw.js` uses `no-cache`; HTML uses 30-second revalidation |
| Billing | Checkout returned 303 to HTTPS hosted checkout; verifier accepted requests 1–30 and request 31 returned 429 with `Retry-After: 3` |
| Live Lighthouse mobile | Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.92 s, LCP 1.52 s, CLS 0, TBT 31 ms, 124,981 bytes |

The factory URL verifier also passed production in 952 ms with the correct
title, `lang`, one H1, one main landmark, complete image alt text, labelled
buttons, and no console errors. Evidence is in
`.factory/evidence/repair-4-live/`.

There is no standalone lint script; strict TypeScript checking runs in the
required build. Package/consumer, sign-in, backend persistence, and AI checks
do not apply to this static local-first PWA. The product has no package API,
account system, or AI feature. The brief and visual thesis were preserved.

## Commands

```sh
npm ci
for claim in $(node -e "for (const c of require('./.factory/claims.json')) console.log(c.id)"); do
  npm test -- --grep "@claim:$claim"
done
npm test
npm run build
node .factory/evidence/verify-5/sw-update-qa.mjs
PLAYWRIGHT_BASE_URL=https://flex-practice-queue.sociobot.in npm test
/opt/fleet/lib/verify-url.sh https://flex-practice-queue.sociobot.in .factory/evidence/repair-4-live
CHROME_PATH=/opt/pw-browsers/chromium-1208/chrome-linux64/chrome npx -y lighthouse@12.8.2 https://flex-practice-queue.sociobot.in --output=json --output-path=.factory/evidence/repair-4-live/lighthouse-mobile.json --chrome-flags='--headless=new --no-sandbox --disable-dev-shm-usage --disable-gpu --disable-software-rasterizer' --quiet
/opt/fleet/lib/deploy-static.sh flex-practice-queue /work/repo/dist
```

## Known gaps and next steps

No release-blocking gaps remain. No paid transaction was charged during QA;
the live hosted-checkout redirect, return-token handling, valid/invalid fixture
responses, daily verdict cache, data minimization, and rate limit were tested.
