import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sell/appraisal")({
  head: () => ({
    meta: [
      { title: "Request an appraisal — Ring Real Estate" },
      { name: "description", content: "A confidential, no-obligation written appraisal of your home from a senior Ring agent." },
      { property: "og:title", content: "Request an appraisal" },
      { property: "og:description", content: "Confidential. No obligation. Senior agent only." },
    ],
  }),
  component: AppraisalPage,
});

function AppraisalPage() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <section className="pt-28 md:pt-36 container-page pb-24 md:pb-32">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
          <div className="md:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              <span className="ring-mark" /> &nbsp;Appraisal request
            </div>
            <h1 className="font-serif text-5xl md:text-7xl tracking-tight mt-5 leading-[0.95]">
              A quiet conversation about your home.
            </h1>
            <div className="mt-10 space-y-5 text-muted-foreground leading-relaxed">
              <p>A senior Ring agent will visit your home at a time that suits you — and only you. We will walk the property, ask questions, and listen.</p>
              <p>Within seven days you will receive a written appraisal grounded in genuinely comparable sales, alongside a campaign recommendation if you wish to proceed.</p>
              <p>It costs nothing. It commits to nothing.</p>
            </div>
            <div className="mt-12 pt-10 border-t border-border space-y-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Cost</span><span>Complimentary</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Time on site</span><span>~45 minutes</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Written response</span><span>Within 7 days</span></div>
            </div>
          </div>

          <form className="md:col-span-7 bg-secondary/50 p-8 md:p-12 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First name" />
              <Field label="Last name" />
            </div>
            <Field label="Email" type="email" />
            <Field label="Phone" />
            <Field label="Property address" />
            <Field label="Suburb" />
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Property type</label>
              <select className="mt-2 w-full bg-background px-4 py-3.5 text-sm">
                <option>House</option><option>Townhouse</option><option>Apartment</option><option>Land</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Anything we should know?</label>
              <textarea className="mt-2 w-full bg-background px-4 py-3.5 text-sm min-h-36" />
            </div>
            <button type="button" className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.22em] hover:bg-foreground/90">
              Request appraisal <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input type={type} className="mt-2 w-full bg-background px-4 py-3.5 text-sm outline-none" />
    </div>
  );
}
