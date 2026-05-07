import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import type { Listing } from "@/data/site";

type BannerHeroProps = {
  slides: Listing[];
  kicker: string;
  title: ReactNode;
  subtitle?: ReactNode;
  cta?: { label: string; to: string };
  height?: "tall" | "medium";
};

export function BannerHero({
  slides,
  kicker,
  title,
  subtitle,
  cta,
  height = "medium",
}: BannerHeroProps) {
  const pool = slides.slice(0, 6);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (pool.length < 2 || paused) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % pool.length), 5000);
    return () => clearInterval(id);
  }, [paused, pool.length]);

  const current = pool[slide] ?? pool[0];
  const heightClass = height === "tall" ? "min-h-[88svh]" : "min-h-[68svh] md:min-h-[72svh]";

  return (
    <section
      className={`relative ${heightClass} w-full overflow-hidden`}
      aria-roledescription="carousel"
      aria-label={kicker}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      {pool.map((l, i) => (
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/75 pointer-events-none" />

      <div className="relative z-20 container-page h-full min-h-inherit flex flex-col justify-end pb-16 md:pb-24 pt-32 text-white">
        <div className="max-w-4xl">
          <div className="text-[10px] uppercase tracking-[0.32em] opacity-80">
            <span className="ring-mark" /> &nbsp;{kicker}
          </div>
          <h1 className="font-serif text-[2.6rem] sm:text-5xl md:text-7xl leading-[0.95] tracking-tight mt-5">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-7 max-w-xl text-base md:text-lg opacity-85 leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {cta && (
              <Link
                to={cta.to}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--ringgreen)] text-[var(--ink)] text-xs uppercase tracking-[0.22em] hover:opacity-90 transition"
              >
                {cta.label}
              </Link>
            )}
            {current && (
              <span className="text-xs uppercase tracking-[0.25em] opacity-80">
                Now showing · {current.suburb}
              </span>
            )}
          </div>
        </div>
      </div>

      {pool.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex gap-1.5">
          {pool.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Show slide ${i + 1}`}
              className={[
                "h-1 transition-all",
                i === slide ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/70",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
