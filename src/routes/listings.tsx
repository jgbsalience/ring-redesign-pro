import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Map as MapIcon,
  ArrowDown,
  ChevronDown,
  Check,
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingsMap } from "@/components/site/ListingsMap";
import { ListingCard } from "@/components/site/ListingCard";
import { supabase } from "@/integrations/supabase/client";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

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
  q: fallback(z.string().max(200), "").default(""),
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
    query = query.order("featured", { ascending: false }).order("scraped_at", { ascending: false });
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
    // Strip PostgREST reserved chars to prevent filter-string injection,
    // then wrap in % for ILIKE matching.
    const safe = search.q.trim().replace(/[,()*\\]/g, " ").slice(0, 200);
    if (safe.trim()) {
      const term = `%${safe}%`;
      query = query.or(
        `address.ilike.${term},suburb.ilike.${term},postcode.ilike.${term},headline.ilike.${term}`,
      );
    }
  }

  const { data, count, error } = await query;
  if (error) {
    console.error("[listings] supabase query error", error);
    throw new Error("Unable to load listings. Please try again.");
  }
  return { rows: (data ?? []) as Row[], count: count ?? 0 };
}

function ListingsPage() {
  const search: SearchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  // local input state for the search box, debounced into the URL so
  // rapid typing doesn't trigger a refetch on every keystroke
  const [qInput, setQInput] = useState(search.q);
  const debouncedQ = useDebouncedValue(qInput, 400);

  // sync external URL changes (back/forward, reset, chip remove) into the input
  useEffect(() => setQInput(search.q), [search.q]);

  // push debounced input into the URL (preserves scroll)
  useEffect(() => {
    if (debouncedQ === search.q) return;
    navigate({
      search: (prev: SearchParams) => ({ ...prev, q: debouncedQ, page: 1 }),
      replace: true,
      resetScroll: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  // Explicit submit (Enter on the search input). Flush immediately with the
  // SAME scroll behavior as debounced typing — never jump to the top.
  const submitQ = () => {
    if (qInput === search.q) return;
    navigate({
      search: (prev: SearchParams) => ({ ...prev, q: qInput, page: 1 }),
      replace: true,
      resetScroll: false,
    });
  };

  // Floating "Jump to results" button: shows when filters/sort change
  // while the user has scrolled past the results section.
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [resultsOffscreen, setResultsOffscreen] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);

  // Track when filter/sort/view/page changes happen (any URL change other than
  // initial mount). If results are off-screen, surface the FAB.
  const filterKey = `${search.status}|${search.minPrice}|${search.maxPrice}|${search.beds}|${search.baths}|${search.q}|${search.sort}|${search.view}|${search.page}`;
  const firstFilterRef = useRef(true);
  useEffect(() => {
    if (firstFilterRef.current) {
      firstFilterRef.current = false;
      return;
    }
    setFiltersChanged(true);
  }, [filterKey]);

  // Observe whether the results section is in the viewport.
  useEffect(() => {
    const el = resultsRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setResultsOffscreen(!entry.isIntersecting), {
      rootMargin: "-80px 0px 0px 0px",
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showJumpButton = filtersChanged && resultsOffscreen;
  const jumpToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setFiltersChanged(false);
  };

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

  // Log query errors to console (raw error already logged in fetchListings)
  useEffect(() => {
    if (error) {
      console.error("[listings] query error:", error);
    }
  }, [error]);

  const rows = data?.rows ?? [];
  const count = data?.count ?? 0;
  const showInitialSkeleton = isPending;
  const isRefetching = isFetching && (isPlaceholderData || !isPending);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Header />

      <section
        id="main-content"
        tabIndex={-1}
        className="bg-secondary/40 border-b border-border focus:outline-none"
      >
        <div className="container-page py-16 md:py-20">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Adelaide listings · live
          </div>
          <h1 className="text-5xl md:text-7xl tracking-tight mt-4 leading-[0.95] font-serif">
            Homes for sale, rent, <span className="italic">and recently sold.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">
            The full Ring Real Estate database, filterable by status, price and specifications.
            Updated continuously from our live system.
          </p>
        </div>
      </section>

      <FiltersBar
        search={search}
        navigate={navigate}
        qInput={qInput}
        setQInput={setQInput}
        onSubmitQ={submitQ}
        disabled={isFetching}
      />

      <ActiveFilterChips search={search} navigate={navigate} setQInput={setQInput} />

      <div ref={resultsRef} className="container-page mt-8 flex-1 scroll-mt-24">
        {error ? (
          <div className="text-center py-32 text-destructive">
            Couldn't load listings. Please try again later.
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {rows.map((r) => (
                    <ListingCard
                      key={r.id}
                      l={{
                        id: r.id,
                        status: r.status,
                        address: r.address,
                        suburb: r.suburb,
                        state: r.state,
                        price: r.price,
                        beds: r.beds,
                        baths: r.baths,
                        cars: r.cars,
                        hero: r.hero,
                        featured: r.featured,
                      }}
                    />
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
                search: (p: z.infer<typeof searchSchema>) => ({
                  ...p,
                  page: Math.max(1, p.page - 1),
                }),
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
                search: (p: z.infer<typeof searchSchema>) => ({
                  ...p,
                  page: Math.min(totalPages, p.page + 1),
                }),
              })
            }
            className="inline-flex items-center gap-1 px-4 py-2 text-xs uppercase tracking-[0.2em] border border-border disabled:opacity-40 hover:bg-secondary transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}

      <Footer />

      <button
        type="button"
        onClick={jumpToResults}
        aria-hidden={!showJumpButton}
        tabIndex={showJumpButton ? 0 : -1}
        className={[
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
          "inline-flex items-center gap-2 px-5 py-3",
          "bg-foreground text-background text-[11px] uppercase tracking-[0.2em]",
          "shadow-lg hover:opacity-90 transition-[opacity,transform] duration-300",
          showJumpButton
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none",
        ].join(" ")}
      >
        <ArrowDown size={14} /> Jump to results
      </button>
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
          <span aria-hidden="true" className="opacity-60">
            ×
          </span>
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
  onSubmitQ,
  disabled = false,
}: {
  search: z.infer<typeof searchSchema>;
  navigate: ReturnType<typeof Route.useNavigate>;
  qInput: string;
  setQInput: (v: string) => void;
  onSubmitQ: () => void;
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
      <Tabs.Root
        value={search.status}
        onValueChange={(v) => update("status", v as StatusKey)}
        className="border-b border-border"
      >
        <Tabs.List className="flex gap-2">
          {STATUSES.map((s) => (
            <Tabs.Trigger
              key={s}
              value={s}
              className="px-5 py-3 text-xs uppercase tracking-[0.22em] border-b-2 -mb-[1px] transition-colors border-transparent text-muted-foreground hover:text-foreground data-[state=active]:border-[var(--ringgreen)] data-[state=active]:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ringgreen)] focus-visible:ring-inset"
            >
              {s === "buy" ? "For Sale" : s === "rent" ? "For Rent" : "Sold"}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr_auto] gap-2 bg-secondary/60 p-2">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitQ();
          }}
          className="flex items-center gap-3 px-4 py-3 bg-background"
        >
          <Search size={16} className="opacity-50" />
          <input
            type="search"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            className="bg-transparent w-full outline-none text-sm placeholder:text-muted-foreground"
            placeholder="Suburb, address, postcode, keyword"
            aria-label="Search listings"
          />
          {/* Hidden submit so Enter triggers onSubmit consistently */}
          <button type="submit" className="sr-only">
            Search
          </button>
        </form>

        <CustomSelect
          value={search.minPrice.toString()}
          onValueChange={(v) => update("minPrice", Number(v))}
          ariaLabel="Minimum price"
          placeholder="Min price"
          options={[
            { value: "0", label: "Min price" },
            ...priceOptions(search.status).map((p) => ({
              value: p.toString(),
              label: `${formatShortPrice(p)}+`,
            })),
          ]}
        />

        <CustomSelect
          value={search.maxPrice.toString()}
          onValueChange={(v) => update("maxPrice", Number(v))}
          ariaLabel="Maximum price"
          placeholder="Max price"
          options={[
            { value: "0", label: "Max price" },
            ...priceOptions(search.status).map((p) => ({
              value: p.toString(),
              label: `up to ${formatShortPrice(p)}`,
            })),
          ]}
        />

        <CustomSelect
          value={search.beds.toString()}
          onValueChange={(v) => update("beds", Number(v))}
          ariaLabel="Minimum bedrooms"
          placeholder="Any beds"
          options={[
            { value: "0", label: "Any beds" },
            ...[1, 2, 3, 4, 5].map((n) => ({ value: n.toString(), label: `${n}+ beds` })),
          ]}
        />

        <CustomSelect
          value={search.baths.toString()}
          onValueChange={(v) => update("baths", Number(v))}
          ariaLabel="Minimum bathrooms"
          placeholder="Any baths"
          options={[
            { value: "0", label: "Any baths" },
            ...[1, 2, 3, 4].map((n) => ({ value: n.toString(), label: `${n}+ baths` })),
          ]}
        />

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
              resetScroll: false,
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
          <label
            htmlFor="listing-sort"
            className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            Sort by
          </label>
          <CustomSelect
            value={search.sort}
            onValueChange={(v) => update("sort", v as SortKey)}
            ariaLabel="Sort by"
            placeholder="Sort by"
            className="text-xs uppercase tracking-[0.18em] py-2 px-3"
            options={[
              { value: "featured", label: "Featured" },
              { value: "newest", label: "Newest" },
              { value: "price-asc", label: "Price: Low to High" },
              { value: "price-desc", label: "Price: High to Low" },
            ]}
          />
        </div>
      </div>
    </fieldset>
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

function priceOptions(status: StatusKey): number[] {
  if (status === "rent") {
    // weekly rent steps
    return [400, 500, 600, 700, 800, 1000, 1250, 1500, 2000];
  }
  return [
    500_000, 750_000, 1_000_000, 1_250_000, 1_500_000, 2_000_000, 2_500_000, 3_000_000, 5_000_000,
  ];
}

function formatShortPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
}
