import { NextRequest, NextResponse } from "next/server";
import { CreateReviewSchema } from "@/lib/validations/review";
import { getProductBySlug } from "@/data/products";

// Server review storage
const reviewsStore: Record<string, any[]> = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get("productSlug");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

    let reviewsList: any[] = [];

    if (productSlug) {
      const product = getProductBySlug(productSlug);
      const initialReviews = product?.reviews || [];
      const dynamicReviews = reviewsStore[productSlug] || [];
      reviewsList = [...dynamicReviews, ...initialReviews];
    } else {
      // Return all reviews
      reviewsList = Object.values(reviewsStore).flat();
    }

    const total = reviewsList.length;
    const paginated = reviewsList.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      status: "success",
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: error?.message || "Failed to load reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateReviewSchema.parse(body);

    const product = getProductBySlug(validated.productSlug);
    if (!product) {
      return NextResponse.json(
        { status: "fail", error: `Garment '${validated.productSlug}' not found` },
        { status: 404 }
      );
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      productSlug: validated.productSlug,
      author: validated.authorName,
      location: "Verified Global Client",
      rating: validated.rating,
      warmthRating: validated.warmthRating || 5,
      fitFeedback: validated.fitFeedback,
      title: validated.title,
      comment: validated.comment,
      verified: true,
      isApproved: true,
      date: "Just now",
      createdAt: new Date().toISOString(),
    };

    if (!reviewsStore[validated.productSlug]) {
      reviewsStore[validated.productSlug] = [];
    }

    reviewsStore[validated.productSlug].unshift(newReview);

    return NextResponse.json(
      {
        status: "success",
        message: "Customer review verified and published.",
        data: newReview,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.errors) {
      return NextResponse.json(
        { status: "fail", error: "Validation error", validationErrors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { status: "error", error: error?.message || "Failed to record review" },
      { status: 500 }
    );
  }
}
