"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-4xl font-serif text-brand-text mb-6">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven't added any luxury treats yet.</p>
                <Link href="/products" className="bg-brand-primary text-white px-8 py-4 rounded-xl uppercase tracking-widest text-sm font-semibold hover:bg-brand-text transition-colors duration-300">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-serif text-brand-text mb-12 border-b border-gray-200 pb-4">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div key={item.cartId} className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-brand-bgAccent flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1">
                                <Link href={`/product/${item.product.id}`} className="font-serif font-semibold text-brand-text hover:text-brand-primary text-lg line-clamp-1">
                                    {item.product.name}
                                </Link>
                                <div className="text-sm text-gray-500 mt-1 uppercase tracking-wider">{item.variant.weight}</div>
                                <div className="text-brand-text font-medium mt-2">₹{item.variant.price}</div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                    <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-50">-</button>
                                    <span className="px-3 py-1 text-sm font-medium border-x border-gray-200">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-50">+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-brand-box rounded-2xl p-8 border border-brand-bgAccent h-fit sticky top-28">
                    <h2 className="font-serif text-2xl text-brand-text mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className="text-brand-primary text-sm font-semibold uppercase">Free</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mb-8 flex justify-between items-center text-xl font-bold text-brand-text">
                        <span>Total</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    <Link href="/checkout" className="w-full flex items-center justify-center bg-brand-primary text-white py-4 rounded-xl uppercase tracking-widest text-sm font-semibold hover:bg-brand-text transition-colors duration-300">
                        Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
