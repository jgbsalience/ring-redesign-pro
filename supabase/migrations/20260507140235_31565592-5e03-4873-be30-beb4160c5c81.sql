
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_url TEXT NOT NULL UNIQUE,
  external_id TEXT,
  status TEXT NOT NULL,
  address TEXT NOT NULL,
  suburb TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'SA',
  postcode TEXT DEFAULT '',
  price TEXT NOT NULL DEFAULT 'Contact Agent',
  price_note TEXT,
  price_numeric NUMERIC,
  beds INTEGER NOT NULL DEFAULT 0,
  baths INTEGER NOT NULL DEFAULT 0,
  cars INTEGER NOT NULL DEFAULT 0,
  land TEXT,
  type TEXT NOT NULL DEFAULT 'House',
  hero TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  floorplan TEXT,
  headline TEXT NOT NULL DEFAULT '',
  description JSONB NOT NULL DEFAULT '[]'::jsonb,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  agent_slugs JSONB NOT NULL DEFAULT '[]'::jsonb,
  inspections JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  raw JSONB,
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_suburb ON public.listings(suburb);
CREATE INDEX idx_listings_scraped_at ON public.listings(scraped_at DESC);
CREATE INDEX idx_listings_status_scraped ON public.listings(status, scraped_at DESC);
CREATE INDEX idx_listings_type ON public.listings(type);
CREATE INDEX idx_listings_beds ON public.listings(beds);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings are publicly viewable"
ON public.listings
FOR SELECT
USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
