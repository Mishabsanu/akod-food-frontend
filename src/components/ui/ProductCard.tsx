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
        <div onClick={handleNavigate} className="group flex flex-col cursor-pointer bg-white relative pb-10">
            {/* Signature Marker */}
            {product.id === "p1" || product.id === "p7" ? (
                <div className="absolute top-4 left-0 z-10 text-[9px] font-light uppercase tracking-[0.2em] text-gray-400 rotate-[-90deg] origin-top-left translate-y-24">
                    Signature
                </div>
            ) : null}

            {/* Image Container */}
            <div className="relative h-[380px] w-full overflow-hidden bg-[#faf9f6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                />
                
                {/* Fast Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out flex justify-center bg-gradient-to-t from-black/20 to-transparent">
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
                <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-3">{product.category}</span>
                <h3 className="text-lg font-serif font-normal text-gray-900 mb-2">
                    {product.name}
                </h3>
                
                <div className="flex items-center justify-center space-x-4">
                    <span className="text-sm font-light text-gray-900">
                        ₹{selectedVariant.price}
                    </span>
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
                        {product.variants.map((v, idx) => (
                            <option key={v.weight} value={idx}>
                                {v.weight}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            {/* Minimalist Hover Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-700 ease-in-out mx-8"></div>
        </div>
    );
}

