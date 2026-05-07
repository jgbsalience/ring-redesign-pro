import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/site/ListingCard";
import { listings, agents, testimonials } from "@/data/site";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";

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

function HomePage() {
  const featured = listings.filter((l) => l.featured).slice(0, 3);
  const sold = listings.filter((l) => l.status === "sold");
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

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
          <div className="mt-14 reveal reveal-4">
            <div className="bg-background/95 backdrop-blur text-foreground p-2 md:p-3 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-2 max-w-4xl">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search size={16} className="opacity-50" />
                <input
                  className="bg-transparent w-full outline-none text-sm placeholder:text-muted-foreground"
                  placeholder="Suburb, postcode or street"
                />
              </div>
              <select className="bg-secondary px-4 py-3 text-sm outline-none">
                <option>For sale</option><option>For rent</option><option>Sold</option>
              </select>
              <select className="bg-secondary px-4 py-3 text-sm outline-none">
                <option>Any beds</option><option>1+</option><option>2+</option><option>3+</option><option>4+</option>
              </select>
              <Link to="/buy" className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2 hover:bg-foreground/90">
                Search <ArrowRight size={14} />
              </Link>
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
          <Link to="/sell" className="text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
            All recent sales <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <div className="container-page flex gap-6 pb-4 min-w-max">
            {sold.map((l) => (
              <Link
                key={l.id}
                to="/buy/$listingId"
                params={{ listingId: l.id }}
                className="w-[320px] md:w-[380px] shrink-0 group hover-lift"
              >
                <div className="aspect-[4/5] img-zoom bg-stone overflow-hidden">
                  <img
                    src={l.hero}
                    alt={l.address}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {l.suburb}
                  </div>
                  <div className="font-serif text-xl mt-1 group-hover:text-[var(--ringgreen)] transition-colors">{l.address}</div>
                  <div className="mt-2 text-sm font-medium text-[var(--ringgreen)]">{l.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
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
                <div className="aspect-[3/4] img-zoom bg-stone">
                  <img src={a.photo} alt={a.name} referrerPolicy="no-referrer" loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
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
