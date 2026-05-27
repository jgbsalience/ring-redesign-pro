## Goal

Replace the current "Our inner circle" two-column row layout on `/about` with a polished editorial **grid** of all team members — consistent portrait sizes, uniform role labels, and clear contact actions on every card.

## Layout

File: `src/routes/about.tsx`, the section starting at line 369.

Grid:

- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16`
- Iterates over `agents` (no slicing — every agent appears).
- Each card is a vertical stack: portrait → name → role → contact links → "View profile" CTA.

## Card composition (per agent)

```
┌──────────────────┐
│   3:4 portrait   │  ← TeamMemberImage size="xl", full-color, subtle img-zoom on hover
├──────────────────┤
│ Name (serif 2xl) │  ← hover: ringgreen
│ ROLE · UPPERCASE │  ← uniform tracking, muted
│ ─────            │  ← thin divider
│ ☎  phone         │  ← icon + link, hover ringgreen
│ ✉  email         │  ← icon + link, hover ringgreen
│ View profile →   │  ← uppercase CTA, arrow nudges on hover
└──────────────────┘
```

Consistency rules:

- Portraits all `aspect-[3/4]`, `object-cover`, same image component/size — no grayscale filter so every agent reads equally.
- Role label normalized to `text-[10px] uppercase tracking-[0.28em] text-muted-foreground`.
- Phone/email use `lucide-react` `Phone` and `Mail` icons (already imported).
- Card itself is **not** the link wrapper anymore — the portrait + name + "View profile" are the link to `/team/$agentId`; phone/email are real `tel:` / `mailto:` anchors so they don't require `stopPropagation` hacks.

## Out of scope

- No data-shape changes; uses existing `agents` from `@/data/site` and existing `TeamMemberImage`.
- No change to other sections, the heading "The people you'll work with.", the section background, or the eyebrow label.
- No new agent fields.

## Technical notes

- Wrap each card in a `<div className="group">`; nest a `<Link>` around the portrait + name block, and render contact anchors as siblings outside the `Link` (avoids nested `<a>` tags and the current `e.stopPropagation` workaround which also fixes a potential hydration issue).
- Use `<TeamMemberImage agent={a} size="xl" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />` inside `aspect-[3/4] overflow-hidden bg-muted`.
- Keep `priority` off (only the profile hero uses priority).
