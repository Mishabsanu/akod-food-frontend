"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import StarRating from "@/components/ui/StarRating";
import ReviewSection from "@/components/ui/ReviewSection";

export default function ProductViewPage({ params }: { params: { id: string } }) {
    const product = products.find((p) => p.id === params.id);
    const { addToCart } = useCart();
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const defaultImage = product?.image || "";
    const [activeImage, setActiveImage] = useState(defaultImage);

    if (!product) return notFound();

    const selectedVariant = product.variants[selectedVariantIdx];

    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 3);

    // If not enough in category, just grab random items to fill up to 3
    if (relatedProducts.length < 3) {
        const additional = products.filter(p => !relatedProducts.includes(p) && p.id !== product.id);
        relatedProducts.push(...additional.slice(0, 3 - relatedProducts.length));
    }

    const handleAdd = () => {
        addToCart(product, selectedVariant, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-8 pb-32 font-sans selection:bg-brand-primary/20 selection:text-black">
            
            {/* Minimalist Top Navigation */}
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-4 mb-4">
                <Link href="/products" className="inline-flex items-center text-[10px] font-medium text-gray-400 hover:text-black transition-colors uppercase tracking-[0.3em] group">
                    <ArrowLeft className="w-3 h-3 mr-4 transition-transform group-hover:-translate-x-1" strokeWidth={1}/> Return to Complete Portfolio
                </Link>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32 items-start">
                    
                <div className="flex flex-col lg:flex-row gap-6 w-full lg:col-span-1">
                    {/* Thumbnails (Left side on desktop, bottom on mobile) */}
                    <div className="flex lg:flex-col gap-4 order-2 lg:order-1 overflow-x-auto lg:overflow-hidden hide-scrollbar">
                        {product.gallery?.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 border transition-all duration-300 ${activeImage === img ? 'border-black' : 'border-gray-200 opacity-50 hover:opacity-100 hover:border-gray-400'}`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 bg-white border border-gray-100 p-4 lg:p-12 relative h-[50vh] lg:h-[70vh] flex items-center justify-center overflow-hidden group order-1 lg:order-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={activeImage}
                            alt={product.name}
                            className="w-full h-full object-contain cursor-zoom-in transition-transform duration-700 ease-out group-hover:scale-[1.35]"
                        />
                        <div className="absolute top-8 left-8 text-[9px] uppercase tracking-[0.4em] text-gray-400 rotate-[-90deg] origin-top-left translate-y-12 z-10 hidden lg:block">
                            {product.category}
                        </div>
                    </div>
                </div>

                {/* Right Column: Editorial Info */}
                    <div className="flex flex-col pt-8 lg:pt-16">
                        
                        <div className="mb-10">
                            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif text-gray-900 font-light leading-none tracking-tight mb-6">
                                {product.name}
                            </h1>
                            <p className="text-gray-500 font-light text-base leading-relaxed max-w-lg">
                                {product.description}
                            </p>
                        </div>

                        <div className="border-t border-gray-200 py-8">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 block mb-6">Valuation</span>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-serif text-gray-900 font-light">
                                    ₹{selectedVariant.price}
                                </div>
                                <StarRating rating={product.rating} count={product.reviewsCount} showText size={12} />
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="border-t border-gray-200 py-8">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 block mb-6">Curated Quantities</span>
                            <div className="flex flex-wrap gap-4">
                                {product.variants.map((variant, idx) => (
                                    <button
                                        key={variant.weight}
                                        onClick={() => setSelectedVariantIdx(idx)}
                                        className={`px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors border ${
                                            selectedVariantIdx === idx
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 bg-white text-gray-500 hover:border-black hover:text-black"
                                        }`}
                                    >
                                        {variant.weight}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-200 py-8 flex flex-col sm:flex-row gap-6">
                            
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-gray-200 bg-white shadow-sm w-fit">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-6 py-4 text-gray-400 hover:text-black transition-colors"
                                >
                                    <Minus className="w-4 h-4" strokeWidth={1} />
                                </button>
                                <span className="text-sm font-light w-12 text-center text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-6 py-4 text-gray-400 hover:text-black transition-colors"
                                >
                                    <Plus className="w-4 h-4" strokeWidth={1} />
                                </button>
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={handleAdd}
                                className={`flex-1 py-4 text-[10px] uppercase tracking-[0.3em] font-light transition-colors ${
                                    isAdded 
                                    ? "bg-green-700 text-white border border-green-700" 
                                    : "bg-black text-white hover:bg-brand-primary"
                                }`}
                            >
                                {isAdded ? "Secured to Cart" : "Acquire Provision"}
                            </button>
                        </div>
                        
                        {/* Trust Badges */}
                        <div className="pt-8 flex flex-col gap-3">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span> Signature Sourcing
                            </p>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span> Expedited Climate-Controlled Delivery
                            </p>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span> Absolute Satisfaction Guarantee
                            </p>
                        </div>
                    </div>
                </div>

                {/* Review Section */}
                <ReviewSection 
                    productId={product.id} 
                    initialRating={product.rating} 
                    initialReviewsCount={product.reviewsCount} 
                />

                {/* Related Products Section */}
                <div className="pt-20 border-t border-gray-100 pb-16">
                    <div className="mb-12">
                        <p className="text-[9px] uppercase tracking-[0.4em] text-gray-400 mb-2">Curated For You</p>
                        <h2 className="text-3xl font-serif text-gray-900 font-light">Complementary Provisions.</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
