"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Minus, Plus, Loader2, ShieldCheck, Flame, Leaf, PackageCheck, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ZoomIn, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import StarRating from "@/components/ui/StarRating";
import ReviewSection from "@/components/ui/ReviewSection";
import { customerApi } from "@/lib/api";

export default function ProductViewPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [activeImage, setActiveImage] = useState("");
    
    // Interactive Mouse Lens Zoom State
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

    const [thumbStartIdx, setThumbStartIdx] = useState(0);
    const VISIBLE_COUNT = 4;

    // Accordion state
    const [openTab, setOpenTab] = useState<string | null>("ingredients");

    const toggleTab = (tab: string) => {
        setOpenTab(openTab === tab ? null : tab);
    };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const res = await customerApi.getProductById(params.id);
                const prod = res.data.data;
                setProduct(prod);
                setActiveImage(prod.images?.[0] || prod.image || "/placeholder.png");

                // Fetch related products
                const allRes = await customerApi.getProducts();
                const allProds = allRes.data.data || [];
                const catId = typeof prod.category === 'object' ? prod.category._id : prod.category;
                const related = allProds
                    .filter((p: any) => {
                        const pCatId = typeof p.category === 'object' ? p.category._id : p.category;
                        return pCatId === catId && p._id !== prod._id;
                    })
                    .slice(0, 3);
                setRelatedProducts(related);
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [params.id]);

    if (loading) return (
        <div className="bg-[#faf9f6] min-h-screen font-sans py-8">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 animate-pulse">
                {/* Breadcrumbs Skeleton */}
                <div className="h-4 bg-stone-200 w-48 mb-8"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    {/* Left Images Stage Skeleton */}
                    <div className="lg:col-span-6 flex gap-4">
                        <div className="hidden sm:flex flex-col gap-2.5 w-[90px]">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="w-[90px] h-[105px] bg-stone-200"></div>
                            ))}
                        </div>
                        <div className="flex-1 aspect-square bg-stone-200"></div>
                    </div>

                    {/* Right Details Skeleton */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="h-3 bg-stone-200 w-24"></div>
                        <div className="h-10 bg-stone-200 w-3/4"></div>
                        <div className="h-6 bg-stone-200 w-32"></div>
                        <div className="h-16 bg-stone-200 w-full"></div>
                        <div className="h-12 bg-stone-200 w-full"></div>
                        <div className="h-14 bg-stone-900/20 w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!product) return notFound();

    const productImages = product.images && product.images.length > 0 
        ? product.images 
        : [product.image || "/placeholder.png"];

    const switchImage = (newIdx: number) => {
        if (!productImages[newIdx]) return;
        setActiveImage(productImages[newIdx]);
        if (newIdx < thumbStartIdx) {
            setThumbStartIdx(newIdx);
        } else if (newIdx >= thumbStartIdx + VISIBLE_COUNT) {
            setThumbStartIdx(Math.max(0, newIdx - VISIBLE_COUNT + 1));
        }
    };

    const selectedVariant = product.variants?.[selectedVariantIdx] || { sellingPrice: product.price, name: "Standard", unit: "" };
    const categoryName = typeof product.category === 'object' ? product.category.name : product.category || "Snacks";
    const currentPrice = selectedVariant.sellingPrice || selectedVariant.price || product.price;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
        setZoomPos({ x, y });
    };

    const handleAdd = () => {
        addToCart(product, selectedVariant, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(product, selectedVariant, quantity);
        router.push("/cart");
    };

    return (
        <div className="bg-[#faf9f6] min-h-screen font-sans selection:bg-brand-primary/20 selection:text-black pb-32">
            
            {/* Breadcrumbs Strip */}
            <div className="w-full bg-white border-b border-gray-200 py-3.5 px-6 sm:px-12 mb-8">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-black transition-colors">Shop</Link>
                        <span>/</span>
                        <span className="text-brand-primary truncate max-w-[150px] sm:max-w-none">{product.name}</span>
                    </div>

                    <Link 
                        href="/products" 
                        className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] font-medium text-gray-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        <span className="hidden sm:inline">Back to Collection</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                
                {/* Main Product Showcase Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-24">
                    
                    {/* Left Column: Image Stage & High-End Thumbnails */}
                    <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 sm:gap-5 items-start">
                        
                        {/* Left Thumbnails Column with Up/Down Buttons (No scrollbars) */}
                        {productImages.length > 1 && (
                            <div className="flex sm:flex-col items-center gap-2 w-full sm:w-[90px] flex-shrink-0">
                                
                                {/* Up Arrow (Desktop) / Left Arrow (Mobile) */}
                                {productImages.length > VISIBLE_COUNT && (
                                    <button
                                        onClick={() => setThumbStartIdx(prev => Math.max(0, prev - 1))}
                                        disabled={thumbStartIdx === 0}
                                        className="w-7 h-7 sm:w-full sm:h-7 bg-white border border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors shadow-sm"
                                        aria-label="Previous thumbnails"
                                    >
                                        <ChevronUp className="w-4 h-4 hidden sm:block" />
                                        <ChevronLeft className="w-4 h-4 sm:hidden" />
                                    </button>
                                )}

                                {/* Paged Thumbnails List */}
                                <div className="flex sm:flex-col gap-2.5 overflow-hidden w-full items-center">
                                    {productImages.slice(thumbStartIdx, thumbStartIdx + VISIBLE_COUNT).map((img: string, i: number) => {
                                        const actualIdx = thumbStartIdx + i;
                                        const isSelected = (activeImage || productImages[0]) === img;
                                        return (
                                            <button 
                                                key={actualIdx}
                                                onClick={() => switchImage(actualIdx)}
                                                className={`w-16 h-20 sm:w-[90px] sm:h-[105px] bg-[#faf9f6] flex-shrink-0 border transition-all duration-300 relative p-1.5 flex items-center justify-center group ${
                                                    isSelected 
                                                        ? 'border-2 border-black bg-white shadow-md' 
                                                        : 'border-gray-200/90 opacity-70 hover:opacity-100 hover:border-gray-400'
                                                }`}
                                                aria-label={`View photo ${actualIdx + 1}`}
                                            >
                                                {/* Micro Number Marker */}
                                                <span className={`absolute top-1 left-1.5 text-[8px] font-mono font-medium px-1 ${isSelected ? 'bg-black text-white' : 'text-gray-400 group-hover:text-black'}`}>
                                                    0{actualIdx + 1}
                                                </span>

                                                <Image 
                                                    src={img} 
                                                    alt={`${product.name} ${actualIdx + 1}`} 
                                                    fill
                                                    sizes="90px"
                                                    className="object-contain p-2" 
                                                />

                                                {/* Active side indicator */}
                                                {isSelected && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black hidden sm:block"></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Down Arrow (Desktop) / Right Arrow (Mobile) */}
                                {productImages.length > VISIBLE_COUNT && (
                                    <button
                                        onClick={() => setThumbStartIdx(prev => Math.min(productImages.length - VISIBLE_COUNT, prev + 1))}
                                        disabled={thumbStartIdx + VISIBLE_COUNT >= productImages.length}
                                        className="w-7 h-7 sm:w-full sm:h-7 bg-white border border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors shadow-sm"
                                        aria-label="Next thumbnails"
                                    >
                                        <ChevronDown className="w-4 h-4 hidden sm:block" />
                                        <ChevronRight className="w-4 h-4 sm:hidden" />
                                    </button>
                                )}

                            </div>
                        )}

                        {/* Main Stage with Interactive Cursor-Tracking Magnifier */}
                        <div 
                            onMouseEnter={() => setIsZooming(true)}
                            onMouseLeave={() => setIsZooming(false)}
                            onMouseMove={handleMouseMove}
                            className="flex-1 w-full bg-white border border-gray-200 relative h-[400px] sm:h-[500px] lg:h-[560px] flex items-center justify-center overflow-hidden cursor-crosshair group shadow-sm"
                        >
                            {/* Inner Scaling Container that tracks exact cursor coordinates */}
                            <div 
                                className="relative w-full h-full flex items-center justify-center p-6 sm:p-10 pointer-events-none select-none"
                                style={{
                                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                    transform: isZooming ? "scale(2.5)" : "scale(1)",
                                    transition: isZooming ? "transform 0.05s ease-out" : "transform 0.35s ease-out"
                                }}
                            >
                                <Image
                                    src={activeImage || productImages[0]}
                                    alt={product.name}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-contain p-4 select-none"
                                />
                            </div>
                            
                            {/* Signature / Origin Badge */}
                            <div className="absolute top-4 left-4 bg-black text-white text-[8px] uppercase tracking-[0.25em] px-2.5 py-1 font-medium z-10 pointer-events-none">
                                Pure Coconut Oil
                            </div>

                            {/* Floating "Hover to Magnify" hint */}
                            {!isZooming && (
                                <div className="absolute bottom-4 right-4 bg-white/95 border border-gray-200 text-gray-700 px-3 py-1.5 text-[9px] uppercase tracking-wider flex items-center gap-1.5 pointer-events-none z-10 shadow-sm backdrop-blur-sm">
                                    <ZoomIn className="w-3.5 h-3.5 text-brand-primary" />
                                    <span>Hover to Magnify</span>
                                </div>
                            )}

                            {/* Main Stage Prev & Next Image Arrows */}
                            {productImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const currentIdx = productImages.indexOf(activeImage || productImages[0]);
                                            const prevIdx = (currentIdx - 1 + productImages.length) % productImages.length;
                                            switchImage(prevIdx);
                                        }}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition-colors z-20 shadow-sm opacity-0 group-hover:opacity-100 duration-200"
                                        aria-label="Previous photo"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const currentIdx = productImages.indexOf(activeImage || productImages[0]);
                                            const nextIdx = (currentIdx + 1) % productImages.length;
                                            switchImage(nextIdx);
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition-colors z-20 shadow-sm opacity-0 group-hover:opacity-100 duration-200"
                                        aria-label="Next photo"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Editorial Product Information */}
                    <div className="lg:col-span-6 flex flex-col pt-1 lg:pt-2">
                        
                        {/* Header & Title */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-brand-primary">
                                    {categoryName}
                                </span>
                                <span className="text-gray-300">&bull;</span>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                                    Handmade in Kerala
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 font-light leading-tight tracking-tight mb-3">
                                {product.name}
                            </h1>

                            {/* Reviews rating */}
                            <div className="flex items-center gap-3 pt-1">
                                <StarRating rating={product.rating || 5} size={13} />
                                <span className="text-xs text-gray-500 font-light">
                                    {product.reviewsCount || 0} customer reviews
                                </span>
                            </div>
                        </div>

                        {/* Pricing & Offer */}
                        <div className="py-5 border-y border-gray-200/80 mb-6 bg-white/50 -mx-6 px-6 sm:mx-0 sm:px-4 sm:border sm:border-gray-200">
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl sm:text-4xl font-serif font-light text-gray-900">
                                    ₹{currentPrice}
                                </span>
                                <span className="text-xs font-light text-gray-400">
                                    Inclusive of all taxes
                                </span>
                            </div>
                            <p className="text-[11px] text-green-700 font-medium mt-1 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                In Stock &bull; Dispatches in 24 Hours
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 font-light leading-relaxed mb-6">
                            {product.description || "Authentic South Indian delicacy crafted by hand in pure coconut oil and small wood-fire brass kettles."}
                        </p>

                        {/* Weight Variants */}
                        {product.variants?.length > 0 && (
                            <div className="mb-6">
                                <label className="text-[10px] uppercase tracking-[0.25em] font-medium text-gray-700 block mb-3">
                                    Select Weight / Pack Size
                                </label>
                                <div className="flex flex-wrap gap-2.5">
                                    {product.variants.map((variant: any, idx: number) => {
                                        const isSelected = selectedVariantIdx === idx;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedVariantIdx(idx)}
                                                className={`px-5 py-3 text-xs uppercase tracking-wider font-medium transition-all border ${
                                                    isSelected 
                                                        ? "border-black bg-black text-white shadow-sm" 
                                                        : "border-gray-200 bg-white text-gray-700 hover:border-black"
                                                }`}
                                            >
                                                <span>{variant.name || variant.weight}{variant.unit || ''}</span>
                                                <span className={`ml-2 text-[10px] ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                                                    ₹{variant.sellingPrice || variant.price || currentPrice}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity & CTA Buttons */}
                        <div className="space-y-3 mb-8">
                            <div className="flex flex-col sm:flex-row gap-3">
                                
                                {/* Stepper */}
                                <div className="flex items-center border border-gray-300 bg-white h-12 w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 h-full text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-10 text-center text-sm font-medium text-black">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 h-full text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    onClick={handleAdd}
                                    className={`flex-1 h-12 text-[10px] uppercase tracking-[0.25em] font-medium transition-all shadow-sm ${
                                        isAdded 
                                            ? "bg-green-700 text-white" 
                                            : "bg-black text-white hover:bg-brand-primary hover:text-black"
                                    }`}
                                >
                                    {isAdded ? "Added to Cart ✓" : "Add to Cart"}
                                </button>
                            </div>

                            {/* Buy Now Button */}
                            <button
                                onClick={handleBuyNow}
                                className="w-full h-12 bg-[#faf9f6] border border-black text-black text-[10px] uppercase tracking-[0.25em] font-medium hover:bg-black hover:text-white transition-colors"
                            >
                                Instant Checkout
                            </button>
                        </div>

                        {/* Accordion Tabs */}
                        <div className="border-t border-gray-200 divide-y divide-gray-200">
                            
                            {/* Tab 1: Ingredients & Dietary */}
                            <div>
                                <button 
                                    onClick={() => toggleTab("ingredients")}
                                    className="w-full py-4 flex items-center justify-between text-left text-xs uppercase tracking-widest font-medium text-gray-900 hover:text-brand-primary transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <Leaf className="w-3.5 h-3.5 text-brand-primary" /> Ingredients & Purity
                                    </span>
                                    {openTab === "ingredients" ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>
                                {openTab === "ingredients" && (
                                    <div className="pb-4 text-xs font-light text-gray-600 leading-relaxed space-y-2 animate-in fade-in duration-200">
                                        <p>Raw Kerala Nendran Bananas, 100% Pure Cold-Pressed Coconut Oil, Natural Rock Salt, Heritage Spice Blends.</p>
                                        <p className="text-stone-500 font-normal">&bull; 100% Vegetarian &bull; Zero Palm Oil &bull; Zero Artificial Preservatives</p>
                                    </div>
                                )}
                            </div>

                            {/* Tab 2: Sourcing & Method */}
                            <div>
                                <button 
                                    onClick={() => toggleTab("craft")}
                                    className="w-full py-4 flex items-center justify-between text-left text-xs uppercase tracking-widest font-medium text-gray-900 hover:text-brand-primary transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <Flame className="w-3.5 h-3.5 text-brand-primary" /> The AKOD Craft
                                    </span>
                                    {openTab === "craft" ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>
                                {openTab === "craft" && (
                                    <div className="pb-4 text-xs font-light text-gray-600 leading-relaxed space-y-2 animate-in fade-in duration-200">
                                        <p>Prepared in traditional wood-fire brass kettles in small artisanal batches to lock in natural crispness and distinctive golden aroma.</p>
                                    </div>
                                )}
                            </div>

                            {/* Tab 3: Shipping & Delivery */}
                            <div>
                                <button 
                                    onClick={() => toggleTab("shipping")}
                                    className="w-full py-4 flex items-center justify-between text-left text-xs uppercase tracking-widest font-medium text-gray-900 hover:text-brand-primary transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <PackageCheck className="w-3.5 h-3.5 text-brand-primary" /> Delivery & Freshness
                                    </span>
                                    {openTab === "shipping" ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>
                                {openTab === "shipping" && (
                                    <div className="pb-4 text-xs font-light text-gray-600 leading-relaxed space-y-2 animate-in fade-in duration-200">
                                        <p>Secure multi-layer foil packaging for lasting crunch. Delivered directly to your doorstep across India.</p>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
                            <div className="p-3 bg-white border border-gray-200">
                                <ShieldCheck className="w-4 h-4 text-brand-primary mx-auto mb-1" />
                                <span className="text-[9px] uppercase tracking-wider text-gray-600 font-medium block">Pure Origin</span>
                            </div>
                            <div className="p-3 bg-white border border-gray-200">
                                <Flame className="w-4 h-4 text-brand-primary mx-auto mb-1" />
                                <span className="text-[9px] uppercase tracking-wider text-gray-600 font-medium block">Wood-Fire</span>
                            </div>
                            <div className="p-3 bg-white border border-gray-200">
                                <PackageCheck className="w-4 h-4 text-brand-primary mx-auto mb-1" />
                                <span className="text-[9px] uppercase tracking-wider text-gray-600 font-medium block">Fresh Pack</span>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Reviews Section */}
                <ReviewSection productId={product._id} />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="pt-20 border-t border-gray-200 mt-20">
                        <div className="mb-12 text-center max-w-md mx-auto">
                            <span className="text-[9px] uppercase tracking-[0.35em] text-brand-primary font-medium block mb-2">Curated Pairing</span>
                            <h2 className="text-3xl font-serif text-gray-900 font-light">Complementary Flavours</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
