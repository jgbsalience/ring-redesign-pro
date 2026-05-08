## Problem

The homepage hero filter (intent tabs + suburb/keyword input + beds select + Search button) currently navigates to `/buy`, `/rent`, or `/sold` with query params like `?q=Blackwood&beds=3`. But those destination pages render `ListingsBrowser`, which only uses **local component state** — the URL params are ignored, so the user lands on an unfiltered grid. The filter looks functional but isn't.

## Goal

When the user submits the homepage filter (or clicks a popular suburb chip / suggestion), they should land on the correct status page with the listings already filtered by their suburb/keyword and minimum beds, and the filter inputs on that page should reflect those values so they can refine further.

## Changes

### 1. Validate search params on `/buy`, `/rent`, `/sold`

Add a shared zod schema (e.g. `src/lib/listingsSearch.ts`) used by all three routes:

```ts
const listingsSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  suburb: fallback(z.string(), "All suburbs").default("All suburbs"),
  type: fallback(z.string(), "Any type").default("Any type"),
  beds: fallback(z.string(), "Any").default("Any"),
  sort: fallback(z.enum(["newest","price-desc","price-asc","beds-desc"]), "newest").default("newest"),
  page: fallback(z.number().int().min(1), 1).default(1),
});
```

Wire `validateSearch: zodValidator(listingsSearchSchema)` into each route's `createFileRoute` config.

### 2. Make `ListingsBrowser` URL-driven

Refactor `src/components/site/ListingsBrowser.tsx` so its filter state is the URL search params instead of `useState`:

- Accept a `routeId` (or use `useSearch({ strict: false })`) to read current params.
- Replace each `setQuery / setSuburb / setType / setBeds / setSort / setPage` call with `navigate({ search: (prev) => ({ ...prev, ... }) })` (function form to preserve other params).
- Drop the `useEffect` that resets `page` on filter change — instead reset `page: 1` inline whenever a filter changes.
- Keep the same UI; only the state source changes.

### 3. Update homepage `runSearch`

In `src/routes/index.tsx`, change `runSearch` to send keys that match the new schema (it already sends `q` and `beds`; that's fine). Make sure beds is sent as a string matching the select options ("1".."5"). Also navigate using TanStack's typed `navigate({ to, search })` rather than `Object.fromEntries(URLSearchParams)` so types stay clean.

### 4. Buy/Rent/Sold pages

- `/buy` keeps its local `status` tab state for switching between for-sale / for-rent / sold sub-views, but defaults `status` from a route param if the user landed via the homepage Sold/Rent intent (already handled because homepage routes Sold→`/sold` and Rent→`/rent`, so `/buy` only needs to honor `for-sale` by default — no change needed there).
- `/rent` and `/sold` already pass a pre-filtered `source` to `ListingsBrowser`; they just need the new search schema on the route.

### 5. Verify

- From the homepage, type "Blackwood", select "3+ beds", click Search → land on `/buy?q=Blackwood&beds=3` with results filtered and the inputs pre-populated.
- Refreshing the destination URL preserves the filter state.
- Changing a filter on the destination page updates the URL and the grid; back/forward navigation works.
- The "Popular" suburb chips on the homepage navigate with `q={suburb}` and filter correctly.

## Out of scope

- No backend / data changes — listings still come from `src/data/site.ts`.
- No design changes to the filter UI itself.
- Min/max price isn't part of the homepage filter, so we won't add it now.
