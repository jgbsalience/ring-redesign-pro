import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { agents, testimonials, listings } from "@/data/site";
import { ArrowRight } from "lucide-react";
import { TeamMemberImage } from "@/components/site/TeamMemberImage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ring Real Estate, Adelaide since 1978" },
      { name: "description", content: "A small, senior team selling and managing distinguished Adelaide homes for nearly five decades." },
      { property: "og:title", content: "About Ring Real Estate" },
      { property: "og:description", content: "Adelaide's independent residential agency, since 1978." },
      { property: "og:image", content: listings[1]?.hero ?? "" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <Header overlay />
      <section className="relative h-[80svh] min-h-[520px] overflow-hidden">
        <img src={listings[1]?.hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        <div className="relative container-page h-full flex flex-col justify-end pb-20 text-white">
          <div className="text-[10px] uppercase tracking-[0.32em] opacity-80">
            <span className="ring-mark" /> &nbsp;Established 1978
          </div>
          <h1 className="font-serif text-5xl md:text-8xl tracking-tight mt-5 leading-[0.95] max-w-5xl">
            Forty-seven years<br />of <span className="italic">the same word.</span>
          </h1>
        </div>
      </section>

      <section className="container-page py-24 md:py-32 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Our story</div>
        </div>
        <div className="md:col-span-7 space-y-7 text-lg leading-relaxed">
          <p>
            Ring Real Estate was founded in Fullarton in 1978 by Geoffrey
            Ring on a single, stubborn idea: that residential agency could
            be a profession of integrity, not a profession of volume.
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

      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container-page">
          <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Our inner circle</div>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight mt-4">The people you'll work with.</h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {agents.map((a) => (
              <Link key={a.id} to="/team/$agentId" params={{ agentId: a.id }} className="grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-6 group">
                <div className="aspect-[3/4] img-zoom bg-stone">
                  <img src={a.photo} alt={a.name} referrerPolicy="no-referrer" loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
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

      <section className="bg-[var(--ink)] text-[var(--bone)]">
        <div className="container-page py-24 md:py-32 flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight max-w-2xl leading-[1.05]">
            Come and meet us — coffee is on, always.
          </h2>
          <Link to="/contact" className="inline-flex items-center gap-3 px-7 py-4 bg-[var(--ringgreen)] text-[var(--ink)] text-xs uppercase tracking-[0.22em]">
            Visit the studio <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
