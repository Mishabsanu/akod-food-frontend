"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function PromoModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeenPromo = sessionStorage.getItem("akodPromoSeen");
        
        if (!hasSeenPromo) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000); // 3 seconds delay
            
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem("akodPromoSeen", "true");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center font-sans">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-500"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-[#faf9f6] w-full max-w-2xl mx-4 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-700 flex flex-col md:flex-row border border-black/10">
                
                {/* Close Button */}
                <button 
                    onClick={handleClose} 
                    className="absolute top-4 right-4 z-10 p-2 text-black/50 hover:text-black transition-colors rounded-full bg-white/50 backdrop-blur-md md:bg-transparent"
                >
                    <X strokeWidth={1} className="w-5 h-5" />
                </button>

                {/* Left: Image */}
                <div className="md:w-1/2 h-48 md:h-auto bg-gray-200 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src="/3.jpeg" 
                        alt="AKOD Welcome" 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right: Content */}
                <div className="md:w-1/2 p-10 md:p-12 flex flex-col justify-center">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-brand-primary font-medium mb-4">
                        Exclusive Invitation
                    </span>
                    <h2 className="text-3xl font-serif text-gray-900 font-light mb-4 leading-tight">
                        Experience the <br/> Artisan Craft.
                    </h2>
                    <p className="text-xs text-gray-500 font-light leading-loose mb-8">
                        Join our Atelier and receive <span className="font-medium text-black">10% off</span> your first curation of premium heritage snacks. Enter code <span className="font-medium border-b border-black text-black">LUXURY10</span> at checkout.
                    </p>
                    
                    <button 
                        onClick={handleClose}
                        className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] font-light hover:bg-brand-primary transition-colors mb-4"
                    >
                        Redeem Offer
                    </button>
                    <button 
                        onClick={handleClose}
                        className="w-full text-center text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
                    >
                        Continue without offer
                    </button>
                </div>
            </div>
        </div>
    );
}
