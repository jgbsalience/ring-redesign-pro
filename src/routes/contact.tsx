import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowRight, MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
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

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  enquiryType: z.string().min(1),
  message: z.string().min(1, "Please enter a message"),
  website: z.literal("").optional(),
});

type FormValues = z.infer<typeof schema>;

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { enquiryType: "Selling my home", website: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Something went wrong");
      }
      setSubmitted(true);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

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

          {submitted ? (
            <div className="md:col-span-7 bg-secondary/50 p-8 md:p-12 flex flex-col justify-center text-center gap-5">
              <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--ringgreen-deep)]">Received</div>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Thank you. We'll be in touch.</h2>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                We aim to respond within one business day. You can also reach us directly on{" "}
                <a href="tel:+61883703211" className="underline underline-offset-2">(08) 8370 3211</a>.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="md:col-span-7 bg-secondary/50 p-8 md:p-12 space-y-5 h-fit"
              noValidate
            >
              {/* Honeypot — hidden from real users */}
              <input
                type="text"
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                className="hidden"
                {...register("website")}
              />

              <div className="font-serif text-3xl">Send a message</div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First name" error={errors.firstName?.message}>
                  <input
                    type="text"
                    autoComplete="given-name"
                    className={inputCls(!!errors.firstName)}
                    {...register("firstName")}
                  />
                </Field>
                <Field label="Last name" error={errors.lastName?.message}>
                  <input
                    type="text"
                    autoComplete="family-name"
                    className={inputCls(!!errors.lastName)}
                    {...register("lastName")}
                  />
                </Field>
              </div>

              <Field label="Email" error={errors.email?.message}>
                <input
                  type="email"
                  autoComplete="email"
                  className={inputCls(!!errors.email)}
                  {...register("email")}
                />
              </Field>

              <Field label="Phone" error={errors.phone?.message}>
                <input
                  type="tel"
                  autoComplete="tel"
                  className={inputCls(!!errors.phone)}
                  {...register("phone")}
                />
              </Field>

              <Field label="I'm enquiring about">
                <select
                  className="mt-2 w-full bg-background px-4 py-3.5 text-sm outline-none focus:ring-1 focus:ring-[var(--ringgreen-deep)]"
                  {...register("enquiryType")}
                >
                  <option>Selling my home</option>
                  <option>Buying a home</option>
                  <option>Renting a home</option>
                  <option>Property management</option>
                  <option>Something else</option>
                </select>
              </Field>

              <Field label="Message" error={errors.message?.message}>
                <textarea
                  className={`mt-2 w-full bg-background px-4 py-3.5 text-sm min-h-40 outline-none resize-y ${errors.message ? "ring-1 ring-red-500" : "focus:ring-1 focus:ring-[var(--ringgreen-deep)]"}`}
                  {...register("message")}
                />
              </Field>

              {serverError && (
                <p className="text-sm text-red-600">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.22em] hover:bg-foreground/90 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Sending…</>
                ) : (
                  <>Send message <ArrowRight size={14} /></>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `mt-2 w-full bg-background px-4 py-3.5 text-sm outline-none transition-all ${
    hasError
      ? "ring-1 ring-red-500"
      : "focus:ring-1 focus:ring-[var(--ringgreen-deep)]"
  }`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
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
