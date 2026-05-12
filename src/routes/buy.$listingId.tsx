import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getListing, type Listing } from "@/data/site";
import { ListingDetailView } from "@/components/site/ListingDetail";
import { JsonLd } from "@/components/site/JsonLd";
import { canonical, listingSchema, breadcrumbSchema, SITE_URL } from "@/lib/seo";

function BuyListingRouteComponent() {
  const { listing } = Route.useLoaderData() as { listing: Listing };
  const path = `/buy/${listing.id}`;
  return (
    <>
      <JsonLd schema={listingSchema(listing, path)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Buy", url: `${SITE_URL}/buy` },
          { name: `${listing.address}, ${listing.suburb}`, url: `${SITE_URL}${path}` },
        ])}
      />
      <ListingDetailView listing={listing} />
    </>
  );
}

export const Route = createFileRoute("/buy/$listingId")({
  loader: ({ params }) => {
    const l = getListing(params.listingId);
    if (!l) throw notFound();
    return { listing: l };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          {
            title: `${loaderData.listing.address}, ${loaderData.listing.suburb} — Ring Real Estate`,
          },
          { name: "description", content: loaderData.listing.headline },
          {
            property: "og:title",
            content: `${loaderData.listing.address}, ${loaderData.listing.suburb}`,
          },
          { property: "og:description", content: loaderData.listing.headline },
          { property: "og:image", content: loaderData.listing.hero },
        ]
      : [],
    links: loaderData ? canonical(`/buy/${loaderData.listing.id}`) : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="font-serif text-6xl">Not found</div>
        <Link to="/buy" className="mt-6 inline-block underline">
          All listings
        </Link>
      </div>
    </div>
  ),
  component: BuyListingRouteComponent,
});
