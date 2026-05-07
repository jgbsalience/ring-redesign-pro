import { Link } from "@tanstack/react-router";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "tint" | "soft" | "ink" | "bone";

const toneClasses: Record<Tone, string> = {
  tint: "bg-green-tint text-foreground",
  soft: "bg-green-soft text-foreground",
  ink: "bg-[var(--ink)] text-[var(--bone)]",
  bone: "bg-background text-foreground",
};

/* ------------------------------------------------------------------ */
/* SectionShell — base padding + container, with a tone               */
/* ------------------------------------------------------------------ */

export function SectionShell({
  tone = "bone",
  className,
  children,
  id,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn(toneClasses[tone], "border-y border-border/60", className)}>
      <div className="container-page py-20 md:py-28">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Eyebrow — small kicker line with the ring mark                     */
/* ------------------------------------------------------------------ */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("text-[10px] uppercase tracking-[0.32em] text-muted-foreground", className)}>
      <span className="ring-mark" /> &nbsp;{children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GreenHero — large headline hero with optional eyebrow + CTAs       */
/* ------------------------------------------------------------------ */

type CTA = {
  label: string;
  to?: ComponentProps<typeof Link>["to"];
  href?: string;
  variant?: "primary" | "ghost";
};

export function GreenHero({
  eyebrow,
  title,
  italic,
  description,
  ctas,
  tone = "tint",
  align = "left",
  children,
}: {
  eyebrow?: string;
  title: string;
  italic?: string;
  description?: string;
  ctas?: CTA[];
  tone?: Extract<Tone, "tint" | "soft" | "ink">;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const isDark = tone === "ink";
  return (
    <section className={cn(toneClasses[tone], "relative overflow-hidden")}>
      <div
        aria-hidden
        className="absolute inset-x-0 -top-32 h-64 pointer-events-none opacity-60"
        style={{ background: "radial-gradient(closest-side, var(--ringgreen-soft), transparent 70%)" }}
      />
      <div className={cn("container-page pt-28 md:pt-36 pb-20 md:pb-28 relative", align === "center" && "text-center")}>
        {eyebrow && (
          <div
            className={cn(
              "text-[10px] uppercase tracking-[0.32em]",
              isDark ? "text-[var(--ringgreen)]" : "text-muted-foreground",
              align === "center" && "flex justify-center",
            )}
          >
            <span className="ring-mark" /> &nbsp;{eyebrow}
          </div>
        )}
        <h1
          className={cn(
            "font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mt-5 leading-[0.95]",
            align === "left" ? "max-w-4xl" : "max-w-4xl mx-auto",
          )}
        >
          {title} {italic && <span className="italic font-light">{italic}</span>}
        </h1>
        {description && (
          <p
            className={cn(
              "mt-8 text-lg md:text-xl leading-relaxed max-w-2xl",
              align === "center" && "mx-auto",
              isDark ? "text-[var(--bone)]/75" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
        {ctas && ctas.length > 0 && (
          <div className={cn("mt-10 flex flex-wrap gap-3", align === "center" && "justify-center")}>
            {ctas.map((c) => (
              <CTAButton key={c.label} cta={c} dark={isDark} />
            ))}
          </div>
        )}
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}

function CTAButton({ cta, dark }: { cta: CTA; dark: boolean }) {
  const base =
    "group inline-flex items-center gap-3 px-7 py-4 text-xs uppercase tracking-[0.22em] transition-colors";
  const primary = "bg-[var(--ringgreen)] text-[var(--ink)] hover:bg-[var(--ringgreen-deep)] hover:text-[var(--bone)]";
  const ghost = dark
    ? "border border-[var(--bone)]/30 text-[var(--bone)] hover:bg-[var(--bone)]/5"
    : "border border-foreground/80 text-foreground hover:bg-foreground hover:text-background";
  const cls = cn(base, cta.variant === "ghost" ? ghost : primary);
  const inner = (
    <>
      {cta.label}
      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </>
  );
  if (cta.to) return <Link to={cta.to} className={cls}>{inner}</Link>;
  return <a href={cta.href ?? "#"} className={cls}>{inner}</a>;
}

/* ------------------------------------------------------------------ */
/* FeatureBand — 3 or 4 column feature grid with icons                */
/* ------------------------------------------------------------------ */

export type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export function FeatureBand({
  eyebrow,
  title,
  italic,
  description,
  features,
  tone = "tint",
}: {
  eyebrow?: string;
  title: string;
  italic?: string;
  description?: string;
  features: Feature[];
  tone?: Tone;
}) {
  const isDark = tone === "ink";
  return (
    <SectionShell tone={tone} className="border-0">
      <div className="grid md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-5">
          {eyebrow && <Eyebrow className={isDark ? "text-[var(--ringgreen)]" : undefined}>{eyebrow}</Eyebrow>}
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mt-4 leading-[1.05]">
            {title} {italic && <span className="italic font-light">{italic}</span>}
          </h2>
          {description && (
            <p className={cn("mt-6 max-w-md", isDark ? "text-[var(--bone)]/70" : "text-muted-foreground")}>
              {description}
            </p>
          )}
        </div>
        <div className="md:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-10">
          {features.map((f) => (
            <div key={f.title} className="border-t border-green pt-5">
              <f.icon size={20} className="text-[var(--ringgreen-deep)]" />
              <div className="font-serif text-xl mt-4">{f.title}</div>
              <p className={cn("mt-2 text-sm leading-relaxed", isDark ? "text-[var(--bone)]/70" : "text-muted-foreground")}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

/* ------------------------------------------------------------------ */
/* Callout — compact CTA strip with single action                     */
/* ------------------------------------------------------------------ */

export function Callout({
  eyebrow,
  title,
  italic,
  description,
  cta,
  tone = "ink",
}: {
  eyebrow?: string;
  title: string;
  italic?: string;
  description?: string;
  cta: CTA;
  tone?: Extract<Tone, "ink" | "tint" | "soft">;
}) {
  const isDark = tone === "ink";
  return (
    <section className={cn(toneClasses[tone])}>
      <div className="container-page py-20 md:py-24 grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          {eyebrow && (
            <div
              className={cn(
                "text-[10px] uppercase tracking-[0.32em]",
                isDark ? "text-[var(--ringgreen)]" : "text-muted-foreground",
              )}
            >
              <span className="ring-mark" /> &nbsp;{eyebrow}
            </div>
          )}
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight mt-4 leading-[1.05] max-w-2xl">
            {title} {italic && <span className="italic font-light">{italic}</span>}
          </h2>
          {description && (
            <p className={cn("mt-5 max-w-xl", isDark ? "text-[var(--bone)]/70" : "text-muted-foreground")}>
              {description}
            </p>
          )}
        </div>
        <div className="md:col-span-4 md:flex md:justify-end">
          <CTAButton cta={cta} dark={isDark} />
        </div>
      </div>
    </section>
  );
}
