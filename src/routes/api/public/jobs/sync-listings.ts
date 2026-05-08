/**
 * POST /api/public/jobs/sync-listings
 *
 * Crawls ring-sa.com.au's Buy / Rent / Sold sections via Firecrawl and
 * upserts the results into `public.listings`.
 *
 * Security: protected by a shared `CRON_SECRET` header. Configure on the
 * caller (pg_cron, GitHub Action, manual curl) as either:
 *   - `Authorization: Bearer <CRON_SECRET>`, or
 *   - `x-cron-secret: <CRON_SECRET>`
 *
 * Body (all optional):
 *   {
 *     "targets": ["for-sale" | "for-rent" | "sold"],   // defaults to all 3
 *     "limit":   number,                                // per-section page cap
 *     "prune":   boolean                                // mark missing as sold/leased
 *   }
 */

import { createFileRoute } from "@tanstack/react-router";
import Firecrawl from "@mendable/firecrawl-js";
import { z } from "zod";
import { upsertFirecrawlListings, type UpsertReport } from "@/lib/firecrawl/upsert.server";
import type { FirecrawlDoc } from "@/lib/firecrawl/mapper";

/* ---------------- Config ---------------- */

type Status = "for-sale" | "for-rent" | "sold";

const SECTIONS: Record<Status, { url: string; includePaths?: string[] }> = {
  "for-sale": {
    url: "https://ring-sa.com.au/buy",
    includePaths: ["^/buy", "^/property", "^/listing"],
  },
  "for-rent": {
    url: "https://ring-sa.com.au/rent",
    includePaths: ["^/rent", "^/property", "^/listing"],
  },
  sold: {
    url: "https://ring-sa.com.au/sold",
    includePaths: ["^/sold", "^/property", "^/listing"],
  },
};

const BodySchema = z.object({
  targets: z
    .array(z.enum(["for-sale", "for-rent", "sold"]))
    .min(1)
    .max(3)
    .optional(),
  limit: z.number().int().min(1).max(500).optional(),
  prune: z.boolean().optional(),
});

/* ---------------- Helpers ---------------- */

function unauthorized(msg = "Unauthorized") {
  return new Response(JSON.stringify({ error: msg }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function checkAuth(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth && auth.replace(/^Bearer\s+/i, "") === secret) return true;
  const xs = request.headers.get("x-cron-secret");
  return xs === secret;
}

async function crawlSection(
  firecrawl: Firecrawl,
  status: Status,
  limit: number,
): Promise<FirecrawlDoc[]> {
  const { url, includePaths } = SECTIONS[status];
  const result = await firecrawl.crawl(url, {
    limit,
    includePaths,
    scrapeOptions: {
      formats: ["markdown", "html"],
      onlyMainContent: true,
    },
    pollInterval: 2,
    timeout: 300,
  });

  // SDK v2 returns documents on `.data`; fall back gracefully.
  const docs = (result as { data?: FirecrawlDoc[] }).data ?? (result as unknown as FirecrawlDoc[]);
  return Array.isArray(docs) ? docs : [];
}

/* ---------------- Route ---------------- */

export const Route = createFileRoute("/api/public/jobs/sync-listings")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!checkAuth(request)) return unauthorized();

        if (!process.env.FIRECRAWL_API_KEY) {
          return new Response(JSON.stringify({ error: "FIRECRAWL_API_KEY not configured" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        let body: z.infer<typeof BodySchema> = {};
        try {
          const text = await request.text();
          if (text) body = BodySchema.parse(JSON.parse(text));
        } catch (err) {
          return new Response(
            JSON.stringify({
              error: "Invalid request body",
              detail: err instanceof Error ? err.message : String(err),
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const targets: Status[] = body.targets ?? ["for-sale", "for-rent", "sold"];
        const limit = body.limit ?? 100;
        const prune = body.prune ?? false;

        const firecrawl = new Firecrawl({
          apiKey: process.env.FIRECRAWL_API_KEY,
        });

        const startedAt = Date.now();
        const reports: Record<string, UpsertReport | { error: string }> = {};

        for (const status of targets) {
          try {
            const docs = await crawlSection(firecrawl, status, limit);
            const report = await upsertFirecrawlListings(docs, {
              statusHint: status,
              pruneMissingForStatus: prune ? status : undefined,
            });
            reports[status] = report;
          } catch (err) {
            reports[status] = {
              error: err instanceof Error ? err.message : String(err),
            };
          }
        }

        return new Response(
          JSON.stringify({
            ok: true,
            durationMs: Date.now() - startedAt,
            targets,
            limit,
            prune,
            reports,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },
    },
  },
});
