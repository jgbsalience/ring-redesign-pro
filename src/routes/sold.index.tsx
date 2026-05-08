import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { canonical } from "@/lib/seo";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/site/ListingCard";
import { PortfolioCarousel } from "@/components/site/PortfolioCarousel";
import { listings } from "@/data/site";
import { listingsSearchSchema } from "@/lib/listingsSearch";
import { useMemo, useRef } from "react";
import { Search, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/sold/")({
  validateSearch: zodValidator(listingsSearchSchema),
  head: () => ({
    meta: [
      { title: "Recently sold — Ring Real Estate Adelaide" },
      {
        name: "description",
        content:
          "A quiet record of recent sales across metropolitan Adelaide — distinguished homes, sold with care by Ring Real Estate.",
      },
      { property: "og:title", content: "Recently sold — Ring Real Estate" },
      {
        property: "og:description",
        content:
          "Recent results across Blackwood, Coromandel Valley, Bellevue Heights and beyond.",
      },
    ],
    links: canonical("/sold"),
  }),
  component: SoldIndex,
});

function SoldIndex() {
  const [query, setQuery] = useState("");
  const [suburb, setSuburb] = useState("All suburbs");
  const [type, setType] = useState("Any type");
  const [beds, setBeds] = useState("Any");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 16;
  const gridRef = useRef<HTMLDivElement>(null);

  const sold = useMemo(() => listings.filter((l) => l.status === "sold"), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sold.filter(
      (l) =>
        (suburb === "All suburbs" || l.suburb === suburb) &&
        (type === "Any type" || l.type === type) &&
        (beds === "Any" || l.beds >= Number(beds)) &&
        (q === "" ||
          l.address.toLowerCase().includes(q) ||
          l.suburb.toLowerCase().includes(q) ||
          l.postcode.toLowerCase().includes(q))
    );
  }, [sold, query, suburb, type, beds]);

  const soldSuburbs = useMemo(
    () => Array.from(new Set(sold.map((l) => l.suburb).filter(Boolean))).sort(),
    [sold]
  );

  useEffect(() => {
    setPage(1);
  }, [query, suburb, type, beds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const goToPage = (n: number) => {
    setPage(n);
    if (typeof window !== "undefined") {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div className="bg-background text-foreground">
      <Header />
      <div className="pt-28 md:pt-36">
        <div className="container-page">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            <span className="ring-mark" /> &nbsp;Recent results
          </div>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tight mt-4 leading-[0.95]">
            Quietly,
            <br />
            exceptionally.
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
            A selection of recently sold residential properties — handled with
            the same patience and judgement we bring to every campaign.
          </p>

          {/* Filters */}
          <div className="mt-10 bg-secondary/60 p-2 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] gap-2">
            <div className="flex items-center gap-3 px-4 py-3 bg-background">
              <Search size={16} className="opacity-50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Suburb, address or postcode"
                className="bg-transparent w-full outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
            <select
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              className="bg-background px-4 py-3 text-sm outline-none"
            >
              <option>All suburbs</option>
              {soldSuburbs.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-background px-4 py-3 text-sm outline-none"
            >
              <option>Any type</option>
              <option>House</option>
              <option>Townhouse</option>
              <option>Apartment</option>
              <option>Land</option>
              <option>Villa</option>
            </select>
            <select
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              className="bg-background px-4 py-3 text-sm outline-none"
            >
              <option>Any</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
            <div className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.2em] inline-flex items-center justify-center">
              {filtered.length} results
            </div>
          </div>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="container-page mt-12 md:mt-16 pb-24 md:pb-32 scroll-mt-28">
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground">
              No matching results. Try widening your filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-y-16">
                {pageItems.map((l) => (
                  <ListingCard key={l.id} l={l} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(Math.max(1, current - 1))}
                    disabled={current === 1}
                    className="inline-flex items-center gap-1 px-4 py-2 text-xs uppercase tracking-[0.2em] border border-border disabled:opacity-40 hover:bg-secondary transition-colors"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => goToPage(n)}
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
                    onClick={() => goToPage(Math.min(totalPages, current + 1))}
                    disabled={current === totalPages}
                    className="inline-flex items-center gap-1 px-4 py-2 text-xs uppercase tracking-[0.2em] border border-border disabled:opacity-40 hover:bg-secondary transition-colors"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* CTA */}
        <section className="bg-foreground text-background">
          <div className="container-page py-24 md:py-32 grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <div className="text-[10px] uppercase tracking-[0.32em] opacity-70">
                <span className="ring-mark" /> &nbsp;Considering a sale?
              </div>
              <h2 className="font-serif text-4xl md:text-6xl mt-4 tracking-tight leading-[1]">
                A quiet conversation,
                <br />
                a considered result.
              </h2>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 border border-background/40 px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-background hover:text-foreground transition-colors"
              >
                Request an appraisal <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <PortfolioCarousel items={listings.filter((l) => l.status === "sold" && l.hero)} />
      <Footer />
    </div>
  );
}
