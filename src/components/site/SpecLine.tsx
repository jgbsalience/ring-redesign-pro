type Tone = "dark" | "light";
type Size = "sm" | "md";

type Props = {
  price: string;
  beds: number;
  baths: number;
  cars: number;
  tone?: Tone;
  size?: Size;
  priceClassName?: string;
};

export function SpecLine({
  price,
  beds,
  baths,
  cars,
  tone = "dark",
  size = "md",
  priceClassName,
}: Props) {
  const isDark = tone === "dark";
  const valueClass = isDark ? "text-white" : "text-foreground";
  const labelClass = isDark ? "opacity-70" : "text-muted-foreground";
  const dividerClass = isDark ? "opacity-40" : "text-muted-foreground/50";
  const barClass = isDark ? "opacity-40" : "text-muted-foreground/40";
  const baseText =
    size === "sm"
      ? isDark
        ? "text-xs text-white/85"
        : "text-xs text-muted-foreground"
      : isDark
        ? "text-sm text-white/85"
        : "text-sm text-muted-foreground";

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-y-1 sm:gap-x-4 ${baseText}`}
    >
      <span
        className={
          priceClassName ??
          "text-[var(--ringgreen)] font-medium tabular-nums leading-tight"
        }
      >
        {price}
      </span>
      <span aria-hidden="true" className={`hidden sm:inline ${barClass}`}>
        |
      </span>
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 tabular-nums leading-tight">
        <li>
          <span className={`font-medium ${valueClass}`}>{beds}</span>{" "}
          <span className={labelClass}>bed</span>
        </li>
        <li aria-hidden="true" className={dividerClass}>·</li>
        <li>
          <span className={`font-medium ${valueClass}`}>{baths}</span>{" "}
          <span className={labelClass}>bath</span>
        </li>
        <li aria-hidden="true" className={dividerClass}>·</li>
        <li>
          <span className={`font-medium ${valueClass}`}>{cars}</span>{" "}
          <span className={labelClass}>car</span>
        </li>
      </ul>
    </div>
  );
}
