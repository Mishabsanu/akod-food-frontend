"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            clearCart();
            router.push("/checkout/success");
        }, 2000);
    };

    if (cartTotal === 0 && !isProcessing) {
        if (typeof window !== "undefined") router.push("/cart");
        return null;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-serif text-brand-text mb-12 border-b border-gray-200 pb-4">Secure Checkout</h1>

            <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                <div className="space-y-12">
                    {/* Contact info */}
                    <div>
                        <h2 className="text-xl font-semibold text-brand-text mb-6">Contact Information</h2>
                        <input required type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
                    </div>

                    {/* Shipping */}
                    <div>
                        <h2 className="text-xl font-semibold text-brand-text mb-6">Shipping Address</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
                                <input required type="text" placeholder="Last Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
                            </div>
                            <input required type="text" placeholder="Street Address" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="text" placeholder="City" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
                                <input required type="text" placeholder="Postal Code" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-brand-box p-8 rounded-3xl h-fit border border-gray-100 shadow-xl shadow-brand-primary/5">
                    <h2 className="text-xl font-semibold text-brand-text mb-6">Payment Method</h2>

                    {/* Dummy payment UI */}
                    <div className="space-y-4 mb-8">
                        <div className="p-5 border-2 border-brand-primary rounded-xl bg-brand-bgLight relative">
                            <div className="flex items-center mb-4">
                                <div className="w-4 h-4 rounded-full bg-brand-primary border-4 border-white shadow-sm mr-3"></div>
                                <span className="font-medium text-brand-text">Credit / Debit Card</span>
                            </div>
                            <div className="space-y-3">
                                <input required type="text" placeholder="Card Number (Dummy)" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-primary text-sm" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input required type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-primary text-sm" />
                                    <input required type="text" placeholder="CVC" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-primary text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 flex justify-between items-center text-2xl font-bold text-brand-text mb-8">
                        <span>Total to Pay</span>
                        <span>₹{cartTotal}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center bg-brand-text text-white py-4 rounded-xl uppercase tracking-widest text-sm font-semibold hover:bg-brand-primary transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? "Processing Payment..." : `Secure Pay ₹${cartTotal}`}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                        256-bit SSL Encrypted Dummy Checkout
                    </p>
                </div>
            </form>
        </div>
    );
}
