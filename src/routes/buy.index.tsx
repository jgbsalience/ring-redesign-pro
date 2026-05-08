import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { canonical } from "@/lib/seo";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingsBrowser } from "@/components/site/ListingsBrowser";
import { PortfolioCarousel } from "@/components/site/PortfolioCarousel";
import { BannerHero } from "@/components/site/BannerHero";
import { listings } from "@/data/site";
import { listingsSearchSchema } from "@/lib/listingsSearch";
import { useMemo, useState } from "react";

const BUY_SLIDES = listings.filter((l) => l.status === "for-sale" && l.hero).slice(0, 6);

export const Route = createFileRoute("/buy/")({
  validateSearch: zodValidator(listingsSearchSchema),
  head: () => ({
    meta: [
      { title: "Properties — Ring Real Estate Adelaide" },
      {
        name: "description",
        content:
          "Browse residential properties for sale, for rent and recently sold across metropolitan Adelaide.",
      },
      { property: "og:title", content: "Properties — Ring Real Estate" },
      {
        property: "og:description",
        content:
          "Distinguished homes for sale, for rent and recently sold across metropolitan Adelaide.",
      },
    ],
    links: canonical("/buy"),
  }),
  component: BuyPage,
});

const STATUSES = [
  { id: "for-sale", label: "For Sale" },
  { id: "for-rent", label: "For Rent" },
  { id: "sold", label: "Sold" },
] as const;

type StatusId = (typeof STATUSES)[number]["id"];

function BuyPage() {
  const [status, setStatus] = useState<StatusId>("for-sale");

  const counts = useMemo(
    () => ({
      "for-sale": listings.filter((l) => l.status === "for-sale").length,
      "for-rent": listings.filter((l) => l.status === "for-rent").length,
      sold: listings.filter((l) => l.status === "sold").length,
    }),
    [],
  );

  const source = useMemo(() => listings.filter((l) => l.status === status), [status]);

  const heading =
    status === "for-sale"
      ? { kicker: "Currently for sale", title: ["Homes worth", "the patience."] }
      : status === "for-rent"
        ? { kicker: "Available to rent", title: ["A home,", "well managed."] }
        : { kicker: "Recent results", title: ["Quietly,", "exceptionally."] };

  return (
    <div className="bg-background text-foreground">
      <Header overlay />
      <BannerHero
        slides={BUY_SLIDES}
        kicker={heading.kicker}
        title={
          <>
            {heading.title[0]}
            <br />
            <span className="italic font-light">{heading.title[1]}</span>
          </>
        }
        subtitle="Distinguished homes across metropolitan Adelaide — curated, not collected."
      />
      <div className="pt-14 md:pt-20">
        <div className="container-page">
          <div className="mt-2 md:mt-4 flex items-center gap-1 border-b border-border overflow-x-auto">
            {STATUSES.map((s) => {
              const active = s.id === status;
              return (
                <button
                  key={s.id}
                  onClick={() => setStatus(s.id)}
                  className={[
                    "px-5 md:px-6 py-3 text-xs uppercase tracking-[0.22em] -mb-px border-b-2 transition-colors whitespace-nowrap",
                    active
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {s.label}
                  <span className="ml-2 text-[10px] opacity-60">{counts[s.id]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ListingsBrowser source={source} pageSize={16} />
      </div>
      <PortfolioCarousel items={listings.filter((l) => l.status === "for-sale" && l.hero)} />
      <Footer />
    </div>
  );
}
