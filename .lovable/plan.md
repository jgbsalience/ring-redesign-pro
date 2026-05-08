## Goal
Bring our `/sell/appraisal` page closer to the calm, clean composition Ring uses on ring-sa.com.au — while keeping our editorial brand (Fraunces serif + Inter + ringgreen). Today our page leads with a heavy full-bleed hero and dramatic 8xl serif H1; Ring's page is light, centered, and minimal.

## Reference (scraped + screenshot)
- No hero image. Plain white background top-to-bottom.
- Centered eyebrow "Request an appraisal".
- Centered headline: **"Find out the true Market Value of your property."** — modest size, not display.
- Centered subline: "Selling Now or forward planning … We welcome the connection."
- Two-column form, clearly labelled, light blue placeholders, simple bordered inputs, plain checkbox list for "Interested in", large comments textarea, single green submit button.

## Refinements — `src/routes/sell.appraisal.tsx`

1. **Hero → Centered intro band**
   - Remove the full-bleed image hero entirely.
   - Replace with a calm white intro: small ringgreen rule (`h-px w-12`) centered, tiny eyebrow "Request an appraisal" centered, then a centered serif H1 sized down to `text-4xl md:text-6xl` (was `8xl`), then a centered subline.
   - Keep `<Header />` at the top (will read on the white background since it's already dark-themed).
   - Add `pt-32 md:pt-40 pb-14` so the centered intro sits beneath the fixed header with breathing room.

2. **Drop the "What to expect" two-column intro**
   - Ring goes straight from headline → form. Removing that section tightens the page and matches the source.
   - Move the "Cost / Time on site / Written response" meta strip into the **left rail of the form section** as a small inset list under the office contact card — keeps the information without the heavy section.

3. **Form section — cleaner, more like Ring**
   - White background instead of `bg-secondary/40` (Ring uses pure white). Remove the surrounding `border-y`.
   - Form card: drop the outer border + 12-padding card. Use a centered max-width container (`max-w-3xl mx-auto`) with simple stacked fields. This mirrors Ring's centered, single-column-by-default form.
   - Inputs: switch from underline-only style to **bordered inputs** matching Ring (`border border-border bg-background px-4 py-3 rounded-[2px]`). Subtle 2px radius keeps them editorial rather than bootstrap-y.
   - Labels: keep our small uppercase tracking style — it's our brand voice and reads cleaner than Ring's plain labels.
   - "Interested in" tiles: keep current checkbox-tile pattern (it's an improvement over Ring's plain checkboxes per the original brief), but tighten — `py-3` instead of `py-3.5`, lighter borders, ringgreen check.
   - Submit button: use brand green fill (`bg-[var(--ringgreen-deep)] text-white`) instead of black foreground, matching Ring's green CTA. Full-width on mobile, auto on desktop, centered.

4. **Office card relocation**
   - Move office address/phone/email into a slim band **above** the form (centered, three inline items separated by middots) — replaces the previous left-rail block. This matches how Ring lists their office details near the top.
   - Removes the lopsided 4/8 split and lets the form breathe centrally.

5. **Reassurance + Closing CTA**
   - Keep the "Confidential / No obligation / Senior agent only" three-up — it's a brand-positive addition Ring doesn't have but suits our voice.
   - Keep the dark closing CTA strip but soften: smaller serif quote (`text-3xl md:text-4xl` instead of `5xl`) to match the calmer pacing.

6. **Typography pass**
   - All section H2s drop one tier (`text-6xl → text-5xl`, `text-5xl → text-4xl`) — matches Ring's quieter scale.
   - Body copy `text-[1.05rem]` stays — it's our brand.

## Files
- `src/routes/sell.appraisal.tsx` — restructure as above.

## Out of scope
- No backend wiring.
- No global token changes.
- Header / Footer untouched.
- Other pages untouched.