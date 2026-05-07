import { Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/site/ListingCard";
import { getAgent, listings, type Listing } from "@/data/site";
import { Bed, Bath, Car, Maximize, MapPin, ArrowRight } from "lucide-react";

export function ListingDetailView({ listing }: { listing: Listing }) {
  const agents = listing.agentIds.map(getAgent);
  const similar = listings
    .filter((l) => l.id !== listing.id && l.status === listing.status)
    .slice(0, 3);

  const crumb =
    listing.status === "for-rent" || listing.status === "leased"
      ? { to: "/rent" as const, label: "For rent" }
      : listing.status === "sold"
      ? { to: "/sold" as const, label: "Recent sales" }
      : { to: "/buy" as const, label: "For sale" };

  const enquireLabel =
    listing.status === "for-rent" ? "Enquire about this rental"
    : listing.status === "sold" ? "Discuss recent sales"
    : "Enquire about this home";

  return (
    <div className="bg-background text-foreground">
      <Header />

      <section className="pt-20 md:pt-24">
        <div className="container-page py-10 md:py-14">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
            <Link to={crumb.to} className="hover:text-foreground">{crumb.label}</Link>
            <span>/</span>
            <span>{listing.suburb}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-7xl tracking-tight mt-5 leading-[0.98] max-w-5xl">
            {listing.address}<span className="text-muted-foreground">, {listing.suburb}</span>
          </h1>
          {listing.headline && (
            <p className="mt-6 font-serif italic text-xl md:text-2xl text-[var(--ringgreen)]">
              {listing.headline}
            </p>
          )}
        </div>

        <div className="container-page grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-2 aspect-[4/3] md:aspect-auto md:row-span-2 bg-stone overflow-hidden">
            <img src={listing.gallery[0]} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
          {listing.gallery.slice(1, 3).map((g, i) => (
            <div key={i} className="aspect-[4/3] bg-stone overflow-hidden">
              <img src={g} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-border">
            {[
              { Icon: Bed, l: "Bedrooms", v: listing.beds },
              { Icon: Bath, l: "Bathrooms", v: listing.baths },
              { Icon: Car, l: "Parking", v: listing.cars },
              { Icon: Maximize, l: "Land", v: listing.land ?? "—" },
            ].map(({ Icon, l, v }) => (
              <div key={l}>
                <Icon size={18} className="text-[var(--ringgreen)]" />
                <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{l}</div>
                <div className="font-serif text-2xl mt-1">{v}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-6 text-base md:text-lg leading-relaxed">
            {listing.description.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {listing.features.length > 0 && (
            <div className="mt-14">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Features</div>
              <ul className="mt-6 grid sm:grid-cols-2 gap-x-10 gap-y-3 text-sm">
                {listing.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 py-2 border-b border-border/60">
                    <span className="ring-mark mt-1.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {listing.inspections && listing.inspections.length > 0 && (
            <div className="mt-14">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Open for inspection</div>
              <div className="mt-4 space-y-3">
                {listing.inspections.map((i) => (
                  <div key={i.date} className="flex items-baseline justify-between border-b border-border py-3">
                    <div className="font-serif text-xl">{i.date}</div>
                    <div className="text-sm text-muted-foreground">{i.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 space-y-8">
            <div className="bg-secondary/60 p-8">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{listing.priceNote ?? (listing.status === "for-rent" ? "Per week" : listing.status === "sold" ? "Sold" : "Guide")}</div>
              <div className="font-serif text-3xl md:text-4xl mt-2">{listing.price}</div>
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} /> {listing.address}, {listing.suburb} {listing.state} {listing.postcode}
              </div>
            </div>

            <form className="bg-background border border-border p-8 space-y-4">
              <div className="font-serif text-2xl">{enquireLabel}</div>
              <input className="w-full bg-secondary px-4 py-3 text-sm outline-none" placeholder="Full name" />
              <input className="w-full bg-secondary px-4 py-3 text-sm outline-none" placeholder="Email" type="email" />
              <input className="w-full bg-secondary px-4 py-3 text-sm outline-none" placeholder="Phone" />
              <textarea className="w-full bg-secondary px-4 py-3 text-sm outline-none min-h-32" defaultValue={`Please send me more information about ${listing.address}, ${listing.suburb}.`} />
              <button type="button" className="w-full bg-foreground text-background py-3.5 text-xs uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2 hover:bg-foreground/90">
                Send enquiry <ArrowRight size={14} />
              </button>
            </form>

            <div className="border border-border p-8 space-y-6">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Listing agents</div>
              {agents.map((a) => (
                <div key={a.id} className="flex items-center gap-4">
                  <img src={a.photo} alt="" className="w-14 h-14 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-serif text-lg leading-tight">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.role}</div>
                  </div>
                  <a href={`tel:${a.phone}`} className="text-xs underline">{a.phone}</a>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {similar.length > 0 && (
        <section className="bg-secondary/50 py-24">
          <div className="container-page">
            <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-12">You may also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
              {similar.map((l) => <ListingCard key={l.id} l={l} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
