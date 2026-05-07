import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/ring-logo-green.png";

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
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent text-white"
          : "bg-background/85 backdrop-blur-md text-foreground border-b border-border/60",
      ].join(" ")}
    >
      <div className="container-page flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)} aria-label="Ring Real Estate home">
          <img
            src={logo}
            alt="Ring Real Estate"
            className={[
              "h-10 md:h-12 w-auto transition",
              transparent ? "brightness-0 invert" : "",
            ].join(" ")}
          />
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.22em] opacity-70 mt-0.5">
            Est. 1978
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative py-1 hover:opacity-100 opacity-90 transition-opacity"
              activeProps={{ className: "opacity-100" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <a href="tel:+61883703211" className="text-sm opacity-90 hover:opacity-100">
            (08) 8370 3211
          </a>
          <Link
            to="/sell/appraisal"
            className="text-xs uppercase tracking-[0.18em] px-4 py-2.5 bg-foreground text-background hover:bg-foreground/90 transition"
          >
            Request Appraisal
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2"
          aria-label="Menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`h-px bg-current transition ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`h-px bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-px bg-current transition ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={[
          "md:hidden fixed inset-x-0 top-16 bottom-0 bg-background text-foreground transition-all duration-500",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <div className="container-page py-10 flex flex-col gap-7">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="font-serif text-4xl tracking-tight"
            >
              {n.label}
            </Link>
          ))}
          <div className="mt-8 pt-8 border-t border-border space-y-3 text-sm">
            <a href="tel:+61883703211" className="block">(08) 8370 3211</a>
            <a href="mailto:ring@ring-sa.com.au" className="block opacity-70">
              ring@ring-sa.com.au
            </a>
          </div>
          <Link
            to="/sell/appraisal"
            onClick={() => setOpen(false)}
            className="mt-4 inline-block text-xs uppercase tracking-[0.2em] px-5 py-3 bg-foreground text-background w-fit"
          >
            Request Appraisal
          </Link>
        </div>
      </div>
    </header>
  );
}
