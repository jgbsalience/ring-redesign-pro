import { Link } from "@tanstack/react-router";
import type { Listing } from "@/data/site";
import { getAgent } from "@/data/site";
import { Bed, Bath, Car } from "lucide-react";
import { TeamMemberImage } from "@/components/site/TeamMemberImage";

export function ListingCard({ l }: { l: Listing }) {
  const agent = getAgent(l.agentIds[0]);
  const to =
    l.status === "for-rent" || l.status === "leased"
      ? "/rent/$listingId"
      : l.status === "sold"
      ? "/sold/$listingId"
      : "/buy/$listingId";
  return (
    <Link
      to={to}
      params={{ listingId: l.id }}
      className="group block hover-lift cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ringgreen)] focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
    >
      <div className="img-zoom relative aspect-[4/3] bg-stone overflow-hidden">
        <img
          src={l.hero}
          alt={l.address}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
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
        <h3 className="font-serif text-xl md:text-[1.4rem] mt-2 leading-snug group-hover:text-[var(--ringgreen)] transition-colors">
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
          <TeamMemberImage agent={agent} size="xs" />
          <span>{agent.name}</span>
        </div>
      </div>
    </Link>
  );
}
