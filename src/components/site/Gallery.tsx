import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const total = images.length;

  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev]);

  if (total === 0) return null;

  return (
    <div>
      {/* Main */}
      <div className="relative group bg-stone overflow-hidden aspect-[16/10] md:aspect-[16/9]">
        <img
          src={images[active]}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="eager"
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <button
          onClick={() => setOpen(true)}
          className="absolute top-4 right-4 bg-background/90 hover:bg-background text-foreground text-[10px] uppercase tracking-[0.22em] px-3 py-2 inline-flex items-center gap-2"
        >
          <Expand size={12} /> View {total}
        </button>

        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/85 hover:bg-background w-11 h-11 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/85 hover:bg-background w-11 h-11 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-4 left-4 bg-background/90 text-foreground text-[10px] uppercase tracking-[0.22em] px-3 py-1.5">
              {active + 1} / {total}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="mt-3 grid grid-cols-5 md:grid-cols-8 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={[
                "aspect-[4/3] overflow-hidden bg-stone transition-all",
                i === active ? "ring-2 ring-[var(--ringgreen)] opacity-100" : "opacity-60 hover:opacity-100",
              ].join(" ")}
              aria-label={`Image ${i + 1}`}
            >
              <img src={src} alt="" referrerPolicy="no-referrer" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div className="flex items-center justify-between px-5 md:px-8 py-4 text-white/80 text-[10px] uppercase tracking-[0.25em]">
            <span>{active + 1} / {total}</span>
            <button onClick={() => setOpen(false)} className="hover:text-white">Close ✕</button>
          </div>
          <div className="flex-1 flex items-center justify-center px-3 md:px-12 pb-8 relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[active]}
              alt={alt}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain"
            />
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-12 h-12 flex items-center justify-center"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-12 h-12 flex items-center justify-center"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
          {total > 1 && (
            <div className="px-5 md:px-8 pb-6 flex gap-2 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActive(i)}
                  className={[
                    "h-16 w-24 shrink-0 overflow-hidden transition-opacity",
                    i === active ? "ring-2 ring-[var(--ringgreen)] opacity-100" : "opacity-50 hover:opacity-100",
                  ].join(" ")}
                >
                  <img src={src} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
