import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const UA = "RingRealEstateAdelaide/1.0 (admin@ring-sa.com.au)";

const bodySchema = z
  .object({
    limit: z.number().int().min(1).max(50).default(20),
  })
  .partial()
  .default({});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function geocodeOne(query: string) {
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

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const bearer = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-cron-secret");
  if (bearer === `Bearer ${secret}`) return true;
  if (headerSecret === secret) return true;
  return false;
}

export const Route = createFileRoute("/api/public/jobs/geocode-listings")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!authorized(request)) {
          return new Response("Unauthorized", { status: 401 });
        }

        let parsed;
        try {
          const raw = await request.json().catch(() => ({}));
          parsed = bodySchema.parse(raw ?? {});
        } catch (e) {
          return Response.json({ error: (e as Error).message }, { status: 400 });
        }

        const limit = parsed.limit ?? 20;

        const { data: rows, error } = await supabaseAdmin
          .from("listings")
          .select("id, address, suburb, state, postcode")
          .is("latitude", null)
          .limit(limit);

        if (error) {
          return Response.json({ error: error.message }, { status: 500 });
        }
        if (!rows?.length) {
          return Response.json({ processed: 0, geocoded: 0, failed: 0 });
        }

        let geocoded = 0;
        let failed = 0;
        const failures: string[] = [];

        for (const r of rows) {
          const full = [r.address, r.suburb, r.state, r.postcode, "Australia"]
            .filter(Boolean)
            .join(", ");
          try {
            let result = await geocodeOne(full);
            if (!result) {
              await sleep(1100);
              const fb = [r.suburb, r.state, r.postcode, "Australia"].filter(Boolean).join(", ");
              result = await geocodeOne(fb);
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
              failures.push(`${r.id}: no match`);
            }
          } catch (e) {
            failed += 1;
            failures.push(`${r.id}: ${(e as Error).message}`);
          }
          await sleep(1100);
        }

        return Response.json({
          processed: rows.length,
          geocoded,
          failed,
          failures: failures.slice(0, 10),
        });
      },
    },
  },
});
