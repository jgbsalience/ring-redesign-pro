import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search, Bed, Bath, Car, ChevronLeft, ChevronRight, LayoutGrid, Map as MapIcon } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingsMap } from "@/components/site/ListingsMap";
import { supabase } from "@/integrations/supabase/client";

/* ---------------- Search params ---------------- */

const STATUSES = ["buy", "rent", "sold"] as const;
type StatusKey = (typeof STATUSES)[number];

const STATUS_TO_DB: Record<StatusKey, string[]> = {
  buy: ["for-sale"],
  rent: ["for-rent", "leased"],
  sold: ["sold"],
};

const SORTS = ["featured", "newest", "price-asc", "price-desc"] as const;
type SortKey = (typeof SORTS)[number];

const VIEWS = ["grid", "map"] as const;
type ViewKey = (typeof VIEWS)[number];

const searchSchema = z.object({
  status: fallback(z.enum(STATUSES), "buy").default("buy"),
  minPrice: fallback(z.number().int().min(0), 0).default(0),
  maxPrice: fallback(z.number().int().min(0), 0).default(0),
  beds: fallback(z.number().int().min(0).max(10), 0).default(0),
  baths: fallback(z.number().int().min(0).max(10), 0).default(0),
  q: fallback(z.string(), "").default(""),
  sort: fallback(z.enum(SORTS), "featured").default("featured"),
  view: fallback(z.enum(VIEWS), "grid").default("grid"),
  page: fallback(z.number().int().min(1).max(500), 1).default(1),
});

const PAGE_SIZE = 12;

/* ---------------- Route ---------------- */

export const Route = createFileRoute("/listings")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Listings — Ring Real Estate Adelaide" },
      {
        name: "description",
        content:
          "Browse Adelaide homes for sale, for rent and recently sold by Ring Real Estate. Filter by price, bedrooms and bathrooms across the southern foothills and metropolitan Adelaide.",
      },
      { property: "og:title", content: "Listings — Ring Real Estate Adelaide" },
      {
        property: "og:description",
        content:
          "Adelaide homes for sale, for rent and recently sold. Filter by price, beds and baths.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ring-sa.com.au/listings" }],
  }),
  component: ListingsPage,
});

/* ---------------- Types ---------------- */

type Row = {
  id: string;
  source_url: string;
  status: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string | null;
  price: string;
  price_numeric: number | null;
  beds: number;
  baths: number;
  cars: number;
  type: string;
  hero: string | null;
  headline: string;
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
};

/* ---------------- Page ---------------- */

type SearchParams = z.infer<typeof searchSchema>;

async function fetchListings(search: SearchParams): Promise<{ rows: Row[]; count: number }> {
  const dbStatuses = STATUS_TO_DB[search.status as StatusKey];
  const isMap = search.view === "map";
  const from = isMap ? 0 : (search.page - 1) * PAGE_SIZE;
  const to = isMap ? 499 : from + PAGE_SIZE - 1;

  let query = supabase
    .from("listings")
    .select(
      "id, source_url, status, address, suburb, state, postcode, price, price_numeric, beds, baths, cars, type, hero, headline, featured, latitude, longitude",
      { count: "exact" },
    )
    .in("status", dbStatuses);

  if (search.sort === "featured") {
    query = query
      .order("featured", { ascending: false })
      .order("scraped_at", { ascending: false });
  } else if (search.sort === "newest") {
    query = query.order("scraped_at", { ascending: false });
  } else if (search.sort === "price-asc") {
    query = query
      .order("price_numeric", { ascending: true, nullsFirst: false })
      .order("scraped_at", { ascending: false });
  } else if (search.sort === "price-desc") {
    query = query
      .order("price_numeric", { ascending: false, nullsFirst: false })
      .order("scraped_at", { ascending: false });
  }

  query = query.range(from, to);

  if (search.minPrice > 0) query = query.gte("price_numeric", search.minPrice);
  if (search.maxPrice > 0) query = query.lte("price_numeric", search.maxPrice);
  if (search.beds > 0) query = query.gte("beds", search.beds);
  if (search.baths > 0) query = query.gte("baths", search.baths);
  if (search.q.trim()) {
    const term = `%${search.q.trim()}%`;
    query = query.or(
      `address.ilike.${term},suburb.ilike.${term},postcode.ilike.${term},headline.ilike.${term}`,
    );
  }

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { rows: (data ?? []) as Row[], count: count ?? 0 };
}

function ListingsPage() {
  const search: SearchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  // local input state for the search box (debounced into URL)
  const [qInput, setQInput] = useState(search.q);
  useEffect(() => setQInput(search.q), [search.q]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (qInput !== search.q) {
        navigate({
          search: (prev: SearchParams) => ({ ...prev, q: qInput, page: 1 }),
          replace: true,
          resetScroll: false,
        });
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput]);

  const { data, error, isPending, isFetching, isPlaceholderData } = useQuery({
    queryKey: [
      "listings",
      search.status,
      search.minPrice,
      search.maxPrice,
      search.beds,
      search.baths,
      search.q,
      search.sort,
      search.view,
      search.page,
    ],
    queryFn: () => fetchListings(search),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const rows = data?.rows ?? [];
  const count = data?.count ?? 0;
  const showInitialSkeleton = isPending;
  const isRefetching = isFetching && (isPlaceholderData || !isPending);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header />

      <section className="bg-secondary/40 border-b border-border">
        <div className="container-page py-16 md:py-20">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Adelaide listings · live
          </div>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight mt-4 leading-[1.05]">
            Homes for sale, rent, <span className="italic">and recently sold.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">
            The full Ring Real Estate database, filterable by status, price and
            specifications. Updated continuously from our live system.
          </p>
        </div>
      </section>

      <FiltersBar search={search} navigate={navigate} qInput={qInput} setQInput={setQInput} disabled={isFetching} />

      <ActiveFilterChips search={search} navigate={navigate} setQInput={setQInput} />

      <div className="container-page mt-8 flex-1">
        {error ? (
          <div className="text-center py-32 text-destructive">
            Couldn't load listings: {error.message}
          </div>
        ) : showInitialSkeleton ? (
          <>
            <div className="h-3 w-24 bg-muted animate-pulse mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="h-4 bg-muted mt-5 w-1/3" />
                  <div className="h-6 bg-muted mt-3 w-2/3" />
                  <div className="h-4 bg-muted mt-3 w-1/2" />
                </div>
              ))}
            </div>
          </>
        ) : rows.length === 0 ? (
          <div className="text-center py-32 text-muted-foreground">
            No matches for those filters.{" "}
            <Link to="/contact" className="underline">
              Talk to us
            </Link>{" "}
            about an off-market home.
          </div>
        ) : (
          <>
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-8 flex items-center gap-3">
              <span>
                {count} {count === 1 ? "result" : "results"}
                {search.view === "map" && rows.length < count && (
                  <span className="ml-2 normal-case tracking-normal text-[11px]">
                    (showing first {rows.length} on map)
                  </span>
                )}
              </span>
              {isRefetching && (
                <span
                  aria-live="polite"
                  className="inline-flex items-center gap-2 normal-case tracking-normal text-[11px] text-muted-foreground"
                >
                  <span className="h-3 w-3 rounded-full border-2 border-muted-foreground/30 border-t-foreground animate-spin" />
                  Updating…
                </span>
              )}
            </div>
            <div
              aria-busy={isRefetching}
              className={[
                "transition-opacity duration-200",
                isRefetching ? "opacity-50 pointer-events-none" : "opacity-100",
              ].join(" ")}
            >
              {search.view === "map" ? (
                <ListingsMap rows={rows} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {rows.map((r) => (
                    <ListingDbCard key={r.id} r={r} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {totalPages > 1 && !showInitialSkeleton && search.view !== "map" && (
        <div className="container-page mt-14 mb-20 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={search.page === 1}
            onClick={() =>
              navigate({
                search: (p: z.infer<typeof searchSchema>) => ({ ...p, page: Math.max(1, p.page - 1) }),
              })
            }
            className="inline-flex items-center gap-1 px-4 py-2 text-xs uppercase tracking-[0.2em] border border-border disabled:opacity-40 hover:bg-secondary transition-colors"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Page {search.page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={search.page >= totalPages}
            onClick={() =>
              navigate({
                search: (p: z.infer<typeof searchSchema>) => ({ ...p, page: Math.min(totalPages, p.page + 1) }),
              })
            }
            className="inline-flex items-center gap-1 px-4 py-2 text-xs uppercase tracking-[0.2em] border border-border disabled:opacity-40 hover:bg-secondary transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

/* ---------------- Active filter chips ---------------- */

type SearchT = z.infer<typeof searchSchema>;

function ActiveFilterChips({
  search,
  navigate,
  setQInput,
}: {
  search: SearchT;
  navigate: ReturnType<typeof Route.useNavigate>;
  setQInput: (v: string) => void;
}) {
  const chips: { key: string; label: string; reset: Partial<SearchT> }[] = [];

  if (search.q.trim()) {
    chips.push({ key: "q", label: `“${search.q.trim()}”`, reset: { q: "" } });
  }
  if (search.minPrice > 0) {
    chips.push({
      key: "minPrice",
      label: `Min ${formatShortPrice(search.minPrice)}`,
      reset: { minPrice: 0 },
    });
  }
  if (search.maxPrice > 0) {
    chips.push({
      key: "maxPrice",
      label: `Max ${formatShortPrice(search.maxPrice)}`,
      reset: { maxPrice: 0 },
    });
  }
  if (search.beds > 0) {
    chips.push({ key: "beds", label: `${search.beds}+ beds`, reset: { beds: 0 } });
  }
  if (search.baths > 0) {
    chips.push({ key: "baths", label: `${search.baths}+ baths`, reset: { baths: 0 } });
  }

  if (chips.length === 0) return null;

  const clearOne = (patch: Partial<SearchT>) => {
    if ("q" in patch) setQInput("");
    navigate({ search: (prev: SearchT) => ({ ...prev, ...patch, page: 1 }), resetScroll: false });
  };

  const clearAll = () => {
    setQInput("");
    navigate({
      search: (prev: SearchT) => ({
        ...prev,
        minPrice: 0,
        maxPrice: 0,
        beds: 0,
        baths: 0,
        q: "",
        page: 1,
      }),
      resetScroll: false,
    });
  };

  return (
    <div className="container-page mt-4 flex flex-wrap items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mr-1">
        Filters
      </span>
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => clearOne(c.reset)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs border border-border bg-background hover:bg-secondary transition-colors"
          aria-label={`Remove filter ${c.label}`}
        >
          <span>{c.label}</span>
          <span aria-hidden="true" className="opacity-60">×</span>
        </button>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="ml-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

/* ---------------- Filters ---------------- */

function FiltersBar({
  search,
  navigate,
  qInput,
  setQInput,
  disabled = false,
}: {
  search: z.infer<typeof searchSchema>;
  navigate: ReturnType<typeof Route.useNavigate>;
  qInput: string;
  setQInput: (v: string) => void;
  disabled?: boolean;
}) {
  const update = <K extends keyof z.infer<typeof searchSchema>>(
    key: K,
    value: z.infer<typeof searchSchema>[K],
  ) => {
    navigate({
      search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, [key]: value, page: 1 }),
      resetScroll: false,
    });
  };

  return (
    <fieldset
      disabled={disabled}
      aria-busy={disabled}
      className={[
        "container-page mt-8 border-0 p-0 m-0 min-w-0 transition-opacity",
        disabled ? "opacity-70" : "opacity-100",
      ].join(" ")}
    >
      {/* Status tabs */}
      <div className="flex gap-2 border-b border-border">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => update("status", s)}
            className={[
              "px-5 py-3 text-xs uppercase tracking-[0.22em] border-b-2 -mb-px transition-colors",
              search.status === s
                ? "border-[var(--ringgreen)] text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {s === "buy" ? "For Sale" : s === "rent" ? "For Rent" : "Sold"}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr_auto] gap-2 bg-secondary/60 p-2">
        <label className="flex items-center gap-3 px-4 py-3 bg-background">
          <Search size={16} className="opacity-50" />
          <input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            className="bg-transparent w-full outline-none text-sm placeholder:text-muted-foreground"
            placeholder="Suburb, address, postcode, keyword"
          />
        </label>

        <select
          className="bg-background px-4 py-3 text-sm"
          value={search.minPrice}
          onChange={(e) => update("minPrice", Number(e.target.value))}
        >
          <option value={0}>Min price</option>
          {priceOptions(search.status).map((p) => (
            <option key={`min-${p}`} value={p}>
              {formatShortPrice(p)}+
            </option>
          ))}
        </select>

        <select
          className="bg-background px-4 py-3 text-sm"
          value={search.maxPrice}
          onChange={(e) => update("maxPrice", Number(e.target.value))}
        >
          <option value={0}>Max price</option>
          {priceOptions(search.status).map((p) => (
            <option key={`max-${p}`} value={p}>
              up to {formatShortPrice(p)}
            </option>
          ))}
        </select>

        <select
          className="bg-background px-4 py-3 text-sm"
          value={search.beds}
          onChange={(e) => update("beds", Number(e.target.value))}
        >
          <option value={0}>Any beds</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+ beds
            </option>
          ))}
        </select>

        <select
          className="bg-background px-4 py-3 text-sm"
          value={search.baths}
          onChange={(e) => update("baths", Number(e.target.value))}
        >
          <option value={0}>Any baths</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}+ baths
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() =>
            navigate({
              search: () => ({
                status: search.status,
                minPrice: 0,
                maxPrice: 0,
                beds: 0,
                baths: 0,
                q: "",
                sort: "featured",
                view: search.view,
                page: 1,
              }),
            })
          }
          className="bg-foreground text-background text-xs uppercase tracking-[0.2em] px-5 py-3 hover:opacity-90 transition-opacity"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex border border-border">
          <button
            type="button"
            onClick={() => update("view", "grid")}
            aria-pressed={search.view === "grid"}
            className={[
              "inline-flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors",
              search.view === "grid"
                ? "bg-foreground text-background"
                : "bg-background hover:bg-secondary",
            ].join(" ")}
          >
            <LayoutGrid size={14} /> Grid
          </button>
          <button
            type="button"
            onClick={() => update("view", "map")}
            aria-pressed={search.view === "map"}
            className={[
              "inline-flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.2em] border-l border-border transition-colors",
              search.view === "map"
                ? "bg-foreground text-background"
                : "bg-background hover:bg-secondary",
            ].join(" ")}
          >
            <MapIcon size={14} /> Map
          </button>
        </div>

        <div className="flex items-center gap-3">
        <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Sort by
        </label>
        <select
          className="bg-background border border-border px-3 py-2 text-xs uppercase tracking-[0.18em]"
          value={search.sort}
          onChange={(e) => update("sort", e.target.value as SortKey)}
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        </div>
      </div>
    </fieldset>
  );
}

function priceOptions(status: StatusKey): number[] {
  if (status === "rent") {
    // weekly rent steps
    return [400, 500, 600, 700, 800, 1000, 1250, 1500, 2000];
  }
  return [
    500_000, 750_000, 1_000_000, 1_250_000, 1_500_000, 2_000_000, 2_500_000,
    3_000_000, 5_000_000,
  ];
}

function formatShortPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
}

/* ---------------- Card ---------------- */

function ListingDbCard({ r }: { r: Row }) {
  const to =
    r.status === "for-rent" || r.status === "leased"
      ? "/rent/$listingId"
      : r.status === "sold"
      ? "/sold/$listingId"
      : "/buy/$listingId";

  return (
    <Link
      to={to}
      params={{ listingId: r.id }}
      className="group block hover-lift cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ringgreen)] focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
    >
      <div className="img-zoom relative aspect-[4/3] bg-muted overflow-hidden">
        {r.hero ? (
          <img
            src={r.hero}
            alt={r.address}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] bg-background/95 text-foreground px-2.5 py-1">
            {r.status === "for-sale"
              ? "For Sale"
              : r.status === "for-rent"
              ? "For Rent"
              : r.status === "sold"
              ? "Sold"
              : "Leased"}
          </span>
          {r.featured && (
            <span className="text-[10px] uppercase tracking-[0.2em] bg-[var(--ringgreen)] text-[var(--ink)] px-2.5 py-1">
              Featured
            </span>
          )}
        </div>
      </div>
      <div className="pt-5 pb-2">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {r.suburb} · {r.state}
        </div>
        <h3 className="font-serif text-xl md:text-[1.4rem] mt-2 leading-snug group-hover:text-[var(--ringgreen)] transition-colors">
          {r.address}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm font-medium">{r.price}</div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed size={14} />
              {r.beds}
            </span>
            <span className="flex items-center gap-1">
              <Bath size={14} />
              {r.baths}
            </span>
            <span className="flex items-center gap-1">
              <Car size={14} />
              {r.cars}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
