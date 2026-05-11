import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type PointerEvent as RPointerEvent,
  type WheelEvent as RWheelEvent,
} from "react";
import { ChevronLeft, ChevronRight, Expand, ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react";

function buildCdnSrcSet(url: string): string | undefined {
  if (!/cp-rect-\d+x\d+\.[a-z]+$/i.test(url)) return undefined;
  const v = (w: number, h: number) =>
    url.replace(/cp-rect-\d+x\d+\.([a-z]+)$/i, (_m, ext) => `cp-rect-${w}x${h}.${ext}`);
  return [
    `${v(960, 720)} 960w`,
    `${v(1280, 960)} 1280w`,
    `${v(1600, 1200)} 1600w`,
    `${v(1920, 1440)} 1920w`,
    `${v(2400, 1800)} 2400w`,
    `${v(3200, 2400)} 3200w`,
    `${v(4000, 3000)} 4000w`,
  ].join(", ");
}
function cdnVariant(url: string, w: number, h: number): string {
  return /cp-rect-\d+x\d+\.[a-z]+$/i.test(url)
    ? url.replace(/cp-rect-\d+x\d+\.([a-z]+)$/i, (_m, ext) => `cp-rect-${w}x${h}.${ext}`)
    : url;
}

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const total = images.length;

  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);

  // Swipe state for main image
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const onMainPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
  };
  const onMainPointerUp = (e: RPointerEvent<HTMLDivElement>) => {
    if (!swipeStart.current) return;
    const dx = e.clientX - swipeStart.current.x;
    const dy = e.clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  };

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
      <div
        className="relative group bg-muted overflow-hidden aspect-[16/10] md:aspect-[16/9] cursor-zoom-in touch-pan-y"
        onPointerDown={onMainPointerDown}
        onPointerUp={onMainPointerUp}
      >
        <img
          src={cdnVariant(images[active], 1920, 1440)}
          srcSet={buildCdnSrcSet(images[active])}
          sizes="(min-width: 1280px) 1200px, (min-width: 768px) 90vw, 100vw"
          alt={alt}
          referrerPolicy="no-referrer"
          loading="eager"
          draggable={false}
          onClick={() => setOpen(true)}
          className="w-full h-full object-cover transition-opacity duration-500 select-none"
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
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/85 hover:bg-background w-11 h-11 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/85 hover:bg-background w-11 h-11 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity"
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
                "aspect-[4/3] overflow-hidden bg-muted transition-all",
                i === active
                  ? "ring-2 ring-[var(--ringgreen)] opacity-100"
                  : "opacity-60 hover:opacity-100",
              ].join(" ")}
              aria-label={`Image ${i + 1}`}
            >
              <img
                src={src}
                alt=""
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {open && (
        <Lightbox
          images={images}
          alt={alt}
          active={active}
          setActive={setActive}
          onClose={() => setOpen(false)}
          next={next}
          prev={prev}
        />
      )}
    </div>
  );
}

function Lightbox({
  images,
  alt,
  active,
  setActive,
  onClose,
  next,
  prev,
}: {
  images: string[];
  alt: string;
  active: number;
  setActive: (i: number) => void;
  onClose: () => void;
  next: () => void;
  prev: () => void;
}) {
  const total = images.length;
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const MIN = 1;
  const MAX = 5;

  const reset = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
  }, []);

  // Reset zoom when changing image
  useEffect(() => {
    reset();
  }, [active, reset]);

  const clampPan = (nx: number, ny: number, s: number) => {
    const el = containerRef.current;
    if (!el) return { x: nx, y: ny };
    const w = el.clientWidth;
    const h = el.clientHeight;
    const maxX = (w * (s - 1)) / 2;
    const maxY = (h * (s - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, nx)),
      y: Math.max(-maxY, Math.min(maxY, ny)),
    };
  };

  const zoomBy = (factor: number) => {
    setScale((prev) => {
      const n = Math.max(MIN, Math.min(MAX, prev * factor));
      if (n === 1) {
        setTx(0);
        setTy(0);
      }
      return n;
    });
  };

  // Focus close button on mount
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const FOCUSABLE =
      'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight") {
        next();
        return;
      }
      if (e.key === "ArrowLeft") {
        prev();
        return;
      }
      if (e.key === "+" || e.key === "=") {
        zoomBy(1.25);
        return;
      }
      if (e.key === "-" || e.key === "_") {
        zoomBy(1 / 1.25);
        return;
      }
      if (e.key === "0") {
        reset();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) return;
        const first = nodes[0];
        const lastEl = nodes[nodes.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, next, prev, reset]);

  const onWheel = (e: RWheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15);
  };

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (scale > 1) {
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } else {
      swipe.current = { x: e.clientX, y: e.clientY };
    }
  };
  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    const n = clampPan(tx + dx, ty + dy, scale);
    setTx(n.x);
    setTy(n.y);
  };
  const onPointerUp = (e: RPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (swipe.current) {
      const dx = e.clientX - swipe.current.x;
      const dy = e.clientY - swipe.current.y;
      swipe.current = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next();
        else prev();
      }
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery — ${alt}`}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-fade-in select-none"
    >
      <div className="flex items-center justify-between px-5 md:px-8 py-4 text-white/80 text-[10px] uppercase tracking-[0.25em] z-10">
        <span>
          {active + 1} / {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => zoomBy(1 / 1.25)}
            className="w-9 h-9 inline-flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <div className="w-12 text-center tabular-nums text-[11px] text-white/80">
            {Math.round(scale * 100)}%
          </div>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => zoomBy(1.25)}
            className="w-9 h-9 inline-flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            aria-label="Reset"
            onClick={reset}
            className="w-9 h-9 inline-flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors ml-1"
          >
            <RotateCcw size={16} />
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors ml-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center px-3 md:px-12 pb-4 relative overflow-hidden touch-none"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: scale > 1 ? (dragging.current ? "grabbing" : "grab") : "default" }}
        onDoubleClick={() => (scale > 1 ? reset() : zoomBy(2))}
      >
        <img
          src={cdnVariant(images[active], 3200, 2400)}
          srcSet={buildCdnSrcSet(images[active])}
          sizes="100vw"
          alt={alt}
          referrerPolicy="no-referrer"
          draggable={false}
          className="max-w-full max-h-full object-contain transition-transform duration-100 will-change-transform"
          style={{ transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})` }}
        />
        {total > 1 && scale === 1 && (
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
        <div className="px-5 md:px-8 pb-6 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${total}`}
              aria-current={i === active ? "true" : undefined}
              className={[
                "h-16 w-24 shrink-0 overflow-hidden transition-opacity",
                i === active
                  ? "ring-2 ring-[var(--ringgreen)] opacity-100"
                  : "opacity-50 hover:opacity-100",
              ].join(" ")}
            >
              <img
                src={src}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
