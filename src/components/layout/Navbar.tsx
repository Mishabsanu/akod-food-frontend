"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, User, Menu, ChevronDown } from "lucide-react";
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
    const [isFlavorOpen, setIsFlavorOpen] = useState(false);

    const flavorOptions = [
        { name: "Classic Salted", param: "Classic" },
        { name: "Spicy & Masala", param: "Spicy" },
        { name: "Sweet Jaggery (Upperi)", param: "Sweet" },
    ];

    const links = [
        { name: "Home", path: "/" },
        { name: "All Products", path: "/products" },
        { name: "Our Story", path: "/story" },
    ];

    return (
        <>
            <nav className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 text-black shadow-sm transition-all duration-300">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                    <div className="flex justify-between items-center h-20 md:h-24">

                        {/* Left: Logo & Desktop Links / Mobile Menu */}
                        <div className="flex items-center space-x-6 sm:space-x-10">
                            {/* Mobile Hamburger Menu */}
                            <div className="flex items-center md:hidden">
                                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="hover:text-gray-500 transition-colors">
                                    <Menu className="h-5 w-5" strokeWidth={1.25} />
                                </button>
                            </div>

                            {/* Logo on Left */}
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="hidden sm:block py-1">
                                    <Image
                                        src="/logo.jpg"
                                        alt="AKOD"
                                        width={80}
                                        height={80}
                                        className="h-16 md:h-20 w-auto object-contain"
                                    />
                                </Link>
                                <Link href="/" className="sm:hidden">
                                    <Image
                                        src="/logo.jpg"
                                        alt="AKOD"
                                        width={36}
                                        height={36}
                                        className="h-9 w-auto object-contain"
                                    />
                                </Link>
                            </div>

                            {/* Desktop Links */}
                            <div className="hidden md:flex items-center space-x-10">
                                <Link 
                                    href="/" 
                                    className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${pathname === "/" ? "text-brand-primary" : "text-gray-800 hover:text-brand-primary"}`}
                                >
                                    Home
                                </Link>
                                
                                {/* Flavors Dropdown */}
                                <div 
                                    className="relative group"
                                    onMouseEnter={() => setIsFlavorOpen(true)}
                                    onMouseLeave={() => setIsFlavorOpen(false)}
                                >
                                    <Link 
                                        href="/products" 
                                        className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-1.5 ${pathname === "/products" ? "text-brand-primary" : "text-gray-800 hover:text-brand-primary"}`}
                                    >
                                        Flavors <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isFlavorOpen ? 'rotate-180' : ''}`} />
                                    </Link>
                                    
                                    {/* Flavor Dropdown Menu */}
                                    <div className={`absolute top-full left-0 pt-6 transition-all duration-300 ${isFlavorOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                        <div className="bg-white border border-gray-100 shadow-2xl p-7 min-w-[260px] backdrop-blur-xl bg-white/95">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <h3 className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-3">Our Flavors</h3>
                                                    <div className="space-y-3">
                                                        {flavorOptions.map((f) => (
                                                            <Link 
                                                                key={f.param} 
                                                                href={`/products?flavor=${encodeURIComponent(f.param)}`}
                                                                className="block text-[12px] font-light tracking-wider text-gray-600 hover:text-black hover:translate-x-1 transition-all"
                                                                onClick={() => setIsFlavorOpen(false)}
                                                            >
                                                                {f.name}
                                                            </Link>
                                                        ))}
                                                        <Link 
                                                            href="/products" 
                                                            className="block text-[10px] uppercase tracking-[0.2em] text-brand-primary pt-3 border-t border-gray-100 font-medium hover:text-black transition-colors"
                                                            onClick={() => setIsFlavorOpen(false)}
                                                        >
                                                            View All Products &rarr;
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link 
                                    href="/products" 
                                    className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${pathname === "/products" ? "text-brand-primary" : "text-gray-800 hover:text-brand-primary"}`}
                                >
                                    All Products
                                </Link>

                                <Link 
                                    href="/story" 
                                    className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${pathname === "/story" ? "text-brand-primary" : "text-gray-800 hover:text-brand-primary"}`}
                                >
                                    Story
                                </Link>
                            </div>
                        </div>

                        {/* Right: Utility Icons */}
                        <div className="flex items-center space-x-6 sm:space-x-8">

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
                        <div className="flex flex-col space-y-5">
                            <Link
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-800"
                            >
                                Home
                            </Link>

                            <div className="space-y-3 pl-3 border-l-2 border-brand-primary/40 my-1">
                                <span className="text-[9px] uppercase tracking-[0.25em] text-brand-primary font-semibold block">Flavors</span>
                                {flavorOptions.map((f) => (
                                    <Link
                                        key={f.param}
                                        href={`/products?flavor=${encodeURIComponent(f.param)}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-[12px] font-light tracking-wider text-gray-600 hover:text-black"
                                    >
                                        {f.name}
                                    </Link>
                                ))}
                            </div>

                            <Link
                                href="/products"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-800"
                            >
                                All Products
                            </Link>

                            <Link
                                href="/story"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-800"
                            >
                                Our Story
                            </Link>
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
