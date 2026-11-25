import { z } from "zod";

export const CreateReviewSchema = z.object({
  productSlug: z.string().min(1, "Product slug is required"),
  rating: z.number().int().min(1, "Minimum rating is 1").max(5, "Maximum rating is 5"),
  warmthRating: z.number().int().min(1).max(5).optional(),
  fitFeedback: z.enum(["runs_small", "true_to_size", "runs_large"]).default("true_to_size"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  comment: z.string().min(10, "Review comment must be at least 10 characters").max(2000),
  authorName: z.string().min(1, "Author name is required"),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
