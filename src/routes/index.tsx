import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/site/ListingCard";
import { TeamMemberImage } from "@/components/site/TeamMemberImage";
import { PortfolioCarousel } from "@/components/site/PortfolioCarousel";
import { LuxuryCarousel } from "@/components/site/LuxuryCarousel";
import { JsonLd } from "@/components/site/JsonLd";
import { listings, agents, testimonials } from "@/data/site";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  ChevronDown,
  MapPin,
  BedDouble,
  Check,
  Mouse,
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Select from "@radix-ui/react-select";
import { canonical, localBusinessSchema } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ring Real Estate — Adelaide residential, since 1978" },
      {
        name: "description",
        content:
          "Distinguished homes across metropolitan Adelaide. Sell, buy, rent and manage with a small, senior team.",
      },
      { property: "og:title", content: "Ring Real Estate" },
      {
        property: "og:description",
        content: "Distinguished homes across metropolitan Adelaide. Since 1978.",
      },
      { property: "og:image", content: listings[0]?.hero ?? "" },
    ],
    links: canonical("/"),
  }),
  component: HomePage,
});

const HERO_SLIDES = (() => {
  const seen = new Set<string>();
  const pool: typeof listings = [];
  for (const l of listings) {
    if (!l.hero || seen.has(l.hero)) continue;
    seen.add(l.hero);
    pool.push(l);
    if (pool.length === 6) break;
  }
  return pool;
})();

const LUXURY_SLIDES = [
  {
    id: "4-college",
    hero: "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/c2728d99-37f0-4373-8ddc-147cded542d9/cp-rect-1920x1440.pg",
    address: "4 College Avenue",
    suburb: "Bellevue Heights",
    caption: "A truly wonderful home, offered for the very first time.",
  },
  {
    id: "58-brighton",
    hero: "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/10d0da4a-6e2d-4245-a273-082adff2f09b/cp-rect-1920x1440.pg",
    address: "58 Brighton Parade",
    suburb: "Blackwood",
    caption: "Architectural calm in a treasured tree-lined pocket.",
  },
  {
    id: "1-menura",
    hero: "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/b0c08cc5-7628-42b1-b77f-c17b375ff327/cp-rect-1920x1440.pg",
    address: "1 Menura Avenue",
    suburb: "Glenalta",
    caption: "60s contemporary in a position-perfect setting.",
  },
  {
    id: "16-gannet",
    hero: "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/dc3fcad6-baa5-47e6-9a57-c1949d40ecc2/cp-rect-1920x1440.pg",
    address: "16 Gannet Avenue",
    suburb: "Glenalta",
    caption: "Family scale and garden privacy, beautifully kept.",
  },
  {
    id: "9-esplanade",
    hero: "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/e258eebb-0add-4cb9-99ba-54a318f272b0/cp-rect-1920x1440.pg",
    address: "9 Esplanade",
    suburb: "Sellicks Beach",
    caption: "An unrepeatable absolute beachfront position.",
  },
];

function HomePage() {
  const featuredAll = listings.filter((l) => l.featured);
  const forSale = listings.filter((l) => l.status === "for-sale");
  const featured = [
    ...featuredAll,
    ...forSale.filter((l) => !featuredAll.some((f) => f.id === l.id)),
  ];
  const sold = listings.filter((l) => l.status === "sold").slice(0, 16);

  const suburbsOfNote = [
    {
      name: "Bellevue Heights",
      img: listings.find((l) => l.suburb === "Bellevue Heights" && l.hero)?.hero,
    },
    { name: "Blackwood", img: listings.find((l) => l.suburb === "Blackwood" && l.hero)?.hero },
    { name: "Glenalta", img: listings.find((l) => l.suburb === "Glenalta" && l.hero)?.hero },
    {
      name: "Coromandel Valley",
      img: listings.find((l) => l.suburb === "Coromandel Valley" && l.hero)?.hero,
    },
  ].filter((s) => s.img);

  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Search bar state
  const navigate = useNavigate();
  const [intent, setIntent] = useState<"buy" | "rent" | "sold">("buy");
  const [query, setQuery] = useState("");
  const [beds, setBeds] = useState("any");
  const [suggestOpen, setSuggestOpen] = useState(false);

  const suburbs = Array.from(new Set(listings.map((l) => l.suburb))).sort();
  const suggestions = query.trim().length
    ? suburbs.filter((s) => s.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : [];

  function runSearch(q?: string) {
    const dest = intent === "rent" ? "/rent" : intent === "sold" ? "/sold" : "/buy";
    const term = (q ?? query).trim();
    const search: Record<string, string | number> = {};
    if (term) search.q = term;
    if (beds !== "any") search.beds = beds;
    navigate({ to: dest, search: search as never });
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (HERO_SLIDES.length < 2 || paused) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  const current = HERO_SLIDES[slide] ?? HERO_SLIDES[0];

  return (
    <div className="bg-background text-foreground">
      <JsonLd schema={localBusinessSchema} />
      <Header overlay />

      {/* HERO — Variation C: Parallax Layers */}
      <section
        id="main-content"
        tabIndex={-1}
        className="relative min-h-[100svh] w-full overflow-hidden group/hero focus:outline-none hero-parallax-container"
        aria-roledescription="carousel"
        aria-label="Featured properties"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
        }}
      >
        {/* Layer 3 (Back) - Atmospheric gradient */}
        <div
          className="absolute inset-0 bg-mesh-green hero-layer-3 pointer-events-none"
          aria-hidden="true"
        />

        {/* Layer 2 (Mid) - Property photo */}
        <div className="absolute inset-0 hero-layer-2 pointer-events-none" aria-hidden="true">
          {HERO_SLIDES.map((l, i) => (
            <img
              key={l.id}
              src={l.hero}
              alt={l.address}
              referrerPolicy="no-referrer"
              loading={i === 0 ? "eager" : "lazy"}
              className={[
                "absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-[1500ms] ease-in-out",
                i === slide ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />
        </div>

        {/* Link overlay for active slide */}
        {current && (
          <Link
            to={
              current.status === "for-rent" || current.status === "leased"
                ? "/rent/$listingId"
                : current.status === "sold"
                  ? "/sold/$listingId"
                  : "/buy/$listingId"
            }
            params={{ listingId: current.id }}
            aria-label={`View featured property: ${current.address}, ${current.suburb} — ${current.price}`}
            className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                (e.currentTarget as HTMLAnchorElement).click();
              }
            }}
          >
            <span className="sr-only">
              View featured property {current.address}, {current.suburb}
            </span>
          </Link>
        )}

        {/* Layer 1 (Front) - Text content */}
        <div className="relative z-20 container-page min-h-[100svh] flex flex-col justify-end pb-32 md:pb-40 pt-32 text-white pointer-events-none hero-layer-1">
          <div className="max-w-4xl pointer-events-auto">
            <div className="text-[10px] uppercase tracking-[0.32em] opacity-80 reveal drop-shadow-sm">
              <span className="ring-mark" /> &nbsp;Adelaide · Established 1978
            </div>
            <h1 className="font-serif text-[3.2rem] sm:text-[5rem] md:text-[7rem] leading-[0.92] tracking-tight mt-6 reveal reveal-2 drop-shadow-2xl">
              The home
              <br />
              <span className="italic font-light">you have been</span>
              <br />
              looking for.
            </h1>
            <p className="mt-8 max-w-xl text-base md:text-lg opacity-90 leading-relaxed reveal reveal-3 drop-shadow-md">
              A small, senior team quietly selling and managing some of South Australia's most
              considered homes — for nearly five decades.
            </p>
          </div>
        </div>

        {/* Static UI - Search bar and bottom navigation */}
        <div className="absolute inset-x-0 bottom-0 z-30 container-page pb-8 pointer-events-none">
          {/* Search bar */}
          <div className="reveal reveal-4 max-w-4xl pointer-events-auto">
            {/* Intent toggle */}
            <Tabs.Root
              value={intent}
              onValueChange={(v) => setIntent(v as "buy" | "rent" | "sold")}
              className="inline-flex gap-px bg-ringgreen/25 backdrop-blur p-px ring-1 ring-ringgreen/40"
            >
              <Tabs.List className="flex">
                {(
                  [
                    { id: "buy", label: "For sale" },
                    { id: "rent", label: "For rent" },
                    { id: "sold", label: "Sold" },
                  ] as const
                ).map((t) => {
                  return (
                    <Tabs.Trigger
                      key={t.id}
                      value={t.id}
                      className="px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] transition-colors data-[state=active]:bg-ringgreen data-[state=active]:text-ink text-white/85 hover:text-white hover:bg-ringgreen/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset cursor-pointer"
                    >
                      {t.label}
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>
            </Tabs.Root>

            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                setSuggestOpen(false);
                runSearch();
              }}
              className="mt-2 w-full md:w-[680px] bg-background/85 backdrop-blur-2xl border border-border shadow-2xl text-foreground grid grid-cols-1 md:grid-cols-[1fr_auto_auto] divide-y md:divide-y-0 md:divide-x divide-border"
            >
              {/* Query */}
              <div className="relative focus-within:z-10">
                <label className="flex items-center gap-3 px-5 py-4">
                  <MapPin size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
                  <span className="sr-only">Where</span>
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSuggestOpen(true);
                    }}
                    onFocus={() => setSuggestOpen(true)}
                    onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setSuggestOpen(false);
                    }}
                    className="bg-transparent w-full outline-none text-sm placeholder:text-muted-foreground"
                    placeholder="Suburb, postcode or street"
                    aria-label="Search by suburb, postcode or street"
                    autoComplete="off"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setSuggestOpen(false);
                      }}
                      className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                      aria-label="Clear search"
                    >
                      Clear
                    </button>
                  )}
                </label>
                {mounted && suggestOpen && suggestions.length > 0 && (
                  <ul
                    role="listbox"
                    className="absolute z-30 left-0 right-0 top-full mt-1 bg-background border border-border shadow-xl max-h-72 overflow-auto"
                  >
                    {suggestions.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setQuery(s);
                            setSuggestOpen(false);
                            runSearch(s);
                          }}
                          className="w-full text-left px-5 py-3 text-sm hover:bg-secondary flex items-center gap-3"
                        >
                          <MapPin size={14} className="text-muted-foreground" />
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Beds */}
              <div className="relative flex items-center gap-2 px-5 py-4 hover:bg-secondary/40 transition-shadow cursor-pointer focus-within:bg-ringgreen/5 focus-within:ring-2 focus-within:ring-ringgreen focus-within:ring-inset focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-ringgreen)_25%,transparent),0_0_24px_color-mix(in_oklab,var(--color-ringgreen)_35%,transparent)] focus-within:z-10">
                <BedDouble size={16} className="text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Beds</span>
                {mounted ? (
                  <Select.Root value={beds} onValueChange={setBeds}>
                    <Select.Trigger className="bg-transparent appearance-none text-sm outline-none cursor-pointer flex items-center justify-between gap-2 w-auto min-w-[80px] focus:outline-none">
                      <Select.Value aria-label="Minimum bedrooms" />
                      <Select.Icon>
                        <ChevronDown size={14} className="text-muted-foreground" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content
                        className="bg-background border border-border shadow-xl z-50 min-w-[140px]"
                        position="popper"
                        sideOffset={4}
                        align="start"
                      >
                        <Select.Viewport className="p-1">
                          {[
                            { v: "any", l: "Any beds" },
                            { v: "1", l: "1+ beds" },
                            { v: "2", l: "2+ beds" },
                            { v: "3", l: "3+ beds" },
                            { v: "4", l: "4+ beds" },
                            { v: "5", l: "5+ beds" },
                          ].map((opt) => (
                            <Select.Item
                              key={opt.v}
                              value={opt.v}
                              className="text-sm px-8 py-2 cursor-pointer outline-none data-[highlighted]:bg-secondary data-[highlighted]:text-foreground relative flex items-center"
                            >
                              <Select.ItemIndicator className="absolute left-2 flex items-center justify-center">
                                <Check size={14} />
                              </Select.ItemIndicator>
                              <Select.ItemText>{opt.l}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                ) : (
                  <span
                    className="text-sm w-auto min-w-[80px] inline-flex items-center justify-between gap-2"
                    aria-hidden="true"
                  >
                    Any beds <ChevronDown size={14} className="text-muted-foreground" />
                  </span>
                )}
              </div>

              {/* Browse all */}
              <Link
                to={intent === "rent" ? "/rent" : intent === "sold" ? "/sold" : "/buy"}
                className="hidden md:inline-flex items-center justify-center px-5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse all
              </Link>

              {/* Submit */}
              <button
                type="submit"
                className="bg-ringgreen text-ink px-7 py-4 text-xs uppercase tracking-[0.22em] inline-flex items-center justify-center gap-2 hover:bg-ringgreen/90 transition-[background-color,box-shadow] focus:outline-none focus-visible:ring-2 focus-visible:ring-ringgreen focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-ringgreen)_30%,transparent),0_0_28px_color-mix(in_oklab,var(--color-ringgreen)_45%,transparent)] group cursor-pointer"
              >
                <Search size={14} className="md:hidden" />
                Search
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pointer-events-none">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px] uppercase tracking-[0.22em] text-white/70 pointer-events-auto max-w-4xl">
              <span className="opacity-70">Popular:</span>
              {["Bellevue Heights", "Coromandel Valley", "Blackwood", "Glenalta"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQuery(s);
                    runSearch(s);
                  }}
                  className="hover:text-white border-b border-transparent hover:border-white/60 pb-0.5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-end gap-4 text-[10px] uppercase tracking-[0.25em] text-white/70 mt-4 md:mt-0">
              <div className="flex items-center gap-4">
                {current && (
                  <Link
                    to={
                      current.status === "for-rent" || current.status === "leased"
                        ? "/rent/$listingId"
                        : current.status === "sold"
                          ? "/sold/$listingId"
                          : "/buy/$listingId"
                    }
                    params={{ listingId: current.id }}
                    aria-label={`View featured property: ${current.address}, ${current.suburb}`}
                    className="pointer-events-auto transition-opacity duration-500 hover:text-white border-b border-white/0 hover:border-white/60 pb-0.5 focus:outline-none focus-visible:text-white focus-visible:border-white/80 cursor-pointer"
                  >
                    {current.address} · {current.suburb} →
                  </Link>
                )}
                <span
                  className="hidden sm:flex items-center gap-1.5 pointer-events-auto"
                  role="group"
                  aria-label="Featured property slides"
                >
                  {HERO_SLIDES.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSlide(i)}
                      aria-label={`Show slide ${i + 1} of ${HERO_SLIDES.length}: ${s.address}, ${s.suburb}`}
                      aria-current={i === slide ? "true" : undefined}
                      className={[
                        "relative h-px transition-[width,background-color] duration-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 cursor-pointer",
                        "before:content-[''] before:absolute before:-inset-y-3 before:-inset-x-1",
                        i === slide ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/70",
                      ].join(" ")}
                    />
                  ))}
                </span>
              </div>

              {/* Scroll Indicator */}
              <div className="pointer-events-auto opacity-60 hidden md:flex flex-col items-center gap-2 mt-4 animate-bounce mix-blend-overlay">
                <Mouse size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM STRIP — directly below hero */}
      <section className="border-b border-border bg-background">
        <div className="container-page py-14 md:py-20">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                <span className="ring-mark" /> &nbsp;The team
              </div>
              <h2 className="font-serif text-3xl md:text-5xl mt-3 tracking-tight">
                Senior agents, by name.
              </h2>
            </div>
            <Link
              to="/about"
              className="group text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              Meet the team{" "}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {agents.map((a) => (
              <Link
                key={a.id}
                to="/team/$agentId"
                params={{ agentId: a.id }}
                className="block group hover-lift cursor-pointer"
              >
                <div className="aspect-[3/4] img-zoom bg-muted overflow-hidden">
                  <TeamMemberImage
                    agent={a}
                    size="lg"
                    className="grayscale group-hover:grayscale-0 transition-[filter] duration-700"
                  />
                </div>
                <div className="mt-3">
                  <div className="font-serif text-base md:text-lg leading-tight group-hover:text-ringgreen transition-colors duration-200">
                    {a.name}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {a.role}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRITY EDITORIAL */}
      <section className="py-28 md:py-44 relative overflow-hidden bg-muted/20">
        <div className="w-full flex flex-col md:flex-row relative">
          <div className="w-full md:w-[60%] lg:w-[50%] reveal relative z-10 md:-ml-8">
            <LuxuryCarousel className="mt-10" slides={LUXURY_SLIDES} />
          </div>

          <div className="w-full md:w-[55%] md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 reveal-2 z-20 mt-12 md:mt-0">
            <div className="bg-background/85 backdrop-blur-2xl p-10 md:p-16 lg:p-20 shadow-2xl border border-border mx-4 md:mx-8 lg:mr-[10%]">
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                <span className="ring-mark" /> &nbsp;Since 1978
              </div>
              <h2 className="mt-8 font-serif text-3xl md:text-5xl leading-[1.1] tracking-tight">
                Integrity. <br />
                <span className="italic font-light text-muted-foreground">A promise kept.</span>
              </h2>
              <p className="mt-8 text-base md:text-lg text-muted-foreground leading-relaxed">
                Ring Real Estate has remained deliberately small since the day we opened our doors
                in Fullarton. We sell fewer homes than the franchises around us, and we sell them
                better — by hand, by name, with the patience that good outcomes require.
              </p>
              <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
                We stand apart through our total refusal to compromise on standards, marketing, or
                discretion.
              </p>
              <Link
                to="/about"
                className="group mt-10 inline-flex items-center gap-2 text-sm border-b border-foreground pb-1 transition-colors cursor-pointer"
              >
                Read our story{" "}
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SUBURBS OF NOTE */}
      <section className="bg-background py-24 md:py-32">
        <div className="container-page">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                <span className="ring-mark" /> &nbsp;Areas of expertise
              </div>
              <h2 className="font-serif text-3xl md:text-5xl mt-3 tracking-tight">
                Suburbs of note
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {suburbsOfNote.map((s, i) => (
              <Link
                key={s.name}
                to="/buy"
                search={{ q: s.name }}
                className="group relative aspect-[4/5] overflow-hidden hover-lift cursor-pointer block"
              >
                <img
                  src={s.img}
                  alt={`Real estate in ${s.name}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 editorial-scrim" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-bone font-serif text-2xl drop-shadow-md">{s.name}</h3>
                  <div className="text-ringgreen-soft text-xs uppercase tracking-[0.2em] mt-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 flex items-center gap-2">
                    Explore <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container-page">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
            <div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                Currently for sale
              </div>
              <h2 className="font-serif text-4xl md:text-6xl mt-3 tracking-tight">
                Featured residences
              </h2>
            </div>
            <Link
              to="/buy"
              className="group text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              View all listings{" "}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {featured.slice(0, 8).map((l) => (
              <ListingCard key={l.id} l={l} size="sm" />
            ))}
          </div>
        </div>
      </section>

      {/* RECENT SALES STRIP */}
      <section className="py-24 md:py-32">
        <div className="container-page mb-12 flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Recent results
            </div>
            <h2 className="font-serif text-4xl md:text-6xl mt-3 tracking-tight">
              Quietly, exceptionally.
            </h2>
          </div>
          <Link
            to="/sold"
            className="group text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            All recent sales{" "}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
        <div className="container-page grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {sold.slice(0, 16).map((l) => (
            <ListingCard key={l.id} l={l} size="sm" />
          ))}
        </div>
      </section>

      {/* METHODS OF SALE */}
      <section className="container-page py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
          <div className="md:col-span-4 md:sticky md:top-32 self-start">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Methods of sale
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 leading-tight tracking-tight">
              Three deliberate paths to the right buyer.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md">
              Every campaign is built around the home, not the calendar. We recommend the method
              that will produce the strongest result, not the fastest commission.
            </p>
          </div>
          <div className="md:col-span-8 flex flex-col gap-6">
            {[
              {
                n: "01",
                t: "Set to Sell",
                d: "A defined campaign window with a closing date — clarity for buyers, urgency in the market.",
              },
              {
                n: "02",
                t: "Auction",
                d: "Public competition on the day. Transparent, decisive, and frequently the highest result.",
              },
              {
                n: "03",
                t: "Private Treaty",
                d: "Quiet negotiation on a published price. The right approach for the right home.",
              },
            ].map((m) => (
              <div key={m.n} className="card-interactive bg-background p-10 md:p-14 group">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8">
                  <div className="font-serif text-7xl text-ringgreen/20 group-hover:text-ringgreen transition-colors duration-500">
                    {m.n}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl">{m.t}</h3>
                    <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                      {m.d}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container-page">
          <div className="text-center mb-16">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              <span className="ring-mark" /> &nbsp;Client perspectives
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <figure
                key={i}
                className="bg-background p-10 border border-border flex flex-col justify-between hover-lift"
              >
                <div>
                  <div className="font-serif text-5xl text-ringgreen/40 leading-none mb-6">"</div>
                  <blockquote className="font-serif text-xl md:text-2xl leading-[1.3] tracking-tight">
                    {t.quote}
                  </blockquote>
                </div>
                <figcaption className="mt-12 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <strong className="text-foreground">{t.author}</strong>
                  <br />
                  <span className="opacity-70 mt-1 block">{t.location}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* APPRAISAL CTA */}
      <section className="relative overflow-hidden bg-ink text-bone">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/c2728d99-37f0-4373-8ddc-147cded542d9/cp-rect-1920x1440.pg"
            alt="Interior view"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-green-ink opacity-90" />
        </div>

        <div className="container-page py-32 md:py-48 relative z-10 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="text-[10px] uppercase tracking-[0.32em] opacity-80">
              <span className="ring-mark" /> &nbsp;Considering selling?
            </div>
            <h2 className="font-serif text-5xl md:text-7xl tracking-tight mt-6 leading-[1.02] drop-shadow-lg">
              A confidential, considered
              <br />
              appraisal of your home.
            </h2>
          </div>
          <div className="md:col-span-5 md:pl-10 md:border-l border-white/20 pt-8 md:pt-0">
            <p className="opacity-80 leading-relaxed text-lg">
              No obligation. No franchise theatre. A senior agent will visit you, walk the home, and
              prepare a written appraisal grounded in recent comparable sales.
            </p>
            <Link
              to="/sell/appraisal"
              className="group mt-10 inline-flex items-center gap-3 px-8 py-5 bg-bone text-ink text-xs uppercase tracking-[0.22em] hover:bg-ringgreen-soft transition-[background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink cursor-pointer shadow-xl hover:shadow-2xl"
            >
              Request appraisal{" "}
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      <PortfolioCarousel
        items={[
          ...listings.filter((l) => l.featured && l.hero),
          ...listings.filter((l) => l.status === "for-sale" && l.hero && !l.featured),
          ...listings.filter((l) => l.status === "sold" && l.hero),
        ]}
      />

      <Footer />
    </div>
  );
}
