import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/site/ListingCard";
import { listings } from "@/data/site";
import { ArrowRight } from "lucide-react";

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
      <Header />
      <div className="pt-28 md:pt-36 container-page">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              <span className="ring-mark" /> &nbsp;Property management
            </div>
            <h1 className="font-serif text-5xl md:text-7xl tracking-tight mt-5 leading-[0.95]">
              Rentals, <span className="italic">managed by people</span><br />who answer their phone.
            </h1>
          </div>
          <div className="md:col-span-4 text-muted-foreground">
            460 doors. A 99.2% retention rate. The award-winning property team
            you actually know by name.
            <a
              href="https://www.landlords.com.au/auth/login/1274"
              className="mt-6 inline-flex items-center gap-2 text-sm border-b border-foreground pb-1 text-foreground"
            >
              Landlord login <ArrowRight size={14} />
            </a>
          </div>
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
