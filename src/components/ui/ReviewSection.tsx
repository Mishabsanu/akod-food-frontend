"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, User, MessageSquare } from "lucide-react";
import StarRating from "./StarRating";

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
  isVerified: boolean;
}

interface ReviewSectionProps {
  productId: string;
  initialRating: number;
  initialReviewsCount: number;
}

export default function ReviewSection({
  productId,
  initialRating,
  initialReviewsCount,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "r1",
      user: "Alexandra V.",
      rating: 5,
      date: "Oct 12, 2023",
      comment: "Absolutely the finest banana chips I've ever tasted. The crunch is sublime and the spice level is perfectly balanced. Truly a premium experience.",
      isVerified: true,
    },
    {
      id: "r2",
      user: "Julian R.",
      rating: 4,
      date: "Nov 05, 2023",
      comment: "Exquisite quality. You can tell these aren't mass-produced. My only wish was for slightly larger packaging options, but the taste is unmatched.",
      isVerified: true,
    },
  ]);

  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const review: Review = {
        id: `r${Date.now()}`,
        user: "Guest Client",
        rating: newReview.rating,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        comment: newReview.comment,
        isVerified: false,
      };
      
      setReviews([review, ...reviews]);
      setIsSubmitting(false);
      setHasSubmitted(true);
      setNewReview({ rating: 5, comment: "" });
    }, 1500);
  };

  return (
    <div className="mt-32 pt-20 border-t border-gray-100">
      <div className="flex flex-col lg:flex-row gap-20">
        
        {/* Left Column: Summary and Submission */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-400 mb-2">The Archive</p>
            <h2 className="text-3xl font-serif text-gray-900 font-light mb-8">Client Critiques.</h2>
            
            <div className="bg-white border border-gray-100 p-8 mb-12">
              <div className="flex items-center gap-6 mb-6">
                <div className="text-5xl font-serif text-gray-900 leading-none">{initialRating.toFixed(1)}</div>
                <div>
                  <StarRating rating={initialRating} size={18} />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-2">Based on {initialReviewsCount} Reviews</p>
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
                        style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '5%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!hasSubmitted ? (
              <div className="border-t border-gray-100 pt-10">
                <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-6">Contribute your perspective</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3">Valuation</label>
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
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3">Your Commentary</label>
                    <textarea
                      required
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience with this provision..."
                      className="w-full bg-white border border-gray-200 p-4 text-sm font-light focus:outline-none focus:border-black transition-colors min-h-[120px] resize-none"
                    ></textarea>
                  </div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-light hover:bg-brand-primary transition-colors disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Submitting Critique..." : "Submit Critique"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="pt-10 text-center py-12 bg-gray-50 border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <CheckCircle2 className="w-12 h-12 text-black mx-auto mb-4" strokeWidth={1}/>
                <h4 className="text-xl font-serif text-gray-900 mb-2">Critique Received.</h4>
                <p className="text-xs text-gray-500 font-light max-w-[200px] mx-auto italic">Your perspective has been shared with our curators.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Review List */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 gap-12">
            {reviews.map((review, idx) => (
              <div 
                key={review.id} 
                className="pb-12 border-b border-gray-100 flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[100ms]"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="md:w-48 flex-shrink-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#f0ede6] flex items-center justify-center">
                      <User size={14} className="text-gray-400" strokeWidth={1} />
                    </div>
                    <span className="text-[11px] font-medium tracking-widest text-gray-900 uppercase">{review.user}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{review.date}</p>
                  {review.isVerified && (
                    <div className="flex items-center gap-2 mt-4 text-green-700">
                      <CheckCircle2 size={12} strokeWidth={1.5} />
                      <span className="text-[9px] uppercase tracking-[0.2em] font-medium">Verified Curator</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="mb-4">
                    <StarRating rating={review.rating} size={12} />
                  </div>
                  <p className="text-gray-600 font-light text-base leading-relaxed italic">
                     "{review.comment}"
                  </p>
                  <div className="mt-6 flex items-center gap-6">
                    <button className="text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors flex items-center gap-2">
                      Helpful (0)
                    </button>
                    <button className="text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
                      Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <div className="text-center py-20 bg-white border border-dashed border-gray-200">
                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" strokeWidth={1} />
                <p className="text-gray-400 text-sm font-light italic">No critiques have been archived yet for this provision.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
