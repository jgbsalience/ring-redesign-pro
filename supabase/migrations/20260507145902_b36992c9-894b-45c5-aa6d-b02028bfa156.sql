ALTER TABLE public.listings 
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS geocoded_at timestamp with time zone;

CREATE INDEX IF NOT EXISTS listings_lat_lng_idx ON public.listings (latitude, longitude);