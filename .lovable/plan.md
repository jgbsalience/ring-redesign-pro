## What you selected
The Welcome paragraph on the listing detail page (e.g. `/buy/5-stella-street`). It's rendered from `listing.description` at `src/components/site/ListingDetail.tsx:114`:

```tsx
<div className="mt-12 space-y-6 text-base md:text-lg leading-relaxed">
  {listing.description.map((p, i) => <p key={i}>{p}</p>)}
</div>
```

A global rule in `src/styles.css` already forces every `<p>` to Inter (`font-family: var(--font-sans) !important`), so this paragraph should already be Inter. If it still looks serif in the preview, the cause is browser font cache or the rule order — not the markup.

## Plan
- Add `font-sans` directly to the description wrapper in `ListingDetail.tsx` so Inter is applied explicitly via a Tailwind class, in addition to the global rule. This guarantees the body copy renders in Inter regardless of any inherited or future style.

```tsx
<div className="mt-12 space-y-6 text-base md:text-lg leading-relaxed font-sans">
```

That's the only change. No content edits, no other components touched.