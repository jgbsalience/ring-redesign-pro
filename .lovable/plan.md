## Goal
Cap the homepage "Recent results" strip at 15 sold listings and have it auto-scroll horizontally every 4s — pausing on hover/touch so users can browse without it moving under them.

## Changes — `src/routes/index.tsx` only

1. **Cap to 15**
   - Replace `const sold = listings.filter((l) => l.status === "sold");` with the same line followed by `.slice(0, 15)`.

2. **Auto-advance**
   - Extract the strip into a small inline `RecentSalesStrip` component (keeps state local).
   - Use a ref on the scroll container (the existing `overflow-x-auto` div).
   - Every 4000ms: scroll right by one card width (`card.offsetWidth + gap`, where gap is 24px). When near the end (`scrollLeft + clientWidth >= scrollWidth - 8`), smooth-scroll back to `0` to loop.
   - Pause when `paused` state is true; resume when false.
   - Pause triggers: `onMouseEnter`, `onMouseLeave`, `onTouchStart`, `onTouchEnd`, `onFocusCapture`, `onBlurCapture`.
   - Respect `prefers-reduced-motion`: skip the interval entirely.
   - Use `behavior: "smooth"` on the scrollBy for the luxe feel matching the hero carousel.

3. **No layout/visual changes** — same card sizes, same spacing, same hover-lift; only behaviour and the cap change.

## Out of scope
- No new dependencies (no embla/swiper).
- Other carousels/strips untouched.
- No backend changes.