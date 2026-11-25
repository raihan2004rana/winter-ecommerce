import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Universal Tailwind class merger with clsx condition handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Currency formatter conforming to regional luxury e-commerce formatting
 */
export function formatCurrency(
  amount: number,
  currency: "USD" | "EUR" | "GBP" | "CAD" = "USD"
): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }),
    EUR: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }),
    GBP: new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0 }),
    CAD: new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 0 }),
  };

  return formatters[currency]?.format(amount) ?? `$${amount.toFixed(0)}`;
}
