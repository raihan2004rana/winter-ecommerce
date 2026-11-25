import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Editorial Luxury Button Component
 * Avoids bubbly pill buttons. Emphasizes architectural sharpness,
 * refined micro-interactions, and high-contrast tactile feedback.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs uppercase tracking-editorial font-medium transition-all duration-300 ease-editorial-out disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-charcoal",
  {
    variants: {
      variant: {
        // High-contrast primary charcoal button
        primary:
          "bg-charcoal text-canvas hover:bg-forest active:bg-charcoal-900 border border-charcoal",
        // Signature muted forest-green button
        forest:
          "bg-forest text-canvas hover:bg-forest-deep active:bg-forest-deep border border-forest",
        // Architectural hairline outline button
        outline:
          "border border-charcoal/30 bg-transparent text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-canvas",
        // Soft linen/canvas button for subtle secondary actions
        secondary:
          "bg-canvas-subtle text-charcoal border border-canvas-muted hover:bg-canvas-muted hover:border-charcoal/20",
        // Subtle ghost button
        ghost:
          "text-charcoal hover:bg-canvas-subtle hover:text-charcoal-900",
        // Editorial underline link style
        link:
          "text-charcoal underline-offset-4 hover:underline p-0 h-auto tracking-widest lowercase first-letter:uppercase",
        // Glacial ice technical button
        ice:
          "bg-ice-frost text-charcoal border border-ice-soft hover:bg-ice hover:text-canvas",
      },
      size: {
        default: "h-11 px-7 py-2.5",
        sm: "h-9 px-4 text-2xs tracking-widest",
        lg: "h-13 px-9 text-xs tracking-widest",
        icon: "h-10 w-10 p-0",
      },
      shape: {
        sharp: "rounded-none",
        subtle: "rounded-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      shape: "subtle",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
