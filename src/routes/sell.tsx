import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BannerHero } from "@/components/site/BannerHero";
import { listings } from "@/data/site";
import { ArrowRight } from "lucide-react";

const SELL_SLIDES = listings
  .filter((l) => l.status === "sold" && l.hero)
  .slice(0, 6);

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell with Ring — Adelaide's most considered campaigns" },
      { name: "description", content: "Three deliberate methods of sale, one promise: integrity. Request a confidential appraisal." },
      { property: "og:title", content: "Sell with Ring Real Estate" },
      { property: "og:description", content: "Three deliberate methods of sale. One promise: integrity." },
    ],
  }),
  component: SellPage,
});

function SellPage() {
  const sold = listings.filter((l) => l.status === "sold");
  return (
    <div className="bg-background text-foreground">
      <Header />
      <section className="pt-28 md:pt-36 container-page">
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          <span className="ring-mark" /> &nbsp;Selling with Ring
        </div>
        <h1 className="font-serif text-5xl md:text-8xl tracking-tight mt-5 leading-[0.92] max-w-5xl">
          A campaign as<br /><span className="italic font-light">considered</span> as the home.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Photography by the people the architects use. Copy that reads like
          a magazine, not a brochure. Negotiation by a senior agent who has
          done this for two decades — not a junior reading from a script.
        </p>
      </section>

      {/* Methods */}
      <section className="container-page py-24 md:py-32">
        <div className="grid md:grid-cols-3 gap-px bg-border">
          {[
            { n: "01", t: "Set to Sell", d: "A defined campaign window with a closing date. Buyers move with intent because there is a finish line.", w: "Best for distinctive homes where price discovery matters." },
            { n: "02", t: "Auction", d: "Public competition on the day. Transparent, decisive, often the strongest result.", w: "Best for in-demand suburbs and unique properties." },
            { n: "03", t: "Private Treaty", d: "Quiet negotiation on a published price. Considered, discreet, exact.", w: "Best for owners who value privacy above velocity." },
          ].map((m) => (
            <div key={m.n} className="bg-background p-10 md:p-14 hover-lift">
              <div className="font-serif text-7xl text-[var(--ringgreen)]">{m.n}</div>
              <div className="font-serif text-3xl mt-10">{m.t}</div>
              <p className="mt-5 text-muted-foreground leading-relaxed">{m.d}</p>
              <p className="mt-6 text-sm italic text-muted-foreground">{m.w}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent results */}
      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container-page">
          <div className="grid md:grid-cols-12 gap-10 items-end mb-14">
            <div className="md:col-span-7">
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Recent results</div>
              <h2 className="font-serif text-4xl md:text-6xl tracking-tight mt-4">Sold, with intention.</h2>
            </div>
            <div className="md:col-span-5 grid grid-cols-3 gap-6 text-center">
              <Stat n="98%" l="Sold above reserve" />
              <Stat n="14" l="Avg. days on market" />
              <Stat n="$220m+" l="Sold last year" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-14">
            {sold.map((l) => (
              <Link key={l.id} to="/buy/$listingId" params={{ listingId: l.id }} className="hover-lift">
                <div className="aspect-[4/3] img-zoom bg-stone">
                  <img src={l.hero} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="mt-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{l.suburb}</div>
                  <div className="font-serif text-xl mt-1">{l.address}</div>
                  <div className="mt-2 text-[var(--ringgreen)] font-medium">{l.price}</div>
                  {l.priceNote && <div className="text-xs text-muted-foreground mt-1">{l.priceNote}</div>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--ink)] text-[var(--bone)]">
        <div className="container-page py-28 md:py-36 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <h2 className="font-serif text-5xl md:text-7xl tracking-tight leading-[1.02]">
              Ready when you are.
            </h2>
          </div>
          <div className="md:col-span-4">
            <Link to="/sell/appraisal" className="inline-flex items-center gap-3 px-7 py-4 bg-[var(--ringgreen)] text-[var(--ink)] text-xs uppercase tracking-[0.22em]">
              Request appraisal <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-serif text-3xl md:text-4xl text-[var(--ringgreen)]">{n}</div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-2">{l}</div>
    </div>
  );
}
