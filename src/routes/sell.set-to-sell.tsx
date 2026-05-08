import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowRight, Phone } from "lucide-react";

export const Route = createFileRoute("/sell/set-to-sell")({
  head: () => ({
    meta: [
      { title: "Set to Sell — Ring Real Estate" },
      {
        name: "description",
        content:
          "A Private Treaty–Tender strategy to sell your home in 28 days. Ring's signature method: more buyer enquiry, seller in control, less risk, less stress.",
      },
      { property: "og:title", content: "Set to Sell — The fourth method" },
      {
        property: "og:description",
        content:
          "Ring's trademarked selling strategy: 8 winning features, 4 selling phases, one outcome.",
      },
    ],
  }),
  component: SetToSellPage,
});

const HERO_IMG =
  "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/10d0da4a-6e2d-4245-a273-082adff2f09b/cp-rect-1920x1440.pg";

const METHODS = [
  {
    n: "01",
    name: "Private Treaty",
    tag: "Negotiated",
    body: "An asking price or price range invites negotiation. The most-used method in South Australia — flexible, considered, and the seller stays in control throughout.",
  },
  {
    n: "02",
    name: "Auction",
    tag: "Public",
    body: "A sale in public to the highest bidder above the reserve. Buyers must be cash-ready with inspections and insurance complete at the fall of the hammer.",
  },
  {
    n: "03",
    name: "Tender",
    tag: "Private",
    body: "Marketed without price to a closing date. Formal expressions of interest are submitted privately; the seller accepts the best offer, or none.",
  },
];

const FEATURES = [
  {
    n: "01",
    t: "Tailored to you",
    c: "Built around your home, your reason for sale, and your private circumstances.",
  },
  {
    n: "02",
    t: "Optimum selling time",
    c: "A 28-day cadence that creates momentum without panic.",
  },
  {
    n: "03",
    t: "Greater enquiry",
    c: "Marketing designed to draw the broadest qualified buyer pool.",
  },
  {
    n: "04",
    t: "Buyer empowerment",
    c: "Clear opportunity to engage, inspect and offer with confidence.",
  },
  {
    n: "05",
    t: "Seller in control",
    c: "Decisions remain with you at every step — from price to timing.",
  },
  {
    n: "06",
    t: "Ethical negotiation",
    c: "Private, transparent, principled — no theatre, no pressure.",
  },
  {
    n: "07",
    t: "Transparent consultation",
    c: "You see the offers, the feedback and the rationale, in real time.",
  },
  {
    n: "08",
    t: "Fail-safe by design",
    c: "A structure that protects the outcome even if the market shifts.",
  },
];

const PHASES = [
  {
    d: "Days 1–7",
    t: "Prepare",
    c: "Presentation, photography, pricing strategy and launch plan signed off.",
  },
  {
    d: "Days 8–14",
    t: "Present",
    c: "Market launch, first inspections, buyer registration, qualified enquiry.",
  },
  {
    d: "Days 15–21",
    t: "Negotiate",
    c: "Private negotiation begins. Offers are reviewed transparently with you.",
  },
  {
    d: "Days 22–28",
    t: "Settle",
    c: "Best terms accepted. Contracts exchanged with the right buyer at the right price.",
  },
];

function SetToSellPage() {
  return (
    <div className="bg-background text-foreground">
      <Header />

      {/* HERO */}
      <section className="relative isolate overflow-hidden h-[78vh] min-h-[560px] flex items-end">
        <img
          src={HERO_IMG}
          alt="A Ring residence"
          referrerPolicy="no-referrer"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 w-full h-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/35 to-black/85" />

        <div className="container-page pb-16 md:pb-24 text-white">
          <div className="text-[10px] uppercase tracking-[0.32em] text-white/80 flex items-center gap-2">
            <span className="ring-mark" /> The fourth method
          </div>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-[8.5rem] tracking-tight leading-[0.92] mt-5">
            Set to Sell.
          </h1>
          <div className="mt-8 h-px w-24 bg-[var(--ringgreen)]" />
          <p className="mt-6 max-w-2xl text-white/85 text-lg leading-relaxed">
            A Private Treaty–Tender strategy designed to sell your home in 28 days — with less risk
            and less stress.
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-white/50">
            Set to Sell™ &nbsp;·&nbsp; A registered trademark of Ring Real Estate
          </p>
        </div>
      </section>

      {/* PILLAR INTRO */}
      <section className="container-page py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
          <div className="md:col-span-7">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              <span className="ring-mark" /> &nbsp;The strategy
            </div>
            <h2 className="font-serif text-4xl md:text-6xl tracking-tight mt-5 leading-[1.02]">
              Not a method. A discipline.
            </h2>
            <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed text-[1.05rem] max-w-2xl">
              <p>
                Set to Sell removes the restrictions of the traditional methods of sale and brings
                together their positive elements — into a single, compelling marketing and selling
                strategy.
              </p>
              <p>
                It is unique because it is tailored to your property, your reasons, and your
                circumstances. It is compelling because it promotes the sale in the optimum selling
                window, generates more buyer enquiry, and keeps you in control at every step.
              </p>
              <p className="text-foreground">
                Driven by the most ethical and transparent private negotiation process we know.
              </p>
            </div>
          </div>

          <aside className="md:col-span-5 md:pt-2">
            <div className="border-t border-border pt-6 space-y-4 text-sm">
              {[
                ["Format", "Private Treaty–Tender"],
                ["Timeframe", "28 days"],
                ["Negotiation", "Private, transparent"],
                ["Marketing", "Bespoke per property"],
                ["Authorisation", "Ring agents only"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between items-baseline border-b border-border/60 pb-4"
                >
                  <span className="text-muted-foreground uppercase tracking-[0.18em] text-[10px]">
                    {k}
                  </span>
                  <span className="text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* THE FOUR METHODS */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="container-page py-20 md:py-28">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            <span className="ring-mark" /> &nbsp;In South Australia
          </div>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight mt-5 leading-[1.02] max-w-3xl">
            Three traditional methods. One that brings them together.
          </h2>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {METHODS.map((m) => (
              <div key={m.n} className="bg-background border border-border p-8 md:p-10">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-3xl text-[var(--ringgreen-deep)]">{m.n}</span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {m.tag}
                  </span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl tracking-tight mt-6">{m.name}</h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>

          {/* The fourth — full width, highlighted */}
          <div className="mt-6 border border-[var(--ringgreen-line)] bg-[var(--ringgreen-tint)] p-8 md:p-12">
            <div className="grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-7">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-3xl text-[var(--ringgreen-deep)]">04</span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--ringgreen-deep)]">
                    The fourth method
                  </span>
                </div>
                <h3 className="font-serif text-3xl md:text-5xl tracking-tight mt-4">Set to Sell</h3>
                <p className="mt-4 text-foreground/80 leading-relaxed max-w-xl">
                  A Private Treaty–Tender hybrid with a private negotiation system. Combines the
                  flexibility of Private Treaty, the urgency of Auction, and the discretion of
                  Tender — into one disciplined 28-day plan.
                </p>
              </div>
              <div className="md:col-span-5 md:text-right">
                <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  Outcome
                </div>
                <div className="font-serif text-2xl md:text-3xl tracking-tight mt-2">
                  Sold for the right price, to the right buyer, on time.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT WORKS */}
      <section className="container-page py-20 md:py-28">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {[
            {
              t: "More buyer enquiry",
              c: "Marketing crafted to widen the qualified audience, not just the audience.",
            },
            {
              t: "Seller in control",
              c: "Decisions on price, timing and terms stay with you — never delegated to the room.",
            },
            {
              t: "28 days, by design",
              c: "A finite, focused window that creates momentum without forcing the outcome.",
            },
          ].map((p) => (
            <div key={p.t}>
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground flex items-center gap-2">
                <span className="ring-mark" /> Why it works
              </div>
              <h3 className="font-serif text-2xl md:text-3xl tracking-tight mt-4">{p.t}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{p.c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8 WINNING FEATURES */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="container-page py-20 md:py-28">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            <span className="ring-mark" /> &nbsp;Eight winning features
          </div>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight mt-5 leading-[1.02] max-w-3xl">
            What makes it different, every time.
          </h2>
          <div className="mt-14 grid md:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.n}
                className="bg-background border border-border p-6 md:p-8 flex gap-6 items-start"
              >
                <span className="font-serif text-3xl text-[var(--ringgreen-deep)] leading-none">
                  {f.n}
                </span>
                <div>
                  <h3 className="font-serif text-xl md:text-2xl tracking-tight">{f.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 SELLING PHASES */}
      <section className="container-page py-20 md:py-28">
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          <span className="ring-mark" /> &nbsp;Four selling phases
        </div>
        <h2 className="font-serif text-4xl md:text-6xl tracking-tight mt-5 leading-[1.02] max-w-3xl">
          Twenty-eight days. Four deliberate moves.
        </h2>

        <div className="mt-14 grid md:grid-cols-4 gap-px bg-border">
          {PHASES.map((p, i) => (
            <div key={p.t} className="bg-background p-7 md:p-8">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl text-[var(--ringgreen-deep)]">0{i + 1}</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--ringgreen-deep)] bg-[var(--ringgreen-tint)] px-2 py-1">
                  {p.d}
                </span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl tracking-tight mt-6">{p.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HERITAGE */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="container-page py-20 md:py-28 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              <span className="ring-mark" /> &nbsp;Heritage
            </div>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-5 leading-[1.1]">
              Twenty-five years in the making.
            </h2>
          </div>
          <div className="md:col-span-8">
            <blockquote className="font-serif text-2xl md:text-3xl tracking-tight leading-[1.25]">
              <span className="text-[var(--ringgreen-deep)]">“</span>The foundation principles of
              Set to Sell were trademarked as
              <em className="not-italic"> Set Sale</em> from 2000 to 2010 — licensed to more than
              500 consultants across Australia and New Zealand. Stephen Ring and Ring Real Estate
              were among the first authorised, and have been refining the discipline ever since.
              <span className="text-[var(--ringgreen-deep)]">”</span>
            </blockquote>
            <p className="mt-6 text-sm text-muted-foreground">
              Today, the strategy has been refreshed and is reserved for trained Ring agents only.
            </p>
          </div>
        </div>
      </section>

      {/* COMPLIANCE */}
      <section className="container-page py-16 md:py-20">
        <div className="border border-border p-8 md:p-10 bg-background">
          <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--ringgreen-deep)]">
            South Australian compliance
          </div>
          <h3 className="font-serif text-xl md:text-2xl tracking-tight mt-3">
            Statutes Amendment Act 2007 — Section 24A
          </h3>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">
            South Australian legislation prohibits under-quoting and vague price representations
            ("offers over", "in excess of", "low to mid"). A price guide may only be quoted in an
            Auction sale, and not more than 10% below the anticipated reserve. If a property is
            listed without a price, no price can be quoted. Set to Sell is built to operate fully
            within these rules — by design, not by exception.
          </p>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-[var(--ink)] text-white">
        <div className="container-page py-20 md:py-28 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <div className="text-[10px] uppercase tracking-[0.32em] text-white/60 flex items-center gap-2">
              <span className="ring-mark" /> Begin
            </div>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight mt-5 leading-[1.02]">
              Let's design a strategy for your home.
            </h2>
          </div>
          <div className="md:col-span-4 flex flex-col gap-3">
            <Link
              to="/sell/appraisal"
              className="inline-flex items-center justify-between gap-3 px-7 py-4 bg-[var(--ringgreen)] text-[var(--ink)] text-xs uppercase tracking-[0.22em] hover:bg-[var(--ringgreen-deep)] hover:text-white transition-colors"
            >
              Request appraisal <ArrowRight size={14} />
            </Link>
            <a
              href="tel:+61883703211"
              className="inline-flex items-center justify-between gap-3 px-7 py-4 border border-white/20 text-xs uppercase tracking-[0.22em] hover:border-[var(--ringgreen)] hover:text-[var(--ringgreen)] transition-colors"
            >
              (08) 8370 3211 <Phone size={14} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
