"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function CheckoutPage() {
    const { cartTotal, cartSubtotal, platformFee, deliveryFee, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Address State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [selectedQuickAddress, setSelectedQuickAddress] = useState<string | null>(null);
    
    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [discountApplied, setDiscountApplied] = useState(0);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<"card" | "razorpay">("card");

    const handleApplyCoupon = () => {
        if (!couponCode) return;
        if (couponCode.toLowerCase() === "luxury10") {
            setDiscountApplied(cartTotal * 0.1); // 10% off
        } else {
            setDiscountApplied(500); // flat ₹500 off dummy
        }
    };

    const handleRemoveCoupon = () => {
        setDiscountApplied(0);
        setCouponCode("");
    };

    const finalTotal = Math.max(0, cartTotal - discountApplied);

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            clearCart();
            router.push("/checkout/success");
        }, 2000);
    };

    const handleSelectHome = () => {
        setFirstName("Aura");
        setLastName("Guest");
        setStreet("1A Luxury Avenue, Bandra West");
        setCity("Mumbai");
        setZip("400050");
        setSelectedQuickAddress("home");
    };

    const handleSelectOffice = () => {
        setFirstName("Aura");
        setLastName("Guest");
        setStreet("Corporate Tower B, BKC");
        setCity("Mumbai");
        setZip("400051");
        setSelectedQuickAddress("office");
    };

    if (cartTotal === 0 && !isProcessing) {
        if (typeof window !== "undefined") router.push("/cart");
        return null;
    }

    return (
        <div className="bg-[#faf9f6] min-h-screen pb-32 font-sans selection:bg-brand-primary/20 selection:text-black">
            
            {/* Ultra-Premium Header */}
            <div className="w-full bg-white border-b border-gray-100 py-10 lg:py-16 mb-8 lg:mb-12">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                    <p className="text-[9px] uppercase tracking-[0.4em] mb-4 font-medium text-gray-400">
                        Finalization
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-[4rem] font-serif text-gray-900 font-light leading-none tracking-tight">
                        Secure Checkout.
                    </h1>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative items-start">
                    
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 flex flex-col space-y-16">
                        
                        {/* Contact Information */}
                        <div>
                            <h2 className="font-serif text-2xl text-gray-900 mb-8 font-light">Contact Information.</h2>
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Email Address</label>
                                    <input required type="email" placeholder="example@akodfood.com" className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors placeholder:text-gray-300" />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <h2 className="font-serif text-2xl text-gray-900 mb-8 font-light">Delivery Details.</h2>
                            
                            {/* Address Selector to Autofill */}
                            <div className="mb-10">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-4">Quick Fill from Saved Addresses</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button 
                                        type="button" 
                                        onClick={handleSelectHome} 
                                        className={`p-6 border text-left transition-colors ${selectedQuickAddress === 'home' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black text-black bg-white'}`}
                                    >
                                        <span className="block text-[9px] uppercase tracking-[0.3em] font-medium mb-3">Home</span>
                                        <span className={`block text-xs font-light leading-relaxed truncate ${selectedQuickAddress === 'home' ? 'text-gray-300' : 'text-gray-500'}`}>1A Luxury Avenue, Bandra West</span>
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={handleSelectOffice} 
                                        className={`p-6 border text-left transition-colors ${selectedQuickAddress === 'office' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black text-black bg-white'}`}
                                    >
                                        <span className="block text-[9px] uppercase tracking-[0.3em] font-medium mb-3">Office</span>
                                        <span className={`block text-xs font-light leading-relaxed truncate ${selectedQuickAddress === 'office' ? 'text-gray-300' : 'text-gray-500'}`}>Corporate Tower B, BKC</span>
                                    </button>
                                </div>
                            </div>

                            {/* Manual Address Form (Always Visible) */}
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">First Name</label>
                                        <input 
                                            required 
                                            type="text" 
                                            value={firstName}
                                            onChange={(e) => { setFirstName(e.target.value); setSelectedQuickAddress(null); }}
                                            className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Last Name</label>
                                        <input 
                                            required 
                                            type="text" 
                                            value={lastName}
                                            onChange={(e) => { setLastName(e.target.value); setSelectedQuickAddress(null); }}
                                            className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Full Street Address</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={street}
                                        onChange={(e) => { setStreet(e.target.value); setSelectedQuickAddress(null); }}
                                        className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">City</label>
                                        <input 
                                            required 
                                            type="text" 
                                            value={city}
                                            onChange={(e) => { setCity(e.target.value); setSelectedQuickAddress(null); }}
                                            className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Postal Code</label>
                                        <input 
                                            required 
                                            type="text" 
                                            value={zip}
                                            onChange={(e) => { setZip(e.target.value); setSelectedQuickAddress(null); }}
                                            className="w-full px-4 py-3 bg-transparent border-b border-gray-200 text-sm font-light text-gray-900 focus:border-black outline-none transition-colors" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment & Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-36 flex flex-col space-y-8">
                        
                        {/* Summary & Payment Module */}
                        <div className="bg-white border border-gray-100 p-8 lg:p-12 shadow-sm">
                            <h2 className="font-serif text-xl text-gray-900 mb-6 font-light">Payment Method.</h2>
                            
                            <div className="flex gap-4 mb-6">
                                <button 
                                    type="button" 
                                    onClick={() => setPaymentMethod("card")}
                                    className={`flex-1 py-3 text-[9px] uppercase tracking-[0.2em] font-medium border transition-colors ${paymentMethod === "card" ? "border-black bg-black text-white" : "border-gray-200 text-gray-400 hover:text-black hover:border-black"}`}
                                >
                                    Card
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setPaymentMethod("razorpay")}
                                    className={`flex-1 py-3 text-[9px] uppercase tracking-[0.2em] font-medium border transition-colors ${paymentMethod === "razorpay" ? "border-black bg-black text-white" : "border-gray-200 text-gray-400 hover:text-black hover:border-black"}`}
                                >
                                    Razorpay
                                </button>
                            </div>

                            <div className="border border-black p-6 relative bg-[#faf9f6] mb-8 min-h-[140px] flex flex-col justify-center">
                                <div className="absolute top-0 right-0 bg-black w-4 h-4" />
                                
                                {paymentMethod === "card" ? (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div>
                                            <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2">Card Number (Dummy)</label>
                                            <input required={paymentMethod === "card"} type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2 border border-gray-200 bg-white text-sm font-mono text-gray-900 focus:border-black outline-none transition-colors" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2">Expiry</label>
                                                <input required={paymentMethod === "card"} type="text" placeholder="MM/YY" className="w-full px-4 py-2 border border-gray-200 bg-white text-sm font-mono text-gray-900 focus:border-black outline-none transition-colors" />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2">Security Code</label>
                                                <input required={paymentMethod === "card"} type="text" placeholder="CVC" className="w-full px-4 py-2 border border-gray-200 bg-white text-sm font-mono text-gray-900 focus:border-black outline-none transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center animate-in fade-in duration-300">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 leading-relaxed">
                                            You will be securely redirected to the Razorpay gateway upon authorization.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Coupon Section */}
                            <div className="border-t border-gray-100 pt-8 mb-8">
                                <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-900 mb-4">Privilege Code</h3>
                                <div className="flex">
                                    <input 
                                        type="text" 
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        disabled={discountApplied > 0}
                                        placeholder="Enter Code (e.g. LUXURY10)" 
                                        className="flex-1 px-4 py-3 border border-gray-200 border-r-0 text-xs font-light uppercase tracking-widest text-gray-900 focus:border-black outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={discountApplied > 0 ? handleRemoveCoupon : handleApplyCoupon}
                                        className={`px-6 py-3 border ${discountApplied > 0 ? 'border-gray-200 text-black hover:bg-gray-100' : 'border-black bg-black text-white hover:bg-gray-900'} text-[9px] uppercase tracking-[0.2em] transition-colors`}
                                    >
                                        {discountApplied > 0 ? 'Remove' : 'Apply'}
                                    </button>
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="border-t border-black pt-6 mb-8 text-sm font-light space-y-4">
                                <div className="flex justify-between items-end text-gray-500">
                                    <span className="uppercase tracking-[0.2em] text-[10px]">Subtotal</span>
                                    <span>₹{cartSubtotal}</span>
                                </div>
                                <div className="flex justify-between items-end text-gray-500">
                                    <span className="uppercase tracking-[0.2em] text-[10px]">Platform Fee</span>
                                    <span>₹{platformFee}</span>
                                </div>
                                <div className="flex justify-between items-end text-gray-500">
                                    <span className="uppercase tracking-[0.2em] text-[10px]">Delivery Charge</span>
                                    <span>{deliveryFee === 0 ? "Complimentary" : `₹${deliveryFee}`}</span>
                                </div>
                                {discountApplied > 0 && (
                                    <div className="flex justify-between items-end text-green-700 font-medium">
                                        <span className="uppercase tracking-[0.2em] text-[10px]">Privilege Applied ({couponCode.toUpperCase()})</span>
                                        <span>- ₹{discountApplied.toFixed(0)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-end text-gray-900 font-medium pt-2">
                                    <span className="uppercase tracking-[0.2em] text-[10px]">Total to Pay</span>
                                    <span className="text-3xl font-serif font-light leading-none">₹{finalTotal.toFixed(0)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-black text-white text-[10px] uppercase tracking-[0.3em] font-light py-5 hover:bg-brand-primary transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? "Processing Authorization..." : `Authorize ₹${finalTotal.toFixed(0)}`}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gray-400">
                                <Lock className="w-3 h-3" strokeWidth={1} />
                                <span>Encrypted Session</span>
                            </div>
                        </div>

                    </div>

                </form>
            </div>
        </div>
    );
}
