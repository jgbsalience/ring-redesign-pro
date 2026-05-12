# WCAG 2.1 quick checklist (A / AA)

Use as a scan list during implementation or review. Not exhaustive; map items to success criteria when reporting.

## Perceivable

- [ ] **Text alternatives**: Informative images have appropriate `alt`; decorative images/icons hidden from AT or `alt=""` as intended.
- [ ] **Non-text contrast (AA 1.4.11)**: UI parts needed to understand or operate the page (e.g. icons, graph lines, focus rings) meet contrast against adjacent colors where applicable.
- [ ] **Contrast (AA 1.4.3)**: Normal text roughly 4.5:1; large text roughly 3:1 (verify with tooling when close).
- [ ] **Resize (AA 1.4.4)**: Content usable at ~200% zoom without loss of function (no clipped-only-by-zoom critical controls).
- [ ] **Reflow (AA 1.4.10)**: No horizontal scroll requirement for essential reading at typical viewport widths (unless table/map exceptions).
- [ ] **Motion (A 2.3.3)**: Essential animation respects reduced motion preference where feasible.

## Operable

- [ ] **Keyboard (A 2.1.1)**: All functionality available from keyboard; no stuck focus except intentional modal with documented escape.
- [ ] **No keyboard trap (A 2.1.2)**: Users can move focus away from every component.
- [ ] **Focus order (A 2.4.3)**: Tab order matches reading order and intent.
- [ ] **Focus visible (AA 2.4.7)**: Focus indicator visible for keyboard users on custom-styled components.
- [ ] **Page titled (A 2.4.2)**: Route/page has a meaningful `title` or equivalent where applicable.
- [ ] **Link purpose (A 2.4.4)**: Link text (or programmatic context) identifies purpose.
- [ ] **Multiple ways (AA 2.4.5)**: For larger sites, more than one path to key content when relevant.
- [ ] **Headings and labels (AA 2.4.6)**: Headings describe topic; labels describe purpose.
- [ ] **Target size (AAA optional)**: Touch targets not impractically small on mobile when feasible.

## Understandable

- [ ] **Language (A 3.1.1)**: `lang` on document where appropriate.
- [ ] **On focus (A 3.2.1)**: No context change on focus alone without warning.
- [ ] **On input (A 3.2.2)**: Changing setting does not cause unexpected navigation without user consent.
- [ ] **Consistent navigation (AA 3.2.3)**: Repeated nav blocks appear in consistent relative order.
- [ ] **Identification (AA 3.3.1)**: Errors identified in text; not color-only.
- [ ] **Labels or instructions (A 3.3.2)**: Inputs have labels or instructions when needed.
- [ ] **Error suggestion (AA 3.3.3)**: For known error types, suggest correction when feasible.

## Robust

- [ ] **Parsing / valid markup**: Well-formed DOM; avoid duplicate `id`s.
- [ ] **Name, role, value (A 4.1.2)**: Custom components expose correct role and state; state updates announced when needed (`aria-live` sparingly).
- [ ] **Status messages (AA 4.1.3)**: Important status updates programmatically determinable without stealing focus (when applicable).
