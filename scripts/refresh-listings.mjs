#!/usr/bin/env node
// One-off: refresh agent assignments + key fields in src/data/ring.json
// from live ring-sa.com.au listing pages. Direct fetch (no API key needed).

import fs from "node:fs/promises";
import path from "node:path";

const DATA = path.resolve("src/data/ring.json");

const EMAIL_TO_AGENT = {
  stephen: "stephen-ring",
  luke: "luke-bull",
  soozie: "soozie-bice",
  rachel: "rachel-brooke",
  toni: "toni-dalcin",
};
// "ring@" is the office mailbox — ignore.
const IGNORE_LOCAL = new Set(["ring", "info", "admin", "office", "rentals", "sales"]);

function statusFromUrl(url) {
  if (/\/sold-residential-real-estate\//.test(url)) return "sold";
  if (/\/leased-residential-real-estate\//.test(url)) return "leased";
  if (/\/rent-residential-real-estate\//.test(url) || /residential-for-rent/.test(url)) return "for-rent";
  return "for-sale";
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (RingDataRefresh)" },
    redirect: "follow",
  });
  return { status: res.status, html: res.status === 200 ? await res.text() : "" };
}

function extractAgents(html) {
  const emails = [...html.matchAll(/mailto:([a-z0-9._-]+)@ring-sa\.com\.au/gi)].map((m) => m[1].toLowerCase());
  const seen = new Set();
  const ids = [];
  for (const local of emails) {
    if (IGNORE_LOCAL.has(local)) continue;
    const id = EMAIL_TO_AGENT[local];
    if (!id) {
      if (!seen.has("UNKNOWN:" + local)) {
        seen.add("UNKNOWN:" + local);
        ids.push({ unknown: local });
      }
      continue;
    }
    if (seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

function extractPrice(html) {
  // Try common patterns; fall back to nothing.
  const m = html.match(/<[^>]*class="[^"]*(?:price|listing-price)[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i);
  if (!m) return null;
  const txt = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return txt || null;
}

function extractStats(html) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const out = {};
  const land = text.match(/([\d,.]+\s*sqm)/i);
  if (land) out.land = land[1];
  return out;
}

async function main() {
  const raw = JSON.parse(await fs.readFile(DATA, "utf8"));
  const listings = raw.listings;
  const report = [];
  let i = 0;

  for (const l of listings) {
    i++;
    const url = l.url;
    if (!url) {
      report.push({ id: l.id, skipped: "no url" });
      continue;
    }
    process.stdout.write(`[${i}/${listings.length}] ${l.id} ... `);
    let r;
    try {
      r = await fetchHtml(url);
    } catch (e) {
      console.log(`ERR ${e.message}`);
      report.push({ id: l.id, error: e.message });
      continue;
    }
    if (r.status !== 200) {
      console.log(`HTTP ${r.status}`);
      report.push({ id: l.id, http: r.status });
      continue;
    }

    const before = (l.agentSlugs || []).slice();
    const agentResults = extractAgents(r.html);
    const knownIds = agentResults.filter((x) => typeof x === "string");
    const unknowns = agentResults.filter((x) => x && typeof x === "object").map((x) => x.unknown);

    const status = statusFromUrl(url);
    const stats = extractStats(r.html);
    const price = extractPrice(r.html);

    const changes = {};
    if (knownIds.length && JSON.stringify(knownIds) !== JSON.stringify(before)) {
      changes.agents = { from: before, to: knownIds };
      l.agentSlugs = knownIds;
    } else if (!knownIds.length) {
      changes.agents = { warn: "no agents matched on page", before };
    }
    if (status && status !== l.status) {
      changes.status = { from: l.status, to: status };
      l.status = status;
    }
    if (stats.land && stats.land !== l.land) {
      // Only update if existing is empty/different format slightly
      if (!l.land) {
        changes.land = { from: l.land, to: stats.land };
        l.land = stats.land;
      }
    }
    if (price && price !== l.price && !/contact/i.test(l.price || "")) {
      changes.price = { from: l.price, to: price };
      l.price = price;
    }

    if (unknowns.length) changes.unknown_agents = unknowns;

    console.log(JSON.stringify({ agents: knownIds, ...changes }));
    if (Object.keys(changes).length) report.push({ id: l.id, ...changes });

    // light pacing
    await new Promise((r) => setTimeout(r, 150));
  }

  await fs.writeFile(DATA, JSON.stringify(raw, null, 2));
  await fs.writeFile("/tmp/refresh-report.json", JSON.stringify(report, null, 2));
  console.log(`\nDone. ${report.length} listings changed/warned. Report: /tmp/refresh-report.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
