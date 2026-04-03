"use client";

import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { items, updateQuantity, removeFromCart, cartSubtotal } = useCart();
    
    // Sliding Offers Logic
    const offers = [
        "Unlock 10% Off with code LUXURY10",
        "Complimentary delivery above ₹2000",
        "Explore our Signature Jackfruit Range"
    ];
    const [offerIdx, setOfferIdx] = useState(0);

    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            setOfferIdx((prev) => (prev + 1) % offers.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isOpen, offers.length]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl transition-transform duration-500 ease-in-out transform flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-900 font-medium">Your Selection</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 transition-colors rounded-full group">
                        <X className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden font-sans">
                    
                    {/* Sliding Offers Banner */}
                    {items.length > 0 && (
                        <div className="bg-[#faf9f6] py-3 px-4 text-center overflow-hidden border-b border-gray-100 flex-shrink-0 relative">
                            {/* Uses key prop to force re-render/re-animation of tailwind animate-in */}
                            <p key={offerIdx} className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {offers[offerIdx]}
                            </p>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-8">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 text-gray-400">
                                <ShoppingBag className="h-12 w-12 stroke-[0.5]" />
                                <p className="text-xs uppercase tracking-[0.2em]">Your bag is empty.</p>
                                <button 
                                    onClick={onClose}
                                    className="mt-4 border border-black px-8 py-4 text-[9px] uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                                >
                                    Continue Browsing
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {items.map((item) => (
                                    <div key={item.cartId} className="flex gap-6 group">
                                        <div className="w-24 h-32 bg-[#faf9f6] flex-shrink-0 overflow-hidden relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img 
                                                src={item.product.image} 
                                                alt={item.product.name} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-serif text-lg font-light text-gray-900 leading-tight pr-4">
                                                        {item.product.name}
                                                    </h3>
                                                    <button 
                                                        onClick={() => removeFromCart(item.cartId)}
                                                        className="text-gray-300 hover:text-black transition-colors p-1"
                                                    >
                                                        <X className="h-4 w-4" strokeWidth={1} />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                                                    {item.variant.weight}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-end justify-between mt-4">
                                                <div className="flex items-center border border-gray-200">
                                                    <button 
                                                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                        className="px-3 py-2 text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Minus className="h-3 w-3" strokeWidth={1} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-light text-black">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                        className="px-3 py-2 text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" strokeWidth={1} />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-light text-gray-900">
                                                    ₹{item.variant.price * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-8 border-t border-gray-100 bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Subtotal</span>
                            <span className="text-xl font-serif text-gray-900 font-light">₹{cartSubtotal}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-light text-center mb-6">
                            Shipping and taxes calculated at checkout.
                        </p>
                        <Link href="/cart" onClick={onClose} className="block w-full">
                            <button className="w-full bg-black text-white text-[10px] uppercase tracking-[0.3em] font-light py-5 hover:bg-brand-primary transition-colors">
                                Authenticate & Checkout
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
