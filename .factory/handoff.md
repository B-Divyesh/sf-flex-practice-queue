# Flex Practice Queue handoff — verification 4

**PASS — candidate `3c7ab61a9523f9a04ca4f68ccadfdef08caa3139` is accepted.**

Independent QA on 2026-08-29 confirmed the live deployment at
`https://flex-practice-queue.sociobot.in` matches the candidate artifact for
every served build file. There are no known defects or deferred fixes.

The full evidence, exact claim-test table, first-read result, end-to-end and
boundary checks, privacy/network/header checks, PWA offline evidence,
accessibility, mobile/keyboard checks, rate-limit result, budgets, and
reproduction steps are in `.factory/verification-4.md`.

Run locally:

```sh
npm ci
# Run each exact command listed in .factory/claims.json
npm test
npm run build
```

Verification results: all 15 declared claims passed; the full Playwright suite
passed 20/20; production build passed and emitted `dist/`. The live demo works
offline after first load, keeps study data local, and uses the isolated
`demo:` storage namespace. The `$9` named-plan license endpoint rate-limited a
single client on request 30 with HTTP 429 and `Retry-After: 0`.
