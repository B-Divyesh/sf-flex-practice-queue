# Flex Practice Queue handoff — polish round 2

Final deployed commit: `b79995686e9afbc5dfdb9351820097e854c43975` on `main`.
Live URL: https://flex-practice-queue.sociobot.in

All findings in `.factory/review-1.md` and `.factory/review-2.md` are closed. The full finding-to-change-to-evidence map is in `.factory/polish-2.md`.

## What changed

- The demo claim now proves real-data isolation end to end, including reset and **Start for real**.
- The unsupported Anki `.apkg` path is explicit, safe, and listed/tested in `.factory/claims.json`.
- The real 404 has the complete product shell and route metadata.
- Filter and round-rating controls name their results.
- A live-only PWA check found and fixed service-worker registration and precache issues. The deployed worker now controls a fresh page and live offline demo reload retains all eight prompts.
- Catalog description is now the verb-first 64-character sentence: “Practice spare minutes without changing your flashcard schedule.”

## Verification evidence

- Final clean clone: `/tmp/fpq-polish-2-final.2edDdg` at `b79995686e9afbc5dfdb9351820097e854c43975`.
- `npm ci`: passed, 0 vulnerabilities.
- Every exact claim command in `.factory/claims.json` passed independently from that clean clone: `demo-sandbox`, `offline-reload`, `local-privacy`, `csv-readonly`, `source-schedule-untouched`, `anki-csv-import`, `anki-apkg-not-supported`, `csv-export`, `mixed-round`, `saved-plans`, `data-delete`, `free-core`, `paid-price`, `license-check`, and `license-data-minimization`.
- `npm test`: passed 19/19 Playwright tests, including Axe serious/critical checks, metadata/routes, mobile width, privacy, and offline behavior.
- `npm run build`: passed and produced `dist/index.html`. Final bundle: JS 29.36 KB (10.15 KB gzip), CSS 18.33 KB (4.71 KB gzip), hero image 104 KB.
- Static deployment used `/opt/fleet/lib/deploy-static.sh flex-practice-queue dist`; the live site serves final asset `index-CQ0PpQTU.js`.
- `/opt/fleet/lib/verify-url.sh` live result: title present, `lang=en`, one h1, main landmark, no images missing alt, no unlabeled buttons, and no console errors. See [verify.json](evidence/polish-2-live/verify.json) and [screenshots](evidence/polish-2-live/).
- Cold live browser checks: `/?demo=1` has the sample prompt above the 390×844 fold, proper banner/reset/exit, APKG rejection guidance, result-named controls, no demo off-origin requests, and no serious/critical Axe issues. `/missing-sheet` returns HTTP 404 with the full shell and no serious/critical Axe issues; see [404.headers](evidence/polish-2-live/404.headers).
- Live PWA check: fresh active controlling worker, then offline `/demo` reload retained all 8 sample prompts.
- Mobile live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 954 ms and CLS 0. See [lighthouse-mobile.json](evidence/polish-2-live/lighthouse-mobile.json).

## Known gaps

None.
