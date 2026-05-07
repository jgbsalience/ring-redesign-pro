import { useEffect, useRef, useState, type PointerEvent as RPointerEvent, type WheelEvent as RWheelEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/site/ListingCard";
import { Gallery } from "@/components/site/Gallery";
import { getAgent, listings, type Listing } from "@/data/site";
import { Bed, Bath, Car, Maximize, MapPin, ArrowRight, Ruler, Phone, Mail, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

function downloadBrochure(listing: Listing, agentName: string, agentPhone: string, agentEmail: string) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${listing.address}, ${listing.suburb} — Ring Real Estate</title>
<style>body{font-family:Georgia,serif;max-width:780px;margin:40px auto;padding:0 24px;color:#111;line-height:1.6}
h1{font-size:32px;margin:0 0 8px}h2{font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:#666;margin-top:32px}
.kicker{font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:#666}
.price{font-size:24px;margin:16px 0}.specs{display:flex;gap:24px;margin:16px 0;font-size:14px}
img{max-width:100%;margin:8px 0}.agent{border-top:1px solid #ddd;margin-top:32px;padding-top:16px;font-size:14px}</style></head><body>
<div class="kicker">Ring Real Estate · Adelaide · Since 1978</div>
<h1>${listing.address}, ${listing.suburb} ${listing.state} ${listing.postcode}</h1>
<div class="price">${listing.price}</div>
<div class="specs"><span>${listing.beds} bed</span><span>${listing.baths} bath</span><span>${listing.cars} car</span>${listing.land ? `<span>${listing.land}</span>` : ""}</div>
${listing.hero ? `<img src="${listing.hero}" alt="">` : ""}
${listing.headline ? `<p><em>${listing.headline}</em></p>` : ""}
<h2>About this property</h2>
${listing.description.map((p) => `<p>${p}</p>`).join("")}
${listing.features.length ? `<h2>Features</h2><ul>${listing.features.map((f) => `<li>${f}</li>`).join("")}</ul>` : ""}
<div class="agent"><strong>${agentName}</strong><br>${agentPhone} · ${agentEmail}<br>140 Shepherds Hill Road, Bellevue Heights SA 5050</div>
</body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ring-${listing.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ListingDetailView({ listing }: { listing: Listing }) {
  const agents = listing.agentIds.map(getAgent);
  const similar = listings
    .filter((l) => l.id !== listing.id && l.status === listing.status)
    .slice(0, 3);

  const crumb =
    listing.status === "for-rent" || listing.status === "leased"
      ? { to: "/rent" as const, label: "For rent" }
      : listing.status === "sold"
      ? { to: "/buy" as const, label: "Recent sales" }
      : { to: "/buy" as const, label: "For sale" };

  const enquireLabel =
    listing.status === "for-rent" ? "Enquire about this rental"
    : listing.status === "sold" ? "Discuss recent sales"
    : "Enquire about this home";

  const [floorplanOpen, setFloorplanOpen] = useState(false);
  useEffect(() => {
    if (!floorplanOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFloorplanOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [floorplanOpen]);

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

        <div className="container-page">
          <Gallery images={listing.gallery} alt={listing.address} />
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

          {listing.floorplan && (
            <div className="mt-14">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Floorplan</div>
                  <h3 className="font-serif text-2xl md:text-3xl mt-2">The layout, at a glance.</h3>
                </div>
                <button
                  onClick={() => setFloorplanOpen(true)}
                  className="text-xs uppercase tracking-[0.2em] inline-flex items-center gap-2 border-b border-foreground pb-1 hover:gap-3 transition-all"
                >
                  <Ruler size={14} /> Open full size
                </button>
              </div>
              <button
                onClick={() => setFloorplanOpen(true)}
                className="mt-6 block w-full bg-secondary/50 border border-border p-6 hover:bg-secondary transition-colors"
                aria-label="Open floorplan"
              >
                <img
                  src={listing.floorplan}
                  alt={`Floorplan — ${listing.address}`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-auto object-contain max-h-[520px] mx-auto"
                />
              </button>
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

              {/* Primary CTAs */}
              <div className="mt-6 grid grid-cols-1 gap-2">
                <a
                  href="#enquire"
                  className="bg-foreground text-background py-3.5 text-xs uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2 hover:bg-foreground/90"
                >
                  <Mail size={14} /> Enquire now
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${(agents[0]?.phone ?? "+61883703211").replace(/\s+/g, "")}`}
                    className="bg-[var(--ringgreen)] text-[var(--ink)] py-3.5 text-xs uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2 hover:opacity-90"
                  >
                    <Phone size={14} /> Call agent
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadBrochure(listing, agents[0]?.name ?? "Ring Real Estate", agents[0]?.phone ?? "(08) 8370 3211", agents[0]?.email ?? "ring@ring-sa.com.au")}
                    className="border border-foreground text-foreground py-3.5 text-xs uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors"
                  >
                    <Download size={14} /> Brochure
                  </button>
                </div>
              </div>
            </div>

            <form id="enquire" className="bg-background border border-border p-8 space-y-4 scroll-mt-28">
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
                  <Link to="/team/$agentId" params={{ agentId: a.id }} className="shrink-0">
                    <img src={a.photo} alt={a.name} referrerPolicy="no-referrer" loading="lazy" className="w-14 h-14 rounded-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to="/team/$agentId" params={{ agentId: a.id }} className="font-serif text-lg leading-tight hover:text-[var(--ringgreen)] transition-colors block truncate">
                      {a.name}
                    </Link>
                    <div className="text-xs text-muted-foreground truncate">{a.role}</div>
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

      {floorplanOpen && listing.floorplan && (
        <FloorplanLightbox
          src={listing.floorplan}
          alt={`Floorplan — ${listing.address}`}
          onClose={() => setFloorplanOpen(false)}
        />
      )}
      )}
    </div>
  );
}
