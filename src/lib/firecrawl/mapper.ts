/**
 * Field-mapping layer that normalizes Firecrawl scrape/crawl results into
 * rows that match the `public.listings` Supabase table.
 *
 * This module is server-safe (no browser APIs) and has no side effects —
 * it only transforms data. Call it from a server function or cron handler
 * and pipe the result into `supabaseAdmin.from('listings').upsert(...)`
 * keyed on `source_url`.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** What the Firecrawl SDK gives us (scrape or crawl page). Shape is loose
 *  on purpose — Firecrawl mixes top-level fields with `metadata` and the
 *  optional `json` payload from JSON-format extraction. */
export type FirecrawlDoc = {
  url?: string;
  markdown?: string;
  html?: string;
  rawHtml?: string;
  links?: string[];
  screenshot?: string;
  metadata?: Record<string, unknown> & {
    title?: string;
    description?: string;
    sourceURL?: string;
    ogImage?: string;
    statusCode?: number;
  };
  json?: Record<string, unknown>;
};

/** Row shape that maps 1:1 onto the `listings` table columns we control. */
export type ListingRow = {
  source_url: string;
  external_id: string | null;
  status: "for-sale" | "for-rent" | "sold" | "leased";
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: string;
  price_note: string | null;
  price_numeric: number | null;
  beds: number;
  baths: number;
  cars: number;
  land: string | null;
  type: "House" | "Townhouse" | "Apartment" | "Land" | "Villa";
  hero: string | null;
  gallery: string[];
  floorplan: string | null;
  headline: string;
  description: string[];
  features: string[];
  agent_slugs: string[];
  inspections: { date: string; time: string }[];
  raw: Record<string, unknown>;
  scraped_at: string; // ISO
};

/* ------------------------------------------------------------------ */
/* Recommended JSON-format schema for Firecrawl                        */
/* ------------------------------------------------------------------ */

/** Pass this to Firecrawl as `formats: [{ type: 'json', schema: LISTING_JSON_SCHEMA }]`
 *  to get clean structured data back. The mapper falls back to markdown/regex
 *  parsing for any field the LLM doesn't return. */
export const LISTING_JSON_SCHEMA = {
  type: "object",
  properties: {
    address: { type: "string", description: "Street address line, e.g. '12 Smith Street'" },
    suburb: { type: "string" },
    state: { type: "string", description: "Two-letter Australian state code, e.g. 'SA'" },
    postcode: { type: "string" },
    price: { type: "string", description: "Display price exactly as shown, e.g. 'Offers above $850,000' or 'Contact Agent'" },
    priceNote: { type: "string", description: "Optional qualifier like 'Per week' or 'Guide'" },
    status: { type: "string", enum: ["for-sale", "for-rent", "sold", "leased"] },
    beds: { type: "number" },
    baths: { type: "number" },
    cars: { type: "number" },
    land: { type: "string", description: "Land size with units, e.g. '612 sqm'" },
    type: { type: "string", enum: ["House", "Townhouse", "Apartment", "Land", "Villa"] },
    headline: { type: "string", description: "Short marketing tagline" },
    description: { type: "array", items: { type: "string" }, description: "Full description split into paragraphs" },
    features: { type: "array", items: { type: "string" } },
    hero: { type: "string", description: "URL of the main hero image" },
    gallery: { type: "array", items: { type: "string" } },
    floorplan: { type: "string" },
    agentNames: { type: "array", items: { type: "string" } },
    inspections: {
      type: "array",
      items: {
        type: "object",
        properties: { date: { type: "string" }, time: { type: "string" } },
      },
    },
  },
  required: ["address", "suburb", "price", "beds", "baths"],
} as const;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const VALID_TYPES = new Set(["House", "Townhouse", "Apartment", "Land", "Villa"]);
const VALID_STATUSES = new Set(["for-sale", "for-rent", "sold", "leased"]);

const get = (o: unknown, k: string): unknown =>
  o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined;

const str = (v: unknown): string | null => {
  if (typeof v === "string") return v.trim() || null;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return null;
};

const num = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const arr = <T = unknown>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** Pull a numeric price out of strings like
 *  "Offers above $850,000", "$1.25M", "Guide $720k - $760k", "Contact agent". */
export function parsePriceNumeric(price: string | null | undefined): number | null {
  if (!price) return null;
  const cleaned = price.toLowerCase().replace(/,/g, "");
  const m = cleaned.match(/\$?\s*(\d+(?:\.\d+)?)\s*([mk])?/);
  if (!m) return null;
  const base = parseFloat(m[1]);
  if (!Number.isFinite(base)) return null;
  const unit = m[2];
  if (unit === "m") return base * 1_000_000;
  if (unit === "k") return base * 1_000;
  return base;
}

/** Best-effort status detection from URL, JSON hint, and copy. */
function detectStatus(doc: FirecrawlDoc, hint?: string | null): ListingRow["status"] {
  if (hint && VALID_STATUSES.has(hint)) return hint as ListingRow["status"];
  const haystack = [doc.url, doc.metadata?.sourceURL, doc.markdown ?? "", doc.metadata?.title ?? ""]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (/\bsold\b/.test(haystack)) return "sold";
  if (/\bleased\b/.test(haystack)) return "leased";
  if (/\b(rent|rental|for-?rent|per\s*week|p\/w|pw)\b/.test(haystack)) return "for-rent";
  return "for-sale";
}

/** Try to lift "12 Smith St, Bellevue Heights SA 5050" into parts. */
function parseAddressLine(line: string | null): {
  address: string;
  suburb: string;
  state: string;
  postcode: string;
} {
  if (!line) return { address: "", suburb: "", state: "SA", postcode: "" };
  const cleaned = line.replace(/\s+/g, " ").trim();
  // Match "<address>, <suburb> <STATE> <postcode>"
  const m = cleaned.match(/^(.+?),\s*([^,]+?)\s+([A-Z]{2,3})\s+(\d{4})$/);
  if (m) return { address: m[1].trim(), suburb: m[2].trim(), state: m[3], postcode: m[4] };
  // Match "<address>, <suburb>"
  const m2 = cleaned.match(/^(.+?),\s*(.+)$/);
  if (m2) return { address: m2[1].trim(), suburb: m2[2].trim(), state: "SA", postcode: "" };
  return { address: cleaned, suburb: "", state: "SA", postcode: "" };
}

/** Regex fall-backs for beds/baths/cars/land if the JSON didn't land. */
function extractSpecsFromText(text: string): Pick<ListingRow, "beds" | "baths" | "cars" | "land"> {
  const t = text.toLowerCase();
  const pick = (re: RegExp): number => {
    const m = t.match(re);
    return m ? parseInt(m[1], 10) || 0 : 0;
  };
  const land = t.match(/(\d{2,5})\s*(sqm|sq\.?\s*m|m2|m²)/i);
  return {
    beds: pick(/(\d+)\s*(?:bed|br\b)/),
    baths: pick(/(\d+)\s*(?:bath|ba\b)/),
    cars: pick(/(\d+)\s*(?:car|garage|parking)/),
    land: land ? `${land[1]} sqm` : null,
  };
}

/** Slugify an agent name to match `agents` ids (kebab-case). */
function slugifyAgent(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** External id from URL — last non-empty path segment, with query stripped. */
function deriveExternalId(url: string): string | null {
  try {
    const u = new URL(url);
    const seg = u.pathname.split("/").filter(Boolean).pop();
    return seg ? seg.replace(/\.html?$/i, "") : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Main mapper                                                         */
/* ------------------------------------------------------------------ */

/** Normalize a single Firecrawl document into a `listings` row.
 *  Returns null when no usable source URL is present (can't upsert without it). */
export function mapFirecrawlToListing(
  doc: FirecrawlDoc,
  opts: { statusHint?: ListingRow["status"]; defaultState?: string } = {},
): ListingRow | null {
  const sourceUrl = str(doc.url) ?? str(doc.metadata?.sourceURL);
  if (!sourceUrl) return null;

  const j = (doc.json ?? {}) as Record<string, unknown>;
  const md = doc.markdown ?? "";

  // Address — prefer structured fields, fall back to a single-line parse of
  // metadata.title (most listing pages put the address in the <title>).
  let address = str(get(j, "address")) ?? "";
  let suburb = str(get(j, "suburb")) ?? "";
  let state = str(get(j, "state")) ?? opts.defaultState ?? "SA";
  let postcode = str(get(j, "postcode")) ?? "";
  if (!address || !suburb) {
    const parsed = parseAddressLine(str(doc.metadata?.title) ?? "");
    address = address || parsed.address;
    suburb = suburb || parsed.suburb;
    state = state || parsed.state;
    postcode = postcode || parsed.postcode;
  }

  // Price
  const price = str(get(j, "price")) ?? "Contact Agent";
  const priceNote = str(get(j, "priceNote"));
  const priceNumeric = num(get(j, "priceNumeric")) ?? parsePriceNumeric(price);

  // Specs — prefer JSON, fall back to text extraction
  const fallbackSpecs = extractSpecsFromText(md);
  const beds = num(get(j, "beds")) ?? fallbackSpecs.beds;
  const baths = num(get(j, "baths")) ?? fallbackSpecs.baths;
  const cars = num(get(j, "cars")) ?? fallbackSpecs.cars;
  const land = str(get(j, "land")) ?? fallbackSpecs.land;

  // Type
  const rawType = str(get(j, "type")) ?? "House";
  const type = (VALID_TYPES.has(rawType) ? rawType : "House") as ListingRow["type"];

  // Status
  const status = detectStatus(doc, opts.statusHint ?? str(get(j, "status")));

  // Media
  const hero = str(get(j, "hero")) ?? str(doc.metadata?.ogImage);
  const galleryRaw = arr<unknown>(get(j, "gallery")).map(str).filter((x): x is string => !!x);
  const gallery = hero && !galleryRaw.includes(hero) ? [hero, ...galleryRaw] : galleryRaw;
  const floorplan = str(get(j, "floorplan"));

  // Content
  const headline = str(get(j, "headline")) ?? str(doc.metadata?.description) ?? "";
  const description = arr<unknown>(get(j, "description"))
    .map(str)
    .filter((x): x is string => !!x);
  const features = arr<unknown>(get(j, "features"))
    .map(str)
    .filter((x): x is string => !!x);

  // Agents — accept slugs or names
  const agentNames = arr<unknown>(get(j, "agentNames")).map(str).filter((x): x is string => !!x);
  const explicitSlugs = arr<unknown>(get(j, "agentSlugs")).map(str).filter((x): x is string => !!x);
  const agentSlugs = explicitSlugs.length ? explicitSlugs : agentNames.map(slugifyAgent);

  // Inspections
  const inspections = arr<Record<string, unknown>>(get(j, "inspections"))
    .map((i) => ({ date: str(i.date) ?? "", time: str(i.time) ?? "" }))
    .filter((i) => i.date || i.time);

  return {
    source_url: sourceUrl,
    external_id: deriveExternalId(sourceUrl),
    status,
    address,
    suburb,
    state,
    postcode,
    price,
    price_note: priceNote,
    price_numeric: priceNumeric,
    beds: Math.max(0, Math.trunc(beds)),
    baths: Math.max(0, Math.trunc(baths)),
    cars: Math.max(0, Math.trunc(cars)),
    land,
    type,
    hero,
    gallery,
    floorplan,
    headline,
    description,
    features,
    agent_slugs: agentSlugs,
    inspections,
    raw: { metadata: doc.metadata ?? {}, json: j },
    scraped_at: new Date().toISOString(),
  };
}

/** Map a batch (e.g. `crawl().data`) and drop any rows without a source URL. */
export function mapFirecrawlBatch(
  docs: FirecrawlDoc[],
  opts?: { statusHint?: ListingRow["status"]; defaultState?: string },
): ListingRow[] {
  return docs.map((d) => mapFirecrawlToListing(d, opts)).filter((r): r is ListingRow => r !== null);
}
