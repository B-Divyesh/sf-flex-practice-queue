# Flex Practice Queue handoff — adversarial review 2

No product code was changed. I wrote and committed `.factory/review-2.md` after a cold live review at 390 px and desktop, clean-clone claim execution, route/link checks, demo sandbox exercise, history verification, and source inspection.

## Verification performed

- Clean clone: `/tmp/fpq-review2.Gsj6Vn`; `npm ci` completed with 0 vulnerabilities.
- Ran every exact `@claim` command listed in `.factory/claims.json`: all 14 passed.
- `npm test` passed 18/18; `npm run build` produced `dist/`.
- Live checks covered first-read copy, one-click demo, reset, start-for-real isolation, same-origin demo traffic, offline claim coverage, checkout redirect, route titles/focus/back behaviour, internal/external links, 404 HTTP status, and accessibility evidence.

## Review result

The result is **FAIL**. The review contains five findings, including a blocking gap: the declared demo-isolation test does not seed and preserve real data through demo reset and **Start for real**. It also records an unlisted `.apkg` limitation claim, an incomplete static 404 shell/metadata, and two button-label copy fixes.

See `.factory/review-2.md` for exact evidence, required repairs, copy counts, and retest commands.
