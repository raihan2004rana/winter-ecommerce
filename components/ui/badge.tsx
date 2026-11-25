import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Editorial Technical Garment Badge
 * Used for Temperature comfort ratings (-30°C Sub-Zero), Waterproofing (20k mm),
 * Insulation fill power (850 Fill), and sustainable certifications.
 */
const badgeVariants = cva(
  "inline-flex items-center text-2xs font-medium uppercase tracking-editorial transition-colors rounded-none px-2.5 py-1",
  {
    variants: {
      variant: {
        // Temperature & Sub-Zero rating
        temp: "bg-ice-frost text-charcoal border border-ice-soft",
        // Waterproof & Technical Weatherproofing
        waterproof: "bg-ice-mist text-ice-deep border border-ice-soft",
        // Muted forest accent for RDS Down & Eco-materials
        sustainability: "bg-forest-mist text-forest border border-forest/20",
        // High contrast charcoal status (e.g. New Drop, Backorder)
        neutral: "bg-charcoal text-canvas",
        // Soft linen subtle border badge
        outline: "border border-charcoal/20 text-charcoal-700 bg-canvas-subtle/50",
        // Low stock warning (restrained, non-garish)
        warning: "bg-alpine-amber/10 text-alpine-amber border border-alpine-amber/20",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
