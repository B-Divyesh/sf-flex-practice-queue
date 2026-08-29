# Flex Practice Queue handoff — independent verification 5

**FAIL — candidate `2f7527bf28dcbc8784884adb76e07906a57fcaae` is not release-ready.**

Verified 2026-08-29 from the clean candidate checkout and against `https://flex-practice-queue.sociobot.in`. No product code was changed. The live deployment is byte-for-byte the candidate, and the previous deployment-only checkout/caching failure is resolved.

## Blocking findings

- **High:** at 200% text size on a 390px viewport, `/` grows to 458px wide and `/demo` to 469px. The headline and core form controls extend offscreen instead of reflowing.
- **Medium:** a whitespace-only manual prompt is silently ignored, leaves stale success text visible, and does not focus or announce an error.
- **Medium:** the Anki help link is 34.72px high and the terms support email is 19px high, below the required 44px touch target.

Exact reproduction evidence and screenshots are in `.factory/evidence/verify-5/`. The full decision record is `.factory/verification-5.md`.

## Passing evidence

- All 15 exact claim commands passed independently.
- `npm test`: 23/23 passed.
- `npm run build`: passed TypeScript and the exact production build; `dist/` produced.
- Cold first read and one-click isolated demo passed.
- Every served artifact matched the candidate by SHA-256.
- Normal 390px and desktop layouts, keyboard round controls, visible focus, reduced motion, and five-route Axe scans passed; Axe serious/critical count was zero.
- Live study flow made only same-origin requests. The explicit license check sent one bodyless token-only GET to Sociobot.
- Checkout returned 303 to hosted Dodo checkout. A 40-request verify burst returned 30 × 200 and 10 × 429; every 429 had `Retry-After: 4`.
- Live offline reload restored all eight prompts. Simulated worker replacement displayed the update notice and reloaded cleanly.
- Lighthouse mobile: 91 performance / 100 accessibility / 100 best practices / 100 SEO; LCP 1.63s, CLS 0.
- Budgets: 30,010-byte JS, 18,530-byte CSS, 105,772-byte hero, no fonts.

## Run and verify

```sh
npm ci
# Run every test command in .factory/claims.json independently.
npm test
npm run build
```

Retest only after the 200% text reflow, whitespace validation, and touch-target regressions are fixed and covered by tests.
