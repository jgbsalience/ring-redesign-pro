# Ring Real Estate — Modernised Redesign

A vastly enhanced, design-forward rebuild of ring-sa.com.au (Adelaide-based residential agency, est. 1978). Keeps the brand essence (the green "ring" mark, "Integrity" promise, est. 1978 heritage) but replaces the dated template look with an editorial, premium real-estate experience comparable to The Agency / Belle Property / Sotheby's Realty.

## Brand direction

- **Aesthetic**: Editorial, confident, residential-luxury. Generous white space, large hero imagery, refined serif display type paired with a clean grotesque, subtle motion.
- **Palette**: Deep ink near-black, warm off-white, muted stone, and the existing Ring green (#7BC242-ish) used sparingly as a precision accent — not as flat fills across buttons and headings like today.
- **Typography**: Display serif (e.g. Fraunces / Canela-style) for headlines, Inter for UI/body. Big editorial scale, tight tracking on headings.
- **Motion**: Subtle parallax on hero, fade/slide-up on scroll, hover lifts on property cards. Nothing gimmicky.

## Pages (separate TanStack routes — not hash anchors)

1. `/` Home — hero, integrity statement, property search, featured listings, recent sales strip, agent intro, testimonials, CTA.
2. `/buy` — listings grid with filters (suburb, price, beds, baths, type), map toggle, OFI strip.
3. `/buy/$listingId` — full listing detail (gallery, specs, agent, inspection times, enquiry form).
4. `/rent` — rental listings + landlord login link.
5. `/sell` — methods of sale, target price range explainer, recent sales, appraisal CTA.
6. `/sell/appraisal` — appraisal request form.
7. `/about` — story (est. 1978), team grid ("Inner Circle"), community.
8. `/contact` — contact form, office details, map.

## Home page structure

```text
┌─────────────────────────────────────────────┐
│  Slim transparent nav · logo · phone · CTA   │
├─────────────────────────────────────────────┤
│  Full-bleed hero image                       │
│  Oversized serif headline + Integrity mark   │
│  Inline property search bar (buy/rent/sold)  │
├─────────────────────────────────────────────┤
│  "Since 1978" editorial intro (2-col)        │
├─────────────────────────────────────────────┤
│  Featured listings — 3-up cards, hover lift  │
├─────────────────────────────────────────────┤
│  Recent sales — horizontal scroll strip      │
├─────────────────────────────────────────────┤
│  Methods of sale — 3 tiles w/ illustrations  │
├─────────────────────────────────────────────┤
│  Agent / Inner Circle preview                │
├─────────────────────────────────────────────┤
│  Testimonial — large pull-quote              │
├─────────────────────────────────────────────┤
│  Appraisal CTA band (dark, full-bleed)       │
├─────────────────────────────────────────────┤
│  Footer — sitemap, contact, socials, ABN     │
└─────────────────────────────────────────────┘
```

## Listing card pattern

Image (4:3) with price overlay on hover · address · suburb · beds/baths/cars icons · agent avatar + name · subtle border, lifts on hover.

## Listing detail

Sticky enquiry sidebar, full-width gallery with lightbox, specs grid, inspection times, agent card, similar properties.

## Technical notes

- TanStack Start with file-based routes under `src/routes/`. One file per page (no hash-anchor SPA).
- Design tokens added to `src/styles.css` (oklch): `--ink`, `--bone`, `--stone`, `--ring-green`, plus serif/sans font families. Tailwind classes via semantic tokens only.
- Fonts via Google Fonts `<link>` in `__root.tsx` head (Fraunces + Inter).
- Per-route `head()` with unique title/description/og for SEO.
- All listings/agents/testimonials seeded as typed mock data in `src/data/` so the UI is fully populated without a backend. No Lovable Cloud unless you later want real listings + appraisal form submissions.
- Imagery: high-quality Adelaide/residential stock via Unsplash URLs (no AI image generation needed for v1).
- Mobile-first; nav collapses to a full-screen sheet menu.
- Note: "using gemini 3.1 pro" — Gemini 3.1 Pro is the model powering this design generation; no AI gateway integration is being added to the app itself. Let me know if you actually want an in-app AI feature (e.g. AI property concierge) and I'll add it.

## Out of scope for v1

- Real listings feed / CRM integration (REA, Domain, Console).
- Auth, landlord portal (link out to existing landlords.com.au as today).
- Appraisal/contact form backend submission (forms render but don't submit until Cloud is enabled).

Approve and I'll build it.