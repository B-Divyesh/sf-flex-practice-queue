# Flex Practice Queue handoff — independent verification 6

**PASS** — candidate `40af16d2e16c220c9ac32dc1571f9386fc144d1c` verified on 2026-08-29 at `https://flex-practice-queue.sociobot.in`.

No product code was changed during this verification. The previous deployment-only concern is resolved by fresh evidence: all 17 public `dist/` artifacts match the live site byte-for-byte (SHA-256).

## What was verified

- Clean `npm ci` passed (24 packages, 0 vulnerabilities).
- Every one of the 15 commands declared in `.factory/claims.json` passed individually from the demo entry point.
- `npm test` passed 26/26 Playwright tests and `npm run build` passed, including the TypeScript check. The production bundle is 10.43 kB gzip JS and 4.86 kB gzip CSS.
- Cold live first read clearly states the job, intended learner, and the one-click sample demo. The click opens an isolated eight-prompt demo with the persistent “nothing is saved” banner.
- Live normal, boundary, invalid, and recovery paths passed: tagged/timed Space-and-arrow practice, CSV export, limited matching prompt set, malformed CSV, `.apkg` guidance, and whitespace prompt validation.
- Privacy request logs contained only the product origin during demo practice/export. No tracking, third-party code, remote fonts, or study data transfer was observed.
- `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` have correct landmarks/titles and zero live Axe serious/critical issues. Desktop and 390px mobile passed no-overflow, skip-link, focus, and reduced-motion checks.
- The service worker activated and controlled a fresh context. After its initial visit, `/demo` reloaded offline with all eight prompts. The worker has `skipWaiting`/`clientsClaim`, update notification code, and a no-cache service-worker response.
- Live headers include CSP, HSTS, nosniff, referrer, and permissions protections. Hashed assets are immutable. The Sociobot license verifier allowed 30 invalid requests and returned `429 Retry-After: 4` on request 31.
- Lighthouse mobile: 96 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.6 s and CLS 0.

## How to run

```sh
npm ci
npm test
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/demo` for the isolated sample workspace. See `.factory/demo.md` for its storage namespace and reset behavior.

## Known gaps and next steps

No release-blocking defects or known product gaps were found. Maintain the claim tests, static artifact parity, PWA offline/update checks, and 390px/200% text checks when the app changes.

Detailed independent evidence is in `.factory/verification-6.md`.
