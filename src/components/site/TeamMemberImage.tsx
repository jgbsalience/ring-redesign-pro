import type { Agent } from "@/data/site";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClass: Record<Size, string> = {
  // avatar circles
  xs: "w-6 h-6 rounded-full object-cover",
  sm: "w-10 h-10 rounded-full object-cover",
  md: "w-14 h-14 rounded-full object-cover",
  // portrait fills (use inside an aspect-ratio container)
  lg: "w-full h-full object-cover",
  xl: "w-full h-full object-cover",
};

type Props = {
  agent: Pick<Agent, "name" | "photo">;
  /**
   * Visual size preset. xs–md render as round avatars at fixed pixel sizes.
   * lg/xl fill the parent (use within an aspect-ratio container).
   */
  size?: Size;
  /** Extra classes appended to the size preset (e.g. grayscale/hover effects). */
  className?: string;
  /** Override alt text. Defaults to the agent's name. */
  alt?: string;
  /** Eager-load (e.g. above-the-fold hero portraits). Defaults to lazy. */
  eager?: boolean;
};

/**
 * Reusable team member photo. Centralises:
 * - referrerPolicy="no-referrer" (required by ring-sa.com.au CDN)
 * - loading="lazy" / "eager"
 * - decoding="async"
 * - draggable={false}
 * - consistent sizing presets
 */
export function TeamMemberImage({
  agent,
  size = "lg",
  className = "",
  alt,
  eager = false,
}: Props) {
  return (
    <img
      src={agent.photo}
      alt={alt ?? agent.name}
      referrerPolicy="no-referrer"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={[sizeClass[size], className].filter(Boolean).join(" ")}
    />
  );
}
