## Goal
Create a new `/sell/set-to-sell` route that retells Ring's signature **Set to Sell** strategy (their fourth method, combining Private Treaty + Auction + Tender) in our editorial design language. The user's message references the methods-of-sale URL but calls it "set to sell" — both pages were scraped and the content is woven together so a visitor understands the three traditional methods *and* why Set to Sell unifies them.

## Source content (scraped via Firecrawl)
- **Methods of sale**: Private Treaty, Auction, Tender — definitions + SA legislative note (Statutes Amendment Act 2007, Section 24A) on under-quoting / price representation.
- **Set to Sell**: Ring's trademarked Private Treaty–Tender hybrid; "step-by-step plan to sell your home for the optimum outcome within 28 days"; bullets — 8 winning features, 4 selling phases, more buyer enquiry, fail-safe; lineage from "Set Sale" trademark (2000–2010) → Stephen Ring / RING Real Estate.

## Page structure (top → bottom)

1. **Hero** — full-bleed luxury image with dark scrim, in line with `sell.appraisal.tsx` hero. Eyebrow "The fourth method", serif H1 "Set to Sell.", thin ringgreen rule, subline "A Private Treaty–Tender strategy designed to sell your home in 28 days — with less risk and less stress.", quiet ™ note.

2. **Pillar intro** (light) — two-col grid:
   - Left: serif H2 "Not a method. A discipline." + 3 paragraphs paraphrasing the "removes restrictions / unique / compelling" copy.
   - Right: meta strip (same divider style as appraisal page) — Format · Timeframe · Negotiation · Marketing · Authorisation.

3. **The four methods** — editorial four-card grid (`md:grid-cols-4`) with numbered eyebrows 01–04: Private Treaty, Auction, Tender, **Set to Sell** (4th highlighted with `ringgreen-tint` background). Each card: tagline + 2–3 sentence explainer drawn from scraped content. The Set to Sell card spans full width on mobile and visually anchors the row.

4. **Why it works** — three-up promise row (mirrors appraisal page reassurance pattern): "More buyer enquiry", "Seller in control", "Optimum outcome in 28 days". Each with `ring-mark` eyebrow + short copy.

5. **The 8 winning features** — `md:grid-cols-2` list of 8 numbered tiles (01–08) with serif headings + one-line descriptions. Numbers in ringgreen, bordered tiles. Items derived from the scraped framing: e.g., Tailored to your home, Optimum selling time, Greater enquiry, Buyer empowerment, Seller control, Ethical negotiation, Transparent consultation, Fail-safe structure.

6. **The 4 selling phases** — horizontal stepper / four-column timeline (Prepare → Present → Negotiate → Settle) with serif phase names, day-range badges (Days 1–7, 8–14, 15–21, 22–28) in ringgreen, and a one-line description each.

7. **Heritage strip** — short editorial paragraph on the Set Sale lineage (2000–2010, 500+ consultants → refined under Stephen Ring / Ring Real Estate today). Pull-quote treatment with serif italic + ringgreen mark.

8. **Compliance note** — small print panel summarising SA's Statutes Amendment Act 2007 / Section 24A — no under-quoting, "price guide" only valid in Auction. Sets us apart as transparent. Styled as a bordered notice block.

9. **Closing CTA** — dark `bg-[var(--ink)]` band reusing the appraisal page's pattern: serif quote "Let's design a strategy for your home." + two CTAs: "Request appraisal" (→ /sell/appraisal) primary, "Speak with us" (tel:) secondary.

## Design tokens (matches site)
- Serif headings: `font-serif tracking-tight`
- Body: Inter (global)
- Accent: `var(--ringgreen)` for rules, numbered eyebrows, focus, highlighted card; `var(--ringgreen-deep)` for inline accents
- Spacing: `container-page`, `py-20 md:py-28` between sections
- Reuse `<Header />`, `<Footer />`; eyebrows use `.ring-mark`
- No new components needed — pure presentation in the route file.

## Files to change
- **Create** `src/routes/sell.set-to-sell.tsx` — route at `/sell/set-to-sell` with `head()` meta (unique title/description/og tags).
- **Edit** `src/routes/sell.tsx` — if the existing sell index references the methods/strategy, add a `<Link to="/sell/set-to-sell">` CTA in the relevant section so the new page is reachable.
- **Edit** `src/components/site/Header.tsx` — add a link to "Set to Sell" within the Sell nav area (only if there's an existing dropdown/sub-nav pattern; otherwise leave header untouched and rely on in-page links from `/sell`).

## Out of scope
- No backend, no Supabase changes.
- No images generated; reuse an existing `LUXURY_SLIDES` hero URL already in the codebase.
- Methods-of-sale is not given its own route — its content is folded into the four-method grid on the Set to Sell page.