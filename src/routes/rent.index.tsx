import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/site/ListingCard";
import { BannerHero } from "@/components/site/BannerHero";
import { listings } from "@/data/site";
import { ArrowRight } from "lucide-react";

// Mix rentals + recently leased/sold for visual variety; fall back to any with hero
const RENT_SLIDES = (() => {
  const rentals = listings.filter((l) => (l.status === "for-rent" || l.status === "leased") && l.hero);
  if (rentals.length >= 4) return rentals.slice(0, 6);
  const filler = listings.filter((l) => l.hero && !rentals.includes(l)).slice(0, 6 - rentals.length);
  return [...rentals, ...filler];
})();

export const Route = createFileRoute("/rent/")({
  head: () => ({
    meta: [
      { title: "Rentals — Ring Real Estate Adelaide" },
      { name: "description", content: "Quality rental homes managed personally by our award-winning property team." },
      { property: "og:title", content: "Rentals — Ring Real Estate" },
      { property: "og:description", content: "Quality rentals across metropolitan Adelaide." },
    ],
  }),
  component: RentPage,
});

function RentPage() {
  const rentals = listings.filter((l) => l.status === "for-rent");
  return (
    <div className="bg-background text-foreground">
      <Header overlay />
      <BannerHero
        slides={RENT_SLIDES}
        kicker="Property management"
        title={<>Rentals, <span className="italic font-light">managed by people</span><br />who answer their phone.</>}
        subtitle="460 doors. A 99.2% retention rate. The award-winning property team you actually know by name."
        
      />
      <div className="pt-16 md:pt-20 container-page">
        <div className="flex justify-end -mt-4">
          <a
            href="https://www.landlords.com.au/auth/login/1274"
            className="inline-flex items-center gap-2 text-sm border-b border-foreground pb-1 text-foreground"
          >
            Landlord login <ArrowRight size={14} />
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {rentals.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>

        <div className="mt-24 bg-secondary p-10 md:p-16 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">For owners</div>
            <h2 className="font-serif text-3xl md:text-5xl mt-3 tracking-tight">Considering letting your home?</h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em]">
              Request rental appraisal <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
