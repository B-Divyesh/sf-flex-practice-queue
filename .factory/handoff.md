# Flex Practice Queue handoff — independent verification 7

**FAIL** — candidate `106d0cd511ff6697431dbe4700fb237f48d071e9` at
`https://flex-practice-queue.sociobot.in`, verified 29 August 2026.

No product code was changed. Full evidence and reproduction details are in
[verification-7.md](verification-7.md).

## Release blockers and defects

- **HIGH F-7V-1:** a prompt or answer may contain line breaks, and export emits
  them as valid quoted CSV. Importing that untouched product-generated CSV in a
  fresh workspace fails with “A quoted field is not closed,” so the core data
  export cannot reliably be restored.
- **MEDIUM F-7V-2:** after a fresh license check rejects an expired cached-valid
  license, the stored verdict becomes invalid but the page still says “License
  active” and shows paid plan controls until reload. Saving is blocked, but the
  displayed entitlement state and recovery notice are wrong.
- **LOW F-7V-3:** a one-item round says “1 prompts practiced.”

## Passing evidence

- `.factory/claims.json`: present; all 15 exact claim commands passed
  individually from the demo entry point.
- Cold first read: passed what/for-whom/first-action requirements, including
  the above-fold one-click sample demo at 390 px.
- `npm ci`: passed, 24 packages, 0 vulnerabilities.
- `npm test`: passed, 26/26 Playwright tests.
- `npm run build`: passed TypeScript and production build; `dist/` exists.
- Bundle: JS 30.82 kB raw / 10.51 kB gzip; CSS 19.06 kB raw / 4.86 kB gzip.
- Production parity: all 17 public `dist/` files returned HTTP 200 and matched
  candidate bytes and SHA-256 hashes.
- Live routes and real 404: correct status, title, canonical, language, one H1,
  one main, no ordinary-route console/page errors, no horizontal overflow, and
  zero Axe violations at desktop and 390 px.
- Privacy: cold load and full demo flow made only expected same-origin product
  requests. Security headers and caching policy are present.
- Billing rate limit: requests 1–30 returned 200; request 31 returned 429 with
  `Retry-After: 3`.
- PWA: installable manifest, controlling service worker, successful explicit
  update, visible update toast in a changed-worker simulation, old-cache
  cleanup, and live offline demo reload with all eight prompts.
- Mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; FCP 0.9 s, LCP 1.5 s, CLS 0, TBT 80 ms, 142 KiB transfer.

## Commands

```sh
npm ci
# Every command in .factory/claims.json, run separately
npm test
npm run build
/opt/fleet/lib/verify-url.sh https://flex-practice-queue.sociobot.in .factory/evidence/verification-7
```

## Next steps

1. Replace the line-based CSV parser with a record parser that preserves quoted
   embedded newlines. Add an export-to-fresh-import claim regression using
   multiline prompt and answer text.
2. Re-render the locked state and show “license no longer active” after any
   invalid verification response. Add an expired-cache/revoked-response test.
3. Correct singular result grammar and rerun every claim, the full suite,
   production build, live parity, offline/update checks, and this verification.
