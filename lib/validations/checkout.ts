import { z } from "zod";

export const ShippingAddressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  addressLine1: z.string().min(3, "Street address must be at least 3 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().min(1, "State / Province is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  countryCode: z.string().length(2, "Country code must be ISO-2 characters").toUpperCase(),
  phone: z.string().min(7, "Valid telephone number required"),
});

export const CreateCheckoutIntentSchema = z.object({
  currency: z.enum(["USD", "EUR", "GBP", "CAD"]),
  email: z.string().email("Valid email address required"),
  shippingAddress: ShippingAddressSchema,
  billingAddress: ShippingAddressSchema.optional(),
  items: z.array(
    z.object({
      productSlug: z.string(),
      variantSku: z.string(),
      size: z.string(),
      color: z.string(),
      quantity: z.number().int().min(1),
      unitPrice: z.number().min(0),
    })
  ).min(1, "Cart cannot be empty"),
  discountCode: z.string().optional(),
  idempotencyKey: z.string().min(16, "Idempotency key required to prevent duplicate charges"),
});

export type ShippingAddressInput = z.infer<typeof ShippingAddressSchema>;
export type CreateCheckoutIntentInput = z.infer<typeof CreateCheckoutIntentSchema>;
