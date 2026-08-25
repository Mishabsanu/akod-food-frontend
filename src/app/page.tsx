"use client";

import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, ArrowUpRight, ShieldCheck, Flame, Leaf, Sparkles, Mail, Check } from "lucide-react";

import { customerApi } from "@/lib/api";

export default function Home() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          customerApi.getProducts({ limit: 4 }),
          customerApi.getCategories()
        ]);
        setAllProducts(prodRes.data.data || []);
        setCategories(catRes.data.data || []);
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fadeUp: any = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.15 }
  };

  const slides = [
    {
      id: 1,
      tag: "Freshly Made",
      title: "Perfectly <br /> Crunchy Chips.",
      desc: "Authentic South Indian snacks made with fresh ingredients and traditional methods. Taste the difference of handmade quality.",
      img: "/hero-1.png",
      linkText: "Shop All Products"
    },
    {
      id: 2,
      tag: "Traditional Taste",
      title: "Real <br /> Natural Flavor.",
      desc: "Our snacks are made using the best bananas and spices from Kerala. No artificial colors or flavors, just pure taste.",
      img: "/hero-2.png",
      linkText: "Explore Flavors"
    },
    {
      id: 3,
      tag: "Small Batch Quality",
      title: "Handmade <br /> with Care.",
      desc: "Every bag is packed with snacks made in small batches to ensure you get the freshest quality every time.",
      img: "/hero-3.png",
      linkText: "View Shop"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const fallbackCategories = [
    {
      _id: "banana-chips",
      name: "Traditional Banana Chips",
      description: "Crispy Kerala Nendran slices prepared in pure cold-pressed coconut oil",
      image: "/5.jpg",
      isComingSoon: false
    },
    {
      _id: "flavoured-chips",
      name: "Flavoured Banana Chips",
      description: "Fiery red chili, peri-peri & new-generation heritage spice blends",
      image: "/4.jpeg",
      isComingSoon: true
    },
    {
      _id: "jackfruit-chips",
      name: "Jackfruit Chips (Chakka)",
      description: "Naturally sweet, aromatic tropical crunch from fresh Kerala jackfruit",
      image: "/3.jpeg",
      isComingSoon: true
    },
    {
      _id: "tapioca-chips",
      name: "Tapioca Chips (Kappa)",
      description: "Handcrafted crunch from pristine farm-fresh cassava roots",
      image: "/2.jpeg",
      isComingSoon: true
    }
  ];

  const getCategoryImage = (cat: any, index: number) => {
    if (cat.image && cat.image !== "/placeholder.png") return cat.image;
    const fallbacks = ["/5.jpg", "/4.jpeg", "/3.jpeg", "/2.jpeg", "/1.jpeg"];
    return fallbacks[index % fallbacks.length];
  };

  // Ensure all 4 grid columns are always filled: active DB categories first, followed by Coming Soon previews
  const displayCategories = (() => {
    if (!categories || categories.length === 0) return fallbackCategories;
    
    // Map active backend categories
    const activeCats = categories.map(c => ({
      ...c,
      isComingSoon: false
    }));

    if (activeCats.length >= 4) return activeCats;
    
    // Fill remaining slots with upcoming preview categories
    const combined = [...activeCats];
    for (const fb of fallbackCategories) {
      if (combined.length >= 4) break;
      const alreadyHas = combined.some(c => 
        c._id === fb._id || 
        (c.name && fb.name && c.name.toLowerCase().includes(fb.name.toLowerCase().split(' ')[0]))
      );
      if (!alreadyHas) {
        combined.push({ ...fb, isComingSoon: true });
      }
    }
    while (combined.length < 4) {
      const fb = fallbackCategories[combined.length % fallbackCategories.length];
      combined.push({ ...fb, _id: `${fb._id}-${combined.length}`, isComingSoon: true });
    }
    return combined;
  })();

  return (
    <div className="flex flex-col w-full bg-[#faf9f6] selection:bg-brand-primary/20 selection:text-black min-h-screen">

      {/* Cinematic Full-Width Hero Carousel */}
      <section className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden bg-black flex items-center justify-center group">

        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            {/* Background Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              src={slide.img}
              alt={slide.tag}
              fill
              className={`w-full h-full object-cover transition-transform duration-[6s] ease-out ${idx === currentSlide ? "scale-105" : "scale-100"}`}
              priority={idx === 0}
            />
            {/* Dark Gradient Overlay for perfect text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Slide Content */}
            <div className="absolute inset-x-0 bottom-0 pb-24 md:pb-32 px-6 sm:px-12 lg:px-24">
              <div className="max-w-[1400px] mx-auto text-white">
                <div className={`transition-all duration-1000 delay-300 ${idx === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                  <p className="text-[10px] uppercase tracking-[0.4em] mb-4 font-medium text-white/70">
                    {slide.tag}
                  </p>
                  <h1
                    className="text-5xl md:text-7xl lg:text-[7rem] font-serif font-light mb-6 leading-[1.1] tracking-tight drop-shadow-lg"
                    dangerouslySetInnerHTML={{ __html: slide.title }}
                  />
                  <p className="text-sm md:text-base text-gray-200 font-light leading-relaxed mb-10 max-w-lg drop-shadow-md">
                    {slide.desc}
                  </p>
                  <Link
                    href="/products"
                    className="group/btn inline-flex items-center gap-6"
                  >
                    <div className="flex items-center justify-center w-14 h-14 rounded-full border border-white/50 group-hover/btn:border-white transition-colors duration-500 bg-black/20 backdrop-blur-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-white transition-transform duration-500 group-hover/btn:scale-150"></div>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.25em] text-white font-medium group-hover/btn:tracking-[0.3em] transition-all duration-500">
                      {slide.linkText}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Global Navigation Controls - Bottom Right */}
        <div className="absolute right-6 md:right-12 bottom-12 z-30 flex items-center space-x-3">
          <button
            onClick={prevSlide}
            className="p-3 border border-white/30 rounded-full text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-md bg-black/10"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1} />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 border border-white/30 rounded-full text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-md bg-black/10"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1} />
          </button>
        </div>

        {/* Dash Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-[2px] transition-all duration-500 ${idx === currentSlide ? "w-12 bg-white" : "w-6 bg-white/30 hover:bg-white/50"}`}
            />
          ))}
        </div>

      </section>

      {/* The Origin / Manifesto Showcase */}
      <section id="story" className="py-24 md:py-36 bg-[#faf9f6] border-y border-stone-200/80">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Narrative Column */}
            <motion.div {...fadeUp} className="lg:col-span-6 space-y-8">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  <p className="text-[10px] uppercase tracking-[0.35em] font-semibold text-brand-primary">
                    Our Origin & Heritage
                  </p>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-stone-900 leading-[1.15] tracking-tight mb-4">
                  From the Richness of Kerala <br className="hidden sm:inline" />
                  <span className="italic font-normal text-brand-primary">to the World.</span>
                </h2>
                <div className="w-12 h-[1.5px] bg-brand-primary mb-6"></div>
                <p className="text-base sm:text-lg font-serif italic text-stone-700 leading-relaxed">
                  &ldquo;Kerala is more than a place. It is a collection of flavours, traditions, and memories passed from one generation to the next.&rdquo;
                </p>
              </div>

              <p className="text-sm font-light text-stone-600 leading-loose">
                From the aroma of pure coconut oil simmering in wood-fire kettles to the crunch of hand-sliced Nendran banana chips, AKOD Foods is dedicated to preserving authentic Kerala culinary traditions while crafting exciting new flavours for today&apos;s global palate.
              </p>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
                <div className="p-3.5 bg-white border border-stone-200/70">
                  <span className="text-[9px] font-mono font-medium text-brand-primary block mb-1">01 / TRADITION</span>
                  <h4 className="font-serif text-xs font-medium text-stone-900 mb-1">Wood-Fire Kettles</h4>
                  <p className="text-[11px] text-stone-500 font-light leading-relaxed">Handmade in small batches in brass Urulis.</p>
                </div>

                <div className="p-3.5 bg-white border border-stone-200/70">
                  <span className="text-[9px] font-mono font-medium text-brand-primary block mb-1">02 / PURITY</span>
                  <h4 className="font-serif text-xs font-medium text-stone-900 mb-1">Cold-Pressed Oil</h4>
                  <p className="text-[11px] text-stone-500 font-light leading-relaxed">100% pure coconut oil, zero palm oil.</p>
                </div>

                <div className="p-3.5 bg-white border border-stone-200/70">
                  <span className="text-[9px] font-mono font-medium text-brand-primary block mb-1">03 / EVOLUTION</span>
                  <h4 className="font-serif text-xs font-medium text-stone-900 mb-1">New Generation</h4>
                  <p className="text-[11px] text-stone-500 font-light leading-relaxed">Heritage favorites met with modern flavors.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/story"
                  className="group inline-flex items-center gap-3 px-8 py-3.5 bg-black text-white text-[10px] uppercase tracking-[0.25em] font-medium hover:bg-brand-primary hover:text-black transition-all shadow-md"
                >
                  <span>Explore Our Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Layered Photography Frame */}
            <motion.div {...fadeUp} className="lg:col-span-6 relative">
              <div className="relative h-[380px] sm:h-[460px] md:h-[500px] w-full bg-[#faf9f6] border border-stone-200 p-4 shadow-xl flex items-center justify-center">
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/4.jpeg"
                    alt="Authentic Kerala Woodfire Cooking"
                    fill
                    className="object-contain p-2 hover:scale-105 transition-transform duration-1000"
                  />
                </div>

                {/* Floating Top Left Badge */}
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 border border-white/20 backdrop-blur-md z-10">
                  <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-brand-primary">
                    Artisanal Heritage
                  </span>
                </div>

                {/* Floating Bottom Inset Card */}
                <div className="absolute -bottom-6 -left-4 bg-white border border-stone-200 p-3.5 shadow-xl max-w-[240px] hidden sm:block z-10">
                  <p className="text-[9px] uppercase tracking-widest text-brand-primary font-semibold mb-1">
                    Authentic Kerala
                  </p>
                  <p className="text-xs font-light text-stone-700 leading-snug">
                    Small-batch handmade cooking, preserving real taste & crunchy goodness.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* The Collection (Asymmetrical Grid) */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <motion.div {...fadeUp} className="max-w-md">
              <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-4 font-light">Our Collection</h2>
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                Check out our best-selling snacks, made using traditional methods to keep the real flavor.
              </p>
            </motion.div>
            <motion.div {...fadeUp} className="hidden md:block pb-2">
              <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] font-light text-black hover:text-brand-primary transition-colors border-b border-black hover:border-brand-primary pb-1">
                View Collection
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          >
            {allProducts.map((product, index) => (
              <motion.div
                variants={fadeUp}
                key={product._id}
                className={index % 2 === 0 ? "md:-translate-y-8" : "md:translate-y-8"}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-20 text-center md:hidden">
            <Link href="/products" className="text-[10px] uppercase tracking-[0.2em] font-light text-black hover:text-brand-primary transition-colors border-b border-black pb-1">
              View Collection
            </Link>
          </div>
        </div>
      </section>

      {/* The Process - Oversized Typographic Structured Grid */}
      <section className="py-32 md:py-48 bg-[#faf9f6] border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-24 gap-12">
            <motion.div {...fadeUp} className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.4em] mb-6 font-medium text-brand-primary">Our Method</p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-gray-900 leading-tight">How We <br /> Make It.</h2>
            </motion.div>
            <motion.div {...fadeUp} className="max-w-md lg:mt-12">
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                We respect the traditional methods Kerala has celebrated for generations. From hand-selected farm harvests to small-batch wood-fire cooking in pure coconut oil.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-16 lg:gap-x-12 relative">
            {/* Subtle dividing line on desktop */}
            <div className="hidden lg:block absolute top-[80px] left-0 w-full h-[1px] bg-gray-200"></div>

            {[
              { num: "01", title: "Hand Harvest", desc: "Carefully selected raw Nendran bananas, mature jackfruit, and fresh tapioca roots harvested directly from Kerala's fertile soil." },
              { num: "02", title: "Pure Coconut Oil", desc: "Prepared exclusively in 100% pure coconut oil—the quintessential ingredient defining Kerala's authentic aroma and unmistakable golden crispness." },
              { num: "03", title: "Wood-fire Kettles", desc: "We reject industrial shortcuts. Small batches are slow-cooked over open wood fires in traditional brass Urulis for classic and new-generation flavours." }
            ].map((step, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
                key={idx}
                className="flex flex-col relative z-10 pt-4"
              >
                <div className="text-7xl md:text-8xl font-serif font-light text-gray-200 mb-8 tracking-tighter">
                  {step.num}
                </div>
                <h3 className="text-2xl font-serif mb-6 text-gray-900">{step.title}</h3>
                <p className="text-sm font-light text-gray-500 leading-loose">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Showcase (Our Range) */}
      <section className="py-24 md:py-32 bg-white border-t border-stone-200/70">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-18 gap-6">
            <motion.div {...fadeUp} className="max-w-xl">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                <p className="text-[11px] uppercase tracking-[0.35em] font-semibold text-brand-primary">
                  Our Range
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-stone-900 tracking-tight">
                Shop by Category
              </h2>
              <p className="text-sm text-stone-500 font-light mt-3 leading-relaxed max-w-md">
                Handcrafted South Indian delicacies, prepared in small batches using pure coconut oil, fresh natural ingredients, and time-honored recipes.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="hidden md:flex pb-2">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium text-stone-900 hover:text-brand-primary transition-colors pb-1 border-b border-stone-900 hover:border-brand-primary"
              >
                <span>View All Products</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>

          {/* Cards Grid - Sharp Square Minimalist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {displayCategories.map((cat: any, idx: number) => {
              const catImage = getCategoryImage(cat, idx);
              const isComingSoon = Boolean(cat.isComingSoon);
              const targetUrl = isComingSoon
                ? "/story"
                : cat._id && typeof cat._id === "string" && cat._id.length === 24
                ? `/products?category=${cat._id}`
                : `/products?category=${encodeURIComponent(cat.name || cat._id)}`;

              return (
                <motion.div
                  key={cat._id || idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <Link
                    href={targetUrl}
                    className={`group flex flex-col h-full bg-white p-4 sm:p-5 border transition-all duration-500 relative ${
                      isComingSoon ? "border-gray-200 hover:border-gray-400" : "border-gray-200/80 hover:border-black shadow-sm"
                    }`}
                  >
                    {/* Dedicated Square Image Showcase Stage */}
                    <div className="relative aspect-square w-full bg-[#faf9f6] flex items-center justify-center p-6 mb-5 overflow-hidden">
                      <Image
                        src={catImage}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-contain w-full h-full p-2 transition-transform duration-700 ease-out group-hover:scale-105 ${
                          isComingSoon ? "opacity-90" : "opacity-100"
                        }`}
                      />

                      {/* Status Badges */}
                      {isComingSoon ? (
                        <div className="absolute top-3 left-3 bg-stone-900 text-stone-100 text-[8px] uppercase tracking-[0.25em] px-2.5 py-1 font-medium shadow-sm">
                          Coming Soon
                        </div>
                      ) : (
                        <div className="absolute top-3 left-3 bg-white/90 border border-gray-200 text-green-800 text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 font-medium shadow-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                          Available
                        </div>
                      )}

                      {/* Top Right Action Icon */}
                      <div className="absolute top-3 right-3 w-7 h-7 bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Metadata & Title */}
                    <div className="flex flex-col flex-1 justify-between text-center">
                      <div>
                        <h3 className="font-serif text-lg font-light text-gray-900 mb-2 italic tracking-tight group-hover:text-black transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-light line-clamp-2 leading-relaxed mb-4">
                          {cat.description || "Authentic handmade Kerala recipe made in small wood-fire batches."}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors ${
                          isComingSoon ? "text-stone-400 group-hover:text-stone-700" : "text-gray-500 group-hover:text-black"
                        }`}>
                          {isComingSoon ? "Seasonal Preview" : "Explore Range"}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>

                    {/* Bottom Accent Hover Line */}
                    {!isComingSoon && (
                      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500"></div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-primary transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose AKOD: Natural & Pure Section */}
      <section className="py-24 md:py-32 bg-[#faf9f6] border-t border-gray-200/80">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
          >
            {/* Left Framed Showcase Stage */}
            <motion.div variants={fadeUp} className="lg:col-span-6 relative">
              <div className="relative h-[440px] sm:h-[540px] lg:h-[600px] bg-white border border-gray-200 p-8 sm:p-12 shadow-sm overflow-hidden flex items-center justify-center group">
                <Image 
                  src="/4.jpeg" 
                  alt="AKOD Natural Kerala Harvest" 
                  fill 
                  className="object-contain p-6 sm:p-10 transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                
                {/* Floating Heritage Badge */}
                <div className="absolute top-6 left-6 bg-black text-white px-3.5 py-1.5 text-[8px] uppercase tracking-[0.3em] font-medium shadow-md">
                  100% Traditional Sourcing
                </div>

                {/* Subtitle bottom banner */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 border border-gray-200 backdrop-blur-sm p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-brand-primary font-semibold block">Artisanal Purity</span>
                    <p className="text-xs text-gray-900 font-serif font-light">Small Wood-Fire Batches in Brass Urulis</p>
                  </div>
                  <Sparkles className="w-4 h-4 text-brand-primary flex-shrink-0" />
                </div>
              </div>
            </motion.div>

            {/* Right Content & 4 Quality Pillars */}
            <motion.div variants={fadeUp} className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-brand-primary">Why Choose AKOD</span>
                <span className="text-gray-300">&bull;</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium">The Purity Standard</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 mb-6 font-light leading-tight">
                Natural, Authentic &amp; Pure.
              </h2>

              <p className="text-sm text-gray-600 font-light leading-relaxed mb-8">
                What sets AKOD apart is our refusal to take shortcuts. While commercial snacks rely on industrial palm oil and artificial enhancers, we honor Kerala&apos;s authentic wood-fire heritage. Every chip is sliced from hand-picked Nendran bananas and slow-crisped in 100% pure cold-pressed coconut oil.
              </p>

              {/* 4 Purity Pillars in a 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                <div className="p-4 bg-white border border-gray-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Leaf className="w-3.5 h-3.5 text-brand-primary" />
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-900">Pure Coconut Oil</h3>
                  </div>
                  <p className="text-[11px] font-light text-gray-500 leading-relaxed">
                    100% cold-pressed coconut oil with zero palm oil or chemical substitutes.
                  </p>
                </div>

                <div className="p-4 bg-white border border-gray-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Flame className="w-3.5 h-3.5 text-brand-primary" />
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-900">Wood-Fire Batches</h3>
                  </div>
                  <p className="text-[11px] font-light text-gray-500 leading-relaxed">
                    Slow-cooked in traditional brass kettles for an unmistakable artisanal aroma.
                  </p>
                </div>

                <div className="p-4 bg-white border border-gray-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-900">Farm-Direct Nendran</h3>
                  </div>
                  <p className="text-[11px] font-light text-gray-500 leading-relaxed">
                    Hand-harvested bananas directly from Kerala plantations for golden crunch.
                  </p>
                </div>

                <div className="p-4 bg-white border border-gray-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-900">Zero Additives</h3>
                  </div>
                  <p className="text-[11px] font-light text-gray-500 leading-relaxed">
                    No artificial preservatives or colorings. Just pure food as nature intended.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-6">
                <Link 
                  href="/products" 
                  className="inline-flex items-center gap-3 px-8 py-3.5 bg-black text-white text-[10px] uppercase tracking-[0.25em] font-medium hover:bg-brand-primary hover:text-black transition-colors shadow-sm"
                >
                  <span>Explore Provisions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link 
                  href="/story" 
                  className="text-[10px] uppercase tracking-[0.25em] font-medium text-gray-600 hover:text-black transition-colors underline underline-offset-8"
                >
                  Read Our Origin Story &rarr;
                </Link>
              </div>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Full-Width Newsletter Section: The AKOD Circle */}
      <section className="w-full py-28 md:py-36 bg-white border-t border-stone-200/80 relative overflow-hidden">
        {/* Subtle Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] md:text-[220px] font-serif font-light text-stone-100/50 pointer-events-none select-none tracking-widest whitespace-nowrap">
          AKOD FOODS
        </div>

        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 relative z-10">
          <motion.div 
            {...fadeUp}
            className="max-w-3xl mx-auto flex flex-col items-center text-center"
          >
            {/* Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
              <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-brand-primary">
                The AKOD Harvest Circle
              </span>
            </div>

            {/* Large Editorial Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-stone-900 mb-6 font-light leading-tight tracking-tight">
              Stay Connected to Kerala.
            </h2>

            {/* Narrative */}
            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed mb-10 max-w-xl">
              Join our private dispatch for stories from Kerala&apos;s heritage plantations, early access to limited seasonal harvests, and exclusive culinary offerings.
            </p>

            {/* Interactive Subscription Form */}
            {newsletterSubmitted ? (
              <div className="w-full max-w-lg p-6 bg-green-50 border border-green-200 text-green-900 flex items-center justify-center gap-3 animate-in fade-in duration-300">
                <div className="w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium tracking-wide">
                  Welcome to the AKOD Circle. Please check your inbox for our seasonal welcome note.
                </span>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    setNewsletterSubmitted(true);
                  }
                }}
                className="w-full max-w-xl flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-4 bg-[#faf9f6] border border-stone-300 text-xs font-light text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-black focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="px-9 py-4 bg-black text-white text-[10px] uppercase tracking-[0.25em] font-medium hover:bg-brand-primary hover:text-black transition-all shadow-md whitespace-nowrap"
                >
                  Subscribe &rarr;
                </button>
              </form>
            )}

            {/* Micro Purity Guarantees */}
            <div className="mt-12 pt-8 border-t border-stone-200/80 w-full flex flex-wrap items-center justify-center gap-8 text-[9px] uppercase tracking-[0.25em] text-stone-400 font-medium">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span> Zero Spam Guarantee
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span> Seasonal Private Offers
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span> Unsubscribe Anytime
              </span>
            </div>

          </motion.div>
        </div>
      </section>

    </div>
  );
}


