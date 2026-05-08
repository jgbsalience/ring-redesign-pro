import { createFileRoute } from "@tanstack/react-router";
import { listings } from "@/data/site";

const SITE_URL = "https://ring-sa.com.au";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/buy", priority: "0.9", changefreq: "daily" },
  { path: "/rent", priority: "0.9", changefreq: "daily" },
  { path: "/sell", priority: "0.8", changefreq: "monthly" },
  { path: "/sell/appraisal", priority: "0.8", changefreq: "monthly" },
  { path: "/sold", priority: "0.7", changefreq: "weekly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/complaints", priority: "0.3", changefreq: "yearly" },
  { path: "/trust-account", priority: "0.3", changefreq: "yearly" },
];

function url(path: string, priority: string, changefreq: string) {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildSitemap() {
  const staticUrls = STATIC_PAGES.map((p) => url(p.path, p.priority, p.changefreq));

  const listingUrls = listings.map((l) => {
    const base = l.status === "for-sale" ? "/buy" : l.status === "for-rent" ? "/rent" : "/sold";
    const priority = l.status === "for-sale" || l.status === "for-rent" ? "0.8" : "0.5";
    return url(`${base}/${l.id}`, priority, "weekly");
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...listingUrls].join("\n")}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemap(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
