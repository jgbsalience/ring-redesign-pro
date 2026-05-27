import { Link } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import logo from "@/assets/ring-logo-rev.png";

const nav = [
  { to: "/buy", label: "Buy" },
  { to: "/rent", label: "Rent" },
  { to: "/sold", label: "Sold" },
  { to: "/sell", label: "Sell" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

export function Header({ overlay = false }: { overlay?: boolean }) {
  const [scrollY, setScrollY] = useState(0);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const sheetId = useId();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus trap + ESC + body scroll lock for mobile nav
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const sheet = sheetRef.current;
    const firstLink = sheet?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstLink?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !sheet) return;
      const focusables = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      (toggleRef.current ?? previouslyFocused)?.focus?.();
    };
  }, [open]);

  // Gradual scroll progress: 0 → 1 over the first 100px
  const scrollProgress = Math.min((open ? 100 : scrollY) / 100, 1);
  const isTransparentMode = overlay;

  // Compute inline styles for smooth blur + bg transition
  const bgOpacity = isTransparentMode ? scrollProgress * 0.95 : 0.95;
  const blurPx = isTransparentMode ? scrollProgress * 12 : 12;
  // ink colour is oklch(0.18 0.01 250) ≈ #1e2030
  const headerStyle: React.CSSProperties = {
    backgroundColor: `color-mix(in oklab, oklch(0.18 0.01 250) ${Math.round(bgOpacity * 100)}%, transparent)`,
    backdropFilter: blurPx > 0.5 ? `blur(${blurPx.toFixed(1)}px)` : undefined,
    WebkitBackdropFilter: blurPx > 0.5 ? `blur(${blurPx.toFixed(1)}px)` : undefined,
  };
  const showBorder = isTransparentMode ? scrollProgress > 0.3 : true;

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--ringgreen)] focus:text-[var(--ink)] focus:font-medium focus:text-sm focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ringgreen-deep)]"
      >
        Skip to main content
      </a>

      <header
        style={headerStyle}
        className={[
          "fixed top-0 inset-x-0 z-50 text-white transition-[border-color] duration-300",
          showBorder ? "border-b border-white/10" : "border-b border-transparent",
        ].join(" ")}
      >
        <div className="container-page flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setOpen(false)}
            aria-label="Ring Real Estate home"
          >
            <img src={logo} alt="Ring Real Estate" className="h-10 md:h-12 w-auto" />
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.22em] text-white/80 mt-0.5">
              Est. 1978
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-9 text-sm" aria-label="Primary">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="relative py-1 text-white/85 hover:text-[var(--ringgreen)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ringgreen)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)]"
                activeProps={{ className: "text-white nav-link-active" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <a
              href="tel:+61883703211"
              className="text-sm text-white/85 hover:text-[var(--ringgreen)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ringgreen)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)]"
            >
              (08) 8370 3211
            </a>
            <Link
              to="/sell/appraisal"
              className="btn-cta-pulse text-xs uppercase tracking-[0.18em] px-4 py-2.5 bg-[var(--ringgreen)] text-[var(--ink)] hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)]"
            >
              Request Appraisal
            </Link>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ringgreen)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)]"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={sheetId}
          >
            <div className="w-6 flex flex-col gap-1.5" aria-hidden="true">
              <span
                className={`h-px bg-current transition ${open ? "rotate-45 translate-y-[6px]" : ""}`}
              />
              <span className={`h-px bg-current transition ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-px bg-current transition ${open ? "-rotate-45 -translate-y-[6px]" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile sheet */}
        <div
          ref={sheetRef}
          id={sheetId}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          aria-hidden={!open}
          className={[
            "md:hidden fixed inset-x-0 top-16 bottom-0 bg-[var(--ink)] text-white transition-all duration-500",
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none",
          ].join(" ")}
        >
          <div className="container-page py-10 flex flex-col gap-7">
            <nav aria-label="Mobile primary" className="flex flex-col gap-7">
              {nav.map((n, i) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="font-serif text-4xl tracking-tight hover:text-[var(--ringgreen)] transition-colors focus:outline-none focus-visible:text-[var(--ringgreen)] focus-visible:underline"
                  style={
                    open
                      ? {
                          animation: `mobile-nav-in 0.35s cubic-bezier(0.2,0.65,0.2,1) ${i * 80}ms both`,
                        }
                      : undefined
                  }
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div
              className="mt-8 pt-8 border-t border-white/10 space-y-3 text-sm"
              style={
                open
                  ? {
                      animation: `mobile-nav-in 0.35s cubic-bezier(0.2,0.65,0.2,1) ${nav.length * 80}ms both`,
                    }
                  : undefined
              }
            >
              <a
                href="tel:+61883703211"
                tabIndex={open ? 0 : -1}
                className="block focus:outline-none focus-visible:text-[var(--ringgreen)]"
              >
                (08) 8370 3211
              </a>
              <a
                href="mailto:ring@ring-sa.com.au"
                tabIndex={open ? 0 : -1}
                className="block text-white/80 focus:outline-none focus-visible:text-[var(--ringgreen)]"
              >
                ring@ring-sa.com.au
              </a>
            </div>
            <Link
              to="/sell/appraisal"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="mt-4 inline-block text-xs uppercase tracking-[0.2em] px-5 py-3 bg-[var(--ringgreen)] text-[var(--ink)] w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)]"
              style={
                open
                  ? {
                      animation: `mobile-nav-in 0.35s cubic-bezier(0.2,0.65,0.2,1) ${(nav.length + 1) * 80}ms both`,
                    }
                  : undefined
              }
            >
              Request Appraisal
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
