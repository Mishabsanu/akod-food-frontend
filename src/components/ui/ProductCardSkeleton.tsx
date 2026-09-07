"use client";

import React from "react";

export default function ProductCardSkeleton() {
    return (
        <div className="flex flex-col bg-white relative pb-10 h-full border border-gray-100/70 overflow-hidden shadow-sm">
            {/* Shimmer Image Stage Placeholder */}
            <div className="relative h-[360px] sm:h-[380px] w-full bg-[#faf9f6] flex items-center justify-center p-8 overflow-hidden">
                <div className="w-2/3 h-2/3 bg-stone-200/60 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                </div>
                {/* Fast Add Pill placeholder */}
                <div className="absolute bottom-4 inset-x-8 h-8 bg-stone-200/40 rounded-none animate-pulse"></div>
            </div>

            {/* Info Container Skeleton */}
            <div className="flex flex-col pt-6 px-4 text-center items-center space-y-3">
                {/* Category tag */}
                <div className="h-2.5 bg-stone-200/80 w-24 animate-pulse"></div>

                {/* Product Title */}
                <div className="h-4 bg-stone-200 w-3/4 animate-pulse"></div>

                {/* Star rating placeholder */}
                <div className="flex items-center gap-1 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="w-2.5 h-2.5 bg-stone-200/60 rounded-full animate-pulse"></div>
                    ))}
                    <div className="w-12 h-2 bg-stone-200/50 ml-1"></div>
                </div>

                {/* Price & Variant Pill */}
                <div className="flex items-center justify-center gap-3 pt-1">
                    <div className="h-4 bg-stone-200/90 w-14 animate-pulse"></div>
                    <div className="h-3 bg-stone-200/40 w-1"></div>
                    <div className="h-3 bg-stone-200/60 w-16 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
