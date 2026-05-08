## Goal
Cap each listing index page at 16 results per page and provide pagination so users can browse the rest.

## Current state
- `/buy` and `/rent` already use `ListingsBrowser`, which has built‑in pagination — they just pass `pageSize={12}`.
- `/sold` renders its own grid with no pagination at all (every matching sold listing is dumped onto one page).

## Changes

**1. `src/routes/buy.index.tsx`** — change `pageSize={12}` → `pageSize={16}`.

**2. `src/routes/rent.index.tsx`** — change `pageSize={12}` → `pageSize={16}`.

**3. `src/routes/sold.index.tsx`** — add pagination state matching the style used by `ListingsBrowser`:
- Add `const [page, setPage] = useState(1);`
- Reset `page` to 1 whenever filters change (`query`, `suburb`, `type`, `beds`).
- Compute `totalPages = Math.ceil(filtered.length / 16)` and slice `filtered` to the current page (16 per page).
- Render the same numbered Prev / 1 2 3 / Next control bar that `ListingsBrowser` uses (re-implemented inline in the route — kept simple, same `lucide-react` `ChevronLeft` / `ChevronRight`, same Tailwind classes) under the grid.
- Scroll to the top of the listings grid when the page changes (smooth) so users don't have to scroll up after clicking a page number.

## Out of scope
- No URL-based pagination (page state stays client-side, same as `ListingsBrowser` today). Happy to add `?page=2` query-string sync as a follow-up if you want shareable paginated URLs.
- No changes to filters, the carousel above the footer, or `ListingsBrowser` itself.
