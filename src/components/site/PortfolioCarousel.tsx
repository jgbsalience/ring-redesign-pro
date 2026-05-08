import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import type { Listing } from "@/data/site";
import { SpecLine } from "@/components/site/SpecLine";

function srcSetFor(hero: string) {
  if (!/cp-rect-\d+x\d+\.pg$/.test(hero)) return undefined;
  const v = (w: number, h: number) =>
    hero.replace(/cp-rect-\d+x\d+\.pg$/, `cp-rect-${w}x${h}.pg`);
  return [
    `${v(960, 720)} 960w`,
    `${v(1280, 960)} 1280w`,
    `${v(1600, 1200)} 1600w`,
    `${v(1920, 1440)} 1920w`,
    `${v(2400, 1800)} 2400w`,
    `${v(3200, 2400)} 3200w`,
  ].join(", ");
}

function statusTo(s: Listing["status"]) {
  return s === "for-rent" || s === "leased"
    ? "/rent/$listingId"
    : s === "sold"
    ? "/sold/$listingId"
    : "/buy/$listingId";
}

function statusLabel(s: Listing["status"]) {
  return s === "for-sale"
    ? "For Sale"
    : s === "for-rent"
    ? "For Rent"
    : s === "sold"
    ? "Sold"
    : s === "leased"
    ? "Leased"
    : String(s);
}

export function PortfolioCarousel({ items }: { items: Listing[] }) {
  const slides = items.filter((l) => !!l.hero).slice(0, 12);
  const total = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setI((n) => (n + 1) % total), [total]);
  const prev = useCallback(() => setI((n) => (n - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused || total < 2) return;
    timer.current = setInterval(next, 5500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, next, total]);

  if (total === 0) return null;
  const current = slides[i];
  const to = statusTo(current.status) as
    | "/buy/$listingId"
    | "/rent/$listingId"
    | "/sold/$listingId";

  return (
    <section
      className="relative bg-[var(--ink)] text-[var(--bone)] py-20 md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-page">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] opacity-60">
              The portfolio
            </div>
            <h2 className="font-serif text-4xl md:text-6xl mt-3 tracking-tight">
              A closer look.
            </h2>
          </div>
          <Link
            to="/buy"
            className="text-sm inline-flex items-center gap-2 hover:gap-3 transition-all opacity-90 hover:opacity-100"
          >
            Browse the portfolio <ArrowUpRight size={16} />
          </Link>
        </div>

        <div
          className="relative overflow-hidden bg-black/40"
          style={{ aspectRatio: "16 / 9" }}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {slides.map((l, idx) => {
            const active = idx === i;
            return (
              <div
                key={l.id}
                aria-hidden={!active}
                className="absolute inset-0"
                style={{
                  opacity: active ? 1 : 0,
                  transition:
                    "opacity 1200ms cubic-bezier(0.22, 0.61, 0.36, 1)",
                  willChange: "opacity",
                }}
              >
                <img
                  src={l.hero!}
                  srcSet={srcSetFor(l.hero!)}
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  alt={`${l.address}, ${l.suburb}`}
                  loading={idx <= 1 ? "eager" : "lazy"}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className={`absolute inset-0 w-full h-full object-cover ${
                    active ? "kenburns-base kenburns-active-a" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </div>
            );
          })}

          {/* Caption */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-12">
            <Link
              to={to}
              params={{ listingId: current.id }}
              className="block group max-w-3xl"
            >
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/85">
                <span className="inline-block h-px w-6 bg-[var(--ringgreen)]" />
                {statusLabel(current.status)} · {current.suburb}
                {current.state ? ` · ${current.state}` : ""}
              </div>
              <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl mt-3 leading-[1.05] tracking-tight text-white group-hover:text-[var(--ringgreen)] transition-colors">
                {current.address}
              </h3>
              <div className="mt-4">
                <SpecLine
                  price={current.price}
                  beds={current.beds}
                  baths={current.baths}
                  cars={current.cars}
                  tone="dark"
                />
              </div>
            </Link>
          </div>

          {/* Controls */}
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={prev}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 inline-flex items-center justify-center bg-white/10 hover:bg-white/25 backdrop-blur transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={next}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 inline-flex items-center justify-center bg-white/10 hover:bg-white/25 backdrop-blur transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 text-[10px] uppercase tracking-[0.28em] text-white/85 bg-black/40 backdrop-blur px-3 py-1.5 tabular-nums">
                {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail rail */}
        {total > 1 && (
          <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {slides.map((l, idx) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Show ${l.address}, ${l.suburb}`}
                className={[
                  "relative aspect-[4/3] overflow-hidden bg-black/40 transition-all",
                  idx === i
                    ? "ring-2 ring-[var(--ringgreen)] opacity-100"
                    : "opacity-50 hover:opacity-100",
                ].join(" ")}
              >
                <img
                  src={l.hero!}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
