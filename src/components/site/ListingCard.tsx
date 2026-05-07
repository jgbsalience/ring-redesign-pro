import { Link } from "@tanstack/react-router";
import type { Listing } from "@/data/site";
import { getAgent } from "@/data/site";
import { Bed, Bath, Car } from "lucide-react";

export function ListingCard({ l }: { l: Listing }) {
  const agent = getAgent(l.agentIds[0]);
  return (
    <Link
      to="/buy/$listingId"
      params={{ listingId: l.id }}
      className="group block hover-lift"
    >
      <div className="img-zoom relative aspect-[4/3] bg-stone overflow-hidden">
        <img
          src={l.hero}
          alt={l.address}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] bg-background/95 text-foreground px-2.5 py-1">
            {l.status === "for-sale" ? "For Sale"
              : l.status === "for-rent" ? "For Rent"
              : l.status === "sold" ? "Sold" : "Leased"}
          </span>
          {l.featured && (
            <span className="text-[10px] uppercase tracking-[0.2em] bg-[var(--ringgreen)] text-[var(--ink)] px-2.5 py-1">
              Featured
            </span>
          )}
        </div>
      </div>
      <div className="pt-5 pb-2">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {l.suburb} · {l.state}
        </div>
        <h3 className="font-serif text-xl md:text-[1.4rem] mt-2 leading-snug">
          {l.address}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm font-medium">{l.price}</div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Bed size={14} />{l.beds}</span>
            <span className="flex items-center gap-1"><Bath size={14} />{l.baths}</span>
            <span className="flex items-center gap-1"><Car size={14} />{l.cars}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2.5 text-xs text-muted-foreground">
          <img src={agent.photo} alt={agent.name} className="w-6 h-6 rounded-full object-cover" />
          <span>{agent.name}</span>
        </div>
      </div>
    </Link>
  );
}
