import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/site/ListingCard";
import { TeamMemberImage } from "@/components/site/TeamMemberImage";
import { listings, agents, testimonials } from "@/data/site";
import { ArrowRight, ArrowUpRight, Search, ChevronDown, MapPin, BedDouble } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ring Real Estate — Adelaide residential, since 1978" },
      { name: "description", content: "Distinguished homes across metropolitan Adelaide. Sell, buy, rent and manage with a small, senior team." },
      { property: "og:title", content: "Ring Real Estate" },
      { property: "og:description", content: "Distinguished homes across metropolitan Adelaide. Since 1978." },
      { property: "og:image", content: listings[0]?.hero ?? "" },
    ],
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
const HERO = HERO_SLIDES[0]?.hero ?? "";

const LUXURY_SLIDES = [
  { id: "4-college", hero: "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/c2728d99-37f0-4373-8ddc-147cded542d9/cp-rect-1920x1440.pg", address: "4 College Avenue", suburb: "Bellevue Heights", caption: "A truly wonderful home, offered for the very first time." },
  { id: "58-brighton", hero: "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/10d0da4a-6e2d-4245-a273-082adff2f09b/cp-rect-1920x1440.pg", address: "58 Brighton Parade", suburb: "Blackwood", caption: "Architectural calm in a treasured tree-lined pocket." },
  { id: "1-menura", hero: "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/b0c08cc5-7628-42b1-b77f-c17b375ff327/cp-rect-1920x1440.pg", address: "1 Menura Avenue", suburb: "Glenalta", caption: "60s contemporary in a position-perfect setting." },
  { id: "16-gannet", hero: "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/dc3fcad6-baa5-47e6-9a57-c1949d40ecc2/cp-rect-1920x1440.pg", address: "16 Gannet Avenue", suburb: "Glenalta", caption: "Family scale and garden privacy, beautifully kept." },
  { id: "9-esplanade", hero: "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/e258eebb-0add-4cb9-99ba-54a318f272b0/cp-rect-1920x1440.pg", address: "9 Esplanade", suburb: "Sellicks Beach", caption: "An unrepeatable absolute beachfront position." },
];


function LuxuryCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchActive = useRef(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % LUXURY_SLIDES.length), 7000);
    return () => clearInterval(id);
  }, [paused]);

  const go = (delta: number) =>
    setI((n) => (n + delta + LUXURY_SLIDES.length) % LUXURY_SLIDES.length);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchActive.current = true;
    setPaused(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchActive.current || touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Once a clear horizontal gesture is detected, prevent vertical scroll hijack.
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault?.();
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchActive.current || touchStartX.current === null || touchStartY.current === null) {
      touchActive.current = false;
      setPaused(false);
      return;
    }
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    const SWIPE = 40;
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchActive.current = false;
    setPaused(false);
  };

  return (
    <div
      className="mt-10 relative overflow-hidden bg-muted group touch-pan-y select-none"
      style={{ aspectRatio: "4 / 5" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      role="group"
      aria-roledescription="carousel"
      aria-label="Recent Ring residences"
    >
      {LUXURY_SLIDES.map((s, idx) => {
        // CDN paths end in `cp-rect-1920x1440.pg` — swap the size segment
        // to request appropriately scaled variants without losing fidelity.
        const variant = (w: number, h: number) =>
          s.hero.replace(/cp-rect-\d+x\d+\.pg$/, `cp-rect-${w}x${h}.pg`);
        const srcSet = [
          `${variant(640, 480)} 640w`,
          `${variant(960, 720)} 960w`,
          `${variant(1280, 960)} 1280w`,
          `${variant(1600, 1200)} 1600w`,
          `${variant(1920, 1440)} 1920w`,
        ].join(", ");
        const isActive = idx === i;
        const isNext = idx === (i + 1) % LUXURY_SLIDES.length;
        const eager = idx === 0 || isNext;
        const motion = idx % 2 === 0 ? "kenburns-active-a" : "kenburns-active-b";
        return (
          <div
            key={s.id}
            aria-hidden={!isActive}
            className="absolute inset-0 overflow-hidden"
            style={{
              opacity: isActive ? 1 : 0,
              transition: "opacity 1800ms cubic-bezier(0.22, 0.61, 0.36, 1)",
              willChange: "opacity",
            }}
          >
            <img
              // Re-mount the active image each cycle so the Ken Burns animation restarts cleanly
              key={isActive ? `${s.id}-${i}` : s.id}
              src={variant(1280, 960)}
              srcSet={srcSet}
              sizes="(min-width: 1280px) 1200px, (min-width: 768px) 90vw, 100vw"
              alt={`${s.address}, ${s.suburb}`}
              width={1200}
              height={1500}
              referrerPolicy="no-referrer"
              loading={eager ? "eager" : "lazy"}
              fetchPriority={idx === 0 ? "high" : "low"}
              decoding="async"
              draggable={false}
              className={`absolute inset-0 w-full h-full object-cover kenburns-base ${
                isActive ? motion : ""
              }`}
            />
          </div>
        );
      })}

      {/* Gradient scrim for caption legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-7 text-white">
        <div className="relative h-[88px] md:h-[96px]">
          {LUXURY_SLIDES.map((s, idx) => (
            <div
              key={s.id}
              aria-hidden={idx !== i}
              className={`absolute inset-0 transition-all duration-[900ms] [transition-timing-function:cubic-bezier(0.22,0.61,0.36,1)] ${
                idx === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/70 flex items-center gap-2">
                <span className="inline-block h-px w-6 bg-[var(--ringgreen)]" />
                {s.suburb}
              </div>
              <div className="font-serif text-xl md:text-2xl leading-tight mt-1.5">
                {s.address}
              </div>
              <div className="text-[12px] md:text-[13px] text-white/80 leading-snug mt-1 max-w-[26rem]">
                {s.caption}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex gap-1.5">
            {LUXURY_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Show image ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1 transition-all ${idx === i ? "w-6 bg-white" : "w-3 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-white/60 tabular-nums">
            {String(i + 1).padStart(2, "0")} / {String(LUXURY_SLIDES.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}


function RecentSalesStrip({ sold }: { sold: typeof listings }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const card = el.querySelector<HTMLElement>("[data-card]");
      const step = (card?.offsetWidth ?? 320) + 24; // gap-6 = 24px
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, 4000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      ref={scrollerRef}
      className="overflow-x-auto no-scrollbar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container-page flex gap-6 pb-4 min-w-max">
        {sold.map((l) => (
          <div key={l.id} data-card className="w-[300px] md:w-[340px] shrink-0">
            <ListingCard l={l} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const featured = listings.filter((l) => l.featured).slice(0, 3);
  const sold = listings.filter((l) => l.status === "sold").slice(0, 15);
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
    const params = new URLSearchParams();
    const term = (q ?? query).trim();
    if (term) params.set("q", term);
    if (beds !== "any") params.set("beds", beds);
    const search = params.toString();
    navigate({ to: dest, search: search ? (Object.fromEntries(params) as never) : ({} as never) });
  }

  useEffect(() => { setMounted(true); }, []);

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
      <Header overlay />

      {/* HERO */}
      <section
        className="relative min-h-[100svh] w-full overflow-hidden group/hero"
        aria-roledescription="carousel"
        aria-label="Featured properties"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
        }}
      >
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70 pointer-events-none" />

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

        <div className="relative z-20 container-page min-h-[100svh] flex flex-col justify-end pb-24 pt-32 text-white pointer-events-none">
          <div className="max-w-4xl pointer-events-auto">
            <div className="text-[10px] uppercase tracking-[0.32em] opacity-80 reveal">
              <span className="ring-mark" /> &nbsp;Adelaide · Established 1978
            </div>
            <h1 className="font-serif text-[3.2rem] sm:text-[5rem] md:text-[7rem] leading-[0.92] tracking-tight mt-6 reveal reveal-2">
              The home<br />
              <span className="italic font-light">you have been</span><br />
              looking for.
            </h1>
            <p className="mt-8 max-w-xl text-base md:text-lg opacity-85 leading-relaxed reveal reveal-3">
              A small, senior team quietly selling and managing some of South
              Australia's most considered homes — for nearly five decades.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-14 reveal reveal-4 max-w-4xl">
            {/* Intent tabs */}
            <div role="tablist" aria-label="Search type" className="inline-flex gap-px bg-white/15 backdrop-blur p-px">
              {([
                { id: "buy", label: "For sale" },
                { id: "rent", label: "For rent" },
                { id: "sold", label: "Sold" },
              ] as const).map((t) => {
                const active = intent === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setIntent(t.id)}
                    className={[
                      "px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] transition-colors",
                      active
                        ? "bg-background text-foreground"
                        : "text-white/85 hover:text-white hover:bg-white/10",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <form
              role="search"
              onSubmit={(e) => { e.preventDefault(); setSuggestOpen(false); runSearch(); }}
              className="bg-background/95 backdrop-blur text-foreground grid grid-cols-1 md:grid-cols-[1.4fr_auto_auto_auto] divide-y md:divide-y-0 md:divide-x divide-border shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]"
            >
              {/* Query */}
              <div className="relative">
                <label className="flex items-center gap-3 px-5 py-4">
                  <MapPin size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
                  <span className="sr-only">Where</span>
                  <input
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSuggestOpen(true); }}
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
                      onClick={() => { setQuery(""); setSuggestOpen(false); }}
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
                          onClick={() => { setQuery(s); setSuggestOpen(false); runSearch(s); }}
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
              <label className="relative flex items-center gap-2 px-5 py-4 hover:bg-secondary/40 transition-colors cursor-pointer">
                <BedDouble size={16} className="text-muted-foreground" aria-hidden="true" />
                <span className="sr-only">Beds</span>
                {mounted ? (
                  <>
                    <select
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                      className="bg-transparent appearance-none pr-6 text-sm outline-none cursor-pointer"
                      aria-label="Minimum bedrooms"
                    >
                      <option value="any">Any beds</option>
                      <option value="1">1+ beds</option>
                      <option value="2">2+ beds</option>
                      <option value="3">3+ beds</option>
                      <option value="4">4+ beds</option>
                      <option value="5">5+ beds</option>
                    </select>
                    <ChevronDown size={14} className="text-muted-foreground absolute right-4 pointer-events-none" />
                  </>
                ) : (
                  <span className="text-sm pr-6" aria-hidden="true">Any beds</span>
                )}
              </label>

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
                className="bg-foreground text-background px-7 py-4 text-xs uppercase tracking-[0.22em] inline-flex items-center justify-center gap-2 hover:bg-[var(--ringgreen)] hover:text-[var(--ink)] transition-colors group"
              >
                <Search size={14} className="md:hidden" />
                Search
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px] uppercase tracking-[0.22em] text-white/70">
              <span className="opacity-70">Popular:</span>
              {["Bellevue Heights", "Coromandel Valley", "Blackwood", "Glenalta"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setQuery(s); runSearch(s); }}
                  className="hover:text-white border-b border-transparent hover:border-white/60 pb-0.5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="absolute z-20 bottom-6 right-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-white/70 pointer-events-none">
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
              className="pointer-events-auto transition-opacity duration-500 hover:text-white border-b border-white/0 hover:border-white/60 pb-0.5 focus:outline-none focus-visible:text-white focus-visible:border-white/80"
            >
              {current.address} · {current.suburb} →
            </Link>
          )}
          <span
            className="hidden sm:flex items-center gap-1.5 pointer-events-auto"
            role="tablist"
            aria-label="Featured property slides"
          >
            {HERO_SLIDES.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                onClick={() => setSlide(i)}
                aria-label={`Show slide ${i + 1} of ${HERO_SLIDES.length}: ${s.address}, ${s.suburb}`}
                aria-selected={i === slide}
                aria-current={i === slide ? "true" : undefined}
                className={[
                  "h-px transition-all duration-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50",
                  i === slide ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/70",
                ].join(" ")}
              />
            ))}
          </span>
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
            <Link to="/about" className="text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
              Meet the team <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {agents.map((a) => (
              <Link
                key={a.id}
                to="/team/$agentId"
                params={{ agentId: a.id }}
                className="block group hover-lift"
              >
                <div className="aspect-[3/4] img-zoom bg-muted overflow-hidden">
                  <TeamMemberImage
                    agent={a}
                    size="lg"
                    className="grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="mt-3">
                  <div className="font-serif text-base md:text-lg leading-tight group-hover:text-[var(--ringgreen)] transition-colors">
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
      <section className="container-page py-28 md:py-44">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              <span className="ring-mark" /> &nbsp;Since 1978
            </div>
            <div className="mt-6 font-serif italic text-[var(--ringgreen)] text-3xl">
              Integrity.
            </div>
            <LuxuryCarousel />

          </div>
          <div className="md:col-span-7 md:col-start-6">
            <h2 className="font-serif text-3xl md:text-5xl leading-[1.1] tracking-tight">
              A single word, given as a promise — and kept, transaction
              after transaction, generation after generation.
            </h2>
            <p className="mt-8 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Ring Real Estate has remained deliberately small since the day
              we opened our doors in Fullarton. We sell fewer homes than the
              franchises around us, and we sell them better — by hand, by
              name, with the patience that good outcomes require.
            </p>
            <Link
              to="/about"
              className="mt-10 inline-flex items-center gap-2 text-sm border-b border-foreground pb-1 hover:gap-3 transition-all"
            >
              Read our story <ArrowRight size={14} />
            </Link>
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
            <Link to="/buy" className="text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
              View all listings <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {featured.map((l) => <ListingCard key={l.id} l={l} />)}
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
          <Link to="/sold" className="text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
            All recent sales <ArrowUpRight size={16} />
          </Link>
        </div>
        <RecentSalesStrip sold={sold} />
      </section>

      {/* METHODS OF SALE */}
      <section className="container-page py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Methods of sale
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 leading-tight tracking-tight">
              Three deliberate paths to the right buyer.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md">
              Every campaign is built around the home, not the calendar. We
              recommend the method that will produce the strongest result,
              not the fastest commission.
            </p>
          </div>
          <div className="md:col-span-8 grid sm:grid-cols-3 gap-px bg-border">
            {[
              { n: "01", t: "Set to Sell", d: "A defined campaign window with a closing date — clarity for buyers, urgency in the market." },
              { n: "02", t: "Auction", d: "Public competition on the day. Transparent, decisive, and frequently the highest result." },
              { n: "03", t: "Private Treaty", d: "Quiet negotiation on a published price. The right approach for the right home." },
            ].map((m) => (
              <div key={m.n} className="bg-background p-8 md:p-10 hover-lift">
                <div className="font-serif text-5xl text-[var(--ringgreen)]">{m.n}</div>
                <div className="font-serif text-xl mt-8">{m.t}</div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM PREVIEW */}
      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container-page">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
            <div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                Our inner circle
              </div>
              <h2 className="font-serif text-4xl md:text-6xl mt-3 tracking-tight">
                Senior, every time.
              </h2>
            </div>
            <Link to="/about" className="text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
              Meet the team <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {agents.map((a) => (
              <Link key={a.id} to="/team/$agentId" params={{ agentId: a.id }} className="hover-lift block group">
                <div className="aspect-[3/4] img-zoom bg-muted">
                  <TeamMemberImage agent={a} size="lg" className="grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="mt-4">
                  <div className="font-serif text-lg group-hover:text-[var(--ringgreen)] transition-colors">{a.name}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">
                    {a.role}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="container-page py-28 md:py-40">
        <figure className="max-w-4xl mx-auto text-center">
          <div className="font-serif text-6xl text-[var(--ringgreen)] leading-none">"</div>
          <blockquote className="font-serif text-3xl md:text-5xl leading-[1.2] tracking-tight mt-6">
            {testimonials[0].quote}
          </blockquote>
          <figcaption className="mt-10 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {testimonials[0].author} · {testimonials[0].location}
          </figcaption>
        </figure>
      </section>

      {/* APPRAISAL CTA */}
      <section className="bg-[var(--ink)] text-[var(--bone)]">
        <div className="container-page py-24 md:py-36 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <div className="text-[10px] uppercase tracking-[0.32em] opacity-60">
              <span className="ring-mark" /> &nbsp;Considering selling?
            </div>
            <h2 className="font-serif text-5xl md:text-7xl tracking-tight mt-6 leading-[1.02]">
              A confidential, considered<br />
              appraisal of your home.
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="opacity-75 leading-relaxed">
              No obligation. No franchise theatre. A senior agent will visit
              you, walk the home, and prepare a written appraisal grounded in
              recent comparable sales.
            </p>
            <Link
              to="/sell/appraisal"
              className="mt-8 inline-flex items-center gap-3 px-7 py-4 bg-[var(--ringgreen)] text-[var(--ink)] text-xs uppercase tracking-[0.22em] hover:bg-[var(--ringgreen)]/90"
            >
              Request appraisal <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
