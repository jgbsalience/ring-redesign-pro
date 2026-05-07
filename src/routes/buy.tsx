import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/site/ListingCard";
import { listings, suburbs } from "@/data/site";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/buy")({
  head: () => ({
    meta: [
      { title: "For Sale — Ring Real Estate Adelaide" },
      { name: "description", content: "Browse residential properties for sale across metropolitan Adelaide." },
      { property: "og:title", content: "Properties for sale — Ring Real Estate" },
      { property: "og:description", content: "Distinguished homes for sale across metropolitan Adelaide." },
    ],
  }),
  component: BuyPage,
});

function BuyPage() {
  const all = listings.filter((l) => l.status === "for-sale");
  const [suburb, setSuburb] = useState("All suburbs");
  const [type, setType] = useState("Any type");
  const [beds, setBeds] = useState("Any");

  const filtered = useMemo(() => {
    return all.filter((l) =>
      (suburb === "All suburbs" || l.suburb === suburb) &&
      (type === "Any type" || l.type === type) &&
      (beds === "Any" || l.beds >= Number(beds))
    );
  }, [all, suburb, type, beds]);

  return (
    <div className="bg-background text-foreground">
      <Header />
      <div className="pt-28 md:pt-36">
        <div className="container-page">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            <span className="ring-mark" /> &nbsp;Currently for sale
          </div>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tight mt-4 leading-[0.95]">
            Homes worth<br />the patience.
          </h1>

          <div className="mt-12 md:mt-16 bg-secondary/60 p-2 grid grid-cols-2 md:grid-cols-4 gap-2">
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
            <button className="bg-foreground text-background text-xs uppercase tracking-[0.2em] px-5 py-3">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </button>
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
