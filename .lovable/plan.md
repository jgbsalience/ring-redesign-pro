## Goal

Make the homepage hero carousel feel cinematic: long, soft crossfades with a slow, almost-imperceptible Ken Burns zoom on the active slide — pacing that reads as luxury rather than a slideshow. Add a suttle zoomin animation thats slow

## Current behaviour

- 1200ms opacity-only crossfade, `ease-in-out`
- 4500ms interval (slides change quickly)
- Static images, no motion within a slide
- Caption fades 700ms (already good)

## Proposed changes — `src/routes/index.tsx` (LuxuryCarousel only)

1. **Pacing**
  - Increase autoplay interval `4500ms → 7000ms` so each image has time to breathe.
  - Lengthen crossfade `duration-[1200ms] → duration-[1800ms]`.
  - Swap easing from `ease-in-out` to a custom cubic-bezier `[0.22,0.61,0.36,1]` (a soft "ease-out-expo"-ish curve) for a more filmic fade.
2. **Ken Burns motion**
  - Wrap each `<img>` in a positioned container so the image itself can transform without affecting layout.
  - Active slide: scale from `1.04 → 1.10` over ~9s with a slight translate (e.g. `translate-x-[-1%] translate-y-[1%]`) — direction alternates per slide index (even slides drift one way, odd slides the other) for visual variety.
  - Inactive slides reset to base scale instantly when hidden, so the motion always begins fresh on entry.
  - Implement via a single keyframe defined inline in `src/styles.css` (`@keyframes kenburns-a` / `kenburns-b`) and applied with conditional class names. Animation only runs on the active slide (`animation-play-state: running` when active, `paused` otherwise). Respect `prefers-reduced-motion` — disable the zoom entirely.
3. **Crossfade polish**
  - Add `will-change: opacity, transform` to the image layer for smoother GPU compositing.
  - Slight scale-in on enter (1.02 → 1) layered with the opacity fade, so new slides bloom in rather than appear. Outgoing slide stays at its current zoom while fading.
4. **Preload next image**
  - Set `loading="eager"` (and remove `lazy`) on the slide immediately after the current one, so the next crossfade is never blocked by a network fetch. All others stay lazy.
5. **Caption sync**
  - Keep current 700ms caption transition but bump to 900ms with the same cubic-bezier so caption motion matches the image easing.

## Out of scope

- No new dependencies, no Framer Motion.
- No layout / aspect ratio changes.
- Caption content, swipe handlers, dot pagination, counter — all unchanged.
- Other carousels (listings, etc.) — unchanged unless you ask.

## Files

- `src/routes/index.tsx` — pacing, classes, preload flag.
- `src/styles.css` — add two `@keyframes` (kenburns-a, kenburns-b), a `.kenburns-active` utility, and a `prefers-reduced-motion` override.