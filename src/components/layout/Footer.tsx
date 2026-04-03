import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-white selection:bg-white/20 selection:text-white border-t border-gray-900 mt-20">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-16 md:py-24">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-start">

                    {/* Brand Identity */}
                    <div className="md:col-span-5 flex flex-col items-start space-y-12">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <div className="bg-white rounded-lg p-2 inline-block">
                            <img
                                src="/logo.jpg"
                                alt="AKOD"
                                className="h-16 w-auto object-contain"
                            />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-light leading-relaxed text-gray-400 max-w-sm">
                            Curating extraordinary snacking experiences through the absolute finest ingredients. The definitive destination for luxury provender.
                        </p>

                        {/* Newsletter Mini-form */}
                        <div className="w-full max-w-sm pt-4">
                            <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-500 mb-4">Join the Atelier</label>
                            <div className="flex border-b border-gray-800 focus-within:border-white transition-colors pb-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-transparent border-none text-sm font-light w-full focus:outline-none placeholder:text-gray-700"
                                />
                                <button className="text-gray-500 hover:text-white transition-colors group">
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mt-4 md:mt-0">

                        <div className="flex flex-col space-y-6">
                            <h3 className="text-[9px] uppercase tracking-[0.4em] font-medium text-gray-600 mb-2">Explore</h3>
                            <Link href="/" className="text-xs font-light text-gray-400 hover:text-white transition-colors">The Homepage</Link>
                            <Link href="/products" className="text-xs font-light text-gray-400 hover:text-white transition-colors">Complete Portfolio</Link>
                            <Link href="/profile" className="text-xs font-light text-gray-400 hover:text-white transition-colors">Client Dossier</Link>
                        </div>

                        <div className="flex flex-col space-y-6">
                            <h3 className="text-[9px] uppercase tracking-[0.4em] font-medium text-gray-600 mb-2">Legal</h3>
                            <Link href="#" className="text-xs font-light text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="#" className="text-xs font-light text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="#" className="text-xs font-light text-gray-400 hover:text-white transition-colors">Returns & Refunds</Link>
                        </div>

                        <div className="flex flex-col space-y-6">
                            <h3 className="text-[9px] uppercase tracking-[0.4em] font-medium text-gray-600 mb-2">Concierge</h3>
                            <p className="text-xs font-light text-gray-400 hover:text-white transition-colors cursor-pointer">concierge@akodfood.com</p>
                            <p className="text-xs font-light text-gray-400 hover:text-white transition-colors cursor-pointer">+91 90000 00000</p>
                            <p className="text-xs font-light text-gray-400 max-w-[150px] leading-relaxed pt-2">
                                Available Mon-Fri, <br /> 09:00 - 18:00 IST
                            </p>
                        </div>

                    </div>
                </div>

                {/* Sub Footer Border */}
                <div className="mt-20 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-600 font-light uppercase tracking-[0.3em]">
                        &copy; {new Date().getFullYear()} AKOD Food. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-sm text-gray-600 hover:text-white font-light uppercase tracking-[0.3em] transition-colors">Instagram</Link>
                        <Link href="#" className="text-sm text-gray-600 hover:text-white font-light uppercase tracking-[0.3em] transition-colors">LinkedIn</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
