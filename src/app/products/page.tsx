"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { SlidersHorizontal, ChevronDown, Check, X, Loader2 } from "lucide-react";
import { customerApi } from "@/lib/api";
import { useSearchParams } from "next/navigation";
export default function ShopPage() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");

    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
    const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("featured");
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategories([categoryParam]);
        } else {
            setSelectedCategories([]);
        }
    }, [categoryParam]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    customerApi.getProducts(),
                    customerApi.getCategories()
                ]);
                setAllProducts(prodRes.data.data || []);
                setCategories(catRes.data.data || []);
            } catch (error) {
                console.error("Fetch failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const flavors = ["Classic", "Spicy", "Sweet"];
    const weights = ["50g", "100g", "250g", "500g", "1kg"];

    const toggleCategory = (catId: string) => {
        setSelectedCategories(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]);
    };

    const toggleFlavor = (flavor: string) => {
        setSelectedFlavors(prev => prev.includes(flavor) ? prev.filter(f => f !== flavor) : [...prev, flavor]);
    };

    const toggleWeight = (weight: string) => {
        setSelectedWeights(prev => prev.includes(weight) ? prev.filter(w => w !== weight) : [...prev, weight]);
    };

    const clearAll = () => {
        setSelectedCategories([]);
        setSelectedFlavors([]);
        setSelectedWeights([]);
        setMinPrice("");
        setMaxPrice("");
    };

    const filteredAndSortedProducts = useMemo(() => {
        let result = allProducts.filter(product => {
            // Category Filter
            if (selectedCategories.length > 0) {
                const prodCatId = typeof product.category === 'object' ? product.category._id : product.category;
                if (!selectedCategories.includes(prodCatId)) return false;
            }

            // Flavor Filter (Simulated based on name)
            if (selectedFlavors.length > 0) {
                const nameLower = product.name.toLowerCase();
                const isSpicy = nameLower.includes("spicy");
                const isSweet = nameLower.includes("sweet");
                const isClassic = !isSpicy && !isSweet;

                let flavorMatch = false;
                if (selectedFlavors.includes("Spicy") && isSpicy) flavorMatch = true;
                if (selectedFlavors.includes("Sweet") && isSweet) flavorMatch = true;
                if (selectedFlavors.includes("Classic") && isClassic) flavorMatch = true;

                if (!flavorMatch) return false;
            }

            // Weight Filter
            if (selectedWeights.length > 0) {
                const hasMatch = product.variants?.some((v: any) => selectedWeights.includes(`${v.name}${v.unit}`));
                if (!hasMatch) return false;
            }

            // Price Filter
            const basePrice = product.variants?.length > 0 
                ? Math.min(...product.variants.map((v: any) => v.sellingPrice || 0))
                : product.price;
            
            if (minPrice && basePrice < Number(minPrice)) return false;
            if (maxPrice && basePrice > Number(maxPrice)) return false;

            return true;
        });

        // Sorting
        result.sort((a, b) => {
            const priceA = a.variants?.length > 0 ? Math.min(...a.variants.map((v: any) => v.sellingPrice || 0)) : a.price;
            const priceB = b.variants?.length > 0 ? Math.min(...b.variants.map((v: any) => v.sellingPrice || 0)) : b.price;
            if (sortOption === "price-asc") return priceA - priceB;
            if (sortOption === "price-desc") return priceB - priceA;
            return 0;
        });

        return result;
    }, [allProducts, selectedCategories, selectedFlavors, selectedWeights, minPrice, maxPrice, sortOption]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
            <Loader2 className="w-12 h-12 text-black animate-spin" strokeWidth={1} />
        </div>
    );

    return (
        <div className="bg-[#faf9f6] min-h-screen  pb-32 font-sans selection:bg-brand-primary/20 selection:text-black">
            
            <div className="w-full bg-white border-b border-gray-100 py-10 lg:py-12 mb-8 lg:mb-12">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                    <p className="text-[9px] uppercase tracking-[0.4em] mb-2 font-medium text-gray-400">
                        Our Collection
                    </p>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 font-light leading-none tracking-tight">
                        Our Shop.
                    </h1>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                <div className="flex flex-col lg:flex-row items-start relative gap-8 lg:gap-14">
                    
                    {/* Left Sidebar Filters */}
                    <div className="w-full lg:w-[240px] xl:w-[280px] flex-shrink-0">
                        {/* Mobile Toggle */}
                        <div className="lg:hidden flex justify-between items-center w-full mb-8 border-b border-gray-200 pb-4">
                            <button 
                                className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-medium"
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                            >
                                <SlidersHorizontal className="h-4 w-4" /> {isMobileFilterOpen ? "Close Filters" : "Show Filters"}
                            </button>
                            <div className="relative">
                                <select 
                                    className="appearance-none bg-transparent border-none text-[9px] uppercase tracking-widest font-medium outline-none text-right pr-4"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="featured">Sort: Featured</option>
                                    <option value="price-asc">Price: Lowest</option>
                                    <option value="price-desc">Price: Highest</option>
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black pointer-events-none" />
                            </div>
                        </div>

                        {/* Actual Filters Container */}
                        <div className={`${isMobileFilterOpen ? "block mb-10" : "hidden lg:block"} lg:sticky lg:top-36 lg:h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide pr-4`}>
                            
                            <div className="hidden lg:flex items-center justify-between mb-10 pb-4 border-b border-gray-100">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-900">Refine By</span>
                                {(selectedCategories.length > 0 || selectedFlavors.length > 0 || selectedWeights.length > 0 || minPrice || maxPrice) && (
                                    <button onClick={clearAll} className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Clear</button>
                                )}
                            </div>

                            <div className="mb-12">
                                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-5">Category</h3>
                                <ul className="space-y-4">
                                    {categories.map(cat => (
                                        <li key={cat._id}>
                                            <button onClick={() => toggleCategory(cat._id)} className="flex items-start gap-4 group w-full text-left">
                                                <div className={`flex-shrink-0 w-3.5 h-3.5 mt-0.5 flex items-center justify-center transition-colors ${selectedCategories.includes(cat._id) ? "bg-black border-black" : "border border-gray-300 group-hover:border-black"}`}>
                                                    {selectedCategories.includes(cat._id) && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                                                </div>
                                                <span className={`text-[13px] font-light tracking-wide transition-colors ${selectedCategories.includes(cat._id) ? "text-black" : "text-gray-500 group-hover:text-black"}`}>{cat.name}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-12">
                                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-5">Flavor</h3>
                                <ul className="space-y-4">
                                    {flavors.map(flavor => (
                                        <li key={flavor}>
                                            <button onClick={() => toggleFlavor(flavor)} className="flex items-start gap-4 group w-full text-left">
                                                <div className={`flex-shrink-0 w-3.5 h-3.5 mt-0.5 flex items-center justify-center transition-colors ${selectedFlavors.includes(flavor) ? "bg-black border-black" : "border border-gray-300 group-hover:border-black"}`}>
                                                    {selectedFlavors.includes(flavor) && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                                                </div>
                                                <span className={`text-[13px] font-light tracking-wide transition-colors ${selectedFlavors.includes(flavor) ? "text-black" : "text-gray-500 group-hover:text-black"}`}>{flavor}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-12">
                                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-5">Available Weight</h3>
                                <div className="flex flex-wrap gap-2 lg:gap-3">
                                    {weights.map(weight => (
                                        <button 
                                            key={weight}
                                            onClick={() => toggleWeight(weight)}
                                            className={`px-4 py-2 border text-base tracking-wider uppercase font-light transition-all ${selectedWeights.includes(weight) ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-black hover:text-black"}`}
                                        >
                                            {weight}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-12">
                                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-5">Base Price Range (₹)</h3>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        className="w-full bg-white border border-gray-200 py-3 px-3 text-[13px] font-light outline-none focus:border-black transition-colors placeholder-gray-300"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                    <span className="text-gray-300 font-light">-</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        className="w-full bg-white border border-gray-200 py-3 px-3 text-[13px] font-light outline-none focus:border-black transition-colors placeholder-gray-300"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            {/* Mobile Clear Button */}
                            <div className="lg:hidden text-center mt-6 border-t border-gray-200 pt-6">
                                <button onClick={clearAll} className="text-[9px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-black underline underline-offset-4">Reset All Adjustments</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Product Grid */}
                    <div className="flex-1 w-full min-w-0">
                        
                        {/* Desktop Top Utilities */}
                        <div className="hidden lg:flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
                            <span className="text-[10px] uppercase tracking-widest text-gray-400">
                                {filteredAndSortedProducts.length} Product{filteredAndSortedProducts.length !== 1 && 's'} Found
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Sort By</span>
                                <div className="relative">
                                    <select 
                                        className="appearance-none bg-transparent border-none text-[10px] uppercase tracking-widest cursor-pointer outline-none focus:text-black font-medium text-gray-900 pr-5"
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                    >
                                        <option value="featured">Curated (Featured)</option>
                                        <option value="price-asc">Price (Ascending)</option>
                                        <option value="price-desc">Price (Descending)</option>
                                    </select>
                                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                                {filteredAndSortedProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 px-6 flex flex-col items-center justify-center bg-white border border-gray-100">
                                <X className="h-8 w-8 text-gray-300 mb-6" />
                                <h3 className="text-2xl font-serif text-gray-900 mb-3 font-light">No Products Found.</h3>
                                <p className="text-sm text-gray-500 font-light mb-8 max-w-sm mx-auto">We couldn&apos;t find any products matching your selected filters. Try changing your search.</p>
                                <button 
                                    onClick={clearAll}
                                    className="border border-black px-8 py-4 text-[10px] uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors duration-500"
                                >
                                    Clear All Parameters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


