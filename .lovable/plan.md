## Goal
Every paragraph on the site renders in Inter (the sans body font), including the two decorative serif pull-quotes.

## Approach
One global CSS rule beats hunting 30+ files and prevents future regressions.

In `src/styles.css`, inside the `@layer base` block (next to the existing `body { font-family: var(--font-sans) }` rule), add:

```css
p {
  font-family: var(--font-sans) !important;
  font-style: normal;
}
```

- `!important` overrides any inline `font-serif` utility on a `<p>`.
- Resetting `font-style` neutralises the `italic` on the two pull-quotes so they don't look half-styled. Colour, size, and weight stay untouched.

## Affected paragraphs (verified)
- `src/routes/about.tsx:215` — serif italic green pull-quote → becomes Inter, upright, same green/size.
- `src/components/site/ListingDetail.tsx:85` — same treatment.
- All other `<p>` elements already inherit Inter; rule is a no-op for them but locks the behaviour in.

## Out of scope
Headings, blockquotes, and `<div>`-based display text that use `font-serif` (e.g. hero titles, stat numbers) are intentionally serif and stay as-is. The rule only targets `<p>`.

## Side fix
Add the missing `useRef` import in `src/routes/index.tsx` (currently throwing `useRef is not defined` at SSR).