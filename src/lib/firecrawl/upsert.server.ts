/**
 * Deduplication + upsert layer for Firecrawl-scraped listings.
 *
 * Server-only. Imports `supabaseAdmin`, so this file must never be imported
 * from client code (the `.server.ts` suffix enforces that at build time).
 *
 * Strategy
 * --------
 * 1. Normalize incoming Firecrawl docs via `mapFirecrawlBatch` (already
 *    handles missing-URL drops).
 * 2. Within the batch, dedupe by `source_url` keeping the latest entry.
 * 3. Compute a stable content `fingerprint` per row so we can skip writes
 *    when nothing has changed since the last scrape.
 * 4. Fetch existing rows by `source_url`, diff fingerprints, and only
 *    upsert rows that are new or changed.
 * 5. The `source_url` UNIQUE constraint guarantees the upsert merges into
 *    the existing row instead of inserting a duplicate.
 */

import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { mapFirecrawlBatch, type FirecrawlDoc, type ListingRow } from "@/lib/firecrawl/mapper";

/* ------------------------------------------------------------------ */
/* Fingerprinting                                                      */
/* ------------------------------------------------------------------ */

/** Fields that count as "real" content changes. Volatile fields like
 *  `scraped_at` and `raw` are excluded so re-scrapes of identical pages
 *  don't trigger spurious writes. */
const FINGERPRINT_KEYS: readonly (keyof ListingRow)[] = [
  "status",
  "address",
  "suburb",
  "state",
  "postcode",
  "price",
  "price_note",
  "price_numeric",
  "beds",
  "baths",
  "cars",
  "land",
  "type",
  "hero",
  "gallery",
  "floorplan",
  "headline",
  "description",
  "features",
  "agent_slugs",
  "inspections",
];

function fingerprintRow(row: ListingRow): string {
  const subset: Record<string, unknown> = {};
  for (const k of FINGERPRINT_KEYS) subset[k] = row[k];
  return createHash("sha1").update(JSON.stringify(subset)).digest("hex");
}

/* ------------------------------------------------------------------ */
/* Batch-level dedupe                                                  */
/* ------------------------------------------------------------------ */

/** Collapse duplicate `source_url`s within the batch. Later entries win
 *  (matches Firecrawl's behaviour where re-crawls return fresher data). */
function dedupeBatch(rows: ListingRow[]): ListingRow[] {
  const map = new Map<string, ListingRow>();
  for (const r of rows) map.set(r.source_url, r);
  return [...map.values()];
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export type UpsertReport = {
  received: number; // raw docs in
  mapped: number; // rows after mapping (dropped if no source_url)
  unique: number; // rows after in-batch dedupe
  inserted: number; // brand new source_urls
  updated: number; // changed fingerprint
  skipped: number; // unchanged
  errors: { source_url: string; error: string }[];
};

/**
 * Upsert a batch of Firecrawl documents into `public.listings`.
 *
 * - Re-scrapes of unchanged pages produce 0 writes (skipped).
 * - Re-scrapes of changed pages update the existing row in place.
 * - The unique index on `source_url` is the dedupe key.
 */
export async function upsertFirecrawlListings(
  docs: FirecrawlDoc[],
  opts: {
    statusHint?: ListingRow["status"];
    /** Soft-delete (set status='sold'/'leased') any rows whose source_url
     *  was NOT in this batch but matches one of these statuses. Use only
     *  when the batch represents the *complete* current set for a status. */
    pruneMissingForStatus?: ListingRow["status"];
  } = {},
): Promise<UpsertReport> {
  const report: UpsertReport = {
    received: docs.length,
    mapped: 0,
    unique: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  // 1. Normalize
  const mapped = mapFirecrawlBatch(docs, { statusHint: opts.statusHint });
  report.mapped = mapped.length;
  if (mapped.length === 0) return report;

  // 2. In-batch dedupe
  const unique = dedupeBatch(mapped);
  report.unique = unique.length;

  // 3. Fetch existing fingerprints for these source_urls
  const sourceUrls = unique.map((r) => r.source_url);
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from("listings")
    .select("source_url, raw")
    .in("source_url", sourceUrls);

  if (fetchErr) {
    throw new Error(`Failed to fetch existing listings: ${fetchErr.message}`);
  }

  const existingByUrl = new Map<string, { fingerprint: string | null }>();
  for (const row of existing ?? []) {
    const raw = (row.raw ?? {}) as { fingerprint?: string };
    existingByUrl.set(row.source_url, { fingerprint: raw.fingerprint ?? null });
  }

  // 4. Diff: keep only new + changed rows, attach fingerprint into raw
  const toUpsert: ListingRow[] = [];
  for (const row of unique) {
    const fp = fingerprintRow(row);
    const prior = existingByUrl.get(row.source_url);

    if (!prior) {
      report.inserted++;
    } else if (prior.fingerprint === fp) {
      report.skipped++;
      continue;
    } else {
      report.updated++;
    }

    toUpsert.push({
      ...row,
      raw: { ...(row.raw ?? {}), fingerprint: fp },
    });
  }

  // 5. Upsert in chunks (Supabase REST has a row-size cap; 200 is safe)
  if (toUpsert.length > 0) {
    const CHUNK = 200;
    for (let i = 0; i < toUpsert.length; i += CHUNK) {
      const chunk = toUpsert.slice(i, i + CHUNK);
      const { error } = await supabaseAdmin
        .from("listings")
        // Cast: ListingRow's jsonb fields are typed loosely; the DB schema accepts them as Json.
        .upsert(chunk as unknown as never, { onConflict: "source_url", ignoreDuplicates: false });

      if (error) {
        // Don't lose the whole batch — record per-chunk failure and continue
        for (const r of chunk) {
          report.errors.push({ source_url: r.source_url, error: error.message });
        }
        // Roll counters back for this chunk so the report stays accurate
        report.inserted = Math.max(0, report.inserted - chunk.length);
        report.updated = Math.max(0, report.updated - chunk.length);
      }
    }
  }

  // 6. Optional: mark rows missing from this batch as gone for the given status
  if (opts.pruneMissingForStatus) {
    const seen = new Set(sourceUrls);
    const { data: stale, error: staleErr } = await supabaseAdmin
      .from("listings")
      .select("source_url, status")
      .eq("status", opts.pruneMissingForStatus);

    if (!staleErr && stale) {
      const missing = stale.filter((r) => !seen.has(r.source_url)).map((r) => r.source_url);

      if (missing.length > 0) {
        const newStatus = opts.pruneMissingForStatus === "for-rent" ? "leased" : "sold";
        await supabaseAdmin
          .from("listings")
          .update({ status: newStatus })
          .in("source_url", missing);
      }
    }
  }

  return report;
}
