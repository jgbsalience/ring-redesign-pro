import { useMemo, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ListingCard } from "@/components/site/ListingCard";
import type { Listing } from "@/data/site";
import { suburbs } from "@/data/site";

type Props = {
  source: Listing[];
  pageSize?: number;
  showTypeFilter?: boolean;
  emptyMessage?: React.ReactNode;
};

const TYPES = ["Any type", "House", "Townhouse", "Apartment", "Villa", "Land"];
const BEDS = ["Any", "1", "2", "3", "4", "5"];
const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "price-desc", label: "Price · High to low" },
  { id: "price-asc", label: "Price · Low to high" },
  { id: "beds-desc", label: "Most bedrooms" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

const priceNum = (s: string) => {
  const m = s.replace(/,/g, "").match(/\$?\s*(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : 0;
};

export function ListingsBrowser({
  source,
  pageSize = 12,
  showTypeFilter = true,
  emptyMessage,
}: Props) {
  const [query, setQuery] = useState("");
  const [suburb, setSuburb] = useState("All suburbs");
  const [type, setType] = useState("Any type");
  const [beds, setBeds] = useState("Any");
  const [sort, setSort] = useState<SortId>("newest");
  const [page, setPage] = useState(1);

  const sourceSuburbs = useMemo(() => {
    const set = new Set<string>(suburbs);
    source.forEach((l) => l.suburb && set.add(l.suburb));
    return Array.from(set).sort();
  }, [source]);

  useEffect(() => {
    setPage(1);
  }, [query, suburb, type, beds, sort, source]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = source.filter(
      (l) =>
        (suburb === "All suburbs" || l.suburb === suburb) &&
        (type === "Any type" || l.type === type) &&
        (beds === "Any" || l.beds >= Number(beds)) &&
        (q === "" ||
          l.address.toLowerCase().includes(q) ||
          l.suburb.toLowerCase().includes(q) ||
          l.postcode.toLowerCase().includes(q) ||
          l.headline.toLowerCase().includes(q)),
    );
    const sorted = [...list];
    if (sort === "price-desc") sorted.sort((a, b) => priceNum(b.price) - priceNum(a.price));
    else if (sort === "price-asc") sorted.sort((a, b) => priceNum(a.price) - priceNum(b.price));
    else if (sort === "beds-desc") sorted.sort((a, b) => b.beds - a.beds);
    return sorted;
  }, [source, query, suburb, type, beds, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <>
      <div className="container-page">
        <div className="mt-6 bg-secondary/60 p-2 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_1fr_auto] gap-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-background">
            <Search size={16} className="opacity-50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent w-full outline-none text-sm placeholder:text-muted-foreground"
              placeholder="Suburb, address or keyword"
            />
          </div>
          <select className="bg-background px-4 py-3 text-sm" value={suburb} onChange={(e) => setSuburb(e.target.value)}>
            <option>All suburbs</option>
            {sourceSuburbs.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {showTypeFilter ? (
            <select className="bg-background px-4 py-3 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          ) : (
            <div className="hidden md:block" />
          )}
          <select className="bg-background px-4 py-3 text-sm" value={beds} onChange={(e) => setBeds(e.target.value)}>
            {BEDS.map((b) => (
              <option key={b} value={b}>
                {b === "Any" ? "Any beds" : `${b}+`}
              </option>
            ))}
          </select>
          <select className="bg-background px-4 py-3 text-sm" value={sort} onChange={(e) => setSort(e.target.value as SortId)}>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="bg-foreground text-background text-xs uppercase tracking-[0.2em] px-5 py-3 inline-flex items-center justify-center">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </div>
        </div>
      </div>

      <div className="container-page mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {pageItems.map((l) => (
          <ListingCard key={l.id} l={l} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="container-page text-center py-32 text-muted-foreground">
          {emptyMessage ?? (
            <>
              No matches. <Link to="/contact" className="underline">Talk to us</Link> about an off-market home.
            </>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="container-page mt-14 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs uppercase tracking-[0.2em] border border-border disabled:opacity-40 hover:bg-secondary transition-colors"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={[
                "px-4 py-2 text-xs tracking-[0.2em] border transition-colors",
                n === current
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:bg-secondary",
              ].join(" ")}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current === totalPages}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs uppercase tracking-[0.2em] border border-border disabled:opacity-40 hover:bg-secondary transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </>
  );
}
