import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowRight, Check } from "lucide-react";

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

      {/* INTRO */}
      <section className="container-page pt-32 md:pt-40 pb-14 md:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto h-px w-12 bg-[var(--ringgreen-deep)]" />
          <div className="mt-5 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Request an appraisal
          </div>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.05] mt-5">
            Find out the true market value of your property.
          </h1>
          <p className="mt-7 text-muted-foreground text-[1.05rem] leading-relaxed">
            Selling now, or forward planning — we welcome the connection.
          </p>
        </div>
      </section>

      {/* OFFICE STRIP */}
      <div className="container-page pb-10">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span>140 Shepherds Hill Rd, Bellevue Heights</span>
          <span className="text-border">·</span>
          <a href="tel:+61883703211" className="hover:text-[var(--ringgreen-deep)] transition-colors">(08) 8370 3211</a>
          <span className="text-border">·</span>
          <a href="mailto:ring@ring-sa.com.au" className="hover:text-[var(--ringgreen-deep)] transition-colors">ring@ring-sa.com.au</a>
        </div>
      </div>

      {/* FORM */}
      <section>
        <div className="container-page pb-20 md:pb-28">
          <div className="max-w-3xl mx-auto">
            {submitted ? (
              <div className="border border-border p-10 md:p-14 text-center">
                <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--ringgreen-deep)]">
                  Received
                </div>
                <h3 className="font-serif text-3xl md:text-4xl tracking-tight mt-4">
                  Thank you. Your request is with us.
                </h3>
                <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg mx-auto">
                  A senior Ring agent will be in touch within one business day to arrange a time. In the meantime, feel free to call us directly on (08) 8370 3211.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-7">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Name" required placeholder="John Smith" />
                  <Field label="Phone" type="tel" required placeholder="0400 000 000" />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Email" type="email" required placeholder="johnsmith@somewhere.com.au" />
                  <Field label="Property address" placeholder="Street, suburb" />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Suburb" />
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Property type
                    </label>
                    <select className="mt-2 w-full bg-background border border-border rounded-[2px] px-4 py-3 text-sm focus:border-[var(--ringgreen-deep)] outline-none transition-colors">
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
                          className={`group flex items-start gap-3 text-left px-4 py-3 border rounded-[2px] transition-all ${
                            on
                              ? "border-[var(--ringgreen-deep)] bg-[var(--ringgreen-tint)]"
                              : "border-border hover:border-foreground/40"
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex items-center justify-center w-4 h-4 border rounded-[2px] ${
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
                    Comments
                  </label>
                  <textarea
                    placeholder="Anything we should know?"
                    className="mt-2 w-full bg-background border border-border rounded-[2px] px-4 py-3 text-sm min-h-32 focus:border-[var(--ringgreen-deep)] outline-none transition-colors resize-y"
                  />
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed text-center">
                  Your details are kept strictly confidential and used only to respond to this enquiry.
                </p>

                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-3 px-10 py-4 bg-[var(--ringgreen-deep)] text-white text-xs uppercase tracking-[0.22em] rounded-[2px] hover:opacity-90 transition-opacity"
                  >
                    Request appraisal <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="border-t border-border">
        <div className="container-page py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-10 md:gap-16 max-w-5xl mx-auto">
            {[
              { t: "Confidential", c: "Your enquiry is held in confidence by a senior agent — never circulated." },
              { t: "No obligation", c: "A written appraisal is yours to keep, whether you list with us or not." },
              { t: "Senior agent only", c: "Every appraisal is conducted personally by a Ring principal — not delegated." },
            ].map((p) => (
              <div key={p.t}>
                <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  Promise
                </div>
                <h3 className="font-serif text-2xl md:text-3xl tracking-tight mt-3">{p.t}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{p.c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-[var(--ink)] text-white">
        <div className="container-page py-16 md:py-24 grid md:grid-cols-12 gap-10 items-end">
          <blockquote className="md:col-span-8 font-serif text-3xl md:text-4xl leading-[1.2] tracking-tight">
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
  placeholder,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label} {required && <span className="text-[var(--ringgreen-deep)]">*</span>}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full bg-background border border-border rounded-[2px] px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-[var(--ringgreen-deep)] outline-none transition-colors"
      />
    </div>
  );
}
