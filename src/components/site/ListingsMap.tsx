import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { SpecLine } from "@/components/site/SpecLine";

type MapRow = {
  id: string;
  status: string;
  address: string;
  suburb: string;
  state: string;
  price: string;
  beds: number;
  baths: number;
  cars: number;
  hero: string | null;
  latitude: number | null;
  longitude: number | null;
};

// Adelaide CBD fallback center
const ADELAIDE: [number, number] = [-34.9285, 138.6007];

function listingHref(status: string): "/buy/$listingId" | "/rent/$listingId" | "/sold/$listingId" {
  if (status === "for-rent" || status === "leased") return "/rent/$listingId";
  if (status === "sold") return "/sold/$listingId";
  return "/buy/$listingId";
}

export function ListingsMap({ rows }: { rows: MapRow[] }) {
  const [Lib, setLib] = useState<null | {
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    Popup: typeof import("react-leaflet").Popup;
    L: typeof import("leaflet");
  }>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const markerRefs = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([import("react-leaflet"), import("leaflet"), import("leaflet/dist/leaflet.css")]).then(
      ([rl, leaflet]) => {
        if (cancelled) return;
        // Default Leaflet marker icons reference assets that don't bundle correctly.
        // Use CDN-hosted icons.
        const L = leaflet.default ?? leaflet;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        setLib({
          MapContainer: rl.MapContainer,
          TileLayer: rl.TileLayer,
          Marker: rl.Marker,
          Popup: rl.Popup,
          L,
        });
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const mapped = useMemo(
    () => rows.filter((r) => r.latitude != null && r.longitude != null),
    [rows],
  );
  const missing = rows.length - mapped.length;

  const center: [number, number] = mapped.length
    ? [mapped[0].latitude!, mapped[0].longitude!]
    : ADELAIDE;

  const bounds = useMemo<[[number, number], [number, number]] | null>(() => {
    if (mapped.length < 2) return null;
    let minLat = mapped[0].latitude!;
    let maxLat = mapped[0].latitude!;
    let minLng = mapped[0].longitude!;
    let maxLng = mapped[0].longitude!;
    for (const r of mapped) {
      if (r.latitude! < minLat) minLat = r.latitude!;
      if (r.latitude! > maxLat) maxLat = r.latitude!;
      if (r.longitude! < minLng) minLng = r.longitude!;
      if (r.longitude! > maxLng) maxLng = r.longitude!;
    }
    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }, [mapped]);

  if (!Lib) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-0 border border-border h-[70vh]">
        <div className="bg-muted animate-pulse" />
        <div className="border-l border-border bg-background" />
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = Lib;

  return (
    <div className="border border-border">
      {missing > 0 && (
        <div className="bg-secondary/60 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground border-b border-border">
          {missing} of {rows.length} listings have no map coordinates yet and aren't shown.
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] h-[70vh]">
        <div className="relative">
          <MapContainer
            center={center}
            zoom={11}
            bounds={bounds ?? undefined}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
            ref={(m) => {
              mapRef.current = m ?? null;
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapped.map((r) => (
              <Marker
                key={r.id}
                position={[r.latitude!, r.longitude!]}
                ref={(m) => {
                  if (m) markerRefs.current.set(r.id, m);
                  else markerRefs.current.delete(r.id);
                }}
                eventHandlers={{
                  click: () => setActiveId(r.id),
                }}
              >
                <Popup>
                  <div className="text-xs">
                    <div className="font-medium">{r.address}</div>
                    <div className="text-muted-foreground">
                      {r.suburb} · {r.state}
                    </div>
                    <div className="mt-1">{r.price}</div>
                    <Link
                      to={listingHref(r.status)}
                      params={{ listingId: r.id }}
                      className="text-[var(--ringgreen)] underline mt-1 inline-block"
                    >
                      View listing
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <aside className="border-t lg:border-t-0 lg:border-l border-border overflow-y-auto bg-background">
          {mapped.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No listings with coordinates match these filters.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {mapped.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(r.id);
                      const marker = markerRefs.current.get(r.id);
                      const map = mapRef.current;
                      if (marker) marker.openPopup();
                      if (map) {
                        map.flyTo([r.latitude!, r.longitude!], Math.max(map.getZoom(), 14), {
                          duration: 0.6,
                        });
                      }
                    }}
                    className={[
                      "w-full text-left p-4 flex gap-3 hover:bg-secondary/60 transition-colors",
                      activeId === r.id ? "bg-secondary/60" : "",
                    ].join(" ")}
                  >
                    <div className="w-20 h-16 bg-muted shrink-0 overflow-hidden">
                      {r.hero ? (
                        <img
                          src={r.hero}
                          alt=""
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <MapPin size={16} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground truncate">
                        {r.suburb} · {r.state}
                      </div>
                      <div className="font-serif text-sm leading-snug truncate">
                        {r.address}
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium truncate">{r.price}</span>
                        <span className="flex items-center gap-2 text-muted-foreground shrink-0">
                          <span className="flex items-center gap-0.5">
                            <Bed size={12} />
                            {r.beds}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Bath size={12} />
                            {r.baths}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Car size={12} />
                            {r.cars}
                          </span>
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
