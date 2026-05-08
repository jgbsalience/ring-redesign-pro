#!/usr/bin/env node
/**
 * Lightweight policy check for TeamMemberImage's `defaultSizes` map.
 *
 * Parses src/components/site/TeamMemberImage.tsx (no bundler / test runner
 * required) and verifies the `sizes` attribute each preset produces stays
 * within an expected policy at common breakpoints:
 *
 *   - mobile  (360px) — must never resolve to >= 480px
 *   - tablet  (768px) — must never resolve to a vw unit (concrete px only)
 *   - desktop (1280px) — must resolve to a fixed px value
 *
 * Run: `node scripts/check-team-image-sizes.mjs`
 * Exit code 1 on any policy violation (CI-friendly).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(resolve(__dirname, "../src/components/site/TeamMemberImage.tsx"), "utf8");

// --- Extract the defaultSizes object literal ---------------------------------
const block = src.match(/const defaultSizes:[^=]*=\s*{([\s\S]*?)\n};/);
if (!block) {
  console.error("FAIL: could not locate defaultSizes literal");
  process.exit(2);
}
const sizes = {};
for (const line of block[1].split("\n")) {
  const m = line.match(/^\s*"?([\w-]+)"?:\s*"([^"]+)"\s*,?\s*(?:\/\/.*)?$/);
  if (m) sizes[m[1]] = m[2];
}

// --- Tiny `sizes` resolver ---------------------------------------------------
/** Resolve a `sizes` string for a given viewport width (px). */
function resolveSizes(sizesAttr, viewportPx) {
  const parts = sizesAttr.split(",").map((s) => s.trim());
  for (const part of parts) {
    const mq = part.match(/^\((min-width:\s*(\d+)px)\)\s+(.+)$/);
    if (mq) {
      if (viewportPx >= Number(mq[2])) return mq[3];
    } else {
      // default (no media query) — last entry
      return part;
    }
  }
  return parts[parts.length - 1];
}

/** Convert a resolved sizes value (e.g. "480px", "95vw") to px. */
function toPx(value, viewportPx) {
  const px = value.match(/^(\d+(?:\.\d+)?)px$/);
  if (px) return Number(px[1]);
  const vw = value.match(/^(\d+(?:\.\d+)?)vw$/);
  if (vw) return (Number(vw[1]) / 100) * viewportPx;
  return NaN;
}

// --- Policy ------------------------------------------------------------------
const BREAKPOINTS = [
  { name: "mobile-360", vw: 360, maxPx: 480, allowVw: true },
  { name: "mobile-414", vw: 414, maxPx: 480, allowVw: true },
  { name: "tablet-768", vw: 768, maxPx: 800, allowVw: false },
  { name: "desktop-1280", vw: 1280, maxPx: 800, allowVw: false },
  { name: "desktop-1920", vw: 1920, maxPx: 800, allowVw: false },
];

const failures = [];
const rows = [];

for (const [preset, sizesAttr] of Object.entries(sizes)) {
  for (const bp of BREAKPOINTS) {
    const resolved = resolveSizes(sizesAttr, bp.vw);
    const px = toPx(resolved, bp.vw);
    const isVw = /vw$/.test(resolved);
    rows.push({
      preset,
      bp: bp.name,
      resolved,
      px: Number.isFinite(px) ? Math.round(px) : "?",
    });

    if (!Number.isFinite(px)) {
      failures.push(`[${preset} @ ${bp.name}] could not parse resolved value "${resolved}"`);
      continue;
    }
    if (px > bp.maxPx) {
      failures.push(
        `[${preset} @ ${bp.name}] resolved to ${Math.round(px)}px, exceeds policy max ${bp.maxPx}px (raw: "${resolved}")`,
      );
    }
    if (!bp.allowVw && isVw) {
      failures.push(
        `[${preset} @ ${bp.name}] uses vw unit "${resolved}" — policy requires fixed px at this breakpoint`,
      );
    }
  }
}

// --- Report ------------------------------------------------------------------
console.log("\nTeamMemberImage sizes policy check");
console.log("===================================\n");
console.table(rows);

if (failures.length) {
  console.error(`\n${failures.length} policy violation(s):`);
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}
console.log(
  `\n✓ All ${Object.keys(sizes).length} presets pass policy across ${BREAKPOINTS.length} breakpoints.`,
);
