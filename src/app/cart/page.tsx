"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ArrowRight, Trash2, Minus, Plus } from "lucide-react";

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

    if (items.length === 0) {
        return (
            <div className="bg-[#faf9f6] min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-32 font-sans selection:bg-brand-primary/20 selection:text-black">
                <div className="text-center max-w-lg px-6">
                    <p className="text-[9px] uppercase tracking-[0.4em] mb-4 font-medium text-gray-400">
                        Shopping Bag
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 font-light mb-8">
                        Your bag is currently empty.
                    </h1>
                    <Link href="/products" className="inline-block bg-black text-white text-[10px] uppercase tracking-[0.3em] font-light py-5 px-12 hover:bg-brand-primary transition-colors">
                        Explore Collection
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-8 pb-32 font-sans selection:bg-brand-primary/20 selection:text-black">
            
            {/* Ultra-Premium Header */}
            <div className="w-full bg-white border-b border-gray-100 py-10 lg:py-16 mb-8 lg:mb-12">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                    <p className="text-[9px] uppercase tracking-[0.4em] mb-4 font-medium text-gray-400">
                        Review Selection
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-[4rem] font-serif text-gray-900 font-light leading-none tracking-tight">
                        Shopping Bag.
                    </h1>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative items-start">
                    
                    {/* Cart Items */}
                    <div className="lg:col-span-8 flex flex-col space-y-8">
                        
                        {/* Desktop Header */}
                        <div className="hidden md:grid grid-cols-12 text-[9px] uppercase tracking-[0.3em] text-gray-400 border-b border-gray-200 pb-4">
                            <div className="col-span-7">Product Detail</div>
                            <div className="col-span-3 text-center">Quantity</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>

                        {items.map((item) => (
                            <div key={item.cartId} className="flex flex-col md:grid md:grid-cols-12 items-center gap-6 md:gap-0 py-6 border-b border-gray-100 group relative">
                                
                                {/* Product Info */}
                                <div className="w-full md:col-span-7 flex items-center gap-8">
                                    <div className="w-24 h-32 md:w-32 md:h-44 bg-white border border-gray-100 flex-shrink-0 overflow-hidden relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={item.product.image} 
                                            alt={item.product.name} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 py-2">
                                        <Link href={`/product/${item.product.id}`} className="font-serif text-xl lg:text-2xl font-light text-gray-900 hover:text-black leading-tight mb-2">
                                            {item.product.name}
                                        </Link>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4">
                                            {item.variant.weight}
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.cartId)} 
                                            className="text-[9px] uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 self-start transition-colors border-b border-transparent hover:border-red-500 pb-1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Quantity Mobile & Desktop */}
                                <div className="w-full md:w-auto md:col-span-3 flex justify-between md:justify-center items-center">
                                    <span className="md:hidden text-[9px] uppercase tracking-[0.3em] text-gray-400">Quantity</span>
                                    <div className="flex items-center border border-gray-200 bg-white">
                                        <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="px-4 py-3 text-gray-400 hover:text-black hover:bg-gray-50 transition-colors">
                                            <Minus className="w-3 h-3" strokeWidth={1} />
                                        </button>
                                        <span className="w-10 text-center text-xs font-light text-black">
                                            {item.quantity}
                                        </span>
                                        <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="px-4 py-3 text-gray-400 hover:text-black hover:bg-gray-50 transition-colors">
                                            <Plus className="w-3 h-3" strokeWidth={1} />
                                        </button>
                                    </div>
                                </div>

                                {/* Total Mobile & Desktop */}
                                <div className="w-full md:w-auto md:col-span-2 flex justify-between md:justify-end items-center">
                                    <span className="md:hidden text-[9px] uppercase tracking-[0.3em] text-gray-400">Total</span>
                                    <div className="font-light text-lg text-gray-900 tracking-wide">
                                        ₹{item.variant.price * item.quantity}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Order Summary sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-36 bg-white border border-gray-100 p-8 lg:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                        <h2 className="font-serif text-2xl text-gray-900 mb-8 font-light border-b border-gray-100 pb-6">Order Summary.</h2>
                        
                        <div className="space-y-6 mb-8 text-sm font-light">
                            <div className="flex justify-between text-gray-600">
                                <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span className="uppercase tracking-widest text-[10px]">Estimated Shipping</span>
                                <span className="uppercase tracking-widest text-[10px]">Calculated at checkout</span>
                            </div>
                        </div>
                        
                        <div className="border-t border-black pt-6 mb-10 flex justify-between items-end">
                            <span className="uppercase tracking-[0.2em] text-[10px] text-gray-900 font-medium">Total</span>
                            <span className="text-3xl font-serif text-gray-900 font-light leading-none">₹{cartTotal}</span>
                        </div>
                        
                        <Link href="/checkout" className="block w-full">
                            <button className="w-full bg-black text-white text-[10px] uppercase tracking-[0.3em] font-light py-5 hover:bg-brand-primary transition-colors flex items-center justify-center gap-3 group">
                                Authenticate & Checkout 
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1} />
                            </button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
