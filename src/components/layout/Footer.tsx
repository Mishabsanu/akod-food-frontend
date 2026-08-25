import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Instagram, Phone, MapPin, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-white selection:bg-white/20 selection:text-white border-t border-gray-900 mt-20">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-16 md:py-24">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Brand Identity & Newsletter */}
                    <div className="lg:col-span-4 flex flex-col items-start space-y-6">
                        <Link href="/" className="bg-white p-2 inline-block">
                            <Image
                                src="/logo.jpg"
                                alt="AKOD Foods"
                                width={64}
                                height={64}
                                className="h-12 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-[11px] uppercase tracking-[0.2em] font-light leading-relaxed text-gray-400 max-w-sm">
                            From the richness of Kerala to the world. Handcrafted snacks, cold-pressed coconut oil, pure honey, and traditional wellness foods.
                        </p>

                        {/* Newsletter Mini-form */}
                        <div className="w-full max-w-sm pt-2">
                            <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-500 mb-3">Subscribe for Provisions & Stories</label>
                            <div className="flex border-b border-gray-800 focus-within:border-white transition-colors pb-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="bg-transparent border-none text-xs font-light w-full focus:outline-none placeholder:text-gray-600 text-white"
                                />
                                <button className="text-gray-500 hover:text-white transition-colors group px-2" aria-label="Subscribe">
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation & Contact Columns */}
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 pt-2 lg:pt-0">

                        {/* Column 1: Explore */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-[10px] uppercase tracking-[0.35em] font-semibold text-white/90 border-b border-gray-900 pb-2 mb-1">Explore</h3>
                            <Link href="/" className="text-xs font-light text-gray-400 hover:text-white transition-colors">Home</Link>
                            <Link href="/products" className="text-xs font-light text-gray-400 hover:text-white transition-colors">All Products</Link>
                            <Link href="/story" className="text-xs font-light text-gray-400 hover:text-white transition-colors">Our Story</Link>
                            <Link href="/profile" className="text-xs font-light text-gray-400 hover:text-white transition-colors">My Account</Link>
                        </div>

                        {/* Column 2: Legal & Info */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-[10px] uppercase tracking-[0.35em] font-semibold text-white/90 border-b border-gray-900 pb-2 mb-1">Legal & Policy</h3>
                            <Link href="/terms" className="text-xs font-light text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link>
                            <Link href="/terms" className="text-xs font-light text-gray-400 hover:text-white transition-colors">Refund & Cancellation</Link>
                            <Link href="/terms" className="text-xs font-light text-gray-400 hover:text-white transition-colors">Shipping & Delivery</Link>
                        </div>

                        {/* Column 3: Contact Us (Aligned with WhatsApp, Phone, Email & Address) */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-[10px] uppercase tracking-[0.35em] font-semibold text-white/90 border-b border-gray-900 pb-2 mb-1">Contact Us</h3>
                            
                            <a 
                                href="https://wa.me/919048713538?text=Hello%20AKOD%20Foods,%20I%20would%20like%20to%20know%20more%20about%20your%20products" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs font-light text-gray-400 hover:text-white transition-colors flex items-center gap-2.5"
                            >
                                <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.044-1.928-.465-1.503-.593-2.457-2.121-2.532-2.222-.075-.101-.611-.813-.611-1.551 0-.737.387-1.1.524-1.25.137-.15.299-.187.399-.187.1 0 .199.001.286.006.092.004.215-.035.337.257.122.292.421 1.026.458 1.099.037.073.061.16.012.26-.049.098-.074.16-.147.247-.074.086-.156.192-.223.258-.074.074-.151.155-.065.303.086.148.384.633.824 1.023.567.502 1.045.657 1.193.73.149.074.236.062.324-.037.087-.1.374-.436.474-.585.1-.15.199-.124.336-.074.137.05.872.411 1.022.486.15.075.249.112.286.175.037.062.037.362-.107.767zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.981-1.306C8.423 21.536 10.153 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.637 0-3.155-.472-4.436-1.284l-.318-.202-2.964.777.791-2.89-.221-.351C4.004 14.98 3.5 13.535 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/>
                                </svg>
                                <span>WhatsApp: +91 90487 13538</span>
                            </a>

                            <a href="tel:+919048713538" className="text-xs font-light text-gray-400 hover:text-white transition-colors flex items-center gap-2.5">
                                <Phone className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                                <span>Phone: +91 90487 13538</span>
                            </a>

                            <a href="mailto:support@akodfood.com" className="text-xs font-light text-gray-400 hover:text-white transition-colors flex items-center gap-2.5">
                                <Mail className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
                                <span>support@akodfood.com</span>
                            </a>

                            <div className="text-xs font-light text-gray-400 leading-relaxed flex items-start gap-2.5 pt-1">
                                <MapPin className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                                <span>
                                    KK Tower, Nallamthanni,<br />
                                    Edakkara, Malappuram Dt,<br />
                                    Kerala, India
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Sub Footer Border */}
                <div className="mt-16 pt-8 border-t border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                    <p className="text-xs text-gray-500 font-light tracking-wide">
                        &copy; {new Date().getFullYear()} AKOD Foods. All rights reserved. Born in Kerala, made for the world.
                    </p>
                    <div className="flex items-center gap-6">
                        <a 
                            href="https://wa.me/919048713538?text=Hello%20AKOD%20Foods" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-white font-light tracking-wider transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4 text-green-500 fill-current" viewBox="0 0 24 24">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.044-1.928-.465-1.503-.593-2.457-2.121-2.532-2.222-.075-.101-.611-.813-.611-1.551 0-.737.387-1.1.524-1.25.137-.15.299-.187.399-.187.1 0 .199.001.286.006.092.004.215-.035.337.257.122.292.421 1.026.458 1.099.037.073.061.16.012.26-.049.098-.074.16-.147.247-.074.086-.156.192-.223.258-.074.074-.151.155-.065.303.086.148.384.633.824 1.023.567.502 1.045.657 1.193.73.149.074.236.062.324-.037.087-.1.374-.436.474-.585.1-.15.199-.124.336-.074.137.05.872.411 1.022.486.15.075.249.112.286.175.037.062.037.362-.107.767zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.981-1.306C8.423 21.536 10.153 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.637 0-3.155-.472-4.436-1.284l-.318-.202-2.964.777.791-2.89-.221-.351C4.004 14.98 3.5 13.535 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/>
                            </svg>
                            <span>WhatsApp</span>
                        </a>
                        <a 
                            href="https://www.instagram.com/akodfood?igsi=amh2dWo4aXB4eDdt" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-white font-light tracking-wider transition-colors flex items-center gap-2"
                        >
                            <Instagram className="w-4 h-4 text-brand-primary" />
                            <span>Instagram</span>
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
