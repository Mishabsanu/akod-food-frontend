"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Instagram, Play } from "lucide-react";
import StarRating from "./StarRating";

export default function ProductCard({ product }: { product: any }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
    const selectedVariant = product.variants?.[selectedVariantIdx] || { sellingPrice: product.price, name: 'Default', unit: '' };

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, selectedVariant, 1);
    };

    const handleNavigate = () => {
        router.push(`/product/${product._id || product.id}`);
    };

    return (
        <div onClick={handleNavigate} className="group flex flex-col cursor-pointer bg-white relative pb-10 h-full">
            {/* Signature Marker */}
            {product.isFeatured && (
                <div className="absolute top-4 left-0 z-10 text-[9px] font-light uppercase tracking-[0.2em] text-[#e7ab79] rotate-[-90deg] origin-top-left translate-y-24">
                    Signature
                </div>
            )}

            {/* Reel / Video Badge */}
            {(product.instagramVideoUrl || product.videoUrl) && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-gray-200 text-gray-800 text-[8px] font-medium uppercase tracking-widest shadow-sm rounded-full group-hover:border-black transition-colors">
                    {product.instagramVideoUrl ? (
                        <Instagram className="w-3 h-3 text-[#dc2743]" />
                    ) : (
                        <Play className="w-2.5 h-2.5 text-black fill-black" />
                    )}
                    <span>Reel</span>
                </div>
            )}

            {/* Image Container */}
            <div className="relative h-[380px] w-full overflow-hidden bg-[#faf9f6] flex items-center justify-center p-8">
                <Image
                    src={product.images?.[0] || product.image || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="max-h-full max-w-full object-contain transition-transform duration-1000 ease-in-out group-hover:scale-105 p-8"
                />
                
                {/* Fast Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out flex justify-center bg-gradient-to-t from-black/5 to-transparent">
                    <button 
                        onClick={handleAdd}
                        className="bg-black text-white text-[10px] uppercase tracking-[0.2em] font-light py-3 px-8 hover:bg-brand-primary transition-colors"
                    >
                        Quick Add
                    </button>
                </div>
            </div>

            {/* Info Container */}
            <div className="flex flex-col pt-6 text-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-3">
                    {product.flavor || "Artisanal Kerala Chips"}
                </span>
                <h3 className="text-lg font-serif font-normal text-gray-900 mb-2 uppercase tracking-tight italic">
                    {product.name}
                </h3>
                
                <div className="flex flex-col items-center gap-1 mb-4">
                    <StarRating rating={product.rating || 5} size={10} />
                    <span className="text-[8px] uppercase tracking-[0.2em] text-gray-400">
                        {product.reviewsCount || 0} Reviews
                    </span>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                    <span className="text-sm font-light text-gray-900">
                        ₹{selectedVariant.sellingPrice || selectedVariant.price || product.price}
                    </span>
                    {product.variants?.length > 0 && (
                        <>
                            <span className="text-gray-300">|</span>
                            <select
                                className="bg-transparent border-none text-gray-500 text-[11px] tracking-[0.1em] cursor-pointer outline-none hover:text-black transition-colors"
                                value={selectedVariantIdx}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    setSelectedVariantIdx(Number(e.target.value));
                                }}
                            >
                                {product.variants.map((v: any, idx: number) => (
                                    <option key={idx} value={idx}>
                                        {v.name || v.weight}{v.unit || ''}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>
            </div>
            
            {/* Minimalist Hover Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-700 ease-in-out mx-8"></div>
        </div>
    );
}
