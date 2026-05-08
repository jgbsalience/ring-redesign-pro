# Refresh listing data + correct agents from ring-sa.com.au

## Goal

Every property listing page on the site shows the correct agent(s) and accurate details, sourced from the live ring-sa.com.au listing page. make UI chnages and supabase chnages 

## Current state

- 69 listings live in `src/data/ring.json` (the Supabase `listings` table is empty; the site reads from JSON via `src/data/site.ts`).
- Agent assignments today: 56 listings → Stephen + Luke, 12 → Stephen only, 1 → Soozie. This was a defaulted guess, not scraped.
- Each listing in `ring.json` already has its source `url` (e.g. `https://ring-sa.com.au/buy-residential-real-estate/house-1-menura-avenue-glenalta-sa-1127412251`).
- Spot-fetch of one page confirms agent blocks are present at the bottom (name, phone, email, photo). Sample:
  ```
  #### Stephen Ring  →  stephen@ring-sa.com.au
  #### Luke Bull    →  luke@ring-sa.com.au
  ```
- Five known agents: stephen-ring, luke-bull, soozie-bice, rachel-brooke, toni-dalcin.

## What we'll do

1. Build a one-off Node script (`scripts/refresh-listings.mjs`, not shipped) that:
  - Reads `src/data/ring.json`.
  - For each of the 69 listings, fetches its source URL (via Firecrawl — the connector is already linked to this project — falling back to plain `fetch` on rate-limit).
  - Parses the markdown/HTML to extract:
    - **Agents**: every `#### <name>` block paired with an `@ring-sa.com.au` email → map email local-part to our agent ids (`stephen` → stephen-ring, `luke` → luke-bull, `soozie` → soozie-bice, `rachel` → rachel-brooke, `toni` → toni-dalcin). This is the authoritative agent assignment.
    - **Price** (incl. "Contact Agent" / range), **beds/baths/cars/land**, **headline** (title), **description** paragraphs, **status** (for-sale / sold / for-rent / leased — derived from the URL path), **inspections**.
    - Hero + gallery image URLs (re-confirm).
  - Writes the merged result back to `src/data/ring.json`. Keys not present in the scrape are preserved from the existing record (no data loss).
  - Logs a per-listing diff summary (agents added/removed, fields changed) so we can review.
2. Run the script once from the sandbox. Review the diff log. Commit the refreshed `ring.json`.
3. Verify on the site:
  - `/buy/<id>` detail pages render the correct agent card(s) (the existing `ListingDetail` already reads `agentIds`).
  - `/team/<agent>` listing counts update accordingly.
  - Spot-check 3–5 listings against the live ring-sa.com.au pages.



## Risks / things to confirm before I start

- **Agent roster completeness**: are stephen/luke/soozie/rachel/toni the full team? If a listing legitimately belongs to someone else, we'd need to add them.
- **Stale listings**: some of the 69 may have been removed from ring-sa.com.au (404). The script will keep the existing JSON record for those and flag them in the log so you can decide whether to drop them.
- **Throughput**: 69 sequential fetches via Firecrawl — expect ~2–4 minutes runtime.

## Technical notes

- Firecrawl connection is already linked (`std_01kqsdq3w3fmhrfgf9vfgscx1z`). Script will use `process.env.FIRECRAWL_API_KEY` server-side only.
- Agent matching is by **email local-part**, not name string, to avoid typos.
- `ring.json` is the single source of truth for site listings; `src/data/site.ts` already maps `agentSlugs` → `agentIds` and resolves them via `getAgent()`.