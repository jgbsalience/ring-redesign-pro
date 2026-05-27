import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useId, useRef, useState } from "react";
import React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowRight, Check, CheckCircle, Loader2 } from "lucide-react";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/sell/appraisal")({
  head: () => ({
    meta: [
      { title: "Find out the true market value of your home — Ring Real Estate" },
      {
        name: "description",
        content:
          "A confidential, no-obligation written appraisal of your home from a senior Ring agent. Selling now or forward planning — we welcome the connection.",
      },
      { property: "og:title", content: "Request an appraisal — Ring Real Estate" },
      { property: "og:description", content: "Confidential. No obligation. Senior agent only." },
    ],
    links: canonical("/sell/appraisal"),
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

const PROMISES = [
  {
    t: "Confidential",
    c: "Your enquiry is held in confidence by a senior agent — never circulated.",
  },
  {
    t: "No obligation",
    c: "A written appraisal is yours to keep, whether you list with us or not.",
  },
  {
    t: "Senior agent only",
    c: "Every appraisal is conducted personally by a Ring principal — not delegated.",
  },
];

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(6, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  propertyAddress: z.string().optional(),
  suburb: z.string().optional(),
  propertyType: z.string().min(1),
  interests: z.array(z.string()).min(1, "Please select at least one area of interest"),
  comments: z.string().optional(),
  website: z.literal("").optional(),
});

type FormValues = z.infer<typeof schema>;

function AppraisalPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const serverErrorRef = useRef<HTMLParagraphElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      propertyType: "House",
      interests: [],
      website: "",
    },
  });

  const selectedInterests = watch("interests");

  const toggleInterest = (v: string) => {
    const next = selectedInterests.includes(v)
      ? selectedInterests.filter((x) => x !== v)
      : [...selectedInterests, v];
    setValue("interests", next, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/appraisal", {
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
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      setTimeout(() => serverErrorRef.current?.focus(), 50);
    }
  };

  const onInvalid = () => {
    // Focus the first field with an error
    const order: Array<keyof FormValues> = [
      "name",
      "phone",
      "email",
      "propertyAddress",
      "suburb",
      "propertyType",
      "interests",
      "comments",
    ];
    for (const field of order) {
      if (errors[field]) {
        if (field !== "interests") setFocus(field as keyof Omit<FormValues, "interests">);
        break;
      }
    }
  };

  return (
    <div className="bg-background text-foreground">
      <Header />
      <span id="main-content" tabIndex={-1} className="sr-only" aria-hidden="true" />

      {/* HERO INTRO — dark ink band */}
      <section className="bg-[var(--ink)] text-white">
        <div className="container-page pt-32 md:pt-40 pb-16 md:pb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-[var(--ringgreen)]" />
              <span className="text-[10px] uppercase tracking-[0.32em] text-white/70">
                Request an appraisal
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] mt-6">
              Find out the true market value of your property.
            </h1>
            <p className="mt-6 text-white/80 text-[1.05rem] leading-relaxed max-w-xl">
              Selling now, or forward planning — we welcome the connection.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-white/50">
              <span>140 Shepherds Hill Rd, Bellevue Heights</span>
              <span className="text-white/20">·</span>
              <a
                href="tel:+61883703211"
                className="hover:text-[var(--ringgreen)] transition-colors text-white/70"
              >
                (08) 8370 3211
              </a>
              <span className="text-white/20">·</span>
              <a
                href="mailto:ring@ring-sa.com.au"
                className="hover:text-[var(--ringgreen)] transition-colors text-white/70"
              >
                ring@ring-sa.com.au
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT — two-column desktop layout */}
      <section className="container-page py-16 md:py-24">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12 xl:gap-20 items-start max-w-5xl mx-auto">
          {/* FORM COLUMN */}
          <div>
            {submitted ? (
              /* SUCCESS STATE — dark ink panel */
              <div className="bg-[var(--ink)] text-white px-10 py-14 md:px-16 md:py-20 text-center">
                <div className="flex justify-center">
                  <CheckCircle size={40} className="text-[var(--ringgreen)]" strokeWidth={1.5} />
                </div>
                <div className="mt-5 text-[10px] uppercase tracking-[0.32em] text-[var(--ringgreen)]">
                  Received
                </div>
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight mt-4 text-white">
                  Thank you. Your request is with us.
                </h2>
                <p className="mt-5 text-white/70 leading-relaxed max-w-lg mx-auto">
                  A senior Ring agent will be in touch within one business day to arrange a time. In
                  the meantime, feel free to call us directly on (08) 8370 3211.
                </p>
                <div className="mt-10 flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/buy"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--ringgreen)] text-[var(--ink)] text-xs uppercase tracking-[0.18em] hover:bg-white transition-colors"
                  >
                    Browse listings <ArrowRight size={13} />
                  </Link>
                  <Link
                    to="/sell"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-xs uppercase tracking-[0.18em] hover:bg-white/10 transition-colors"
                  >
                    Our approach <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              /* FORM */
              <div className="bg-card border border-border shadow-sm p-8 md:p-10">
                <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-7">
                  Your details
                </h2>

                <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6" noValidate>
                  {/* Honeypot */}
                  <input
                    type="text"
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="off"
                    className="hidden"
                    {...register("website")}
                  />

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Name" required error={errors.name?.message}>
                      <input
                        type="text"
                        autoComplete="name"
                        placeholder="John Smith"
                        className={inputCls(!!errors.name)}
                        {...register("name")}
                      />
                    </Field>
                    <Field label="Phone" required error={errors.phone?.message}>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="0400 000 000"
                        className={inputCls(!!errors.phone)}
                        {...register("phone")}
                      />
                    </Field>
                  </div>

                  <Field label="Email" required error={errors.email?.message}>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="johnsmith@somewhere.com.au"
                      className={inputCls(!!errors.email)}
                      {...register("email")}
                    />
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Property address">
                      <input
                        type="text"
                        autoComplete="street-address"
                        placeholder="e.g. 12 Smith Street"
                        className={inputCls(false)}
                        {...register("propertyAddress")}
                      />
                    </Field>
                    <Field label="Suburb">
                      <input
                        type="text"
                        autoComplete="address-level2"
                        placeholder="e.g. Bellevue Heights"
                        className={inputCls(false)}
                        {...register("suburb")}
                      />
                    </Field>
                  </div>

                  <Field label="Property type">
                    <select
                      className="mt-2 w-full bg-background border border-border px-4 py-3 text-sm focus:border-[var(--ringgreen-deep)] outline-none transition-colors"
                      {...register("propertyType")}
                    >
                      <option>House</option>
                      <option>Townhouse</option>
                      <option>Apartment</option>
                      <option>Land</option>
                      <option>Other</option>
                    </select>
                  </Field>

                  {/* Interests */}
                  <fieldset>
                    <legend className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Interested in <span className="text-[var(--ringgreen-deep)]">*</span>
                    </legend>
                    <Controller
                      control={control}
                      name="interests"
                      render={() => (
                        <div className="mt-3 grid sm:grid-cols-2 gap-2">
                          {INTERESTS.map((v) => {
                            const on = selectedInterests.includes(v);
                            return (
                              <button
                                key={v}
                                type="button"
                                onClick={() => toggleInterest(v)}
                                aria-pressed={on}
                                className={`group flex items-start gap-3 text-left px-4 py-3 border transition-all ${
                                  on
                                    ? "border-[var(--ringgreen-deep)] bg-[var(--ringgreen-tint)]"
                                    : "border-border hover:border-foreground/30 hover:bg-secondary/30"
                                }`}
                              >
                                <span
                                  className={`mt-0.5 flex items-center justify-center w-4 h-4 border shrink-0 transition-colors ${
                                    on
                                      ? "bg-[var(--ringgreen-deep)] border-[var(--ringgreen-deep)] text-white"
                                      : "border-foreground/30"
                                  }`}
                                  aria-hidden="true"
                                >
                                  {on && <Check size={11} strokeWidth={3} />}
                                </span>
                                <span className="text-sm leading-snug">{v}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    />
                    {errors.interests && (
                      <p className="mt-2 text-xs text-red-600" role="alert">
                        {errors.interests.message}
                      </p>
                    )}
                  </fieldset>

                  <Field label="Comments">
                    <textarea
                      placeholder="Anything we should know?"
                      className="mt-2 w-full bg-background border border-border px-4 py-3 text-sm min-h-28 focus:border-[var(--ringgreen-deep)] outline-none transition-colors resize-y"
                      {...register("comments")}
                    />
                  </Field>

                  {serverError && (
                    <p
                      ref={serverErrorRef}
                      tabIndex={-1}
                      role="alert"
                      className="text-sm text-red-600 text-center focus:outline-none"
                    >
                      {serverError}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground leading-relaxed text-center">
                    Your details are kept strictly confidential and used only to respond to this
                    enquiry.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-3 px-10 py-4 bg-[var(--ringgreen-deep)] text-white text-xs uppercase tracking-[0.22em] hover:bg-[var(--ringgreen)] hover:text-[var(--ink)] disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Request appraisal <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* SIDEBAR — sticky trust signals */}
          <aside className="lg:sticky lg:top-28 space-y-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-6">
                Our promise
              </div>
              <div className="space-y-7">
                {PROMISES.map((p) => (
                  <div key={p.t} className="flex gap-4">
                    <div className="mt-0.5 w-5 h-5 shrink-0 flex items-center justify-center border border-[var(--ringgreen-deep)]/40">
                      <Check size={11} className="text-[var(--ringgreen-deep)]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-serif text-lg leading-tight">{p.t}</div>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.c}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-4">
                Prefer to call?
              </div>
              <a
                href="tel:+61883703211"
                className="block font-serif text-2xl hover:text-[var(--ringgreen-deep)] transition-colors"
              >
                (08) 8370 3211
              </a>
              <p className="mt-2 text-xs text-muted-foreground">Mon – Fri, 9am – 5pm</p>
              <a
                href="mailto:ring@ring-sa.com.au"
                className="mt-4 block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ring@ring-sa.com.au
              </a>
            </div>

            <div className="border-t border-border pt-8">
              <blockquote className="font-serif text-xl leading-snug text-muted-foreground">
                <span className="text-[var(--ringgreen)]">"</span>We will walk the property, ask
                questions, and listen.<span className="text-[var(--ringgreen)]">"</span>
              </blockquote>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `mt-2 w-full bg-background border px-4 py-3 text-sm placeholder:text-muted-foreground/50 outline-none transition-colors ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-border focus:border-[var(--ringgreen-deep)]"
  }`;
}

function Field({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactElement;
}) {
  const generatedId = useId();
  const errorId = `${generatedId}-error`;

  const child = React.cloneElement(children, {
    id: generatedId,
    ...(error ? { "aria-describedby": errorId, "aria-invalid": true } : {}),
  });

  return (
    <div>
      <label
        htmlFor={generatedId}
        className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
      >
        {label}{" "}
        {required && (
          <span className="text-[var(--ringgreen-deep)]" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only">(required)</span>}
      </label>
      {child}
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
