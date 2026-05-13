"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, User, Search, Menu, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState,useEffect  } from "react";
import CartDrawer from "../ui/CartDrawer";
import AuthModal from "../ui/AuthModal";
import { customerApi } from "@/lib/api";

export default function Navbar() {
    const { user, isAuthenticated, isAuthModalOpen, setAuthModalOpen } = useAuth();
    const { itemCount } = useCart();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await customerApi.getCategories();
                setCategories(res.data.data || []);
            } catch (error) {
                console.error("Categories fetch failed", error);
            }
        };
        fetchCategories();
    }, []);

    const links = [
        { name: "Home", path: "/" },
        { name: "Collection", path: "/products" },
        { name: "Atelier", path: "/#story" },
    ];

    return (
        <>
            <nav className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 text-black shadow-sm transition-all duration-300">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                    <div className="flex justify-between items-center h-20 md:h-24">

                        {/* Left: Mobile Menu & Search / Desktop Links */}
                        <div className="flex-1 flex items-center">
                            <div className="flex items-center gap-6 md:hidden">
                                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="hover:text-gray-500 transition-colors">
                                    <Menu className="h-5 w-5" strokeWidth={1.25} />
                                </button>
                                <button className="hover:text-gray-500 transition-colors">
                                    <Search className="h-5 w-5" strokeWidth={1.25} />
                                </button>
                            </div>

                            <div className="hidden md:flex items-center space-x-12">
                                <Link 
                                    href="/" 
                                    className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${pathname === "/" ? "text-brand-primary" : "text-gray-800 hover:text-brand-primary"}`}
                                >
                                    Home
                                </Link>
                                
                                <div 
                                    className="relative group"
                                    onMouseEnter={() => setIsCategoryOpen(true)}
                                    onMouseLeave={() => setIsCategoryOpen(false)}
                                >
                                    <Link 
                                        href="/products" 
                                        className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-1.5 ${pathname === "/products" ? "text-brand-primary" : "text-gray-800 hover:text-brand-primary"}`}
                                    >
                                        Shop <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                    </Link>
                                    
                                    {/* Category Dropdown */}
                                    <div className={`absolute top-full left-0 pt-6 transition-all duration-300 ${isCategoryOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                        <div className="bg-white border border-gray-100 shadow-2xl p-8 min-w-[280px] backdrop-blur-xl bg-white/95">
                                            <div className="grid grid-cols-1 gap-6">
                                                <div>
                                                    <h3 className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-4">Categories</h3>
                                                    <div className="space-y-4">
                                                        {categories.map((cat) => (
                                                            <Link 
                                                                key={cat._id} 
                                                                href={`/products?category=${cat._id}`}
                                                                className="block text-[12px] font-light tracking-wider text-gray-600 hover:text-black transition-colors"
                                                                onClick={() => setIsCategoryOpen(false)}
                                                            >
                                                                {cat.name}
                                                            </Link>
                                                        ))}
                                                        <Link 
                                                            href="/products"
                                                            className="block text-[10px] uppercase tracking-[0.2em] text-brand-primary pt-2 border-t border-gray-50"
                                                            onClick={() => setIsCategoryOpen(false)}
                                                        >
                                                            View All Products
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link 
                                    href="/#story" 
                                    className="text-[11px] uppercase tracking-[0.2em] font-medium text-gray-800 hover:text-brand-primary transition-colors"
                                >
                                    Story
                                </Link>
                            </div>
                        </div>

                        {/* Center: Logo */}
                        <div className="flex-shrink-0 flex justify-center">
                            <Link href="/" className="px-6 border-x border-gray-200 py-2 hidden sm:block">
                                <Image
                                    src="/logo.jpg"
                                    alt="AKOD"
                                    width={80}
                                    height={80}
                                    className="h-20 w-auto object-contain"
                                />
                            </Link>
                            <Link href="/" className="sm:hidden">
                                <Image
                                    src="/logo.jpg"
                                    alt="AKOD"
                                    width={32}
                                    height={32}
                                    className="h-8 w-auto object-contain"
                                />
                            </Link>
                        </div>

                        {/* Right: Utility Icons */}
                        <div className="flex-1 flex items-center justify-end space-x-8">
                            <div className="hidden lg:flex items-center space-x-3 border-b border-gray-300 pb-1 focus-within:border-black transition-colors">
                                <Search className="h-4 w-4 text-gray-400" strokeWidth={1.25} />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="bg-transparent border-none focus:outline-none text-xs tracking-widest w-28 placeholder-gray-400 font-light text-gray-800"
                                />
                            </div>

                            {isAuthenticated ? (
                                <Link href="/profile" className="flex items-center gap-2 text-gray-800 hover:text-brand-primary transition-colors group">
                                    <span className="hidden sm:block text-[9px] uppercase tracking-[0.2em] font-medium text-gray-400 group-hover:text-black transition-colors">
                                        Hi, {user?.name.split(' ')[0]}
                                    </span>
                                    <User className="h-5 w-5" strokeWidth={1.25} />
                                </Link>
                            ) : (
                                <button onClick={() => setAuthModalOpen(true, "IDENTITY")} className="text-gray-800 hover:text-brand-primary transition-colors">
                                    <User className="h-5 w-5" strokeWidth={1.25} />
                                </button>
                            )}

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative text-gray-800 hover:text-gray-500 transition-colors flex items-center"
                            >
                                <div className="relative">
                                    <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-primary text-[8px] font-bold text-white border border-white">
                                            {itemCount}
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 p-8 space-y-6 absolute w-full shadow-lg">
                        <div className="flex flex-col space-y-6">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-800"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Cart Drawer Component */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            
            {/* Auth Modal Component */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
}
