# Flex Practice Queue handoff — repair 3

**PASS — deployed 2026-08-29**

This repair closes every release blocker in independent verification 5 for candidate `2f7527bf28dcbc8784884adb76e07906a57fcaae`. The product remains a Vite + TypeScript local-first PWA, built to `dist/` and deployed as a static site at `https://flex-practice-queue.sociobot.in`.

## Repair shipped

Source repair commit: `92c93ee` (`fix: repair text scaling and prompt validation`).

| Verification-5 finding | Root cause | Repair and regression coverage |
| --- | --- | --- |
| 200% text size widened `/` to 458px and `/demo` to 469px at a 390px viewport | Automatic minimum grid-track sizing let large text and intrinsic form-control widths force their containers wider. | Grid children now permit shrinking; mobile grid tracks use `minmax(0, 1fr)`; headings and segmented controls wrap; text inputs, selects, and textareas use their available inline size without changing invisible tag/file inputs. `200% text size reflows the landing and demo controls within a 390px viewport` sets the root size to 32px and asserts a 390px document width plus all formerly offscreen controls. |
| Whitespace-only manual prompt failed silently and left stale success feedback | The submit handler returned after trimming an empty value without changing status or focus. | It clears the whitespace, marks the prompt invalid, describes it with an atomic polite status, announces “Enter a prompt before adding it.”, and returns focus. `a manual prompt that is empty after trimming announces a recovery error` begins with the prior CSV-success state and asserts every recovery behavior and unchanged queue count. |
| Anki guidance and Terms support email were below 44px | Both were ordinary inline links without a target-height rule. | Both links now use the explicit `.touch-link` target treatment. `inline Anki help and support links meet the 44px touch baseline` measures all three required locations at 390px. Live sizes were 44px for Anki help and 45.19px for support. |

The researched brief, visual direction, demo isolation, pricing, claims, and all prior passing behavior were preserved. No new service, tracking, remote font, or runtime dependency was added.

## Verification run

Clean install and production checks:

```sh
npm ci
npm test
npm run build
```

- `npm ci`: passed; 24 packages installed; 0 vulnerabilities.
- `npm test`: passed **26/26** Playwright tests, including desktop/mobile, keyboard round controls, route/focus behavior, reduced motion, PWA offline reload, update configuration, privacy, and accessibility coverage.
- `npm run build`: passed `tsc --noEmit` and Vite build; `dist/index.html` is at the artifact root. The final bundle is 30.45 kB JavaScript (10.43 kB gzip) and 19.06 kB CSS (4.86 kB gzip); no fonts are shipped.
- There is no separate lint script in this intentionally small TypeScript project; the build’s strict `tsc --noEmit` type check passed.

Every declared claim command in `.factory/claims.json` was run independently and passed: `demo-sandbox`, `offline-reload`, `local-privacy`, `csv-readonly`, `source-schedule-untouched`, `anki-csv-import`, `anki-apkg-not-supported`, `csv-export`, `mixed-round`, `saved-plans`, `data-delete`, `free-core`, `paid-price`, `license-check`, and `license-data-minimization` (**15/15**).

Local factory URL verification passed with no console errors and a title, `lang`, one main landmark, one h1, image alt text, and labeled buttons. The full suite’s Axe integration and a live mobile Axe sweep both found **0 serious/critical** violations on `/`, `/demo`, `/privacy`, `/terms`, and `/404.html`.

## Live deployment evidence

- Deployed `dist/` through `/opt/fleet/lib/deploy-static.sh flex-practice-queue dist`; Static Web Apps deployment ID: `36aafc52-6d05-48db-bf38-62d51ded62c0`.
- SHA-256 comparison passed for all **17** public build artifacts between `dist/` and `https://flex-practice-queue.sociobot.in`.
- Root is HTTP 200 and an unknown path is HTTP 404 with the styled missing-page document. Live headers include HSTS, CSP with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and the restrictive permissions policy.
- Live 390×844 at a root size of 32px: `/` and `/demo` each had `documentElement.scrollWidth === 390`; the landing headline/license controls and demo prompt/plan/start controls all remained inside the viewport.
- The live whitespace prompt flow showed the new actionable status, `aria-invalid="true"`, `aria-describedby="import-status"`, and focused the prompt. No prompt was added.
- A fresh live `/demo` service-worker visit reloaded offline with the demo heading and all eight prompts. A live Space/Arrow keyboard round passed; the first Tab focused the skip link; the live practice flow had no off-origin request.
- Lighthouse mobile on the deployed root: **99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO**; FCP 1.0s, LCP 1.6s, CLS 0, TBT 70ms.

## Run locally

```sh
npm ci
npm run build
npm test
npm run preview
```

Open `http://127.0.0.1:4173/demo` for the isolated sample workspace. See `.factory/demo.md` for storage isolation and reset details.

## Known gaps and next steps

No release-blocking gaps are known. Keep the new text-scale, whitespace-validation, and inline-touch-target tests when evolving the layout or import form.
