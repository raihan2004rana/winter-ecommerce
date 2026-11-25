import { z } from "zod";

export const NewsletterSubscriptionSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  frequency: z.enum(["drops_only", "weekly", "monthly"]).default("weekly"),
  notifyDrops: z.boolean().default(true),
  notifySales: z.boolean().default(true),
});

export const ValidateCouponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").toUpperCase(),
  subtotal: z.number().min(0),
  currency: z.enum(["USD", "EUR", "GBP", "CAD"]),
});

export type NewsletterSubscriptionInput = z.infer<typeof NewsletterSubscriptionSchema>;
export type ValidateCouponInput = z.infer<typeof ValidateCouponSchema>;
