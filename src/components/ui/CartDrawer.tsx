"use client";

import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { items, updateQuantity, removeFromCart, cartSubtotal } = useCart();
    
    // Sliding Offers Logic
    const offers = [
        "Free delivery on all orders today",
        "Get 10% Off with code LUXURY10",
        "New items added to our collection"
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
                className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] shadow-2xl transition-transform duration-500 ease-in-out transform flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-[11px] uppercase tracking-[0.2em] text-gray-900 font-bold">Your Cart</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-50 transition-colors rounded-full group">
                        <X className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden font-sans">
                    
                    {/* Sliding Offers Banner */}
                    {items.length > 0 && (
                        <div className="bg-[#faf9f6] py-2.5 px-4 text-center overflow-hidden border-b border-gray-100 flex-shrink-0 relative">
                            <p key={offerIdx} className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {offers[offerIdx]}
                            </p>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-6 py-5">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-5 text-gray-400 py-12">
                                <ShoppingBag className="h-10 w-10 stroke-[0.5]" />
                                <p className="text-xs uppercase tracking-[0.2em]">Your cart is empty.</p>
                                <button 
                                    onClick={onClose}
                                    className="mt-2 border border-black px-6 py-3 text-[9px] uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.cartId} className="flex gap-4 group pb-4 border-b border-gray-50 last:border-b-0 last:pb-0">
                                        <div className="w-16 h-20 bg-[#faf9f6] flex-shrink-0 overflow-hidden relative">
                                            <Image 
                                                src={item.product.images?.[0] || item.product.image || "/placeholder.png"} 
                                                alt={item.product.name} 
                                                className="w-full h-full object-contain p-1.5"
                                                width={64}
                                                height={80}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-serif text-base font-light text-gray-900 leading-tight pr-3">
                                                        {item.product.name}
                                                    </h3>
                                                    <button 
                                                        onClick={() => removeFromCart(item.cartId)}
                                                        className="text-gray-300 hover:text-black transition-colors p-0.5"
                                                    >
                                                        <X className="h-4 w-4" strokeWidth={1} />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                                                    {item.variant.name}{item.variant.unit || ''}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-end justify-between mt-2">
                                                <div className="flex items-center border border-gray-100 rounded-sm">
                                                    <button 
                                                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                        className="px-2 py-1 text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Minus className="h-3 w-3" strokeWidth={1} />
                                                    </button>
                                                    <span className="w-6 text-center text-xs font-medium text-black">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                        className="px-2 py-1 text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" strokeWidth={1} />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-light text-gray-900">
                                                    ₹{(item.variant.sellingPrice || item.variant.price || item.product.price) * item.quantity}
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
                    <div className="p-6 border-t border-gray-100 bg-white">
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Subtotal</span>
                            <span className="text-xl font-serif text-gray-900 font-light">₹{cartSubtotal}</span>
                        </div>
                        <Link href="/cart" onClick={onClose} className="block w-full">
                            <button className="w-full bg-black text-white text-[10px] uppercase tracking-[0.3em] font-medium py-4 hover:bg-brand-primary transition-all duration-500 shadow-lg hover:shadow-brand-primary/10">
                                View Cart & Checkout
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
