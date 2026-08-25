"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Sparkles, MapPin, Phone, Instagram, ShieldCheck, Flame, HeartHandshake, Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function StoryPage() {
    const fadeUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.8, ease: "easeOut" as const }
    };

    const stagger = {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { staggerChildren: 0.15 }
    };

    const snacks = [
        {
            title: "Traditional Banana Chips",
            tag: "The Heritage Classic",
            desc: "Made from hand-selected pristine Nendran bananas and slow-fried in pure coconut oil in traditional brass kettles. Unmistakable golden crispness that embodies generations of Kerala hospitality.",
            image: "/5.jpg",
        },
        {
            title: "Flavoured Banana Chips",
            tag: "The New Generation",
            desc: "Infused with fiery red chili, heritage masala blends, and modern spice notes. Created for snack connoisseurs who love the familiar crunch with exciting new culinary personalities.",
            image: "/4.jpeg",
        },
        {
            title: "Crispy Jackfruit Chips",
            tag: "Chakka Heritage",
            desc: "Harvested from lush Kerala plantations, mature jackfruit is thinly sliced and fried to perfection, delivering a naturally sweet, aromatic, and distinctly tropical crunch.",
            image: "/3.jpeg",
        },
        {
            title: "Tapioca Chips",
            tag: "Traditional Kappa",
            desc: "Pristine farm-fresh cassava roots, sliced millimeter-thin and cooked over wood fires. A beloved Kerala household staple elevated into gourmet contemporary snacking.",
            image: "/2.jpeg",
        },
    ];

    const botanicals = [
        {
            title: "Forest Honey",
            tag: "Wild Foraged",
            desc: "Harvested from deep natural forests and multifloral blooms, offering rich micro-nutrients and distinctive woody aromas.",
        },
        {
            title: "Organic Honey",
            tag: "Pure & Certified",
            desc: "Sustainably sourced from dedicated organic apiaries, celebrating unfiltered natural sweetness with zero additives.",
        },
        {
            title: "Jamun Honey",
            tag: "Rare Single-Flora",
            desc: "Bees forage exclusively on seasonal Jamun tree blossoms, yielding a dark, amber-toned honey with subtle herbal undertones.",
        },
        {
            title: "Cold-Pressed Coconut Oil",
            tag: "Pure Virgin Harvest",
            desc: "Extracted from freshly grated mature coconuts without chemical refinement, preserving rich medium-chain triglycerides and authentic aroma.",
        },
        {
            title: "Moringa Powder",
            tag: "Superfood Greens",
            desc: "Shade-dried, nutrient-dense drumstick leaves pulverized into a versatile green daily wellness supplement.",
        },
        {
            title: "Arrowroot & Coconut Sugar",
            tag: "Natural Kitchen Staples",
            desc: "Wholesome, low-glycemic traditional pantry essentials adapted for conscious modern cooking and baking.",
        },
    ];

    return (
        <div className="bg-[#faf9f6] min-h-screen font-sans selection:bg-brand-primary/20 selection:text-black">
            
            {/* Cinematic Full Hero Header */}
            <section className="relative w-full min-h-[75vh] md:min-h-[85vh] bg-black text-white flex items-center justify-center overflow-hidden">
                <Image
                    src="/hero-2.png"
                    alt="Kerala Heritage Culinary"
                    fill
                    priority
                    className="w-full h-full object-cover opacity-40 scale-105"
                />
                
                {/* Dark Editorial Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

                <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-12 py-24 text-center">
                    <motion.div {...fadeUp} className="inline-flex items-center gap-2 mb-6 border border-white/20 px-4 py-1.5 backdrop-blur-sm bg-white/5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                        <span className="text-[10px] uppercase tracking-[0.35em] text-white/90 font-medium">
                            The AKOD Chronicle
                        </span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.2 }}
                        className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif font-light tracking-tight leading-[1.08] mb-8 text-white"
                    >
                        From the Richness of Kerala <br className="hidden md:inline" />
                        <span className="italic font-normal text-brand-primary">to the World.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-light text-gray-300 leading-relaxed font-serif"
                    >
                        Kerala is more than a place. It is a collection of flavours, traditions, ingredients, and memories passed from one generation to the next.
                    </motion.p>
                </div>

                {/* Bottom Creed Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-md border-t border-white/10 py-4 px-6 hidden md:block">
                    <div className="max-w-[1200px] mx-auto flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-gray-400 font-medium">
                        <span>Born in Kerala</span>
                        <span>•</span>
                        <span>Rooted in Tradition</span>
                        <span>•</span>
                        <span>Inspired by Nature</span>
                        <span>•</span>
                        <span>Created for Today</span>
                        <span>•</span>
                        <span>Shared with the World</span>
                    </div>
                </div>
            </section>

            {/* Breadcrumb Navigation Strip */}
            <div className="w-full bg-white border-b border-gray-200 py-3.5 px-6 sm:px-12">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="text-[10px] uppercase tracking-[0.25em] font-medium text-gray-400 hover:text-black transition-colors flex items-center gap-1.5">
                            <ArrowLeft className="w-3 h-3" /> Home
                        </Link>
                        <span className="text-gray-300 text-xs">/</span>
                        <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-brand-primary">
                            Our Story
                        </span>
                    </div>

                    <a 
                        href="https://www.instagram.com/akodfood?igsi=amh2dWo4aXB4eDdt" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500 hover:text-black flex items-center gap-1.5 transition-colors"
                    >
                        <Instagram className="w-3.5 h-3.5 text-brand-primary" />
                        <span>@akodfood</span>
                    </a>
                </div>
            </div>

            {/* Chapter 01: The Essence */}
            <section className="py-20 md:py-32 max-w-[1200px] mx-auto px-6 sm:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    
                    <motion.div {...fadeUp} className="lg:col-span-6 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-brand-primary">
                                Chapter 01
                            </span>
                            <span className="w-8 h-[1px] bg-brand-primary"></span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-gray-900 leading-tight">
                            Where Tradition Meets a New Generation.
                        </h2>
                        <p className="text-sm font-light text-gray-600 leading-loose">
                            From the intoxicating aroma of pure coconut oil simmering in a traditional wood-fire kitchen to the crisp snap of freshly sliced banana chips, from the earthy depth of tapioca roots to the tropical sweetness of ripe jackfruit and raw forest honey—Kerala has always maintained an extraordinary intimacy with nature and food.
                        </p>
                        <p className="text-sm font-light text-gray-600 leading-loose">
                            At AKOD Foods, we are inspired by this sacred connection. Our mission is about discovering, preserving, and presenting the culinary treasures of Kerala in an elevated format that delights today&apos;s generation.
                        </p>

                        <div className="pt-4 border-t border-gray-200">
                            <p className="font-serif italic text-base text-gray-900">
                                &ldquo;Traditional at heart. Modern in approach. Kerala in every inspiration.&rdquo;
                            </p>
                        </div>
                    </motion.div>

                    <motion.div {...fadeUp} className="lg:col-span-6 relative h-[360px] sm:h-[420px] md:h-[460px] w-full bg-[#faf9f6] border border-gray-200 p-4 shadow-xl flex items-center justify-center">
                        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                            <Image 
                                src="/4.jpeg" 
                                alt="Authentic Traditional Kerala Cooking" 
                                fill 
                                className="object-contain p-2 hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                        <div className="absolute -bottom-5 -right-3 bg-black text-white p-4 max-w-xs border border-gray-800 hidden sm:block z-10">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-brand-primary font-semibold mb-1">Our Heritage</p>
                            <p className="text-xs font-light text-gray-300">Small batch wood-fire cooking with zero shortcuts.</p>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Chapter 02: The Four Pillars of Snacking (Showcase Grid) */}
            <section className="py-20 md:py-28 bg-white border-y border-gray-200">
                <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
                    
                    <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <div className="inline-flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                            <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-brand-primary">
                                Chapter 02
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-gray-900 tracking-tight">
                            The Kerala Snack Collection
                        </h2>
                        <p className="text-sm font-light text-gray-500 leading-relaxed">
                            Crafted from pristine hand-selected ingredients and cold-pressed coconut oil, celebrated for distinct aroma and uncompromised crunch.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {snacks.map((snack, idx) => (
                            <motion.div
                                key={snack.title}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group bg-[#faf9f6] border border-gray-200/80 hover:border-black transition-all duration-500 flex flex-col p-5 relative"
                            >
                                <div className="relative aspect-square w-full bg-white border border-gray-200/60 flex items-center justify-center p-6 mb-5 overflow-hidden">
                                    <Image
                                        src={snack.image}
                                        alt={snack.title}
                                        fill
                                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <span className="absolute top-2.5 left-2.5 bg-black text-white text-[8px] uppercase tracking-widest px-2 py-0.5 font-medium">
                                        0{idx + 1}
                                    </span>
                                </div>

                                <div className="flex flex-col flex-1 justify-between text-center">
                                    <div>
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-brand-primary block mb-1">
                                            {snack.tag}
                                        </span>
                                        <h3 className="font-serif text-lg font-light text-gray-900 mb-2 italic">
                                            {snack.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-light leading-relaxed">
                                            {snack.desc}
                                        </p>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-gray-200/80">
                                        <Link 
                                            href="/products" 
                                            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-900 group-hover:text-brand-primary transition-colors"
                                        >
                                            <span>Shop Category</span>
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Chapter 03: Nature's Nectars, Coconut & Botanical Wellness */}
            <section className="py-20 md:py-32 max-w-[1200px] mx-auto px-6 sm:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <motion.div {...fadeUp} className="max-w-xl space-y-3">
                        <div className="inline-flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-brand-primary">
                                Chapter 03
                            </span>
                            <span className="w-8 h-[1px] bg-brand-primary"></span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-gray-900 tracking-tight">
                            Honey, Coconut & Botanicals
                        </h2>
                        <p className="text-sm font-light text-gray-500 leading-relaxed">
                            Beyond snacks, Kerala’s flora offers incredible daily sustenance. From raw multifloral forest honey to versatile botanical staples.
                        </p>
                    </motion.div>

                    <motion.div {...fadeUp} className="hidden md:block">
                        <Link 
                            href="/products" 
                            className="text-xs uppercase tracking-[0.2em] font-medium text-gray-900 hover:text-brand-primary border-b border-black hover:border-brand-primary pb-1 transition-colors"
                        >
                            View All Formats
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {botanicals.map((item, idx) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            viewport={{ once: true }}
                            className="bg-white border border-gray-200 p-6 sm:p-7 hover:border-black transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-primary block mb-2">
                                    {item.tag}
                                </span>
                                <h3 className="font-serif text-xl font-light text-gray-900 mb-3 italic">
                                    {item.title}
                                </h3>
                                <p className="text-xs font-light text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>

                            <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between text-gray-400">
                                <span className="text-[9px] uppercase tracking-widest font-mono">
                                    AKOD &bull; 0{idx + 1}
                                </span>
                                <Compass className="w-3.5 h-3.5 text-brand-primary" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Chapter 04: Philosophy & Global Vision (Dark Atelier Experience) */}
            <section className="py-24 md:py-36 bg-black text-white border-t border-gray-900">
                <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                        
                        <motion.div {...fadeUp} className="lg:col-span-7 space-y-8">
                            <div className="inline-flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-[0.35em] text-brand-primary font-semibold">
                                    Our Creed & Vision
                                </span>
                            </div>

                            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white leading-tight">
                                A food brand must have roots. Ours are in Kerala.
                            </h2>

                            <p className="text-sm sm:text-base font-light text-gray-400 leading-relaxed">
                                Having deep roots does not mean standing still. We continuously explore new recipes, experiment with authentic spice profiles, and bring traditional South Indian ingredients to modern kitchens around the world.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-800">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-brand-primary">
                                        <Flame className="w-4 h-4" />
                                        <h4 className="text-xs uppercase tracking-widest font-medium text-white">Tradition</h4>
                                    </div>
                                    <p className="text-[11px] font-light text-gray-400 leading-relaxed">
                                        Small-batch wood-fire kettles, genuine heritage recipes, zero industrial shortcuts.
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-brand-primary">
                                        <HeartHandshake className="w-4 h-4" />
                                        <h4 className="text-xs uppercase tracking-widest font-medium text-white">Innovation</h4>
                                    </div>
                                    <p className="text-[11px] font-light text-gray-400 leading-relaxed">
                                        New-generation flavour blends, convenient pantry packaging, contemporary formats.
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-brand-primary">
                                        <ShieldCheck className="w-4 h-4" />
                                        <h4 className="text-xs uppercase tracking-widest font-medium text-white">Integrity</h4>
                                    </div>
                                    <p className="text-[11px] font-light text-gray-400 leading-relaxed">
                                        100% natural, farm-fresh Nendran bananas, pure cold-pressed coconut oil.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Direct Atelier Card */}
                        <motion.div {...fadeUp} className="lg:col-span-5 bg-[#141414] border border-gray-800 p-8 sm:p-10 space-y-6">
                            <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-brand-primary block">
                                Global Headquarters
                            </span>
                            
                            <h3 className="font-serif text-2xl text-white font-light">
                                AKOD Foods
                            </h3>

                            <div className="space-y-4 text-xs font-light text-gray-300">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0 mt-1" />
                                    <p className="leading-relaxed">
                                        KK TOWER, NALLAMTHANNI,<br />
                                        EDAKKARA, MALAPPURAM DT,<br />
                                        KERALA, INDIA
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Phone className="w-4 h-4 text-brand-primary flex-shrink-0" />
                                    <a href="tel:+919048713538" className="hover:text-white transition-colors underline">
                                        +91 90487 13538
                                    </a>
                                </div>

                                <div className="flex items-center gap-3 pt-1">
                                    <Instagram className="w-4 h-4 text-brand-primary flex-shrink-0" />
                                    <a 
                                        href="https://www.instagram.com/akodfood?igsi=amh2dWo4aXB4eDdt" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors underline"
                                    >
                                        @akodfood on Instagram
                                    </a>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-800">
                                <Link 
                                    href="/products" 
                                    className="w-full inline-block bg-white text-black text-[10px] uppercase tracking-[0.25em] font-medium py-4 text-center hover:bg-brand-primary transition-colors"
                                >
                                    Shop The Entire Range
                                </Link>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

        </div>
    );
}
