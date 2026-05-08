## Goal
Adopt the "Integrity" editorial slide design (the 4:5 hero with subtle Ken-Burns motion, dark scrim, and suburb-mark + serif address + caption overlay) as the universal property-listing card design across the site. Sizes adapt by context — grid card, scrolling strip, hero — so it stays elegant at any width.

## What "this design" means (the source pattern)
- Aspect 4:5 image surface, slow zoom in, dark gradient scrim from bottom.
- Overlay copy stacked over the image (no separate white footer):
  - Tiny ringgreen rule + suburb (uppercase, wide-tracked).
  - Serif address.
  - Caption / one-liner — replaced per context: price for available stock, sold price for sold, weekly rent for rentals.
- Hover lifts subtly; whole tile is a link to the right `/buy|/rent|/sold` page.
- A small status pill (For Sale / Sold / etc.) and Featured chip stay in the top-left, as on today's `ListingCard`.

## Files to change

### 1. `src/components/site/ListingCard.tsx` — rebuild as the new universal card
- Replace the current 4:3 image + white footer layout with the editorial overlay style: 4:5 surface, scrim, overlaid suburb / address / price.
- Keep accepting `size` prop with three sizes that scale type and overlay padding only — the markup is the same so it reads as one design system.
  - `sm` → strip / dense grids (320–380px wide). Smaller serif (text-lg), tighter padding.
  - `md` → default grid card (≈ third-width). Serif text-xl–2xl. **This matches the source slide.**
  - `lg` → first/feature card or single-up. Serif text-3xl, generous padding, subtle Ken-Burns enabled.
- Show beds/baths/cars on a thin row beneath the price *inside the overlay* at `md`/`lg`; hide at `sm` (already noisy).
- Agent thumbnail row removed from the card face — it competes with the editorial composition. Keep agent attribution on the listing detail page where it belongs.
- Status pill + Featured chip: keep, restyled to sit on the dark image with `bg-background/95` (unchanged) and a smaller scale at `sm`.
- Small Ken-Burns motion (re-using the existing `kenburns-base` / `kenburns-active-a` classes from styles.css) only at `lg` to keep grid pages calm.
- Image: use `srcSet` swap of the multiarray `cp-rect-XxY.pg` filename (same trick as `LuxuryCarousel`) for crisp images at every size.

### 2. Replace ad-hoc card markup with the new component everywhere

- **Homepage `RecentSalesStrip` (`src/routes/index.tsx`)** — currently inlines its own 4:5 card. Replace with `<ListingCard l={l} size="sm" />` so it matches the design exactly. Keep the auto-scrolling strip behaviour.
- **Homepage "Featured residences" grid (`src/routes/index.tsx`)** — already uses `ListingCard`; just inherits the new design at `md`. First card on `lg` screens spans 2 cols and uses `size="lg"` to feel like a hero slide.
- **`src/components/site/ListingsBrowser.tsx`** (powers `/buy`, `/rent`, `/sold`) — already uses `ListingCard`. No call-site change; new design flows in. Tighten grid gaps slightly so the taller 4:5 cards breathe.
- **`src/routes/listings.tsx` `ListingDbCard`** — duplicate of the old card design for the DB-backed `/listings` page. Delete the local component and import the shared `ListingCard`, mapping the `Row` to a `Listing` shape (or accept `Row` via a small adapter). Keeps one source of truth.
- **`src/routes/sold.index.tsx`** — already uses `ListingCard`; inherits.
- **`src/routes/team.$agentId.tsx`** — already uses `ListingCard`; inherits.
- **`src/routes/sell.tsx`** (lines around 72) — small inline card with 4:3 image. Replace with `<ListingCard size="sm" />` so the visual language is consistent on the sell page too.
- **Homepage `LuxuryCarousel`** itself stays as-is — it's the design we're standardising on, so it remains the canonical hero for the editorial section.

### 3. Sizing rules (the "change size accordingly" part)

| Context | Size | Width | Overlay type | Motion |
|---|---|---|---|---|
| Homepage featured first card (≥lg) | `lg` | 2/3 width | Suburb + address (3xl) + caption + price + bbc row | Ken-Burns |
| Homepage featured remaining + browser grid | `md` | ~1/3 width | Suburb + address (2xl) + price + bbc row | None |
| Recent sales strip + sell page rail | `sm` | 320–380px | Suburb + address (lg) + price | None |

### 4. Tokens / styles
- No new colours. Use `--ringgreen` for the rule and price emphasis (already in use).
- Add a small reusable scrim utility in `src/styles.css` (`.editorial-scrim` → the `from-black/75 via-black/35 to-transparent` gradient currently inlined in `LuxuryCarousel`) so it isn't duplicated five times.

## Out of scope
- No backend changes.
- Listing **detail** pages stay as-is (the design is for browse/list contexts).
- `LuxuryCarousel` keeps its current placement on the homepage Integrity section.
- No copy changes — only visual structure.

## Risk / things to validate after build
- Taller 4:5 cards make existing 3-up grids ~33% taller — confirm on `/buy`, `/rent`, `/sold`, and the homepage Featured section.
- Recent sales strip auto-scroll step uses `card.offsetWidth + 24` — still correct since cards stay at fixed widths.
- `/listings` page deleting `ListingDbCard` — make sure the `Row` → `ListingCard` adapter covers all fields the card reads (hero, address, suburb, state, price, beds/baths/cars, status, featured, id).