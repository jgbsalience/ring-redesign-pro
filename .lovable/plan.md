## Goal
Rebuild `/sell/appraisal` to match Ring's actual request-appraisal page content while elevating it visually to match our editorial site design (Fraunces serif headings, Inter body, ringgreen accent, full-bleed imagery, generous whitespace).

## Reference content (from ring-sa.com.au)
- Headline: "Find out the true Market Value of your property."
- Subhead: "Selling Now or forward planning… We welcome the connection."
- Form fields: Name*, Address, Phone*, Email*, Interested In* (multi-select checkboxes), Comments
- Interested-in options:
  1. I only want to know the Market Value of my home
  2. I need advice on the method of sale
  3. I need presentation and/or home preparation advice
  4. I want to know how the market is trending in my area
  5. I want to know the best time to sell
- Office footer card: 140 Shepherds Hill Road, Bellevue Heights SA 5050 · (08) 8370 3211 · ring@ring-sa.com.au

## Page structure (top → bottom)

1. **Hero band** — full-bleed luxury property image (reuse one of the existing `LUXURY_SLIDES` images already in the codebase) with dark scrim. Eyebrow "Appraisal request", serif H1 "Find out the true market value of your home.", short sub-line, and a thin ringgreen rule. Sits behind the dark Header.

2. **Two-column intro + meta strip** (light section)
   - Left: editorial copy — "A quiet conversation about your home." paragraph, second paragraph about the 7-day written appraisal, third sentence "It costs nothing. It commits to nothing."
   - Right: meta list — Cost · Time on site · Written response · Conducted by (Senior agent) — same divider styling already used on the page.

3. **Form section** — `bg-secondary/50`, generous padding, two-column on desktop:
   - Left rail: small serif heading "We welcome the connection.", supporting line, and the 4-line office card (address / phone / email) styled like Contact page.
   - Right: the form itself (col-span-7).
     - Name* / Phone* (two cols)
     - Email* / Property address (two cols)
     - Suburb / Property type (select)
     - **Interested in*** — 5 checkbox tiles (label-wrapped, bordered, hover ringgreen) — improvement over Ring's plain checkboxes.
     - Comments textarea
     - Privacy line + dark CTA button "Request appraisal →" matching site button style.
   - Client-side validation: required markers shown via `*`, basic HTML5 `required` attributes; inline success state on submit (no backend wired).

4. **Reassurance row** — three short pillars with `ring-mark` bullets: "Confidential", "No obligation", "Senior agent only" — short copy beneath each. Mirrors the site's editorial three-up pattern used on Sell/About pages.

5. **Closing CTA strip** — dark band (`bg-[var(--ink)] text-white`) with serif quote "We will walk the property, ask questions, and listen." plus phone/email links — matches the dark CTA pattern used on the home page.

## Design tokens & components
- Serif H1/H2: `font-serif tracking-tight`
- Body: Inter (already global)
- Accent: `var(--ringgreen)` for rules, eyebrow mark, focus rings, checkbox active state
- Buttons: solid foreground style already used (`bg-foreground text-background`, uppercase tracking)
- Inputs: white `bg-background`, border-bottom only on focus to keep the editorial feel; consistent with Contact page if present
- Reuse `<Header />` and `<Footer />`; eyebrow uses the existing `.ring-mark` dot

## Files to change
- `src/routes/sell.appraisal.tsx` — full rewrite implementing the structure above. Keep the existing route export and `head()` meta (refresh title/description copy to mirror new headline).

## Out of scope
- No backend submission (no Supabase table, no email send) — form is presentation-only with a success toast on submit, matching the existing Contact form pattern. Hook-up can be a follow-up if desired.
- Header/Footer remain unchanged.