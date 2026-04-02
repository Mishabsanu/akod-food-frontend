"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { itemCount } = useCart();
    const pathname = usePathname();

    const links = [
        { name: "Home", path: "/" },
        { name: "Shop", path: "/products" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-brand-bgLight border-b border-brand-primary/20 backdrop-blur-md bg-opacity-90 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center">
                        <span className="font-serif text-2xl font-bold tracking-widest text-brand-primary uppercase">
                            AKOD <span className="text-brand-text">FOOD</span>
                        </span>
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex space-x-8">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-brand-primary ${pathname === link.path ? "text-brand-primary" : "text-brand-text"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-6">
                        <Link href="/profile" className="text-brand-text hover:text-brand-primary transition-colors">
                            <User className="h-5 w-5" />
                        </Link>
                        <Link href="/cart" className="relative text-brand-text hover:text-brand-primary transition-colors">
                            <ShoppingBag className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
