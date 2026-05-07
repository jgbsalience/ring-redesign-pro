# Replace all imagery with real Ring Real Estate assets

Strip every Unsplash placeholder and rebuild the dataset using real photos and people from ring-sa.com.au.

## What's on the source site

- **Team (Inner Circle)** — 5 real members with photos already captured:
  Stephen Ring (Director), Luke Bull (Sales Consultant), Soozie Bice (Property Manager), Rachel Brooke (Property Manager), Toni Dalcin (Accounting/Admin).
  Photo pattern: `https://img.multiarray.com/realestatemanagerpm/<acct>/<id>/crop-rect-400x300.jpg`
- **Listings** — listing index pages only show blank placeholders; the real photos live on each detail page in carousel items (`cp-rect-1920x1440.pg`, served as `image/jpeg`). I confirmed they fetch with a normal browser User-Agent.
- **Listing slugs already collected** from /buy/residential-for-sale (e.g. `house-1-menura-avenue-glenalta-sa-1127412251`, `house-4-college-avenue-bellevue-heights-sa-...`, plus 6 more for sale and 1 rental). I'll also collect the /sell/recent-sales and /rent/residential-for-rent slugs.
- **Office address**: 140 Shepherds Hill Road, Bellevue Heights SA 5050 — phone (08) 8370 3211, email ring@ring-sa.com.au. Update footer/contact to match.

## Approach

1. **Scrape script** (`/tmp/scrape_ring.ts`, run once with `bun`):
   - Fetch each listing index page (buy, recent-sales, rent) to get the canonical slug + url + price + address + bed/bath/car counts already in the markdown I have.
   - For each detail page, pull the carousel `data-src` URLs (gallery) and the headline/description block.
   - Emit a single `src/data/ring.json` containing all listings + agents.
2. **Typed data layer** — keep `src/data/site.ts` API (`listings`, `agents`, `getAgent`, `getListing`) but populate it from the scraped JSON. Map listing → agent via the agent name shown on each detail page.
3. **Agents rewrite** — replace the 4 fictional agents with the 5 real Ring staff, real phones/emails. Update every `agentIds` reference (cards, listing details, similar-properties).
4. **Hero & editorial images** — replace the Unsplash hero on `/` and `/about` with the strongest real Ring listing photo (likely 4 College Avenue or 58 Brighton Parade). Replace the Unsplash "studio" shot on `/contact` with a Ring listing exterior.
5. **Image loader hardening** — `img.multiarray.com` 404s without a normal UA but works fine in browsers. No proxy needed; just use the URLs directly. I'll add `referrerPolicy="no-referrer"` and `loading="lazy"` to be safe, plus an `onError` swap to a sibling listing image so a single dead URL never leaves a blank tile.
6. **Cleanup** — delete every `images.unsplash.com` URL from the codebase. Delete the `suburbs` mock list and rebuild it from the real listings' suburbs (Glenalta, Bellevue Heights, Blackwood, Clarence Gardens, Pasadena, Sellicks Beach, North Adelaide, …).
7. **QA** — load `/`, `/buy`, `/buy/$listingId` for two listings, `/rent`, `/sell`, `/about`, `/contact` in the preview and confirm no broken images, no Unsplash calls in the network tab.

## Out of scope

- I won't copy long property descriptions verbatim — I'll use the Ring headline + a short factual blurb to avoid mirroring their copywriting. Address, suburb, price, beds/baths/cars, and photos are factual data, used as-is.
- Sold prices on the sell page will use whatever Ring publishes on /sell/recent-sales (often "Sold" without a figure); no invented numbers.

Approve and I'll run the scrape + rewire the dataset.