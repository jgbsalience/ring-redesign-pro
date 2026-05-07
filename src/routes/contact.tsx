import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import { listings } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ring Real Estate Adelaide" },
      { name: "description", content: "Visit our Bellevue Heights office, or send us a message. We respond within the business day." },
      { property: "og:title", content: "Contact Ring Real Estate" },
      { property: "og:description", content: "Visit our Bellevue Heights office, or send us a message." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <section className="pt-28 md:pt-36 container-page pb-24 md:pb-32">
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          <span className="ring-mark" /> &nbsp;Get in touch
        </div>
        <h1 className="font-serif text-5xl md:text-8xl tracking-tight mt-5 leading-[0.95] max-w-4xl">
          We'd love to <span className="italic">hear from you.</span>
        </h1>

        <div className="mt-20 grid md:grid-cols-12 gap-12 lg:gap-20">
          <div className="md:col-span-5 space-y-10">
            <Item Icon={MapPin} title="Office" lines={["140 Shepherds Hill Road", "Bellevue Heights SA 5050"]} />
            <Item Icon={Phone} title="Telephone" lines={["(08) 8370 3211"]} />
            <Item Icon={Mail} title="Email" lines={["ring@ring-sa.com.au"]} />
            <Item Icon={Clock} title="Hours" lines={["Mon – Fri · 8:30 – 5:30", "Sat · By appointment"]} />

            <div className="aspect-[4/3] bg-secondary overflow-hidden">
              <img
                src={listings[4]?.hero}
                alt="Ring Real Estate studio"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>

          <form className="md:col-span-7 bg-secondary/50 p-8 md:p-12 space-y-5 h-fit">
            <div className="font-serif text-3xl">Send a message</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First name" />
              <Field label="Last name" />
            </div>
            <Field label="Email" type="email" />
            <Field label="Phone" />
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">I'm enquiring about</label>
              <select className="mt-2 w-full bg-background px-4 py-3.5 text-sm">
                <option>Selling my home</option>
                <option>Buying a home</option>
                <option>Renting a home</option>
                <option>Property management</option>
                <option>Something else</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Message</label>
              <textarea className="mt-2 w-full bg-background px-4 py-3.5 text-sm min-h-40" />
            </div>
            <button type="button" className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.22em] hover:bg-foreground/90">
              Send message <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Item({ Icon, title, lines }: { Icon: typeof MapPin; title: string; lines: string[] }) {
  return (
    <div className="flex gap-5">
      <Icon size={20} className="text-[var(--ringgreen)] mt-1.5 shrink-0" />
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{title}</div>
        <div className="mt-2 space-y-1 text-base">
          {lines.map((l) => <div key={l}>{l}</div>)}
        </div>
      </div>
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
