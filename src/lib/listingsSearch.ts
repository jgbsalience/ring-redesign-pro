import { z } from "zod";
import { fallback } from "@tanstack/zod-adapter";

export const listingsSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  suburb: fallback(z.string(), "All suburbs").default("All suburbs"),
  type: fallback(z.string(), "Any type").default("Any type"),
  beds: fallback(z.string(), "Any").default("Any"),
  sort: fallback(
    z.enum(["newest", "price-desc", "price-asc", "beds-desc"]),
    "newest",
  ).default("newest"),
  page: fallback(z.number().int().min(1), 1).default(1),
});

export type ListingsSearch = z.infer<typeof listingsSearchSchema>;

export const LISTINGS_SEARCH_DEFAULTS: ListingsSearch = {
  q: "",
  suburb: "All suburbs",
  type: "Any type",
  beds: "Any",
  sort: "newest",
  page: 1,
};
