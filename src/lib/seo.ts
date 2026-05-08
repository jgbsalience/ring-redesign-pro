export const SITE_URL = "https://ring-sa.com.au";
export const SITE_NAME = "Ring Real Estate";

export function canonical(path: string) {
  return [{ rel: "canonical" as const, href: `${SITE_URL}${path}` }];
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Ring Real Estate",
  url: SITE_URL,
  telephone: "+61883703211",
  email: "ring@ring-sa.com.au",
  foundingDate: "1978",
  description:
    "Adelaide's independent residential real estate agency since 1978. Selling, leasing and managing distinguished homes across metropolitan South Australia.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "140 Shepherds Hill Road",
    addressLocality: "Bellevue Heights",
    addressRegion: "SA",
    postalCode: "5050",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -35.0275,
    longitude: 138.6058,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "17:30",
    },
  ],
  areaServed: {
    "@type": "State",
    name: "South Australia",
  },
  sameAs: [],
};

export function listingSchema(
  listing: {
    id: string;
    address: string;
    suburb: string;
    state: string;
    postcode: string;
    price: string;
    beds: number;
    baths: number;
    cars: number;
    hero: string;
    gallery: string[];
    headline: string;
    status: string;
    type: string;
  },
  path: string,
) {
  const statusMap: Record<string, string> = {
    "for-sale": "ForSale",
    "for-rent": "ForRent",
    sold: "Sold",
    leased: "Leased",
  };

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${listing.address}, ${listing.suburb}`,
    description: listing.headline,
    url: `${SITE_URL}${path}`,
    image: [listing.hero, ...listing.gallery].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.suburb,
      addressRegion: listing.state,
      postalCode: listing.postcode,
      addressCountry: "AU",
    },
    numberOfRooms: listing.beds,
    numberOfBathroomsTotal: listing.baths,
    numberOfParkingSpaces: listing.cars,
    accommodationCategory: listing.type,
    offerStatus: statusMap[listing.status] ?? listing.status,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
