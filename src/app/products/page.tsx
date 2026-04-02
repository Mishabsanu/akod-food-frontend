"use client";

import { useState } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";

export default function ShopPage() {
    const [filter, setFilter] = useState("All");

    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

    const filteredProducts = filter === "All" ? products : products.filter((p) => p.category === filter);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif text-brand-text mb-4">Our Collection</h1>
                <div className="h-1 w-24 bg-brand-primary mx-auto mb-8"></div>

                {/* Filter Section */}
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wider uppercase transition-colors ${filter === category
                                    ? "bg-brand-primary text-white"
                                    : "bg-white text-brand-text border border-gray-200 hover:border-brand-primary hover:text-brand-primary"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500 font-light">
                    No products found in this category.
                </div>
            )}
        </div>
    );
}
