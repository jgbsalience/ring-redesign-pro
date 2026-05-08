## Goal

Fix the header's contrast issues on scroll and adopt the supplied Ring logo (reverse / white-text variant) as the single brand mark across header and footer.

## What changes

### 1. Add the new logo asset
- Copy `user-uploads://Ring-Real-Estate_Logo_2023_RGB_Colour_Rev.png` → `src/assets/ring-logo-rev.png`.
- Keep the old `ring-logo.png` and `ring-logo-green.png` files in place for now (no other components reference them — safe to delete in a follow-up if desired).

### 2. Header (`src/components/site/Header.tsx`)
- Import the new reverse logo and use it in both the transparent (overlay) and scrolled states — no more `brightness-0 invert` filter hack.
- Change the scrolled state from light glass (`bg-background/85` + dark text) to a **dark charcoal bar** so the white-text logo and nav always read with strong contrast:
  - Background: solid `bg-[var(--ink)]/95` with `backdrop-blur-md` and a subtle bottom border in `border-white/10`.
  - Text: white, with the green accent (`var(--ringgreen)`) on hover/active states.
  - "Request Appraisal" CTA: switches from black-on-white to the brand green chip (`bg-[var(--ringgreen)] text-[var(--ink)]`) so it pops on the dark bar.
- Overlay (transparent) state stays the same — white text on photo with the same logo.
- Mobile sheet: keep the dark theme too (white text on `var(--ink)` background) so the logo and contrast match the bar above it.
- "Est. 1978" tagline tightened to `text-white/60` for readable but quiet contrast.

### 3. Footer (`src/components/site/Footer.tsx`)
- Replace the imported `ring-logo.png` with the new `ring-logo-rev.png`. Footer already has a dark background, so the white-text logo will read correctly. Bump display height slightly (`h-12` → `h-14`) for parity with header proportions.

### 4. QA
- Load `/` (overlay header), scroll → confirm dark bar with crisp white logo + nav.
- Load `/buy`, `/about`, `/contact` (non-overlay routes) → header is dark from the start, logo + nav legible.
- Mobile: open the menu sheet and confirm dark theme + logo contrast.
- Footer: confirm logo renders with the green ring + white wordmark cleanly on the dark footer.

## Out of scope
- No changes to nav structure, links, or routing.
- No new design tokens — reusing existing `--ink`, `--ringgreen`, `--bone` variables from `src/styles.css`.
- Old logo files left in `src/assets/` (can prune later if you want a clean tree).
