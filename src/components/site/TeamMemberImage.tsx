import type { Agent } from "@/data/site";

/** Single-size presets (kept for backwards compatibility). */
type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/** Responsive presets that scale across breakpoints without layout shift. */
type ResponsiveSize =
  | "xs-sm"   // xs on mobile, sm on sm+
  | "sm-md"   // sm on mobile, md on md+
  | "md-lg"   // md on mobile, lg on lg+ (avatar -> portrait)
  | "avatar"  // xs on mobile, sm on sm, md on lg
  | "portrait"; // lg on mobile/tablet, xl on lg+

type AnySize = Size | ResponsiveSize;

/**
 * Tailwind classes per preset. Responsive variants combine
 * `w-/h-` at each breakpoint so the box reserves the correct
 * dimensions before the image decodes (no CLS).
 */
const sizeClass: Record<AnySize, string> = {
  xs: "w-6 h-6 rounded-full object-cover",
  sm: "w-10 h-10 rounded-full object-cover",
  md: "w-14 h-14 rounded-full object-cover",
  lg: "w-full h-full object-cover",
  xl: "w-full h-full object-cover",
  "2xl": "w-full h-full object-cover",

  // Responsive avatars
  "xs-sm": "w-6 h-6 sm:w-10 sm:h-10 rounded-full object-cover",
  "sm-md": "w-10 h-10 md:w-14 md:h-14 rounded-full object-cover",
  "md-lg": "w-14 h-14 lg:w-20 lg:h-20 rounded-full object-cover",
  avatar: "w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full object-cover",

  // Responsive portrait (must be inside an aspect-ratio container)
  portrait: "w-full h-full object-cover",
};

/**
 * Default `sizes` hint per preset — matches how the component is laid out
 * across the site. Callers can override via props.
 */
const defaultSizes: Record<AnySize, string> = {
  xs: "24px",
  sm: "40px",
  md: "56px",
  lg: "(min-width: 1024px) 320px, (min-width: 640px) 320px, 90vw",
  xl: "(min-width: 1024px) 480px, (min-width: 640px) 400px, 95vw",
  "2xl": "(min-width: 1024px) 640px, (min-width: 640px) 480px, 95vw",

  "xs-sm": "(min-width: 640px) 40px, 24px",
  "sm-md": "(min-width: 768px) 56px, 40px",
  "md-lg": "(min-width: 1024px) 80px, 56px",
  avatar: "(min-width: 1024px) 56px, (min-width: 640px) 40px, 32px",

  // Portrait wraps the image in a 3:4 (vertical) container while the CDN
  // serves landscape 4:3 source images. With `object-cover` the rendered
  // image width is ~16/9 (~1.78×) the container width, so the `sizes` hint
  // must be the *rendered* image width — otherwise the browser undersizes.
  // Container widths: ~360px (mobile, 95vw), ~360px (tablet), 360px (desktop)
  // Rendered widths : ~640px,                ~640px,             ~640px
  portrait: "(min-width: 1024px) 640px, (min-width: 640px) 640px, 100vw",
};

/**
 * Reserved width/height per preset. Used for the `width`/`height`
 * attributes so the browser allocates the correct intrinsic box and
 * avoids layout shift before the image decodes. For responsive presets
 * we pick the LARGEST size in the ladder so the aspect-ratio is correct
 * everywhere.
 */
const baseWidthFor: Record<AnySize, number> = {
  xs: 200, sm: 200, md: 200, lg: 600, xl: 800, "2xl": 1200,
  "xs-sm": 200, "sm-md": 200, "md-lg": 400, avatar: 200,
  portrait: 800,
};

/**
 * Pixel widths offered by the ring-sa.com.au CDN for cp-rect-* images.
 * Heights are derived from the original 4:3 ratio.
 */
const CDN_WIDTHS = [200, 400, 600, 800, 1200, 1600] as const;

function withWidth(url: string, width: number): string | null {
  const match = url.match(/cp-rect-(\d+)x(\d+)\.([a-z]+)$/i);
  if (!match) return null;
  const [, , , ext] = match;
  const height = Math.round((width * 3) / 4);
  return url.replace(/cp-rect-\d+x\d+\.[a-z]+$/i, `cp-rect-${width}x${height}.${ext}`);
}

function buildSrcSet(url: string): string | undefined {
  const variants = CDN_WIDTHS.map((w) => {
    const u = withWidth(url, w);
    return u ? `${u} ${w}w` : null;
  }).filter((v): v is string => v !== null);
  return variants.length > 1 ? variants.join(", ") : undefined;
}

type Props = {
  agent: Pick<Agent, "name" | "photo">;
  size?: AnySize;
  className?: string;
  alt?: string;
  eager?: boolean;
  /** Set fetchpriority="high" — use for the LCP image only. Implies eager. */
  priority?: boolean;
  /** Override the default `sizes` hint for this size preset. */
  sizes?: string;
  /**
   * When true, wraps the image in a div that applies the correct
   * aspect-ratio box. Use this for `lg` / `xl` / `2xl` / `portrait`
   * presets when there is no existing aspect-ratio container around
   * the image. Defaults to false (legacy behaviour) so existing
   * call-sites that already provide their own aspect container are
   * unaffected.
   */
  wrap?: boolean;
  /** Override the wrapper's aspect ratio. Defaults to "4/3" (CDN native). */
  aspect?: string;
  /** Class names applied to the wrapper element when `wrap` is true. */
  wrapperClassName?: string;
};

/** Avatar/round presets size themselves; no wrapper needed. */
const ROUND_PRESETS = new Set<AnySize>([
  "xs", "sm", "md",
  "xs-sm", "sm-md", "md-lg", "avatar",
]);

/**
 * Reusable team member photo. Centralises:
 * - referrerPolicy="no-referrer" (required by ring-sa.com.au CDN)
 * - loading="lazy" / "eager" + decoding="async"
 * - draggable={false}
 * - consistent sizing presets (xs/sm/md avatars, lg/xl/2xl portraits)
 * - responsive presets (xs-sm, sm-md, md-lg, avatar, portrait) that scale
 *   cleanly across breakpoints with no layout shift
 * - responsive srcset / sizes with width-rewritten CDN URLs
 * - optional `wrap` mode that supplies an aspect-ratio container so
 *   fill presets (lg/xl/2xl/portrait) can be dropped in anywhere
 */
export function TeamMemberImage({
  agent,
  size = "lg",
  className = "",
  alt,
  eager = false,
  priority = false,
  sizes,
  wrap = false,
  aspect = "4 / 3",
  wrapperClassName = "",
}: Props) {
  const srcSet = buildSrcSet(agent.photo);
  const baseWidth = baseWidthFor[size];
  const src = withWidth(agent.photo, baseWidth) ?? agent.photo;
  const isEager = eager || priority;

  const img = (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes ?? defaultSizes[size] : undefined}
      alt={alt ?? agent.name}
      width={baseWidth}
      height={Math.round((baseWidth * 3) / 4)}
      referrerPolicy="no-referrer"
      loading={isEager ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      draggable={false}
      className={[
        wrap && !ROUND_PRESETS.has(size)
          ? "absolute inset-0 w-full h-full object-cover"
          : sizeClass[size],
        className,
      ].filter(Boolean).join(" ")}
    />
  );

  // Round/avatar presets are intrinsically sized — wrapping is a no-op.
  if (!wrap || ROUND_PRESETS.has(size)) return img;

  return (
    <div
      className={[
        "relative block w-full overflow-hidden bg-muted",
        wrapperClassName,
      ].filter(Boolean).join(" ")}
      style={{ aspectRatio: aspect, contain: "layout paint" }}
    >
      {img}
    </div>
  );
}

