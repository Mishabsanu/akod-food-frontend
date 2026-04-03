"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, User, Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState,useEffect  } from "react";
import CartDrawer from "../ui/CartDrawer";
import AuthModal from "../ui/AuthModal";

export default function Navbar() {
    const { itemCount } = useCart();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem("akodAuth") === "true");
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
                                {links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${pathname === link.path ? "text-brand-primary" : "text-gray-800 hover:text-brand-primary"}`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Center: Logo */}
                        <div className="flex-shrink-0 flex justify-center">
                            <Link href="/" className="px-6 border-x border-gray-200 py-2 hidden sm:block">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/logo.jpg"
                                    alt="AKOD"
                                    className="h-20 md:h-20 w-auto object-contain"
                                />
                            </Link>
                            <Link href="/" className="sm:hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/logo.jpg"
                                    alt="AKOD"
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
                                <Link href="/profile" className="text-gray-800 hover:text-gray-500 transition-colors">
                                    <User className="h-5 w-5" strokeWidth={1.25} />
                                </Link>
                            ) : (
                                <button onClick={() => setIsAuthOpen(true)} className="text-gray-800 hover:text-gray-500 transition-colors">
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
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    );
}
