# Flex Practice Queue — visual thesis

## Direction

The interface is a working blueprint drafting sheet: a precise place to pull a few useful drills from a larger card collection without redrawing its schedule. Fine cyan grid lines, registration marks, clipped corners, pencil annotations, and a movable red drafting tab make the queue feel temporary and intentional. It is a tool bench, not another dashboard.

## Tokens

- `paper` `#F1F5F0`, `surface` `#FAFCF8`, `ink` `#102A43`, `muted` `#52687A`
- `blueprint` `#075985`, `blueprint-dark` `#063B5C`, `grid` `#B8D5DE`
- `mark` `#C53D2F`, `mark-dark` `#8F261D`, `success` `#28734D`, `warning` `#8A5700`
- Dark treatment uses `#071E2B` paper, `#0D2A3A` surface, `#E8F2EF` ink, and `#8BC5D6` grid. The paper treatment is explicit; there is no theme switch in v1.
- Contrast: body ink on paper is above 12:1; muted copy is above 5:1; white on blueprint-dark is above 8:1.

## Type and spacing

The display face is the local system slab stack (`Rockwell`, `Roboto Slab`, `Georgia`) for labels that resemble drawing titles. Body copy uses the local technical sans stack (`Avenir Next`, `Segoe UI`, `Arial`). No font files or remote requests are needed. Numbers use tabular figures. Type steps are 14, 16, 20, 28, and a fluid 42–72 px. Spacing follows an 8 px base with 4 px detail offsets. Reading measures stay below 68 characters.

## Shape and interaction grammar

Panels are drafting regions separated by rules, not generic floating cards. Corners are square with one clipped corner. Controls use 2 px ink outlines and 44 px targets. Selected tags read like colored annotation tape. The queue is shown as numbered drawing callouts connected to a central round dial.

## Motion

The signature motion is a short “drafting slide”: a selected item moves 8 px into the queue over 180 ms, and the timer sweep rotates around its dial. Nothing loops when a round is idle. Under `prefers-reduced-motion`, transforms and smooth scrolling are removed, and timer state changes are shown with text and a static progress ring.

## Original asset plan and provenance

The hero is an original still-life illustration of prompt slips arranged around a mechanical drafting timer on cyan graph paper. It explains mixed practice at a glance and contains no required text. Source candidates live in `assets/src/`; the shipped optimized WebP derivative lives in `public/art/`.

Prompt sheet: “Editorial top-down still life on a pale cyan architectural blueprint sheet; a compact mechanical practice timer, six blank cream prompt cards, red and navy drafting tabs, steel ruler marks, precise ink construction lines, subtle paper grain, morning window light, 50mm product lens, restrained navy/cyan/vermilion palette, practical educational tool, no people, no hands, no readable text, no logos, no watermark, no gradient, no UI screenshot.”

Generated with the factory Azure image deployment (`gpt-image-1` class) on 2026-08-28. The artwork is original to this product. It is decorative product art, not evidence of a feature. Hand-authored SVG icons and marks are MIT-licensed with the repository.

## Responsive behavior

At 390 px, the artwork becomes a compact header plate, the builder controls stack, and the practice action sits after the prompt instead of floating. Nonessential blueprint measurements disappear. Desktop uses an asymmetric 7/5 drafting grid so the working queue, not the marketing copy, gets the widest region.
