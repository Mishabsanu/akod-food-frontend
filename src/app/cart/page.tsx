"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, ShoppingBag, ShieldCheck, Truck } from "lucide-react";

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, cartTotal, cartSubtotal } = useCart();

    if (items.length === 0) {
        return (
            <div className="bg-[#faf9f6] min-h-[70vh] flex flex-col items-center justify-center font-sans p-6">
                <div className="text-center animate-in fade-in zoom-in duration-700">
                    <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-6 stroke-[1]" />
                    <h1 className="text-3xl font-serif text-gray-900 font-light mb-8">Your cart is empty.</h1>
                    <Link href="/products" className="inline-block bg-black text-white text-[10px] uppercase tracking-[0.3em] py-4 px-10 hover:bg-brand-primary transition-all">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fcfcfc] min-h-screen font-sans">
            <div className="max-w-[1300px] mx-auto px-6 py-8 lg:py-12">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                    <div>
                        <h1 className="text-2xl font-serif text-gray-900 font-light tracking-tight">Shopping Cart</h1>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Review your items</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-[9px] uppercase tracking-[0.2em] text-gray-400">
                        <span className="flex items-center gap-2"><ShieldCheck size={12} className="text-brand-primary" /> Secure Checkout</span>
                        <span className="flex items-center gap-2"><Truck size={12} className="text-brand-primary" /> Free Shipping</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Items Section */}
                    <div className="lg:col-span-8">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.cartId} className="bg-white border border-gray-50 p-4 md:p-6 flex items-center gap-6 transition-all hover:border-gray-100 group">
                                    <div className="w-20 h-24 bg-[#faf9f6] flex-shrink-0 overflow-hidden relative">
                                        <Image 
                                            src={item.product.images?.[0] || item.product.image || "/placeholder.png"} 
                                            alt={item.product.name} 
                                            className="w-full h-full object-contain p-2"
                                            width={80}
                                            height={96}
                                        />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <Link href={`/product/${item.product._id}`} className="font-serif text-lg font-light text-gray-900 truncate hover:text-brand-primary transition-colors">
                                                {item.product.name}
                                            </Link>
                                            <button onClick={() => removeFromCart(item.cartId)} className="text-gray-300 hover:text-black p-1 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">
                                            {item.variant.name}{item.variant.unit}
                                        </p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border border-gray-100 rounded-sm">
                                                <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="p-2 text-gray-300 hover:text-black transition-colors">
                                                    <Minus size={10} />
                                                </button>
                                                <span className="w-8 text-center text-[11px] font-medium">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="p-2 text-gray-300 hover:text-black transition-colors">
                                                    <Plus size={10} />
                                                </button>
                                            </div>
                                            <div className="font-serif text-lg font-light text-gray-900">
                                                ₹{(item.variant.sellingPrice || item.variant.price) * item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8">
                            <Link href="/products" className="text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-4">
                        <div className="bg-white border border-gray-100 p-8 shadow-sm">
                            <h2 className="font-serif text-xl text-gray-900 mb-8 font-light">Order Summary</h2>
                            
                            <div className="space-y-4 mb-8 text-[11px] font-medium uppercase tracking-widest">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">₹{cartSubtotal}</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-6 mb-8 flex justify-between items-end">
                                <span className="uppercase tracking-[0.2em] text-[10px] text-gray-400 font-bold">Total Amount</span>
                                <span className="text-3xl font-serif text-gray-900 font-light">₹{cartTotal}</span>
                            </div>
                            
                            <Link href="/checkout" className="block w-full">
                                <button className="w-full bg-black text-white text-[10px] uppercase tracking-[0.3em] font-medium py-5 hover:bg-brand-primary transition-all shadow-xl hover:shadow-brand-primary/10 flex items-center justify-center gap-3">
                                    Checkout <ArrowRight size={14} />
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

const X = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
        width={size || 24} 
        height={size || 24} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);
