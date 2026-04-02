import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-brand-secondary text-brand-bgLight border-t border-brand-primary/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* Brand */}
                    <div className="space-y-4">
                        <span className="font-serif text-2xl font-bold tracking-widest text-brand-primary uppercase block">
                            AKOD FOOD
                        </span>
                        <p className="text-sm text-gray-400 font-light leading-relaxed">
                            Curating luxury snacking experiences with the finest ingredients. Because every bite should be extraordinary.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="uppercase tracking-widest text-sm font-semibold text-brand-primary mb-2">Explore</h3>
                        <Link href="/" className="hover:text-brand-bgLight text-gray-400 transition-colors text-sm">Home</Link>
                        <Link href="/products" className="hover:text-brand-bgLight text-gray-400 transition-colors text-sm">Shop All</Link>
                        <Link href="/profile" className="hover:text-brand-bgLight text-gray-400 transition-colors text-sm">My Account</Link>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="uppercase tracking-widest text-sm font-semibold text-brand-primary mb-2">Connect</h3>
                        <p className="text-gray-400 text-sm">contact@akodfood.com</p>
                        <p className="text-gray-400 text-sm">+91 90000 00000</p>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500 font-light uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} AKOD FOOD. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
