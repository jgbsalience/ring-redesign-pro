import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const UA = "RingRealEstateAdelaide/1.0 (admin@ring-sa.com.au)";

async function geocodeOne(query: string): Promise<{ lat: number; lon: number } | null> {
  const url = `${NOMINATIM}?format=json&limit=1&countrycodes=au&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) return null;
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (!data.length) return null;
  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return { lat, lon };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const geocodeMissingListings = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ limit: z.number().int().min(1).max(50).default(20) }).parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("listings")
      .select("id, address, suburb, state, postcode")
      .is("latitude", null)
      .limit(data.limit);

    if (error) throw new Error(error.message);
    if (!rows?.length) return { processed: 0, geocoded: 0, failed: 0 };

    let geocoded = 0;
    let failed = 0;
    const failures: string[] = [];

    for (const r of rows) {
      const parts = [r.address, r.suburb, r.state, r.postcode, "Australia"]
        .filter(Boolean)
        .join(", ");

      try {
        let result = await geocodeOne(parts);
        if (!result) {
          // Fallback to suburb-level
          await sleep(1100);
          const fallback = [r.suburb, r.state, r.postcode, "Australia"]
            .filter(Boolean)
            .join(", ");
          result = await geocodeOne(fallback);
        }

        if (result) {
          const { error: upErr } = await supabaseAdmin
            .from("listings")
            .update({
              latitude: result.lat,
              longitude: result.lon,
              geocoded_at: new Date().toISOString(),
            })
            .eq("id", r.id);
          if (upErr) {
            failed += 1;
            failures.push(`${r.id}: ${upErr.message}`);
          } else {
            geocoded += 1;
          }
        } else {
          failed += 1;
          failures.push(`${r.id}: no match for "${parts}"`);
        }
      } catch (e) {
        failed += 1;
        failures.push(`${r.id}: ${(e as Error).message}`);
      }

      // Nominatim policy: max 1 request/second
      await sleep(1100);
    }

    return { processed: rows.length, geocoded, failed, failures: failures.slice(0, 10) };
  });
