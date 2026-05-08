import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowRight, Check, Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/sell/appraisal")({
  head: () => ({
    meta: [
      { title: "Find out the true market value of your home — Ring Real Estate" },
      { name: "description", content: "A confidential, no-obligation written appraisal of your home from a senior Ring agent. Selling now or forward planning — we welcome the connection." },
      { property: "og:title", content: "Request an appraisal — Ring Real Estate" },
      { property: "og:description", content: "Confidential. No obligation. Senior agent only." },
    ],
  }),
  component: AppraisalPage,
});

const HERO_IMG =
  "https://img.multiarray.com/realestatemanagerpm/00b8fc5b-fb0a-4f45-a58b-199da1ae3f2e/c2728d99-37f0-4373-8ddc-147cded542d9/cp-rect-1920x1440.pg";

const INTERESTS = [
  "I only want to know the market value of my home",
  "I need advice on the method of sale",
  "I need presentation or home preparation advice",
  "I want to know how the market is trending in my area",
  "I want to know the best time to sell",
];

function AppraisalPage() {
  const [interests, setInterests] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (v: string) =>
    setInterests((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-background text-foreground">
      <Header />

      {/* HERO */}
      <section className="relative isolate overflow-hidden h-[78vh] min-h-[560px] flex items-end">
        <img
          src={HERO_IMG}
          alt="A Ring residence on the foothills"
          referrerPolicy="no-referrer"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 w-full h-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/35 to-black/85" />

        <div className="container-page pb-16 md:pb-24 text-white">
          <div className="text-[10px] uppercase tracking-[0.32em] text-white/80 flex items-center gap-2">
            <span className="ring-mark" /> Appraisal request
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mt-5 max-w-5xl">
            Find out the true market value of your home.
          </h1>
          <div className="mt-8 h-px w-24 bg-[var(--ringgreen)]" />
          <p className="mt-6 max-w-xl text-white/85 text-lg leading-relaxed">
            Selling now, or forward planning — we welcome the connection.
          </p>
        </div>
      </section>

      {/* INTRO + META */}
      <section className="container-page py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
          <div className="md:col-span-7">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              <span className="ring-mark" /> &nbsp;What to expect
            </div>
            <h2 className="font-serif text-4xl md:text-6xl tracking-tight mt-5 leading-[1.02]">
              A quiet conversation about your home.
            </h2>
            <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed text-[1.05rem] max-w-2xl">
              <p>A senior Ring agent will visit your home at a time that suits you — and only you. We will walk the property, ask questions, and listen.</p>
              <p>Within seven days you will receive a written appraisal grounded in genuinely comparable sales, alongside a campaign recommendation if you wish to proceed.</p>
              <p className="text-foreground">It costs nothing. It commits to nothing.</p>
            </div>
          </div>

          <aside className="md:col-span-5 md:pt-2">
            <div className="border-t border-border pt-6 space-y-4 text-sm">
              {[
                ["Cost", "Complimentary"],
                ["Time on site", "≈ 45 minutes"],
                ["Written response", "Within 7 days"],
                ["Conducted by", "Senior agent only"],
                ["Obligation", "None"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-baseline border-b border-border/60 pb-4">
                  <span className="text-muted-foreground uppercase tracking-[0.18em] text-[10px]">{k}</span>
                  <span className="text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* FORM */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="container-page py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
            {/* Left rail */}
            <div className="md:col-span-4">
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                <span className="ring-mark" /> &nbsp;Begin
              </div>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight mt-5 leading-[1.05]">
                We welcome the connection.
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
                Share a few details and a senior Ring agent will be in touch within one business day to arrange a time.
              </p>

              <div className="mt-10 pt-8 border-t border-border space-y-5 text-sm">
                <div className="flex gap-3">
                  <MapPin size={16} className="mt-0.5 text-[var(--ringgreen-deep)]" />
                  <div>
                    <div className="text-muted-foreground uppercase tracking-[0.18em] text-[10px]">Office</div>
                    <div className="mt-1">140 Shepherds Hill Road<br />Bellevue Heights SA 5050</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone size={16} className="mt-0.5 text-[var(--ringgreen-deep)]" />
                  <div>
                    <div className="text-muted-foreground uppercase tracking-[0.18em] text-[10px]">Phone</div>
                    <a href="tel:+61883703211" className="mt-1 block hover:text-[var(--ringgreen-deep)]">(08) 8370 3211</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail size={16} className="mt-0.5 text-[var(--ringgreen-deep)]" />
                  <div>
                    <div className="text-muted-foreground uppercase tracking-[0.18em] text-[10px]">Email</div>
                    <a href="mailto:ring@ring-sa.com.au" className="mt-1 block hover:text-[var(--ringgreen-deep)]">ring@ring-sa.com.au</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-8">
              {submitted ? (
                <div className="bg-background p-10 md:p-14 border border-border">
                  <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--ringgreen-deep)] flex items-center gap-2">
                    <span className="ring-mark" /> Received
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl tracking-tight mt-4">
                    Thank you. Your request is with us.
                  </h3>
                  <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg">
                    A senior Ring agent will be in touch within one business day to arrange a time. In the meantime, feel free to call us directly on (08) 8370 3211.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="bg-background p-8 md:p-12 border border-border space-y-7">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Name" required />
                    <Field label="Phone" type="tel" required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Email" type="email" required />
                    <Field label="Property address" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Suburb" />
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        Property type
                      </label>
                      <select className="mt-2 w-full bg-transparent border-b border-border px-0 py-3 text-sm focus:border-[var(--ringgreen-deep)] outline-none transition-colors">
                        <option>House</option>
                        <option>Townhouse</option>
                        <option>Apartment</option>
                        <option>Land</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Interested in <span className="text-[var(--ringgreen-deep)]">*</span>
                    </label>
                    <div className="mt-3 grid gap-2">
                      {INTERESTS.map((v) => {
                        const on = interests.includes(v);
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => toggle(v)}
                            className={`group flex items-start gap-3 text-left px-4 py-3.5 border transition-all ${
                              on
                                ? "border-[var(--ringgreen-deep)] bg-[var(--ringgreen-tint)]"
                                : "border-border hover:border-foreground/40"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex items-center justify-center w-4 h-4 border ${
                                on
                                  ? "bg-[var(--ringgreen-deep)] border-[var(--ringgreen-deep)] text-white"
                                  : "border-foreground/40"
                              }`}
                            >
                              {on && <Check size={12} strokeWidth={3} />}
                            </span>
                            <span className="text-sm leading-snug">{v}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Anything we should know?
                    </label>
                    <textarea
                      className="mt-2 w-full bg-transparent border-b border-border px-0 py-3 text-sm min-h-32 focus:border-[var(--ringgreen-deep)] outline-none transition-colors resize-none"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your details are kept strictly confidential and used only to respond to this enquiry.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Fields marked <span className="text-[var(--ringgreen-deep)]">*</span> required
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.22em] hover:bg-[var(--ringgreen-deep)] transition-colors"
                    >
                      Request appraisal <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="container-page py-20 md:py-28">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {[
            { t: "Confidential", c: "Your enquiry is held in confidence by a senior agent — never circulated." },
            { t: "No obligation", c: "A written appraisal is yours to keep, whether you list with us or not." },
            { t: "Senior agent only", c: "Every appraisal is conducted personally by a Ring principal — not delegated." },
          ].map((p) => (
            <div key={p.t}>
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground flex items-center gap-2">
                <span className="ring-mark" /> Promise
              </div>
              <h3 className="font-serif text-2xl md:text-3xl tracking-tight mt-4">{p.t}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{p.c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-[var(--ink)] text-white">
        <div className="container-page py-20 md:py-28 grid md:grid-cols-12 gap-10 items-end">
          <blockquote className="md:col-span-8 font-serif text-3xl md:text-5xl leading-[1.15] tracking-tight">
            <span className="text-[var(--ringgreen)]">“</span>We will walk the property,
            ask questions, and listen.<span className="text-[var(--ringgreen)]">”</span>
          </blockquote>
          <div className="md:col-span-4 space-y-3 text-sm">
            <div className="text-white/60 uppercase tracking-[0.22em] text-[10px]">Speak with us directly</div>
            <a href="tel:+61883703211" className="block text-xl hover:text-[var(--ringgreen)] transition-colors">
              (08) 8370 3211
            </a>
            <a href="mailto:ring@ring-sa.com.au" className="block text-base text-white/80 hover:text-[var(--ringgreen)] transition-colors">
              ring@ring-sa.com.au
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Field({
  label,
  type = "text",
  required = false,
}: {
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label} {required && <span className="text-[var(--ringgreen-deep)]">*</span>}
      </label>
      <input
        type={type}
        required={required}
        className="mt-2 w-full bg-transparent border-b border-border px-0 py-3 text-sm focus:border-[var(--ringgreen-deep)] outline-none transition-colors"
      />
    </div>
  );
}
