import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#faf9f6] flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto mb-6 text-stone-700">
          <Compass className="w-5 h-5" />
        </div>
        
        <p className="text-[10px] uppercase tracking-[0.35em] text-brand-primary font-semibold mb-2">
          404 &bull; Page Not Found
        </p>

        <h1 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4 tracking-tight">
          This Path Is Uncharted.
        </h1>

        <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed mb-8">
          The page or product you are looking for may have been moved, renamed, or is currently out of seasonal harvest.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-black text-white text-[10px] uppercase tracking-[0.25em] font-medium hover:bg-brand-primary hover:text-black transition-colors"
          >
            <span>Explore Provisions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-stone-300 text-stone-700 text-[10px] uppercase tracking-[0.25em] font-medium hover:border-black hover:text-black transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
