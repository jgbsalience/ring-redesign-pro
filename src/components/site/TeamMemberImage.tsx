import type { Agent } from "@/data/site";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClass: Record<Size, string> = {
  xs: "w-6 h-6 rounded-full object-cover",
  sm: "w-10 h-10 rounded-full object-cover",
  md: "w-14 h-14 rounded-full object-cover",
  lg: "w-full h-full object-cover",
  xl: "w-full h-full object-cover",
};

/**
 * Default `sizes` hint per preset — matches how the component is laid out
 * across the site. Callers can override via props.
 */
const defaultSizes: Record<Size, string> = {
  xs: "24px",
  sm: "40px",
  md: "56px",
  // 4-up grid on desktop, 2-up on mobile (homepage / team grid)
  lg: "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 50vw",
  // Hero portrait on the agent profile page (~5/12 of container)
  xl: "(min-width: 1024px) 480px, 100vw",
};

/**
 * Pixel widths offered by the ring-sa.com.au CDN for cp-rect-* images.
 * Heights are derived from the original 4:3 ratio.
 */
const CDN_WIDTHS = [200, 400, 600, 800, 1200, 1600] as const;

/**
 * Rewrite a `cp-rect-{w}x{h}.{ext}` CDN URL to the requested width.
 * Returns null when the URL doesn't match the expected pattern.
 */
function withWidth(url: string, width: number): string | null {
  const match = url.match(/cp-rect-(\d+)x(\d+)\.([a-z]+)$/i);
  if (!match) return null;
  const [, , , ext] = match;
  const height = Math.round((width * 3) / 4); // CDN images are 4:3
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
  size?: Size;
  className?: string;
  alt?: string;
  eager?: boolean;
  /** Override the default `sizes` hint for this size preset. */
  sizes?: string;
};

/**
 * Reusable team member photo. Centralises:
 * - referrerPolicy="no-referrer" (required by ring-sa.com.au CDN)
 * - loading="lazy" / "eager" + decoding="async"
 * - draggable={false}
 * - consistent sizing presets (xs/sm/md avatars, lg/xl portraits)
 * - responsive srcset / sizes with width-rewritten CDN URLs
 */
export function TeamMemberImage({
  agent,
  size = "lg",
  className = "",
  alt,
  eager = false,
  sizes,
}: Props) {
  const srcSet = buildSrcSet(agent.photo);
  // Pick a sensible default base src per preset (avatars stay small)
  const baseWidth = size === "xl" ? 800 : size === "lg" ? 600 : 200;
  const src = withWidth(agent.photo, baseWidth) ?? agent.photo;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes ?? defaultSizes[size] : undefined}
      alt={alt ?? agent.name}
      width={baseWidth}
      height={Math.round((baseWidth * 3) / 4)}
      referrerPolicy="no-referrer"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={[sizeClass[size], className].filter(Boolean).join(" ")}
    />
  );
}
