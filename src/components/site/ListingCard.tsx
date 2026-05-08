import { Link } from "@tanstack/react-router";
import type { Listing } from "@/data/site";
import { Bed, Bath, Car } from "lucide-react";

export type ListingCardData = {
  id: string;
  status: Listing["status"] | string;
  address: string;
  suburb: string;
  state: string;
  price: string;
  beds: number;
  baths: number;
  cars: number;
  hero?: string | null;
  featured?: boolean;
};

type Size = "sm" | "md" | "lg";

const SIZE = {
  sm: {
    title: "text-lg md:text-xl",
    pad: "p-4 md:p-5",
    capH: "min-h-[88px]",
    rule: "w-5",
    suburb: "text-[10px] tracking-[0.24em]",
    price: "text-sm",
    showSpecs: false,
    pill: "text-[9px] px-2 py-0.5",
  },
  md: {
    title: "text-xl md:text-2xl",
    pad: "p-5 md:p-7",
    capH: "min-h-[112px]",
    rule: "w-6",
    suburb: "text-[10px] tracking-[0.28em]",
    price: "text-base",
    showSpecs: true,
    pill: "text-[10px] px-2.5 py-1",
  },
  lg: {
    title: "text-2xl md:text-3xl",
    pad: "p-7 md:p-9",
    capH: "min-h-[136px]",
    rule: "w-8",
    suburb: "text-[11px] tracking-[0.3em]",
    price: "text-lg",
    showSpecs: true,
    pill: "text-[10px] px-2.5 py-1",
  },
} as const;

function srcSetFor(hero: string) {
  // multiarray CDN paths look like .../cp-rect-1920x1440.pg — swap variants for crispness
  if (!/cp-rect-\d+x\d+\.pg$/.test(hero)) return undefined;
  const v = (w: number, h: number) => hero.replace(/cp-rect-\d+x\d+\.pg$/, `cp-rect-${w}x${h}.pg`);
  return [
    `${v(640, 800)} 640w`,
    `${v(960, 1200)} 960w`,
    `${v(1280, 1600)} 1280w`,
    `${v(1600, 2000)} 1600w`,
  ].join(", ");
}

function statusLabel(s: ListingCardData["status"]) {
  return s === "for-sale" ? "For Sale" : s === "for-rent" ? "For Rent" : s === "sold" ? "Sold" : s === "leased" ? "Leased" : String(s);
}

function statusTo(s: ListingCardData["status"]) {
  return s === "for-rent" || s === "leased"
    ? "/rent/$listingId"
    : s === "sold"
    ? "/sold/$listingId"
    : "/buy/$listingId";
}

export function ListingCard({ l, size = "md" }: { l: ListingCardData; size?: Size }) {
  const s = SIZE[size];
  const to = statusTo(l.status) as "/buy/$listingId" | "/rent/$listingId" | "/sold/$listingId";
  const motion = size === "lg" ? "kenburns-base kenburns-active-a" : "";

  return (
    <Link
      to={to}
      params={{ listingId: l.id }}
      className="group relative block overflow-hidden bg-muted hover-lift cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ringgreen)] focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
      style={{ aspectRatio: "4 / 5" }}
      aria-label={`${l.address}, ${l.suburb} — ${l.price}`}
    >
      {l.hero ? (
        <img
          src={l.hero}
          srcSet={srcSetFor(l.hero)}
          sizes="(min-width: 1280px) 600px, (min-width: 768px) 45vw, 90vw"
          alt={l.address}
          loading="lazy"
          referrerPolicy="no-referrer"
          draggable={false}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${motion}`}
        />
      ) : null}

      {/* Scrim */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 editorial-scrim" />

      {/* Status / Featured pills */}
      <div className={`absolute top-3 left-3 z-10 flex gap-2`}>
        <span className={`uppercase tracking-[0.2em] bg-background/95 text-foreground ${s.pill}`}>
          {statusLabel(l.status)}
        </span>
        {l.featured && (
          <span className={`uppercase tracking-[0.2em] bg-[var(--ringgreen)] text-[var(--ink)] ${s.pill}`}>
            Featured
          </span>
        )}
      </div>

      {/* Caption overlay */}
      <div className={`absolute inset-x-0 bottom-0 z-10 text-white ${s.pad} ${s.capH}`}>
        <div className={`flex items-center gap-2 uppercase ${s.suburb} text-white/85`}>
          <span className={`inline-block h-px ${s.rule} bg-[var(--ringgreen)]`} />
          {l.suburb}{l.state ? ` · ${l.state}` : ""}
        </div>
        <div className={`font-serif leading-tight mt-1.5 ${s.title}`}>
          {l.address}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className={`font-medium text-[var(--ringgreen)] ${s.price}`}>{l.price}</div>
          {s.showSpecs && (
            <div className="flex items-center gap-3 text-xs text-white/80">
              <span className="flex items-center gap-1"><Bed size={14} />{l.beds}</span>
              <span className="flex items-center gap-1"><Bath size={14} />{l.baths}</span>
              <span className="flex items-center gap-1"><Car size={14} />{l.cars}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
