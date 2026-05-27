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
import { Search, ArrowUpRight, ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";
import * as Select from "@radix-ui/react-select";

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
        content: "Recent results across Blackwood, Coromandel Valley, Bellevue Heights and beyond.",
      },
    ],
    links: canonical("/sold"),
  }),
  component: SoldIndex,
});

function SoldIndex() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const query = search.q;
  const suburb = search.suburb;
  const type = search.type;
  const beds = search.beds;
  const page = search.page;
  const PAGE_SIZE = 16;
  const gridRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<typeof search>, resetPage = true) => {
    const isPageOnly = !resetPage && Object.keys(patch).length === 1 && "page" in patch;
    navigate({
      to: "/sold",
      search: (prev: typeof search) => ({ ...prev, ...patch, ...(resetPage ? { page: 1 } : {}) }),
      replace: !isPageOnly,
    });
  };

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
          l.postcode.toLowerCase().includes(q)),
    );
  }, [sold, query, suburb, type, beds]);

  const soldSuburbs = useMemo(
    () => Array.from(new Set(sold.map((l) => l.suburb).filter(Boolean))).sort(),
    [sold],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const goToPage = (n: number) => {
    update({ page: n }, false);
    if (typeof window !== "undefined") {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div className="bg-background text-foreground">
      <Header />
      <span id="main-content" tabIndex={-1} className="sr-only" aria-hidden="true" />
      <div className="pt-28 md:pt-36">
        <div className="container-page">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            <span className="ring-mark" /> &nbsp;Recent results
          </div>
          <h1 className="text-5xl md:text-7xl tracking-tight mt-4 leading-[0.95] font-serif">
            Recently Sold
            <br />
            Properties
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
            A selection of recently sold residential properties — handled with the same patience and
            judgement we bring to every campaign.
          </p>

          {/* Filters */}
          <div className="mt-10 bg-secondary/60 p-2 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] gap-2">
            <div className="flex items-center gap-3 px-4 py-3 bg-background">
              <Search size={16} className="opacity-50" />
              <input
                value={query}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Suburb, address or postcode"
                className="bg-transparent w-full outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
            <CustomSelect
              value={suburb}
              onValueChange={(v) => update({ suburb: v })}
              ariaLabel="Suburb"
              placeholder="All suburbs"
              options={[
                { value: "All suburbs", label: "All suburbs" },
                ...soldSuburbs.map((s) => ({ value: s, label: s })),
              ]}
            />
            <CustomSelect
              value={type}
              onValueChange={(v) => update({ type: v })}
              ariaLabel="Property type"
              placeholder="Any type"
              options={["Any type", "House", "Townhouse", "Apartment", "Land", "Villa"].map(
                (t) => ({ value: t, label: t }),
              )}
            />
            <CustomSelect
              value={beds}
              onValueChange={(v) => update({ beds: v })}
              ariaLabel="Bedrooms"
              placeholder="Any"
              options={["Any", "1", "2", "3", "4", "5"].map((b) => ({ value: b, label: b }))}
            />
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
                <br />a considered result.
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

function CustomSelect({
  value,
  onValueChange,
  options,
  placeholder,
  ariaLabel,
  className = "",
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={`bg-background border border-border px-4 py-3 text-sm flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--ringgreen)] focus:ring-inset ${className}`}
        aria-label={ariaLabel}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown size={14} className="opacity-50" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="bg-background border border-border shadow-xl z-50 min-w-[var(--radix-select-trigger-width)]"
          position="popper"
          sideOffset={4}
          align="start"
        >
          <Select.Viewport className="p-1">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="text-sm px-8 py-2 cursor-pointer outline-none data-[highlighted]:bg-secondary data-[highlighted]:text-foreground relative flex items-center"
              >
                <Select.ItemIndicator className="absolute left-2 flex items-center justify-center">
                  <Check size={14} />
                </Select.ItemIndicator>
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
