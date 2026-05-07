import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingsBrowser } from "@/components/site/ListingsBrowser";
import { BannerHero } from "@/components/site/BannerHero";
import { listings } from "@/data/site";
import { useMemo, useState } from "react";

const BUY_SLIDES = listings.filter((l) => l.status === "for-sale" && l.hero).slice(0, 6);

export const Route = createFileRoute("/buy/")({
  head: () => ({
    meta: [
      { title: "Properties — Ring Real Estate Adelaide" },
      { name: "description", content: "Browse residential properties for sale, for rent and recently sold across metropolitan Adelaide." },
      { property: "og:title", content: "Properties — Ring Real Estate" },
      { property: "og:description", content: "Distinguished homes for sale, for rent and recently sold across metropolitan Adelaide." },
    ],
  }),
  component: BuyPage,
});

const STATUSES = [
  { id: "for-sale", label: "For Sale" },
  { id: "for-rent", label: "For Rent" },
  { id: "sold", label: "Sold" },
] as const;

type StatusId = typeof STATUSES[number]["id"];

function BuyPage() {
  const [status, setStatus] = useState<StatusId>("for-sale");
  const [query, setQuery] = useState("");
  const [suburb, setSuburb] = useState("All suburbs");
  const [type, setType] = useState("Any type");
  const [beds, setBeds] = useState("Any");

  const counts = useMemo(() => ({
    "for-sale": listings.filter((l) => l.status === "for-sale").length,
    "for-rent": listings.filter((l) => l.status === "for-rent").length,
    "sold": listings.filter((l) => l.status === "sold").length,
  }), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) =>
      l.status === status &&
      (suburb === "All suburbs" || l.suburb === suburb) &&
      (type === "Any type" || l.type === type) &&
      (beds === "Any" || l.beds >= Number(beds)) &&
      (q === "" ||
        l.address.toLowerCase().includes(q) ||
        l.suburb.toLowerCase().includes(q) ||
        l.postcode.toLowerCase().includes(q))
    );
  }, [status, query, suburb, type, beds]);

  const heading = status === "for-sale"
    ? { kicker: "Currently for sale", title: ["Homes worth", "the patience."] }
    : status === "for-rent"
    ? { kicker: "Available to rent", title: ["A home,", "well managed."] }
    : { kicker: "Recent results", title: ["Quietly,", "exceptionally."] };

  return (
    <div className="bg-background text-foreground">
      <Header overlay />
      <BannerHero
        slides={BUY_SLIDES}
        kicker={heading.kicker}
        title={<>{heading.title[0]}<br /><span className="italic font-light">{heading.title[1]}</span></>}
        subtitle="Distinguished homes across metropolitan Adelaide — curated, not collected."
      />
      <div className="pt-14 md:pt-20">
        <div className="container-page">
          {/* Status tabs */}
          <div className="mt-2 md:mt-4 flex items-center gap-1 border-b border-border overflow-x-auto">
            {STATUSES.map((s) => {
              const active = s.id === status;
              return (
                <button
                  key={s.id}
                  onClick={() => setStatus(s.id)}
                  className={[
                    "px-5 md:px-6 py-3 text-xs uppercase tracking-[0.22em] -mb-px border-b-2 transition-colors whitespace-nowrap",
                    active
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {s.label}
                  <span className="ml-2 text-[10px] opacity-60">{counts[s.id]}</span>
                </button>
              );
            })}
          </div>

          {/* Filters */}
          <div className="mt-6 bg-secondary/60 p-2 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] gap-2">
            <div className="flex items-center gap-3 px-4 py-3 bg-background">
              <Search size={16} className="opacity-50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent w-full outline-none text-sm placeholder:text-muted-foreground"
                placeholder="Suburb, address or postcode"
              />
            </div>
            <select className="bg-background px-4 py-3 text-sm" value={suburb} onChange={(e) => setSuburb(e.target.value)}>
              <option>All suburbs</option>
              {suburbs.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select className="bg-background px-4 py-3 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
              <option>Any type</option>
              <option>House</option><option>Townhouse</option><option>Apartment</option><option>Villa</option><option>Land</option>
            </select>
            <select className="bg-background px-4 py-3 text-sm" value={beds} onChange={(e) => setBeds(e.target.value)}>
              <option value="Any">Any beds</option>
              <option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option>
            </select>
            <div className="bg-foreground text-background text-xs uppercase tracking-[0.2em] px-5 py-3 inline-flex items-center justify-center">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </div>
          </div>
        </div>

        <div className="container-page mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filtered.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>

        {filtered.length === 0 && (
          <div className="container-page text-center py-32 text-muted-foreground">
            No matches. <Link to="/contact" className="underline">Talk to us</Link> about an off-market home.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
