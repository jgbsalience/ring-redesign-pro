import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ringgreen)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary CTA — deep ring green, lifts to bright green on hover
        default:
          "bg-[var(--ringgreen-deep)] text-[var(--bone)] shadow-sm hover:bg-[var(--ringgreen)] hover:text-[var(--ink)] active:bg-[var(--ringgreen-deep)]",
        // Brand alt — bright green field, deep on hover
        brand:
          "bg-[var(--ringgreen)] text-[var(--ink)] shadow-sm hover:bg-[var(--ringgreen-deep)] hover:text-[var(--bone)] active:bg-[var(--ringgreen-deep)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        // Outline picks up the green line color and fills with tint on hover
        outline:
          "border border-[var(--ringgreen-line)] bg-background text-foreground shadow-sm hover:bg-[var(--ringgreen-tint)] hover:border-[var(--ringgreen-deep)] hover:text-[var(--ringgreen-deep)]",
        // Secondary — soft green chip
        secondary:
          "bg-[var(--ringgreen-tint)] text-[var(--ringgreen-deep)] border border-[var(--ringgreen-line)]/60 shadow-sm hover:bg-[var(--ringgreen-soft)] hover:border-[var(--ringgreen-line)]",
        // Ghost — text-only, picks up tint behind it
        ghost:
          "text-foreground hover:bg-[var(--ringgreen-tint)] hover:text-[var(--ringgreen-deep)]",
        // Link — underlines on hover in deep green
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
