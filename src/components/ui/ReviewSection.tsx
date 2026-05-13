"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, User, MessageSquare } from "lucide-react";
import StarRating from "./StarRating";
import { customerApi } from "@/lib/api";
import { toast } from "sonner";

interface Review {
  _id: string;
  customerName?: string;
  user?: string;
  rating: number;
  createdAt: string;
  comment: string;
  isVerified: boolean;
}

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({
  productId,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const fetchReviews = React.useCallback(async () => {
    try {
      const res = await customerApi.getReviews(productId);
      setReviews(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await customerApi.createReview(productId, newReview);
      setHasSubmitted(true);
      toast.success("Review submitted! Thank you.");
      fetchReviews(); // Refresh list to get real data
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Please sign in to leave a review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate dynamic stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / totalReviews 
    : 5.0;

  const getPercentage = (star: number) => {
    if (totalReviews === 0) return 0;
    const count = reviews.filter(r => Math.round(r.rating) === star).length;
    return (count / totalReviews) * 100;
  };

  return (
    <div className="mt-32 pt-20 border-t border-gray-100">
      <div className="flex flex-col lg:flex-row gap-20">
        
        {/* Left Column: Summary and Submission */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-400 mb-2">Customer Feedback</p>
            <h2 className="text-3xl font-serif text-gray-900 font-light mb-8">Reviews.</h2>
            
            <div className="bg-white border border-gray-100 p-8 mb-12">
              <div className="flex items-center gap-6 mb-6">
                <div className="text-5xl font-serif text-gray-900 leading-none">{averageRating.toFixed(1)}</div>
                <div>
                  <StarRating rating={averageRating} size={18} />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-2">Based on {totalReviews} Reviews</p>
                </div>
              </div>
              
              {/* Rating Breakdown */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-4">
                    <span className="text-[10px] w-3 text-gray-400">{star}</span>
                    <div className="flex-1 h-[2px] bg-gray-100 overflow-hidden">
                      <div 
                        className="h-full bg-black transition-all duration-1000" 
                        style={{ width: `${getPercentage(star)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!hasSubmitted ? (
              <div className="border-t border-gray-100 pt-10">
                <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-6">Share your thoughts</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: s })}
                          className="transition-colors"
                        >
                          <Star 
                            size={20} 
                            className={s <= newReview.rating ? "fill-black text-black" : "text-gray-200"} 
                            strokeWidth={1}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3">Your Review</label>
                    <textarea
                      required
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="What did you think of this product?"
                      className="w-full bg-white border border-gray-200 p-4 text-sm font-light focus:outline-none focus:border-black transition-colors min-h-[120px] resize-none"
                    ></textarea>
                  </div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-light hover:bg-brand-primary transition-colors disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Submitting Review..." : "Submit Review"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="pt-10 text-center py-12 bg-gray-50 border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <CheckCircle2 className="w-12 h-12 text-black mx-auto mb-4" strokeWidth={1}/>
                <h4 className="text-xl font-serif text-gray-900 mb-2">Review Submitted.</h4>
                <p className="text-xs text-gray-500 font-light max-w-[200px] mx-auto italic">Thank you for sharing your experience!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Review List */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 gap-12">
            {reviews.map((review, idx) => (
              <div 
                key={review._id} 
                className="pb-12 border-b border-gray-100 flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="md:w-48 flex-shrink-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#f0ede6] flex items-center justify-center">
                      <User size={14} className="text-gray-400" strokeWidth={1} />
                    </div>
                    <span className="text-[11px] font-medium tracking-widest text-gray-900 uppercase">{review.customerName || "Client"}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </p>
                  {review.isVerified && (
                    <div className="flex items-center gap-2 mt-4 text-green-700">
                      <CheckCircle2 size={12} strokeWidth={1.5} />
                      <span className="text-[9px] uppercase tracking-[0.2em] font-medium">Verified Buyer</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="mb-4">
                    <StarRating rating={review.rating} size={12} />
                  </div>
                  <p className="text-gray-600 font-light text-base leading-relaxed italic">
                     &quot;{review.comment}&quot;
                  </p>
                </div>
              </div>
            ))}
            
            {!isLoading && reviews.length === 0 && (
              <div className="text-center py-20 bg-white border border-dashed border-gray-200">
                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" strokeWidth={1} />
                <p className="text-gray-400 text-sm font-light italic">No reviews have been posted yet for this product.</p>
              </div>
            )}

            {isLoading && (
               <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-200" />
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
