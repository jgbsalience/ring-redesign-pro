import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/ring-logo-rev.png";

const nav = [
  { to: "/buy", label: "Buy" },
  { to: "/rent", label: "Rent" },
  { to: "/sold", label: "Sold" },
  { to: "/sell", label: "Sell" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = overlay && !scrolled && !open;

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 text-white",
        transparent
          ? "bg-transparent"
          : "bg-[var(--ink)]/95 backdrop-blur-md border-b border-white/10",
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
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.22em] text-white/60 mt-0.5">
            Est. 1978
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-sm" aria-label="Primary">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative py-1 text-white/85 hover:text-[var(--ringgreen)] focus-visible:outline-none focus-visible:text-[var(--ringgreen)] transition-colors after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-[var(--ringgreen)] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
              activeProps={{
                className: "text-white after:scale-x-100 after:bg-[var(--ringgreen)]",
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <a
            href="tel:+61883703211"
            className="text-sm text-white/85 hover:text-[var(--ringgreen)] focus-visible:outline-none focus-visible:text-[var(--ringgreen)] transition-colors"
          >
            (08) 8370 3211
          </a>
          <Link
            to="/sell/appraisal"
            className="text-xs uppercase tracking-[0.18em] px-4 py-2.5 bg-[var(--ringgreen)] text-[var(--ink)] hover:bg-white transition-colors"
          >
            Request Appraisal
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <div className="w-6 flex flex-col gap-1.5">
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
        id="mobile-nav"
        aria-hidden={!open}
        className={[
          "md:hidden fixed inset-x-0 top-16 bottom-0 bg-[var(--ink)] text-white transition-[opacity,transform] duration-500",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <nav className="container-page py-10 flex flex-col gap-7" aria-label="Mobile">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="font-serif text-4xl tracking-tight hover:text-[var(--ringgreen)] focus-visible:outline-none focus-visible:text-[var(--ringgreen)] transition-colors"
            >
              {n.label}
            </Link>
          ))}
          <div className="mt-8 pt-8 border-t border-white/10 space-y-3 text-sm">
            <a
              href="tel:+61883703211"
              tabIndex={open ? 0 : -1}
              className="block focus-visible:outline-none focus-visible:text-[var(--ringgreen)] transition-colors"
            >
              (08) 8370 3211
            </a>
            <a
              href="mailto:ring@ring-sa.com.au"
              tabIndex={open ? 0 : -1}
              className="block text-white/70 focus-visible:outline-none focus-visible:text-[var(--ringgreen)] transition-colors"
            >
              ring@ring-sa.com.au
            </a>
          </div>
          <Link
            to="/sell/appraisal"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="mt-4 inline-block text-xs uppercase tracking-[0.2em] px-5 py-3 bg-[var(--ringgreen)] text-[var(--ink)] w-fit focus-visible:outline-none focus-visible:bg-white"
          >
            Request Appraisal
          </Link>
        </nav>
      </div>
    </header>
  );
}
