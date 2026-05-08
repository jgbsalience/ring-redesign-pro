## Goal
Add the same `PortfolioCarousel` that sits above the footer on the homepage to `/buy`, `/rent` and `/sold`, each filtered to its own listing status, so the three listing pages share the homepage's visual rhythm.

## Changes

**1. `src/routes/buy.index.tsx`** — Just before the existing `<Footer />`, render:
```tsx
<PortfolioCarousel items={listings.filter(l => l.status === "for-sale" && l.hero)} />
```

**2. `src/routes/rent.index.tsx`** — Same pattern, with both active rentals and previously leased homes:
```tsx
<PortfolioCarousel items={listings.filter(l => (l.status === "for-rent" || l.status === "leased") && l.hero)} />
```

**3. `src/routes/sold.index.tsx`** — Recently sold:
```tsx
<PortfolioCarousel items={listings.filter(l => l.status === "sold" && l.hero)} />
```

The component already caps to 12 slides internally and handles the empty case, so no extra slicing is needed.

## Out of scope
- No new component — reuse the existing `src/components/site/PortfolioCarousel.tsx` exactly as-is.
- No copy/heading changes inside the carousel (it already says "The portfolio · A closer look"). If you'd like the heading tailored per page (e.g. "Recently sold" on /sold), say so and I'll add an optional `eyebrow` / `title` prop.
- No changes to `/sell` (per your answer).
- No changes to homepage, header, footer, or listing data.
