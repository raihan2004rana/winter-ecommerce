"use client";

import * as React from "react";
import {
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { AdminReview } from "@/lib/server/admin-store";

let cachedReviews: AdminReview[] = [];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<AdminReview[]>(cachedReviews);
  const [loading, setLoading] = React.useState(cachedReviews.length === 0);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");
  const [moderatingId, setModeratingId] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  const fetchReviews = React.useCallback(async () => {
    try {
      if (cachedReviews.length === 0) setLoading(true);
      const queryParams = new URLSearchParams();
      if (statusFilter !== "all") queryParams.set("status", statusFilter);

      const res = await fetch(`/api/admin/reviews?${queryParams.toString()}`);
      const data = await res.json();
      if (data && data.reviews) {
        cachedReviews = data.reviews;
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleModerate = async (reviewId: string, status: "approved" | "rejected") => {
    try {
      setModeratingId(reviewId);
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to moderate review");
      }

      await fetchReviews();
      setSuccessToast(
        status === "approved"
          ? "Review approved and published to storefront"
          : "Review marked as rejected"
      );
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setModeratingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-lg shadow-xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Reviews & Social Proof Moderation
            </h1>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-mono border border-neutral-200">
              {reviews.length} Total Submissions
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Moderate customer testimonials, filter spam, and ensure winter gear ratings reflect genuine buyers.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 rounded-md transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Total Reviews
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{reviews.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Submitted ratings</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-amber-700 uppercase tracking-wider flex items-center justify-between">
            <span>Pending Moderation</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-600 mt-1">Awaiting approval action</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
            Approved on Store
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{approvedCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Live customer testimonials</div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center justify-between">
            <span>Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">{avgRating} / 5.0</div>
          <div className="text-[11px] text-neutral-400 mt-1">Across all verified items</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-1 p-1 bg-neutral-100 rounded-lg border border-neutral-200 text-xs">
          {[
            { id: "all", label: "All Reviews" },
            { id: "pending", label: `Pending (${pendingCount})` },
            { id: "approved", label: "Approved" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === tab.id
                  ? "bg-white text-neutral-900 shadow-sm font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search reviews by garment, text or buyer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm"
          />
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-600" />
            <span>Loading reviews stream...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
            <h4 className="text-sm font-semibold text-neutral-900">No reviews found</h4>
            <p className="text-xs text-neutral-500 mt-1">
              There are no reviews currently matching this filter status.
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const dateStr = new Date(review.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={review.id}
                className="bg-white rounded-lg border border-neutral-200 p-5 shadow-sm hover:border-neutral-300 transition-all space-y-3"
              >
                {/* Header: Product & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-neutral-900">
                      {review.productTitle}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      ID: {review.productId}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] text-neutral-400 font-mono">{dateStr}</span>
                    {review.status === "approved" ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        <span>APPROVED</span>
                      </span>
                    ) : review.status === "rejected" ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3 h-3" />
                        <span>REJECTED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        <span>PENDING MODERATION</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Stars and Reviewer info */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-bold text-neutral-900">{review.title}</span>

                  <span className="text-xs text-neutral-400">•</span>

                  <div className="text-xs text-neutral-600 flex items-center space-x-1">
                    <span className="font-semibold text-neutral-800">{review.author}</span>
                    <span className="text-[11px] text-neutral-400">({review.email})</span>
                    <span title="Verified Buyer">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-md border border-neutral-100 italic">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Moderation Actions */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-neutral-400">
                    Review ID: {review.id}
                  </span>

                  <div className="flex items-center space-x-2">
                    {review.status !== "approved" && (
                      <button
                        onClick={() => handleModerate(review.id, "approved")}
                        disabled={moderatingId === review.id}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                      >
                        {moderatingId === review.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Approve Review</span>
                      </button>
                    )}

                    {review.status !== "rejected" && (
                      <button
                        onClick={() => handleModerate(review.id, "rejected")}
                        disabled={moderatingId === review.id}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 disabled:opacity-50 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
                      >
                        {moderatingId === review.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
