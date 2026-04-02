"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ProductViewPage({ params }: { params: { id: string } }) {
    const product = products.find((p) => p.id === params.id);
    const { addToCart } = useCart();
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);

    if (!product) return notFound();

    const selectedVariant = product.variants[selectedVariantIdx];

    const handleAdd = () => {
        addToCart(product, selectedVariant, quantity);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <Link href="/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-primary transition-colors mb-8 uppercase tracking-wider">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                {/* Product Image */}
                <div className="relative rounded-3xl overflow-hidden bg-brand-bgAccent h-[400px] md:h-[500px] shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center">
                    <div className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">
                        {product.category}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif text-brand-text mb-6">
                        {product.name}
                    </h1>
                    <p className="text-lg text-gray-600 font-light mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="text-3xl font-medium text-brand-text mb-8">
                        ₹{selectedVariant.price}
                    </div>

                    {/* Variants */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-text mb-4">Pack Size</h3>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map((variant, idx) => (
                                <button
                                    key={variant.weight}
                                    onClick={() => setSelectedVariantIdx(idx)}
                                    className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${selectedVariantIdx === idx
                                            ? "bg-brand-text text-white shadow-md scale-105"
                                            : "bg-white text-gray-600 border border-gray-200 hover:border-brand-text"
                                        }`}
                                >
                                    {variant.weight}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 mb-8">
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 text-brand-text">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="text-2xl font-light hover:text-brand-primary px-2"
                            >
                                -
                            </button>
                            <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="text-2xl font-light hover:text-brand-primary px-2"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleAdd}
                            className="flex-1 bg-brand-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-brand-text transition-colors duration-300 shadow-md"
                        >
                            Add to Bag
                        </button>
                    </div>

                    <div className="pt-8 border-t border-gray-200">
                        <p className="text-xs text-gray-400 font-light flex items-center gap-2">
                            <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Premium Ingredients &nbsp;&bull;&nbsp; Fast Delivery
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
