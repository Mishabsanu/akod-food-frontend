"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { SlidersHorizontal, ChevronDown, Check, X, Loader2, ArrowUpDown, Tag, RotateCcw } from "lucide-react";
import { customerApi } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

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

    const pricePresets = [
        { label: "Under ₹100", min: "", max: "100" },
        { label: "₹100 – ₹250", min: "100", max: "250" },
        { label: "₹250 – ₹500", min: "250", max: "500" },
        { label: "Above ₹500", min: "500", max: "" },
    ];

    const sortOptionsList = [
        { id: "featured", label: "Featured Collection" },
        { id: "price-asc", label: "Price: Low to High" },
        { id: "price-desc", label: "Price: High to Low" },
        { id: "rating-desc", label: "Highest Rated" },
        { id: "name-asc", label: "Alphabetical (A-Z)" },
    ];

    const toggleCategory = (catId: string) => {
        setSelectedCategories(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]);
    };

    const toggleFlavor = (flavor: string) => {
        setSelectedFlavors(prev => prev.includes(flavor) ? prev.filter(f => f !== flavor) : [...prev, flavor]);
    };

    const toggleWeight = (weight: string) => {
        setSelectedWeights(prev => prev.includes(weight) ? prev.filter(w => w !== weight) : [...prev, weight]);
    };

    const applyPricePreset = (presetMin: string, presetMax: string) => {
        if (minPrice === presetMin && maxPrice === presetMax) {
            setMinPrice("");
            setMaxPrice("");
        } else {
            setMinPrice(presetMin);
            setMaxPrice(presetMax);
        }
    };

    const clearAll = () => {
        setSelectedCategories([]);
        setSelectedFlavors([]);
        setSelectedWeights([]);
        setMinPrice("");
        setMaxPrice("");
        setSortOption("featured");
    };

    // Robust category name resolver
    const activeCategoryObject = useMemo(() => {
        if (selectedCategories.length === 1) {
            const selId = selectedCategories[0];
            return categories.find(c => String(c._id) === String(selId) || c.name.toLowerCase() === String(selId).toLowerCase()) || null;
        }
        return null;
    }, [selectedCategories, categories]);

    const activeFilterCount = selectedCategories.length + selectedFlavors.length + selectedWeights.length + (minPrice || maxPrice ? 1 : 0) + (sortOption !== "featured" ? 1 : 0);

    const filteredAndSortedProducts = useMemo(() => {
        let result = allProducts.filter(product => {
            // Category Filter (support ObjectId string, populated object, or exact name)
            if (selectedCategories.length > 0) {
                const prodCatId = typeof product.category === 'object' ? String(product.category?._id || '') : String(product.category || '');
                const prodCatName = typeof product.category === 'object' ? String(product.category?.name || '') : String(product.category || '');
                
                const matches = selectedCategories.some(selId => {
                    if (String(prodCatId) === String(selId)) return true;
                    if (String(prodCatName).toLowerCase() === String(selId).toLowerCase()) return true;
                    
                    const foundCat = categories.find(c => String(c._id) === String(selId) || c.name.toLowerCase() === String(selId).toLowerCase());
                    if (foundCat) {
                        if (String(foundCat._id) === String(prodCatId)) return true;
                        if (foundCat.name.toLowerCase() === String(prodCatName).toLowerCase()) return true;
                    }
                    return false;
                });
                if (!matches) return false;
            }

            // Flavor Filter (Simulated based on name)
            if (selectedFlavors.length > 0) {
                const nameLower = (product.name || "").toLowerCase();
                const isSpicy = nameLower.includes("spicy") || nameLower.includes("chili") || nameLower.includes("masala");
                const isSweet = nameLower.includes("sweet") || nameLower.includes("jaggery") || nameLower.includes("upperi");
                const isClassic = !isSpicy && !isSweet;

                let flavorMatch = false;
                if (selectedFlavors.includes("Spicy") && isSpicy) flavorMatch = true;
                if (selectedFlavors.includes("Sweet") && isSweet) flavorMatch = true;
                if (selectedFlavors.includes("Classic") && isClassic) flavorMatch = true;

                if (!flavorMatch) return false;
            }

            // Weight Filter
            if (selectedWeights.length > 0) {
                const hasMatch = product.variants?.some((v: any) => selectedWeights.includes(`${v.name}${v.unit}`) || selectedWeights.includes(v.weight));
                if (!hasMatch) return false;
            }

            // Price Filter
            const basePrice = product.variants?.length > 0 
                ? Math.min(...product.variants.map((v: any) => v.sellingPrice || v.price || 0))
                : (product.price || 0);
            
            if (minPrice && basePrice < Number(minPrice)) return false;
            if (maxPrice && basePrice > Number(maxPrice)) return false;

            return true;
        });

        // Sorting
        result.sort((a, b) => {
            const priceA = a.variants?.length > 0 ? Math.min(...a.variants.map((v: any) => v.sellingPrice || v.price || 0)) : (a.price || 0);
            const priceB = b.variants?.length > 0 ? Math.min(...b.variants.map((v: any) => v.sellingPrice || v.price || 0)) : (b.price || 0);
            
            if (sortOption === "price-asc") return priceA - priceB;
            if (sortOption === "price-desc") return priceB - priceA;
            if (sortOption === "rating-desc") return (b.rating || 5) - (a.rating || 5);
            if (sortOption === "name-asc") return (a.name || "").localeCompare(b.name || "");
            return 0;
        });

        return result;
    }, [allProducts, selectedCategories, selectedFlavors, selectedWeights, minPrice, maxPrice, sortOption, categories]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
            <Loader2 className="w-10 h-10 text-black animate-spin" strokeWidth={1} />
        </div>
    );

    return (
        <div className="bg-[#faf9f6] min-h-screen pb-32 font-sans selection:bg-brand-primary/20 selection:text-black">
            
            {/* Minimalist Editorial Compact Header */}
            <div className="w-full bg-white border-b border-gray-200 py-5 md:py-6 mb-6">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Link href="/" className="text-[9px] uppercase tracking-[0.3em] font-medium text-gray-400 hover:text-black transition-colors">
                                    Home
                                </Link>
                                <span className="text-gray-300 text-[10px]">/</span>
                                <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-brand-primary">
                                    {activeCategoryObject ? activeCategoryObject.name : "Our Collection"}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-baseline gap-2.5">
                                <h1 className="text-xl md:text-2xl font-serif text-gray-900 font-light tracking-tight">
                                    {activeCategoryObject ? `${activeCategoryObject.name}.` : "Our Shop."}
                                </h1>
                                {activeCategoryObject?.description && (
                                    <span className="text-xs font-light text-gray-400 hidden sm:inline">
                                        — {activeCategoryObject.description}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="text-left md:text-right">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                                {filteredAndSortedProducts.length} Product{filteredAndSortedProducts.length !== 1 ? 's' : ''} Available
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden flex justify-between items-center w-full mb-6 pb-4 border-b border-gray-200">
                    <button 
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium py-2.5 px-4 bg-black text-white"
                        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span>{isMobileFilterOpen ? "Hide Filters" : `Filters ${activeFilterCount > 0 ? `(${activeFilterCount})` : ''}`}</span>
                    </button>
                    
                    <div className="relative">
                        <select 
                            className="appearance-none bg-white border border-gray-200 text-[10px] uppercase tracking-widest font-medium outline-none py-2 pl-3 pr-7 cursor-pointer"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            {sortOptionsList.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black pointer-events-none" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start relative gap-8 lg:gap-12">
                    
                    {/* Left Sticky Filter Sidebar - Sharp Square Minimalist */}
                    <aside className="w-full lg:w-[270px] xl:w-[300px] flex-shrink-0 lg:sticky lg:top-28 xl:top-32 z-20">
                        <div className={`
                            ${isMobileFilterOpen ? "block mb-10" : "hidden lg:block"}
                            bg-white border border-gray-200 p-6 lg:p-7
                        `}>
                            
                            {/* Refine By Header */}
                            <div className="flex items-center justify-between pb-4 mb-7 border-b border-gray-200">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-900">
                                    Refine By
                                </span>
                                {activeFilterCount > 0 && (
                                    <button 
                                        onClick={clearAll} 
                                        className="text-[9px] uppercase tracking-widest text-brand-primary hover:text-black transition-colors font-medium underline underline-offset-4"
                                    >
                                        Clear ({activeFilterCount})
                                    </button>
                                )}
                            </div>

                            {/* Section: Category */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <Tag className="w-3 h-3 text-gray-400" />
                                    <h3 className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">
                                        Category
                                    </h3>
                                </div>
                                <ul className="space-y-3">
                                    {categories.map(cat => {
                                        const isChecked = selectedCategories.includes(cat._id) || selectedCategories.includes(cat.name);
                                        return (
                                            <li key={cat._id}>
                                                <button 
                                                    onClick={() => toggleCategory(cat._id)} 
                                                    className="flex items-start gap-3.5 group w-full text-left"
                                                >
                                                    <div className={`flex-shrink-0 w-3.5 h-3.5 mt-0.5 flex items-center justify-center transition-colors ${isChecked ? "bg-black border-black" : "border border-gray-300 group-hover:border-black"}`}>
                                                        {isChecked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                                                    </div>
                                                    <span className={`text-[13px] font-light tracking-wide transition-colors ${isChecked ? "text-black font-medium" : "text-gray-500 group-hover:text-black"}`}>
                                                        {cat.name}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Section: Flavor */}
                            <div className="mb-8 pt-6 border-t border-gray-100">
                                <h3 className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-4 font-medium">
                                    Flavor Profile
                                </h3>
                                <ul className="space-y-3">
                                    {flavors.map(flavor => {
                                        const isChecked = selectedFlavors.includes(flavor);
                                        return (
                                            <li key={flavor}>
                                                <button 
                                                    onClick={() => toggleFlavor(flavor)} 
                                                    className="flex items-start gap-3.5 group w-full text-left"
                                                >
                                                    <div className={`flex-shrink-0 w-3.5 h-3.5 mt-0.5 flex items-center justify-center transition-colors ${isChecked ? "bg-black border-black" : "border border-gray-300 group-hover:border-black"}`}>
                                                        {isChecked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                                                    </div>
                                                    <span className={`text-[13px] font-light tracking-wide transition-colors ${isChecked ? "text-black font-medium" : "text-gray-500 group-hover:text-black"}`}>
                                                        {flavor}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Section: Weight */}
                            <div className="mb-8 pt-6 border-t border-gray-100">
                                <h3 className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-4 font-medium">
                                    Available Weight
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {weights.map(weight => {
                                        const isSelected = selectedWeights.includes(weight);
                                        return (
                                            <button 
                                                key={weight}
                                                onClick={() => toggleWeight(weight)}
                                                className={`px-3 py-1.5 border text-xs tracking-wider uppercase font-light transition-all ${isSelected ? "border-black bg-black text-white font-medium" : "border-gray-200 text-gray-500 hover:border-black hover:text-black bg-white"}`}
                                            >
                                                {weight}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section: Base Price (₹) with Presets & Masked Inputs */}
                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">
                                        Base Price (₹)
                                    </h3>
                                    {(minPrice || maxPrice) && (
                                        <button 
                                            onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                                            className="text-[9px] uppercase tracking-wider text-brand-primary hover:text-black"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>

                                {/* Quick Price Range Pills */}
                                <div className="grid grid-cols-2 gap-1.5 mb-4">
                                    {pricePresets.map(preset => {
                                        const isActive = minPrice === preset.min && maxPrice === preset.max;
                                        return (
                                            <button
                                                key={preset.label}
                                                onClick={() => applyPricePreset(preset.min, preset.max)}
                                                className={`px-2.5 py-1.5 text-[11px] font-light border transition-all text-center ${
                                                    isActive 
                                                        ? "border-black bg-black text-white font-medium" 
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
                                                }`}
                                            >
                                                {preset.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom Price Inputs */}
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-light">₹</span>
                                        <input 
                                            type="number" 
                                            placeholder="Min" 
                                            className="w-full bg-white border border-gray-200 py-2 pl-6 pr-2 text-xs font-light outline-none focus:border-black transition-colors placeholder-gray-300"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                        />
                                    </div>
                                    <span className="text-gray-300 font-light text-xs">–</span>
                                    <div className="relative flex-1">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-light">₹</span>
                                        <input 
                                            type="number" 
                                            placeholder="Max" 
                                            className="w-full bg-white border border-gray-200 py-2 pl-6 pr-2 text-xs font-light outline-none focus:border-black transition-colors placeholder-gray-300"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Clear CTA */}
                            <div className="lg:hidden text-center mt-6 border-t border-gray-200 pt-6">
                                <button 
                                    onClick={clearAll} 
                                    className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-black underline underline-offset-4"
                                >
                                    Reset All Parameters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Right Product Grid */}
                    <main className="flex-1 w-full min-w-0">
                        
                        {/* Desktop Top Utilities & Active Chips */}
                        <div className="mb-8 pb-4 border-b border-gray-200 bg-white p-5 border">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                                    {filteredAndSortedProducts.length} Product{filteredAndSortedProducts.length !== 1 && 's'} Found
                                </span>
                                
                                <div className="hidden lg:flex items-center gap-3">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Sort By</span>
                                    <div className="relative">
                                        <select 
                                            className="appearance-none bg-white border border-gray-200 text-[10px] uppercase tracking-widest cursor-pointer outline-none focus:border-black font-medium text-gray-900 py-1.5 pl-3 pr-7"
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                        >
                                            {sortOptionsList.map(opt => (
                                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Active Filter Chips */}
                            {activeFilterCount > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                                    <span className="text-[9px] uppercase tracking-widest text-gray-400">Active Filters:</span>
                                    
                                    {sortOption !== "featured" && (
                                        <button 
                                            onClick={() => setSortOption("featured")}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 hover:border-black text-[11px] font-light text-gray-800 transition-colors"
                                        >
                                            <span>Sort: {sortOptionsList.find(s => s.id === sortOption)?.label}</span>
                                            <X className="w-3 h-3 text-gray-400 hover:text-black" />
                                        </button>
                                    )}

                                    {selectedCategories.map(catId => {
                                        const catObj = categories.find(c => String(c._id) === String(catId) || c.name === catId);
                                        return (
                                            <button 
                                                key={catId} 
                                                onClick={() => toggleCategory(catId)}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 hover:border-black text-[11px] font-light text-gray-800 transition-colors"
                                            >
                                                <span>Category: {catObj ? catObj.name : catId}</span>
                                                <X className="w-3 h-3 text-gray-400 hover:text-black" />
                                            </button>
                                        );
                                    })}

                                    {selectedFlavors.map(flavor => (
                                        <button 
                                            key={flavor} 
                                            onClick={() => toggleFlavor(flavor)}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 hover:border-black text-[11px] font-light text-gray-800 transition-colors"
                                        >
                                            <span>Flavor: {flavor}</span>
                                            <X className="w-3 h-3 text-gray-400 hover:text-black" />
                                        </button>
                                    ))}

                                    {selectedWeights.map(weight => (
                                        <button 
                                            key={weight} 
                                            onClick={() => toggleWeight(weight)}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 hover:border-black text-[11px] font-light text-gray-800 transition-colors"
                                        >
                                            <span>Weight: {weight}</span>
                                            <X className="w-3 h-3 text-gray-400 hover:text-black" />
                                        </button>
                                    ))}

                                    {(minPrice || maxPrice) && (
                                        <button 
                                            onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 hover:border-black text-[11px] font-light text-gray-800 transition-colors"
                                        >
                                            <span>₹{minPrice || "0"} – ₹{maxPrice || "Max"}</span>
                                            <X className="w-3 h-3 text-gray-400 hover:text-black" />
                                        </button>
                                    )}

                                    <button 
                                        onClick={clearAll} 
                                        className="text-[10px] uppercase tracking-widest text-brand-primary hover:text-black transition-colors ml-2 font-medium underline underline-offset-4"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Products Grid & Loading Skeletons */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} className="bg-white border border-gray-200 p-5 animate-pulse flex flex-col">
                                        <div className="aspect-square bg-stone-100 mb-4 w-full"></div>
                                        <div className="h-3.5 bg-stone-200 w-3/4 mb-2"></div>
                                        <div className="h-2.5 bg-stone-100 w-1/2 mb-4"></div>
                                        <div className="mt-auto pt-3 border-t border-stone-100 flex justify-between items-center">
                                            <div className="h-4 bg-stone-200 w-1/4"></div>
                                            <div className="h-7 bg-stone-200 w-20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredAndSortedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {filteredAndSortedProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 px-6 flex flex-col items-center justify-center bg-white border border-gray-200">
                                <X className="h-8 w-8 text-gray-300 mb-6" />
                                <h3 className="text-2xl font-serif text-gray-900 mb-3 font-light">No Products Found.</h3>
                                <p className="text-sm text-gray-500 font-light mb-8 max-w-sm mx-auto">
                                    We couldn&apos;t find any products matching your selected filters. Try broadening your parameters.
                                </p>
                                <button 
                                    onClick={clearAll}
                                    className="border border-black px-8 py-3.5 text-[10px] uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors duration-500 font-medium"
                                >
                                    Clear All Parameters
                                </button>
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
}
