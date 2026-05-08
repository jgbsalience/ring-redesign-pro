import ring from "./ring.json";

export type Listing = {
  id: string;
  status: "for-sale" | "for-rent" | "sold" | "leased";
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: string;
  priceNote?: string;
  beds: number;
  baths: number;
  cars: number;
  land?: string;
  type: "House" | "Townhouse" | "Apartment" | "Land" | "Villa";
  hero: string;
  gallery: string[];
  floorplan?: string;
  headline: string;
  description: string[];
  features: string[];
  agentIds: string[];
  inspections?: { date: string; time: string }[];
  featured?: boolean;
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  phone: string;
  office?: string;
  email: string;
  bio: string[];
  shortBio?: string;
  photo: string;
};

type RingListing = {
  id: string;
  status: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: string;
  beds: number;
  baths: number;
  cars: number;
  land?: string;
  type: string;
  hero: string;
  gallery: string[];
  headline: string;
  description: string[];
  agentSlugs: string[];
  inspections: { date: string; time: string }[];
};

export const agents: Agent[] = (ring.agents as Agent[]).map((a) => ({
  ...a,
  bio: Array.isArray(a.bio) ? a.bio : [a.bio as unknown as string],
}));

const validTypes = new Set(["House", "Townhouse", "Apartment", "Land", "Villa"]);

export const listings: Listing[] = (ring.listings as RingListing[]).map((l, i) => ({
  id: l.id,
  status: l.status as Listing["status"],
  address: l.address,
  suburb: l.suburb,
  state: l.state || "SA",
  postcode: l.postcode || "",
  price: l.price || "Contact Agent",
  beds: l.beds,
  baths: l.baths,
  cars: l.cars,
  land: l.land || undefined,
  type: (validTypes.has(l.type) ? l.type : "House") as Listing["type"],
  hero: l.hero,
  gallery: l.gallery,
  headline: l.headline || l.address,
  description: l.description?.length ? l.description : [],
  features: [],
  agentIds: l.agentSlugs?.length ? l.agentSlugs : ["stephen-ring"],
  inspections: l.inspections,
  featured: i < 3 && l.status === "for-sale",
}));

export const testimonials = [
  {
    quote:
      "Stephen and the team made selling our family home of 30 years feel calm and considered. The result spoke for itself.",
    author: "The Whitford Family",
    location: "Bellevue Heights",
  },
  {
    quote:
      "Luke listened, told us the truth, and then went above and beyond. We could not recommend Ring more highly.",
    author: "Daniel & Mei",
    location: "Glenalta",
  },
  {
    quote:
      "Soozie has looked after our investment properties for years — proactive, communicative, and always on top of detail.",
    author: "P. Whitelock",
    location: "Blackwood",
  },
];

export const suburbs = Array.from(new Set(listings.map((l) => l.suburb).filter(Boolean))).sort();

export function getAgent(id: string): Agent {
  return agents.find((a) => a.id === id) ?? agents[0];
}
export function getListing(id: string) {
  return listings.find((l) => l.id === id);
}
