import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ringgreen)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--ringgreen-deep)] text-[var(--bone)] shadow-sm hover:bg-[var(--ringgreen)] hover:text-[var(--ink)] active:bg-[var(--ringgreen-deep)]",
        brand:
          "bg-[var(--ringgreen)] text-[var(--ink)] shadow-sm hover:bg-[var(--ringgreen-deep)] hover:text-[var(--bone)] active:bg-[var(--ringgreen-deep)]",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-[var(--ringgreen-line)] bg-background text-foreground shadow-sm hover:bg-[var(--ringgreen-tint)] hover:border-[var(--ringgreen-deep)] hover:text-[var(--ringgreen-deep)]",
        secondary:
          "bg-[var(--ringgreen-tint)] text-[var(--ringgreen-deep)] border border-[var(--ringgreen-line)]/60 shadow-sm hover:bg-[var(--ringgreen-soft)] hover:border-[var(--ringgreen-line)]",
        ghost:
          "text-foreground hover:bg-[var(--ringgreen-tint)] hover:text-[var(--ringgreen-deep)]",
        link: "text-[var(--ringgreen-deep)] underline-offset-4 hover:underline hover:text-[var(--ringgreen)] p-0 h-auto",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
