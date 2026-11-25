import { z } from "zod";

export const AddToCartSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  productSlug: z.string().min(1, "Product slug is required"),
  size: z.string().min(1, "Size is required"),
  color: z.string().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Maximum 10 items per line"),
  sessionToken: z.string().min(8, "Session token required"),
});

export const UpdateCartItemSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  quantity: z.number().int().min(0, "Quantity cannot be negative").max(10),
  sessionToken: z.string().min(8, "Session token required"),
});

export const MergeCartSchema = z.object({
  sessionToken: z.string().min(8, "Guest session token required"),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
