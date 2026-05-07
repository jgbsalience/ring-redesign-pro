import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getListing, type Listing } from "@/data/site";
import { ListingDetailView } from "@/components/site/ListingDetail";

export const Route = createFileRoute("/rent/$listingId")({
  loader: ({ params }) => {
    const l = getListing(params.listingId);
    if (!l) throw notFound();
    return { listing: l };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.listing.address}, ${loaderData.listing.suburb} — Rental — Ring Real Estate` },
          { name: "description", content: loaderData.listing.headline },
          { property: "og:title", content: `${loaderData.listing.address}, ${loaderData.listing.suburb}` },
          { property: "og:description", content: loaderData.listing.headline },
          { property: "og:image", content: loaderData.listing.hero },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="font-serif text-6xl">Not found</div>
        <Link to="/rent" className="mt-6 inline-block underline">All rentals</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center"><div>{error.message}</div></div>
  ),
  component: () => {
    const { listing } = Route.useLoaderData() as { listing: Listing };
    return <ListingDetailView listing={listing} />;
  },
});
