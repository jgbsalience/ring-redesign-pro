import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowRight, MapPin, Phone, Mail, Clock, Loader2, Check, ChevronDown } from "lucide-react";
import { listings } from "@/data/site";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ring Real Estate Adelaide" },
      {
        name: "description",
        content:
          "Visit our Bellevue Heights office, or send us a message. We respond within the business day.",
      },
      { property: "og:title", content: "Contact Ring Real Estate" },
      {
        property: "og:description",
        content: "Visit our Bellevue Heights office, or send us a message.",
      },
    ],
    links: canonical("/contact"),
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

type Phase = "idle" | "submitting" | "success" | "done";

const OFFICE_ITEMS = [
  { Icon: MapPin, title: "Office", lines: ["140 Shepherds Hill Road", "Bellevue Heights SA 5050"] },
  { Icon: Phone, title: "Telephone", lines: ["(08) 8370 3211"] },
  { Icon: Mail, title: "Email", lines: ["ring@ring-sa.com.au"] },
  { Icon: Clock, title: "Hours", lines: ["Mon – Fri · 8:30 – 5:30", "Sat · By appointment"] },
] as const;

function ContactPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { enquiryType: "Selling my home", website: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setPhase("submitting");
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
      // Show success state on the button briefly, then swap to the success panel
      setPhase("success");
      setTimeout(() => {
        setPhase("done");
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      }, 900);
    } catch (err) {
      setPhase("idle");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  const submitted = phase === "done";

  return (
    <div className="bg-background text-foreground">
      <Header />
      <span id="main-content" tabIndex={-1} className="sr-only" aria-hidden="true" />
      <section className="pt-28 md:pt-36 container-page pb-24 md:pb-32">
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          <span className="ring-mark" /> &nbsp;Get in touch
        </div>
        <h1 className="font-serif text-5xl md:text-8xl tracking-tight mt-5 leading-[0.95] max-w-4xl">
          We'd love to <span className="italic">hear from you.</span>
        </h1>

        <div className="mt-20 grid md:grid-cols-12 gap-12 lg:gap-20">
          <div className="md:col-span-5 space-y-10">
            {OFFICE_ITEMS.map((item, i) => (
              <Item
                key={item.title}
                Icon={item.Icon}
                title={item.title}
                lines={[...item.lines]}
                delayMs={i * 100}
              />
            ))}

            <div
              className="group aspect-[4/3] bg-secondary overflow-hidden contact-info-stagger"
              style={{ animationDelay: `${OFFICE_ITEMS.length * 100}ms` }}
            >
              <img
                src={listings[4]?.hero}
                alt="Ring Real Estate studio"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.02]"
              />
            </div>

            {/* Map embed */}
            <div
              className="aspect-[4/3] bg-secondary overflow-hidden border border-border contact-info-stagger"
              style={{ animationDelay: `${(OFFICE_ITEMS.length + 1) * 100}ms` }}
            >
              <iframe
                title="Map showing Ring Real Estate office at 140 Shepherds Hill Road, Bellevue Heights"
                src="https://maps.google.com/maps?q=140%20Shepherds%20Hill%20Road%2C%20Bellevue%20Heights%20SA%205050&t=m&z=15&output=embed&iwloc=near"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, filter: "grayscale(0.4) contrast(0.95)" }}
                aria-label="Map of Ring Real Estate office location"
              />
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=140+Shepherds+Hill+Road+Bellevue+Heights+SA+5050"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-[var(--ringgreen-deep)] transition-colors -mt-4"
            >
              Get directions <ArrowRight size={12} />
            </a>
          </div>

          {submitted ? (
            <div className="md:col-span-7 bg-secondary/50 p-8 md:p-12 flex flex-col justify-center text-center gap-5">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-[var(--ringgreen)] flex items-center justify-center check-pop">
                  <Check size={22} strokeWidth={2.5} className="text-[var(--ink)]" />
                </div>
              </div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--ringgreen-deep)]">
                Received
              </div>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight">
                Thank you. We'll be in touch.
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                We aim to respond within one business day. You can also reach us directly on{" "}
                <a href="tel:+61883703211" className="underline underline-offset-2">
                  (08) 8370 3211
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="md:col-span-7 bg-secondary/50 p-8 md:p-12 space-y-5 h-fit"
              noValidate
            >
              {/* Honeypot */}
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
                  inputMode="tel"
                  autoComplete="tel"
                  className={inputCls(!!errors.phone)}
                  {...register("phone")}
                />
              </Field>

              <Field label="I'm enquiring about">
                <div className="relative">
                  <select
                    className={`${inputCls(false)} appearance-none pr-10 cursor-pointer`}
                    {...register("enquiryType")}
                  >
                    <option>Selling my home</option>
                    <option>Buying a home</option>
                    <option>Renting a home</option>
                    <option>Property management</option>
                    <option>Something else</option>
                  </select>
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </Field>

              <Field label="Message" error={errors.message?.message} multiline>
                <textarea
                  className={`${inputCls(!!errors.message)} min-h-40 resize-y`}
                  {...register("message")}
                />
              </Field>

              {serverError && (
                <p className="text-sm text-red-600" role="alert">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={phase === "submitting" || phase === "success"}
                className={`w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs uppercase tracking-[0.22em] disabled:cursor-default transition-colors ${
                  phase === "success"
                    ? "bg-[var(--ringgreen)] text-[var(--ink)]"
                    : "bg-foreground text-background hover:bg-[var(--ringgreen-deep)] disabled:opacity-70"
                }`}
              >
                {phase === "submitting" ? (
                  <>
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Sending…
                  </>
                ) : phase === "success" ? (
                  <>
                    <Check size={14} strokeWidth={2.5} className="check-pop" aria-hidden="true" />{" "}
                    Sent
                  </>
                ) : (
                  <>
                    Send message <ArrowRight size={14} aria-hidden="true" />
                  </>
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
  return `peer mt-2 w-full bg-background px-4 py-3.5 text-sm outline-none border-b transition-colors ${
    hasError ? "border-red-500" : "border-border focus:border-border"
  }`;
}

function Field({
  label,
  error,
  children,
  multiline = false,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        {children}
        {/* Animated focus underline — grows from center */}
        <span
          aria-hidden="true"
          className={`absolute left-0 right-0 ${multiline ? "bottom-0" : "bottom-0"} h-[2px] origin-center transition-transform duration-300 ease-out pointer-events-none ${
            error
              ? "bg-red-500 scale-x-100"
              : "bg-[var(--ringgreen-deep)] scale-x-0 peer-focus:scale-x-100"
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Item({
  Icon,
  title,
  lines,
  delayMs = 0,
}: {
  Icon: typeof MapPin;
  title: string;
  lines: string[];
  delayMs?: number;
}) {
  return (
    <div className="flex gap-5 contact-info-stagger" style={{ animationDelay: `${delayMs}ms` }}>
      <Icon size={20} className="text-[var(--ringgreen)] mt-1.5 shrink-0" aria-hidden="true" />
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{title}</div>
        <div className="mt-2 space-y-1 text-base">
          {lines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
