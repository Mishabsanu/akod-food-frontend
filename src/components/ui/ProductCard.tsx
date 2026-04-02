"use client"
import React, { useState } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
    const selectedVariant = product.variants[selectedVariantIdx];

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, selectedVariant, 1);
    };

    const handleNavigate = () => {
        router.push(`/product/${product.id}`);
    };

    return (
        <div onClick={handleNavigate} className="group flex flex-col bg-brand-box rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-bgAccent cursor-pointer h-full">
            <div className="relative h-[320px] w-full overflow-hidden bg-[#fbfbfb]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 z-10 bg-brand-primary text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-full shadow-md">
                    {product.category}
                </div>
            </div>

            <div className="flex flex-col flex-grow p-6">
                <h3 className="text-lg font-serif font-semibold text-brand-text mb-2 line-clamp-1 group-hover:text-brand-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 font-light mb-6 flex-grow line-clamp-2">
                    {product.description}
                </p>

                <div className="flex flex-col space-y-4 pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-medium text-brand-text">
                            ₹{selectedVariant.price}
                        </span>
                        <select
                            className="bg-brand-bgLight border border-gray-200 text-brand-text text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2 transition-colors cursor-pointer"
                            value={selectedVariantIdx}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                                e.stopPropagation();
                                setSelectedVariantIdx(Number(e.target.value));
                            }}
                        >
                            {product.variants.map((v, idx) => (
                                <option key={v.weight} value={idx}>
                                    {v.weight}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="w-full bg-brand-text text-white py-3 px-4 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-brand-primary transition-colors duration-300"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
