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
  headline: string;
  description: string[];
  features: string[];
  agentIds: string[];
  inspections?: { date: string; time: string }[];
  featured?: boolean;
};

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const listings: Listing[] = [
  {
    id: "fergusson-craigburn-farm",
    status: "for-sale",
    address: "12 Fergusson Avenue",
    suburb: "Craigburn Farm",
    state: "SA",
    postcode: "5051",
    price: "Contact Agent",
    priceNote: "Set to Sell · Closing Sat 24 May",
    beds: 5,
    baths: 3,
    cars: 4,
    land: "1,184 m²",
    type: "House",
    hero: u("photo-1600585154340-be6161a56a0c"),
    gallery: [
      u("photo-1600585154340-be6161a56a0c"),
      u("photo-1600566753190-17f0baa2a6c3"),
      u("photo-1600607687939-ce8a6c25118c"),
      u("photo-1616594039964-ae9021a400a0"),
      u("photo-1505693416388-ac5ce068fe85"),
    ],
    headline: "Architectural calm above the foothills",
    description: [
      "Set against a backdrop of conservation parkland, this five-bedroom residence quietly redefines what a foothills home can be. Honest materials — board-formed concrete, spotted gum, brushed brass — are paired with a restrained palette that lets the South Australian light do the work.",
      "A double-height entry leads to a north-facing living pavilion that opens fully to a heated lap pool and travertine terrace. The kitchen is anchored by a single 4.2 metre island in honed Calacatta, with a butler's pantry concealed behind seamless joinery.",
      "Upstairs, the primary suite enjoys a private balcony, dressing room, and a stone-clad ensuite with twin rainfall showers.",
    ],
    features: [
      "Architect: Studio Gram (concept)",
      "5 oversized bedrooms, 3 bathrooms, 2 living",
      "Heated 12 m magnesium lap pool",
      "Garaging for 4 vehicles + workshop",
      "Hydronic in-slab heating throughout",
      "Walk to Sturt Gorge & Blackwood village",
    ],
    agentIds: ["a-marcus", "a-eliza"],
    inspections: [
      { date: "Sat 17 May", time: "11:00 – 11:30 am" },
      { date: "Wed 21 May", time: "5:30 – 6:00 pm" },
    ],
    featured: true,
  },
  {
    id: "north-tce-kent-town",
    status: "for-sale",
    address: "204 / 88 North Terrace",
    suburb: "Kent Town",
    state: "SA",
    postcode: "5067",
    price: "$1,295,000",
    beds: 3,
    baths: 2,
    cars: 2,
    type: "Apartment",
    hero: u("photo-1600596542815-ffad4c1539a9"),
    gallery: [
      u("photo-1600596542815-ffad4c1539a9"),
      u("photo-1600210492486-724fe5c67fb0"),
      u("photo-1556909114-f6e7ad7d3136"),
    ],
    headline: "A penthouse without pretense",
    description: [
      "Occupying the entire northern corner of Studio 88, this three-bedroom residence frames the parklands and the city skyline through nine metres of uninterrupted glazing.",
      "Interior architecture by Williams Burton Leopardi balances warm timber, soft plaster, and bronze detailing — a city home that feels like a private retreat.",
    ],
    features: [
      "Two secure car parks + storage",
      "Concierge and resident lounge",
      "Walk to East End and the Botanic Gardens",
    ],
    agentIds: ["a-eliza"],
    inspections: [{ date: "Sat 17 May", time: "12:00 – 12:30 pm" }],
    featured: true,
  },
  {
    id: "stirling-old-mill-rd",
    status: "for-sale",
    address: "47 Old Mill Road",
    suburb: "Stirling",
    state: "SA",
    postcode: "5152",
    price: "$2.4m – $2.6m",
    beds: 4,
    baths: 3,
    cars: 3,
    land: "3,210 m²",
    type: "House",
    hero: u("photo-1505691938895-1758d7feb511"),
    gallery: [
      u("photo-1505691938895-1758d7feb511"),
      u("photo-1600047509807-ba8f99d2cdde"),
      u("photo-1599809275671-b5942cabc7a2"),
    ],
    headline: "A garden estate among the elms",
    description: [
      "A landmark Stirling residence on three-quarters of an acre, surrounded by mature European garden by Paul Bangay associates. Inside, English oak floors, deep cornicing, and four open fireplaces.",
    ],
    features: [
      "Tennis court & potager garden",
      "Cellar with tasting room",
      "Walk to Stirling village",
    ],
    agentIds: ["a-marcus"],
    featured: true,
  },
  {
    id: "glenelg-pier-st",
    status: "for-sale",
    address: "9 Pier Street",
    suburb: "Glenelg",
    state: "SA",
    postcode: "5045",
    price: "$1,750,000",
    beds: 4,
    baths: 2,
    cars: 2,
    type: "Townhouse",
    hero: u("photo-1502672260266-1c1ef2d93688"),
    gallery: [u("photo-1502672260266-1c1ef2d93688")],
    headline: "Three storeys to the sea",
    description: ["A bay-side townhouse with a rooftop terrace overlooking Holdfast Bay."],
    features: ["Lift to all levels", "Rooftop spa", "120 m to the beach"],
    agentIds: ["a-james"],
  },
  {
    id: "norwood-george-st",
    status: "for-sale",
    address: "31 George Street",
    suburb: "Norwood",
    state: "SA",
    postcode: "5067",
    price: "$1,495,000",
    beds: 3,
    baths: 2,
    cars: 1,
    type: "House",
    hero: u("photo-1600573472550-8090b5e0745e"),
    gallery: [u("photo-1600573472550-8090b5e0745e")],
    headline: "A bluestone villa, gently re-imagined",
    description: ["Original 1885 bluestone with a measured contemporary addition opening to a walled garden."],
    features: ["3 fireplaces", "Walk to The Parade", "Norwood Primary zone"],
    agentIds: ["a-eliza"],
  },
  {
    id: "unley-park-windsor",
    status: "for-sale",
    address: "8 Windsor Avenue",
    suburb: "Unley Park",
    state: "SA",
    postcode: "5061",
    price: "Expressions of Interest",
    beds: 5,
    baths: 4,
    cars: 3,
    land: "1,820 m²",
    type: "House",
    hero: u("photo-1613490493576-7fde63acd811"),
    gallery: [u("photo-1613490493576-7fde63acd811")],
    headline: "A grand return to Unley Park",
    description: ["Tudor-revival residence on one of the suburb's most coveted boulevards."],
    features: ["Heritage listed", "Tennis court", "Pool & cabana"],
    agentIds: ["a-marcus", "a-james"],
  },
  // Rentals
  {
    id: "rent-parkside-greenhill",
    status: "for-rent",
    address: "2A Greenhill Road",
    suburb: "Parkside",
    state: "SA",
    postcode: "5063",
    price: "$895 per week",
    beds: 3,
    baths: 2,
    cars: 2,
    type: "Townhouse",
    hero: u("photo-1600210491892-03d54c0aaf87"),
    gallery: [u("photo-1600210491892-03d54c0aaf87")],
    headline: "Park-front living, beautifully kept",
    description: ["A three-bedroom townhouse opposite the South Parklands."],
    features: ["Available 1 June", "12-month lease", "Pets considered"],
    agentIds: ["a-eliza"],
  },
  {
    id: "rent-northadelaide-jeffcott",
    status: "for-rent",
    address: "117 Jeffcott Street",
    suburb: "North Adelaide",
    state: "SA",
    postcode: "5006",
    price: "$1,150 per week",
    beds: 4,
    baths: 2,
    cars: 2,
    type: "House",
    hero: u("photo-1600585154526-990dced4db0d"),
    gallery: [u("photo-1600585154526-990dced4db0d")],
    headline: "A North Adelaide classic",
    description: ["Sandstone-front residence walking distance to O'Connell Street."],
    features: ["Available now", "Furnished optional"],
    agentIds: ["a-james"],
  },
  // Sold
  {
    id: "sold-burnside-edward",
    status: "sold",
    address: "44 Edward Street",
    suburb: "Burnside",
    state: "SA",
    postcode: "5066",
    price: "Sold $2,310,000",
    priceNote: "Sold prior · 2 weeks on market",
    beds: 4,
    baths: 3,
    cars: 2,
    type: "House",
    hero: u("photo-1583608205776-bfd35f0d9f83"),
    gallery: [u("photo-1583608205776-bfd35f0d9f83")],
    headline: "Burnside, sold prior to auction",
    description: ["A record street result for Burnside in April."],
    features: [],
    agentIds: ["a-marcus"],
  },
  {
    id: "sold-malvern-cambridge",
    status: "sold",
    address: "12 Cambridge Terrace",
    suburb: "Malvern",
    state: "SA",
    postcode: "5061",
    price: "Sold $1,925,000",
    beds: 4,
    baths: 2,
    cars: 2,
    type: "House",
    hero: u("photo-1600566753376-12c8ab7fb75b"),
    gallery: [u("photo-1600566753376-12c8ab7fb75b")],
    headline: "Malvern character, sold under the hammer",
    description: ["12 registered bidders. Sold $225k above reserve."],
    features: [],
    agentIds: ["a-eliza"],
  },
  {
    id: "sold-prospect-vine",
    status: "sold",
    address: "5 Vine Street",
    suburb: "Prospect",
    state: "SA",
    postcode: "5082",
    price: "Sold $1,180,000",
    beds: 3,
    baths: 2,
    cars: 1,
    type: "House",
    hero: u("photo-1564013799919-ab600027ffc6"),
    gallery: [u("photo-1564013799919-ab600027ffc6")],
    headline: "A Prospect bungalow, sold in 9 days",
    description: ["Set to Sell campaign. Five offers received."],
    features: [],
    agentIds: ["a-james"],
  },
];

export type Agent = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  bio: string;
  photo: string;
};

export const agents: Agent[] = [
  {
    id: "a-marcus",
    name: "Marcus Ring",
    role: "Director · Principal",
    phone: "0418 800 102",
    email: "marcus@ring-sa.com.au",
    bio: "Three decades selling Adelaide's east and foothills. Marcus's clients return to him generation after generation — the highest compliment in this profession.",
    photo: u("photo-1500648767791-00dcc994a43e", 800),
  },
  {
    id: "a-eliza",
    name: "Eliza Hart",
    role: "Senior Sales Consultant",
    phone: "0407 226 491",
    email: "eliza@ring-sa.com.au",
    bio: "Specialist in inner-city apartments and architectural homes. Eliza is known for the quiet confidence of her negotiations.",
    photo: u("photo-1573496359142-b8d87734a5a2", 800),
  },
  {
    id: "a-james",
    name: "James Okafor",
    role: "Sales & Auctions",
    phone: "0432 117 308",
    email: "james@ring-sa.com.au",
    bio: "Auctioneer of the Year (REISA, 2023). James calls 90+ auctions a year across metropolitan Adelaide.",
    photo: u("photo-1472099645785-5658abf4ff4e", 800),
  },
  {
    id: "a-priya",
    name: "Priya Nair",
    role: "Property Management Lead",
    phone: "0415 044 712",
    email: "priya@ring-sa.com.au",
    bio: "Heads our award-winning property management team — 460 doors and a 99.2% retention rate.",
    photo: u("photo-1580489944761-15a19d654956", 800),
  },
];

export const testimonials = [
  {
    quote:
      "Ring Real Estate sold our family home in eleven days, $180,000 above what two other agents had appraised. The campaign was beautiful, the communication was constant, and the result was extraordinary.",
    author: "The Henderson Family",
    location: "Toorak Gardens",
  },
  {
    quote:
      "Buying with Eliza felt less like a transaction and more like being introduced to a home by a thoughtful friend.",
    author: "Daniel & Mei Choi",
    location: "Kent Town",
  },
  {
    quote:
      "Forty years in this industry and Marcus is still the agent I call. There's nobody better in the southern suburbs.",
    author: "P. Whitelock",
    location: "Stirling",
  },
];

export const suburbs = [
  "Adelaide", "Burnside", "Craigburn Farm", "Glenelg", "Kent Town",
  "Malvern", "Mitcham", "North Adelaide", "Norwood", "Parkside",
  "Prospect", "Stirling", "Toorak Gardens", "Unley", "Unley Park",
];

export function getAgent(id: string) {
  return agents.find((a) => a.id === id)!;
}
export function getListing(id: string) {
  return listings.find((l) => l.id === id);
}
