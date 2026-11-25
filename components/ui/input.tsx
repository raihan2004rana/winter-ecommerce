import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial Architectural Form Input
 * Refined 1px hairline border, zero drop shadows, no bubbly rounded corners.
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-2xs uppercase tracking-editorial font-medium text-charcoal-600">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-sm border border-charcoal/20 bg-canvas-elevated px-3.5 py-2 text-sm text-charcoal placeholder:text-charcoal-400 focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-alpine-clay focus:border-alpine-clay focus:ring-alpine-clay",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-alpine-clay font-normal tracking-tight">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
