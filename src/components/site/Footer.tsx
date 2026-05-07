import { Link } from "@tanstack/react-router";
import logo from "@/assets/ring-logo.png";

export function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--bone)] mt-32">
      <div className="container-page py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <img
            src={logo}
            alt="Ring Real Estate"
            className="h-16 w-auto brightness-0 invert"
          />
          <p className="mt-6 max-w-md text-sm opacity-70 leading-relaxed">
            Adelaide's independent residential agency since 1978. A small,
            senior team selling and managing distinguished properties across
            metropolitan South Australia.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <span className="font-serif italic text-[var(--ringgreen)] text-lg">Integrity</span>
            <span className="text-xs uppercase tracking-[0.22em] opacity-60">Our promise, since 1978</span>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] opacity-60 mb-5">Sitemap</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/buy" className="hover:text-[var(--ringgreen)]">Buy</Link></li>
            <li><Link to="/rent" className="hover:text-[var(--ringgreen)]">Rent</Link></li>
            <li><Link to="/sell" className="hover:text-[var(--ringgreen)]">Sell</Link></li>
            <li><Link to="/about" className="hover:text-[var(--ringgreen)]">About</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--ringgreen)]">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] opacity-60 mb-5">Owners</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/sell/appraisal" className="hover:text-[var(--ringgreen)]">Request appraisal</Link></li>
            <li><a href="https://www.landlords.com.au/auth/login/1274" className="hover:text-[var(--ringgreen)]">Landlord login</a></li>
            <li><Link to="/sell" className="hover:text-[var(--ringgreen)]">Methods of sale</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-xs uppercase tracking-[0.2em] opacity-60 mb-5">Office</h4>
          <address className="not-italic text-sm space-y-2 opacity-90">
            <div>140 Shepherds Hill Road</div>
            <div>Bellevue Heights SA 5050</div>
            <div className="pt-3">
              <a href="tel:+61883703211" className="block hover:text-[var(--ringgreen)]">(08) 8370 3211</a>
              <a href="mailto:ring@ring-sa.com.au" className="block hover:text-[var(--ringgreen)]">ring@ring-sa.com.au</a>
            </div>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-60">
          <div>© {new Date().getFullYear()} Ring Real Estate Pty Ltd · RLA 12345</div>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Complaints</a>
            <a href="#">Trust account</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
