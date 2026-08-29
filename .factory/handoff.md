# Flex Practice Queue handoff — adversarial review 6

**FAIL — four findings remain in `.factory/review-6.md`.**

This review changed no product code. It cold-tested the live deployment at
390 × 844 and 1440 × 900, audited landing/README copy, exercised demo reset and
storage isolation, ran every declared claim command from a clean clone,
rechecked all earlier findings, crawled routes and links, checked metadata,
focus, offline behavior, request privacy, accessibility, headers, visual
identity, and missed leverage.

Remaining work:

- F-6-1 (blocking): repair the `/#how` deep link after asynchronous queue
  rendering.
- F-6-2 (medium): enlarge the measured sub-44 px mobile click targets.
- F-6-3 (minor): rename plan controls to match their actual outcomes.
- F-6-4 (minor): replace the untestable “useful” headline adjective.

Verification:

- Clean clone: `/tmp/fpq-review6-VQBxxx`
- All 15 exact `.factory/claims.json` commands: pass
- `npm test`: 20/20 pass
- `npm run build`: pass; `dist/` produced
- Live offline demo reload: pass with eight prompts
- Live same-origin demo request log: pass
- Live Axe: zero violations on app routes and 404
- Worker verifier evidence: `/tmp/fpq-review6-verify-QpzrOG`

Review the report with:

```sh
sed -n '1,420p' .factory/review-6.md
git show --stat --oneline HEAD
```
