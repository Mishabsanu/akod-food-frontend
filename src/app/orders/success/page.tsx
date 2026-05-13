"use client";

import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from "lucide-react";

export default function OrderSuccessPage() {
    return (
        <div className="bg-[#faf9f6] min-h-screen flex items-center justify-center font-sans p-6">
            <div className="max-w-md w-full bg-white border border-gray-100 p-12 text-center shadow-xl animate-in fade-in zoom-in-95 duration-700">
                <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-10 text-brand-primary">
                    <CheckCircle2 size={40} strokeWidth={1.5} className="animate-in zoom-in-50 duration-500 delay-300" />
                </div>
                
                <h1 className="text-4xl font-serif text-gray-900 font-light mb-4">Order Confirmed.</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-10 font-bold">Thank you for your order</p>
                
                <div className="space-y-4 mb-12">
                    <p className="text-sm text-gray-500 font-light leading-relaxed">
                        Your order has been received and is now being prepared. We will update you as soon as it is shipped.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link href="/profile" className="block w-full bg-black text-white text-[10px] uppercase tracking-[0.3em] font-medium py-5 hover:bg-brand-primary transition-all flex items-center justify-center gap-3 group">
                        <Package size={16} strokeWidth={1.5} />
                        Track My Order
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <Link href="/products" className="block w-full border border-gray-100 text-[10px] uppercase tracking-[0.3em] text-gray-400 py-5 hover:border-black hover:text-black transition-all">
                        Continue Shopping
                    </Link>
                </div>
                
                <div className="mt-12 pt-12 border-t border-gray-50">
                    <p className="text-[9px] text-gray-300 uppercase tracking-widest italic">Thank you for choosing AKOD Food</p>
                </div>
            </div>
        </div>
    );
}
