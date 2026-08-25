"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#faf9f6] flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md mx-auto">
        <p className="text-[10px] uppercase tracking-[0.35em] text-brand-primary font-semibold mb-2">
          System Notice
        </p>

        <h1 className="text-3xl font-serif font-light text-stone-900 mb-4">
          Something Went Wrong.
        </h1>

        <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed mb-8">
          We encountered an unexpected issue while loading this view. Please try refreshing or return to the main store.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white text-[10px] uppercase tracking-[0.25em] font-medium hover:bg-brand-primary hover:text-black transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3.5 border border-stone-300 text-stone-700 text-[10px] uppercase tracking-[0.25em] font-medium hover:border-black hover:text-black transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
