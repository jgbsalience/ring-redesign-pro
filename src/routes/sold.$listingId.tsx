import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getListing, type Listing } from "@/data/site";
import { ListingDetailView } from "@/components/site/ListingDetail";
import { JsonLd } from "@/components/site/JsonLd";
import { canonical, listingSchema, breadcrumbSchema, SITE_URL } from "@/lib/seo";

function SoldListingRouteComponent() {
  const { listing } = Route.useLoaderData() as { listing: Listing };
  const path = `/sold/${listing.id}`;
  return (
    <>
      <JsonLd schema={listingSchema(listing, path)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Sold", url: `${SITE_URL}/sold` },
          { name: `${listing.address}, ${listing.suburb}`, url: `${SITE_URL}${path}` },
        ])}
      />
      <ListingDetailView listing={listing} />
    </>
  );
}

export const Route = createFileRoute("/sold/$listingId")({
  loader: ({ params }) => {
    const l = getListing(params.listingId);
    if (!l) throw notFound();
    return { listing: l };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          {
            title: `${loaderData.listing.address}, ${loaderData.listing.suburb} — Sold — Ring Real Estate`,
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
    links: loaderData ? canonical(`/sold/${loaderData.listing.id}`) : [],
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
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div>{error.message}</div>
    </div>
  ),
  component: SoldListingRouteComponent,
});
