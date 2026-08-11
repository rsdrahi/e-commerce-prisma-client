"use client";

import { useState, useEffect } from "react";
import { Review } from "@/types";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store/authStore";
import { toast } from "sonner";
import { Star } from "lucide-react";

export function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const fetchReviews = async () => {
    try {
      const res = await api("/reviews");
      if (res.success) {
        const productReviews = res.data.filter((r: Review) => r.productId === productId);
        setReviews(productReviews);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error("Please login to submit a review");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await api("/reviews", {
        method: "POST",
        body: JSON.stringify({
          rating,
          comment,
          productId,
          userId: user.id
        })
      });

      if (res.success) {
        toast.success("Review submitted successfully");
        setComment("");
        setRating(5);
        fetchReviews(); // refresh
      } else {
        toast.error(res.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
          <div className="mb-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`transition-colors ${rating >= star ? 'text-amber-500' : 'text-gray-300'}`}
              >
                <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} strokeWidth={rating >= star ? 0 : 2} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4 transition-all"
            rows={3}
            placeholder="Share your thoughts about this product..."
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center text-gray-600">
          Please <a href="/login" className="text-amber-600 font-medium hover:underline">log in</a> to write a review.
        </div>
      )}

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                    {review.user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="font-medium text-gray-900">{review.user?.name || "Anonymous User"}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} strokeWidth={i < review.rating ? 0 : 2} className={i >= review.rating ? 'text-gray-300' : ''} />
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
}
