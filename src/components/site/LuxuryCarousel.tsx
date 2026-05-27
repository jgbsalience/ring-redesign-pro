import * as React from "react";
import { cn } from "@/lib/utils";

export interface LuxuryCarouselSlide {
  id: string;
  hero: string;
  address: string;
  suburb: string;
  caption: string;
}

export interface LuxuryCarouselProps extends React.ComponentProps<"div"> {
  slides: LuxuryCarouselSlide[];
}

export function LuxuryCarousel({ className, slides, ...props }: LuxuryCarouselProps) {
  const [i, setI] = React.useState(0);
  const [pausedByInteraction, setPausedByInteraction] = React.useState(false);
  const pointerStartX = React.useRef<number | null>(null);
  const pointerStartY = React.useRef<number | null>(null);
  const pointerActive = React.useRef(false);
  const pointerIsTouch = React.useRef(false);

  React.useEffect(() => {
    if (pausedByInteraction) return;
    if (slides.length < 2) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [pausedByInteraction, slides.length]);

  const go = (delta: number) => setI((n) => (n + delta + slides.length) % slides.length);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = e.clientX;
    pointerStartY.current = e.clientY;
    pointerActive.current = true;
    pointerIsTouch.current = e.pointerType === "touch";
    setPausedByInteraction(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerActive.current || !pointerIsTouch.current) return;
    if (pointerStartX.current === null || pointerStartY.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    const dy = e.clientY - pointerStartY.current;
    // Once a clear horizontal gesture is detected, prevent vertical scroll hijack.
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault?.();
    }
  };

  const endPointerInteraction = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (
      !pointerActive.current ||
      pointerStartX.current === null ||
      pointerStartY.current === null
    ) {
      pointerActive.current = false;
      pointerIsTouch.current = false;
      setPausedByInteraction(false);
      return;
    }

    if (e && pointerIsTouch.current) {
      const dx = e.clientX - pointerStartX.current;
      const dy = e.clientY - pointerStartY.current;
      const SWIPE = 40;
      if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) {
        go(dx < 0 ? 1 : -1);
      }
    }

    pointerStartX.current = null;
    pointerStartY.current = null;
    pointerActive.current = false;
    pointerIsTouch.current = false;
    setPausedByInteraction(false);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    endPointerInteraction(e);
  };

  const onPointerCancel = () => {
    endPointerInteraction();
  };

  const onMouseEnter = () => {
    setPausedByInteraction(true);
  };

  const onMouseLeave = () => {
    if (!pointerActive.current) setPausedByInteraction(false);
  };

  const onBlurCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      if (!pointerActive.current) setPausedByInteraction(false);
    }
  };

  const onFocusCapture = () => {
    setPausedByInteraction(true);
  };

  const onLegacyTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    // keep a touch-end fallback for browsers with inconsistent pointer-up behavior
    if (
      !pointerActive.current ||
      pointerStartX.current === null ||
      pointerStartY.current === null
    ) {
      pointerActive.current = false;
      pointerIsTouch.current = false;
      setPausedByInteraction(false);
      return;
    }
    const t = e.changedTouches[0];
    const dx = t.clientX - pointerStartX.current;
    const dy = t.clientY - pointerStartY.current;
    const SWIPE = 40;
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
    pointerStartX.current = null;
    pointerStartY.current = null;
    pointerActive.current = false;
    pointerIsTouch.current = false;
    setPausedByInteraction(false);
  };

  return (
    <div
      data-slot="luxury-carousel"
      className={cn("relative overflow-hidden bg-muted group touch-pan-y select-none", className)}
      style={{ aspectRatio: "4 / 5" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onTouchEnd={onLegacyTouchEnd}
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured properties"
      {...props}
    >
      {slides.map((s, idx) => {
        // CDN paths end in `cp-rect-1920x1440.pg` — swap the size segment
        // to request appropriately scaled variants without losing fidelity.
        const variant = (w: number, h: number) =>
          s.hero.replace(/cp-rect-\d+x\d+\.pg$/, `cp-rect-${w}x${h}.pg`);
        const srcSet = [
          `${variant(640, 480)} 640w`,
          `${variant(960, 720)} 960w`,
          `${variant(1280, 960)} 1280w`,
          `${variant(1600, 1200)} 1600w`,
          `${variant(1920, 1440)} 1920w`,
          `${variant(2400, 1800)} 2400w`,
          `${variant(3200, 2400)} 3200w`,
          `${variant(4000, 3000)} 4000w`,
        ].join(", ");
        const isActive = idx === i;
        const isNext = idx === (i + 1) % slides.length;
        const eager = idx === 0 || isNext;
        const motion = idx % 2 === 0 ? "kenburns-active-a" : "kenburns-active-b";

        return (
          <div
            key={s.id}
            aria-hidden={!isActive}
            className="absolute inset-0 overflow-hidden bg-card"
            style={{
              opacity: isActive ? 1 : 0,
              transition: "opacity 1800ms cubic-bezier(0.22, 0.61, 0.36, 1)",
              willChange: "opacity",
            }}
          >
            <img
              // Re-mount the active image each cycle so the Ken Burns animation restarts cleanly
              key={isActive ? `${s.id}-${i}` : s.id}
              src={variant(1920, 1440)}
              srcSet={srcSet}
              sizes="(min-width: 1280px) 2000px, (min-width: 768px) 100vw, 100vw"
              alt={`${s.address}, ${s.suburb}`}
              width={1200}
              height={1500}
              referrerPolicy="no-referrer"
              loading={eager ? "eager" : "lazy"}
              fetchPriority={idx === 0 ? "high" : "low"}
              decoding="async"
              draggable={false}
              className={cn(
                "absolute inset-0 w-full h-full object-cover kenburns-base",
                isActive ? motion : "",
              )}
            />
          </div>
        );
      })}

      {/* Gradient scrim for caption legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-7 text-white">
        <div className="relative h-[88px] md:h-[96px]">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              aria-hidden={idx !== i}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-[900ms] [transition-timing-function:cubic-bezier(0.22,0.61,0.36,1)]",
                idx === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              )}
            >
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/70 flex items-center gap-2">
                <span className="inline-block h-px w-6 bg-green" />
                {s.suburb}
              </div>
              <div className="font-serif text-xl md:text-2xl leading-tight mt-1.5">{s.address}</div>
              <div className="text-[12px] md:text-[13px] text-white/80 leading-snug mt-1 max-w-[26rem]">
                {s.caption}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Show image ${idx + 1}`}
                aria-current={idx === i ? "true" : undefined}
                onClick={() => setI(idx)}
                className={cn(
                  "relative h-1 rounded-full transition-[width,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50",
                  "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[44px] before:h-[44px]",
                  idx === i ? "w-6 bg-white" : "w-3 bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-white/60 tabular-nums">
            {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}
