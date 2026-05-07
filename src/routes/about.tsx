import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { agents, testimonials, listings } from "@/data/site";
import { ArrowRight, Plus, Minus, Phone, Mail, CalendarDays } from "lucide-react";
import { TeamMemberImage } from "@/components/site/TeamMemberImage";
import { useState } from "react";

const FAQS: { q: string; a: string; group: "Selling" | "Buying" | "About us" }[] = [
  {
    group: "Selling",
    q: "How long does it take to sell a home in Adelaide?",
    a: "Most well-presented Adelaide homes go under contract within 21 to 35 days of going to market. Off-market and pre-market campaigns can be quicker. We'll give you an honest, evidence-based timeline at your appraisal — not a sales pitch.",
  },
  {
    group: "Selling",
    q: "What does Ring Real Estate charge in commission?",
    a: "Our fee is tailored to the campaign — the property, the price guide, and the marketing approach. There are no hidden costs. You'll see a fully itemised proposal at appraisal so you can compare like-for-like with any other agency.",
  },
  {
    group: "Selling",
    q: "Auction or private treaty — which is better?",
    a: "Both work. Auction suits homes with strong buyer competition or unique appeal; private treaty suits considered, longer-decision purchases. We recommend the method that has historically delivered the best result for homes like yours in your suburb.",
  },
  {
    group: "Selling",
    q: "Do I need to renovate or stage before selling?",
    a: "Rarely a full renovation, but presentation matters. We'll walk through your home and recommend the small, high-return improvements — paint, gardens, styling — that consistently lift the final price. We coordinate trades and stylists for you.",
  },
  {
    group: "Buying",
    q: "How do I get notified about new Ring listings first?",
    a: "Register with us and tell us what you're looking for. We share off-market and pre-market homes with our buyer database before they appear publicly. Many of our sales never see realestate.com.au.",
  },
  {
    group: "Buying",
    q: "Can you help me buy a home that isn't listed with Ring?",
    a: "Yes. We're happy to give you a frank, conflict-free read on any home you're considering across metropolitan Adelaide — comparable sales, likely range, and what to watch out for at building inspection.",
  },
  {
    group: "Buying",
    q: "What suburbs do you specialise in?",
    a: "We're rooted in the southern foothills — Blackwood, Bellevue Heights, Glenalta, Coromandel Valley, Hawthorndene, Eden Hills — and sell across greater Adelaide. If you're buying in our patch, we likely already know the home and the street.",
  },
  {
    group: "About us",
    q: "Are you part of a franchise?",
    a: "No. Ring Real Estate has been independently owned and operated since 1978. Decisions are made in our office, by the people who'll handle your sale or lease — not by a head office in another city.",
  },
  {
    group: "About us",
    q: "Do you manage rental properties as well?",
    a: "Yes. Our property management team looks after around 460 doors across Adelaide with a 99.2% retention rate. The senior agent you meet at the appraisal is the one who manages the relationship — not a junior handover.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Ring Real Estate — Adelaide Real Estate Agents Since 1978" },
      {
        name: "description",
        content:
          "Ring Real Estate is an independent Adelaide real estate agency selling, leasing and managing homes across the southern foothills and metropolitan Adelaide since 1978.",
      },
      {
        name: "keywords",
        content:
          "Adelaide real estate, Adelaide real estate agents, Adelaide real estate agency, residential real estate Adelaide, Blackwood real estate, Bellevue Heights real estate, Glenalta real estate, Coromandel Valley real estate",
      },
      { property: "og:title", content: "About Ring Real Estate — Adelaide Real Estate Agents Since 1978" },
      {
        property: "og:description",
        content:
          "An independent Adelaide real estate agency. A small, senior team selling and managing distinguished homes across metropolitan Adelaide for nearly five decades.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: listings[1]?.hero ?? "" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About Ring Real Estate — Adelaide Real Estate Agents Since 1978" },
      {
        name: "twitter:description",
        content:
          "Independent Adelaide real estate agency. Senior agents, selling and managing distinguished homes since 1978.",
      },
      { name: "twitter:image", content: listings[1]?.hero ?? "" },
    ],
    links: [{ rel: "canonical", href: "https://ring-sa.com.au/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "Ring Real Estate",
          description:
            "Independent Adelaide real estate agency selling, leasing and managing residential homes across metropolitan Adelaide since 1978.",
          url: "https://ring-sa.com.au/about",
          foundingDate: "1978",
          areaServed: [
            { "@type": "City", name: "Adelaide" },
            { "@type": "Place", name: "Blackwood, South Australia" },
            { "@type": "Place", name: "Bellevue Heights, South Australia" },
            { "@type": "Place", name: "Glenalta, South Australia" },
            { "@type": "Place", name: "Coromandel Valley, South Australia" },
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Adelaide",
            addressRegion: "SA",
            addressCountry: "AU",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <Header overlay />
      <section className="relative h-[80svh] min-h-[520px] overflow-hidden">
        <img src={listings[1]?.hero} alt="A distinguished Adelaide home sold by Ring Real Estate" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        <div className="relative container-page h-full flex flex-col justify-end pb-20 text-white">
          <div className="text-[10px] uppercase tracking-[0.32em] opacity-80">
            <span className="ring-mark" /> &nbsp;Adelaide real estate, established 1978
          </div>
          <h1 className="font-serif text-5xl md:text-8xl tracking-tight mt-5 leading-[0.95] max-w-5xl">
            Adelaide real estate,<br /><span className="italic">done the same way since 1978.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
            Ring Real Estate is an independent Adelaide real estate agency
            selling, leasing and managing distinguished homes across
            Blackwood, Bellevue Heights, Glenalta, Coromandel Valley and the
            wider southern foothills.
          </p>
        </div>
      </section>

      <section className="container-page py-24 md:py-32 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Our story · Adelaide, since 1978</div>
        </div>
        <div className="md:col-span-7 space-y-7 text-lg leading-relaxed">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight leading-[1.1]">
            Adelaide's independent residential real estate agency, since 1978.
          </h2>
          <p>
            Ring Real Estate was founded in Fullarton in 1978 by Geoffrey
            Ring on a single, stubborn idea: that residential real estate in
            Adelaide could be a profession of integrity, not a profession of
            volume.
          </p>
          <p>
            Nearly five decades later, the offices have moved twice and the
            faces have grown into a team. The idea has not changed. We
            remain deliberately small, deliberately senior, and deliberately
            slow when slowness produces the better result.
          </p>
          <p className="font-serif italic text-2xl md:text-3xl text-[var(--ringgreen)] leading-snug">
            "We sell fewer homes than the franchises around us — and we sell
            them better, by hand, by name, with the patience that good
            outcomes require."
          </p>
        </div>
      </section>

      {/* By the numbers */}
      <section className="border-y border-border bg-background">
        <div className="container-page py-20 md:py-28 grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
          {[
            { n: "47", l: "Years in Adelaide" },
            { n: "1,800+", l: "Homes sold by hand" },
            { n: "$2.4B", l: "In transactions, lifetime" },
            { n: "92%", l: "Repeat & referral business" },
          ].map((s) => (
            <div key={s.l} className="text-center md:text-left">
              <div className="font-serif text-5xl md:text-6xl text-[var(--ringgreen)] leading-none">{s.n}</div>
              <div className="mt-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="container-page py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">What we hold to</div>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight mt-4 leading-[1.05]">
              Four principles,<br /><span className="italic">unmoved since 1978.</span>
            </h2>
          </div>
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-12">
            {[
              { t: "Senior, always", b: "No juniors learning on your home. Every campaign is led, listed and negotiated by a principal with twenty years or more in the business." },
              { t: "Small by design", b: "We cap our rolls. A team that takes on too much cannot give attention to any of it — and attention is the work." },
              { t: "Quiet first", b: "Off-market introductions before public campaigns. Many of Adelaide's finest homes change hands without a sign on the lawn." },
              { t: "Plain language", b: "No jargon, no theatre, no inflated appraisals to win the listing. We tell you what we believe, then we earn it." },
            ].map((p, i) => (
              <div key={p.t} className="border-t border-foreground pt-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">0{i + 1}</div>
                <h3 className="font-serif text-2xl mt-3">{p.t}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-secondary/40 py-24 md:py-32">
        <div className="container-page">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">A short history</div>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight mt-4">Forty-seven years, in moments.</h2>
          <ol className="mt-16 relative border-l border-border pl-8 md:pl-12 space-y-12">
            {[
              { y: "1978", t: "Founded in Fullarton", d: "Geoffrey Ring opens a single-room office on Fisher Street with two listings and a borrowed typewriter." },
              { y: "1986", t: "Property management begins", d: "A handful of long-term landlords ask us to manage what we sold them. The rent roll is born." },
              { y: "1997", t: "The studio on Unley Road", d: "We move to the building we still occupy today — restored, not renovated." },
              { y: "2008", t: "Through the downturn", d: "We do not retrench. The team that started the GFC together finishes it together." },
              { y: "2019", t: "Second generation", d: "Geoffrey's children join the principal team, carrying the same standards forward." },
              { y: "2025", t: "Still independent", d: "No franchise, no investors, no targets that override the client's interest. As it began." },
            ].map((m) => (
              <li key={m.y} className="relative">
                <span className="absolute -left-[42px] md:-left-[54px] top-1.5 w-3 h-3 rounded-full bg-[var(--ringgreen)] ring-4 ring-secondary/40" />
                <div className="font-serif text-3xl md:text-4xl text-[var(--ringgreen)]">{m.y}</div>
                <h3 className="font-serif text-xl md:text-2xl mt-2">{m.t}</h3>
                <p className="mt-2 text-muted-foreground max-w-2xl leading-relaxed">{m.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What makes us different */}
      <section className="container-page py-24 md:py-32 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">The difference</div>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mt-4 leading-[1.05]">
            What you'll notice<br /><span className="italic">in the first week.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Most of our clients come to us after a campaign elsewhere that
            felt rushed, generic, or transactional. Here is what changes.
          </p>
        </div>
        <div className="md:col-span-7 space-y-8">
          {[
            { t: "Your agent answers the phone", b: "Not a junior, not a call centre. The person whose name is on your listing." },
            { t: "We see the home before we price it", b: "Often twice. We will not put a number to a property we have walked through once at dusk." },
            { t: "Photography is commissioned, not templated", b: "We work with a small group of architectural photographers. Twilight shoots are standard, not extra." },
            { t: "We tell you what isn't working", b: "Open homes, pricing, presentation — we feed back honestly each week, not only at the end." },
          ].map((d) => (
            <div key={d.t} className="flex gap-6 border-b border-border pb-8">
              <div className="font-serif text-2xl text-[var(--ringgreen)] shrink-0 w-10">→</div>
              <div>
                <h3 className="font-serif text-xl">{d.t}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{d.b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-background py-24 md:py-32 border-t border-border">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                <span className="ring-mark" /> &nbsp;Leadership
              </div>
              <h2 className="font-serif text-4xl md:text-6xl tracking-tight mt-4 leading-[1.05]">
                The principals<br /><span className="italic">behind every campaign.</span>
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground leading-relaxed">
              Two senior agents lead every sale and every property under
              management. They are the names on the listing, and the names
              you'll deal with from first appraisal to settlement.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-20">
            {agents
              .filter((a) => ["stephen-ring", "luke-bull"].includes(a.id))
              .map((a) => (
                <article key={a.id} className="group">
                  <Link to="/team/$agentId" params={{ agentId: a.id }} className="block">
                    <div className="aspect-[4/5] img-zoom bg-muted overflow-hidden">
                      <TeamMemberImage
                        agent={a}
                        size="lg"
                        className="grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                    <div className="mt-6 flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-3xl group-hover:text-[var(--ringgreen)] transition-colors">
                        {a.name}
                      </h3>
                      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground shrink-0">
                        {a.role}
                      </span>
                    </div>
                  </Link>

                  <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                    {(a.bio.length ? a.bio : [a.shortBio ?? ""]).slice(0, 2).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <a href={`tel:${a.phone}`} className="hover:text-[var(--ringgreen)]">
                      {a.phone}
                    </a>
                    <a
                      href={`mailto:${a.email}`}
                      className="text-muted-foreground hover:text-[var(--ringgreen)]"
                    >
                      {a.email}
                    </a>
                  </div>

                  <Link
                    to="/team/$agentId"
                    params={{ agentId: a.id }}
                    className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] hover:gap-3 transition-all hover:text-[var(--ringgreen)]"
                  >
                    Read full profile <ArrowRight size={12} />
                  </Link>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* Full team */}
      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container-page">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Our inner circle</div>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight mt-4">The people you'll work with.</h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {agents.map((a) => (
              <Link key={a.id} to="/team/$agentId" params={{ agentId: a.id }} className="grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-6 group">
                <div className="aspect-[3/4] img-zoom bg-muted">
                  <TeamMemberImage agent={a} size="lg" className="grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div>
                  <div className="font-serif text-2xl group-hover:text-[var(--ringgreen)] transition-colors">{a.name}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{a.role}</div>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{a.shortBio ?? a.bio[0]}</p>
                  <div className="mt-5 text-sm space-y-1">
                    <div><a onClick={(e) => e.stopPropagation()} href={`tel:${a.phone}`} className="hover:text-[var(--ringgreen)]">{a.phone}</a></div>
                    <div><a onClick={(e) => e.stopPropagation()} href={`mailto:${a.email}`} className="text-muted-foreground hover:text-[var(--ringgreen)]">{a.email}</a></div>
                  </div>
                  <div className="mt-5 text-xs uppercase tracking-[0.2em] inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    View profile <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12">
          {testimonials.slice(1).map((t) => (
            <figure key={t.author} className="border-t border-foreground pt-8">
              <div className="font-serif text-3xl text-[var(--ringgreen)] leading-none">"</div>
              <blockquote className="font-serif text-2xl md:text-3xl leading-snug mt-4">{t.quote}</blockquote>
              <figcaption className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t.author} · {t.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <FaqSection />

      <section className="bg-[var(--ink)] text-[var(--bone)]">
        <div className="container-page py-24 md:py-32">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end">
            <div className="md:col-span-7">
              <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--ringgreen)]">
                <span className="ring-mark" /> &nbsp;Let's talk
              </div>
              <h2 className="font-serif text-4xl md:text-6xl tracking-tight mt-5 max-w-2xl leading-[1.05]">
                Come and meet us — <span className="italic">coffee is on,</span> always.
              </h2>
              <p className="mt-6 text-[var(--bone)]/70 max-w-lg">
                Whether you're ready to sell, just curious about the market, or looking for the right home in Adelaide — pick the way that suits you best.
              </p>
            </div>
            <div className="md:col-span-5 grid gap-3">
              <a
                href="tel:0883703211"
                className="group flex items-center justify-between gap-4 px-7 py-5 bg-[var(--ringgreen)] text-[var(--ink)] text-xs uppercase tracking-[0.22em] hover:opacity-90"
              >
                <span className="flex items-center gap-3"><Phone size={16} /> Call (08) 8370 3211</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="mailto:ring@ring-sa.com.au"
                className="group flex items-center justify-between gap-4 px-7 py-5 border border-[var(--bone)]/30 text-[var(--bone)] text-xs uppercase tracking-[0.22em] hover:bg-[var(--bone)]/5"
              >
                <span className="flex items-center gap-3"><Mail size={16} /> Email the team</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/sell/appraisal"
                className="group flex items-center justify-between gap-4 px-7 py-5 border border-[var(--bone)]/30 text-[var(--bone)] text-xs uppercase tracking-[0.22em] hover:bg-[var(--bone)]/5"
              >
                <span className="flex items-center gap-3"><CalendarDays size={16} /> Book an appraisal</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="mt-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--bone)]/70 hover:text-[var(--ringgreen)]"
              >
                Or visit the Bellevue Heights studio <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FaqSection() {
  const groups = Array.from(new Set(FAQS.map((f) => f.group)));
  const [open, setOpen] = useState<string | null>(FAQS[0]?.q ?? null);
  return (
    <section className="bg-secondary/40 border-t border-border">
      <div className="container-page py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Frequently asked</div>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight mt-4 leading-[1.05]">
              Questions, <span className="italic font-light">answered honestly.</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-sm">
              Buying or selling in Adelaide should feel considered, not rushed. If your question isn't here, ask us directly.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] border-b border-foreground pb-1"
            >
              Ask a question <ArrowRight size={14} />
            </Link>
          </div>
          <div className="md:col-span-8 space-y-12">
            {groups.map((group) => (
              <div key={group}>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--ringgreen)] mb-4">{group}</div>
                <div className="border-t border-border">
                  {FAQS.filter((f) => f.group === group).map((f) => {
                    const isOpen = open === f.q;
                    return (
                      <div key={f.q} className="border-b border-border">
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : f.q)}
                          className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                          aria-expanded={isOpen}
                        >
                          <span className="font-serif text-xl md:text-2xl leading-snug pr-4 group-hover:text-[var(--ringgreen)] transition-colors">
                            {f.q}
                          </span>
                          <span className="mt-2 shrink-0 text-muted-foreground">
                            {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="pb-7 pr-12 text-muted-foreground leading-relaxed max-w-2xl">
                            {f.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
