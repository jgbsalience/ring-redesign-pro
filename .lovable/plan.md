## Goal

Make every listing caption price + bed/bath/car render with the same layout, typography, and breakpoint behavior as the improved `PortfolioCarousel` caption: text labels (no icons), tabular numerals, bolder values, dot dividers, and price stacking above the specs on narrow widths.

## Reference (already shipped on `PortfolioCarousel`)

```
[ringgreen price]   |   3 bed · 2 bath · 1 car
```
- `flex-col` on mobile → `sm:flex-row sm:items-center sm:flex-wrap`
- Price: `text-[var(--ringgreen)] font-medium tabular-nums leading-tight`
- Vertical bar divider hidden on mobile
- Specs as a `<ul>` with `tabular-nums`, value bold + label muted, `·` between items

## Changes

### 1. New shared component `src/components/site/SpecLine.tsx`

A tiny presentational component that takes `{ price, beds, baths, cars, tone }` and renders the carousel's spec layout. Two tones:

- `tone="dark"` (default): white text on dark backgrounds (used on overlay captions and the carousel)
- `tone="light"`: foreground text on light backgrounds (used on the map sidebar)

This guarantees one source of truth across all surfaces.

### 2. `src/components/site/ListingCard.tsx`

Replace the current overlay caption block (lines ~131–140) — which uses `Bed/Bath/Car` lucide icons — with `<SpecLine price={l.price} beds={l.beds} baths={l.baths} cars={l.cars} tone="dark" />`.

- Remove the `Bed`, `Bath`, `Car` lucide imports if they're no longer used elsewhere in the file.
- Keep the `s.showSpecs` gate so the smallest card variant can still hide specs.
- Keep the price color variable from `s.price` by passing a `priceClassName` override prop, so size-variant scales (sm/md/lg) still apply.

### 3. `src/components/site/PortfolioCarousel.tsx`

Swap the inline price + specs JSX for `<SpecLine ... tone="dark" />` so it stays the canonical reference and we don't have two copies to drift.

### 4. `src/components/site/ListingsMap.tsx` (sidebar rows, lines ~213–229)

Replace the icon-based price + Bed/Bath/Car row with `<SpecLine ... tone="light" size="sm" />`. This row is on a light surface, so labels use `text-muted-foreground` and values use `text-foreground`. Use a smaller `text-xs` size variant.

### 5. Verify

- `/buy`, `/rent`, `/sold` listing grids (3-up, 2-up, 1-up at all breakpoints) — price + specs align consistently, wrap cleanly on the narrowest card width.
- Homepage featured grid uses ListingCard, so it inherits the fix.
- Portfolio carousel still renders identically (now via SpecLine).
- `/listings` map view sidebar — specs now use text labels instead of icons, aligned the same way.
- No layout shift on hover/active states.
- Listing detail page is intentionally untouched (it has its own large stat block with icons by design).

## Out of scope

- ListingDetail.tsx hero stats (different design pattern: large icons + labels).
- Any data/business logic — purely presentation.
- Pluralization (`bed` vs `beds`) — keep current singular labels for visual rhythm and to match the carousel.
