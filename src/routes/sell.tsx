import { createFileRoute, Link } from "@tanstack/react-router";
import { canonical } from "@/lib/seo";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BannerHero } from "@/components/site/BannerHero";
import { listings } from "@/data/site";
import { ListingCard } from "@/components/site/ListingCard";
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
    links: canonical("/sell"),
  }),
  component: SellPage,
});

function SellPage() {
  const sold = listings.filter((l) => l.status === "sold");
  return (
    <div className="bg-background text-foreground">
      <Header overlay />
      <BannerHero
        slides={SELL_SLIDES}
        kicker="Selling with Ring"
        title={<>A campaign as<br /><span className="italic font-light">considered</span> as the home.</>}
        subtitle="Photography by the people the architects use. Copy that reads like a magazine, not a brochure. Negotiation by a senior agent who has done this for two decades."
        cta={{ label: "Request an appraisal", to: "/contact" }}
      />

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
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {sold.map((l) => (
              <ListingCard key={l.id} l={l} size="md" />
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
          <div className="md:col-span-4 flex flex-col gap-3">
            <Link to="/sell/appraisal" className="inline-flex items-center justify-between gap-3 px-7 py-4 bg-[var(--ringgreen)] text-[var(--ink)] text-xs uppercase tracking-[0.22em] hover:bg-[var(--ringgreen-deep)] hover:text-white transition-colors">
              Request appraisal <ArrowRight size={14} />
            </Link>
            <Link to="/sell/set-to-sell" className="inline-flex items-center justify-between gap-3 px-7 py-4 border border-white/20 text-xs uppercase tracking-[0.22em] hover:border-[var(--ringgreen)] hover:text-[var(--ringgreen)] transition-colors">
              Discover Set to Sell <ArrowRight size={14} />
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
