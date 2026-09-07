"use client";

import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { products as fallbackCatalog } from "@/data/products";

import { customerApi } from "@/lib/api";

export default function Home() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Instant Cache Hydration (0ms load)
    const cachedProds = customerApi.getCachedProducts();
    const cachedCats = customerApi.getCachedCategories();
    if (cachedProds && cachedProds.length > 0) {
      setAllProducts(cachedProds);
      setLoading(false);
    }
    if (cachedCats && cachedCats.length > 0) {
      setCategories(cachedCats);
    }

    // 2. Background Revalidation (stays dynamic & fresh without blocking UI)
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          customerApi.getProducts(),
          customerApi.getCategories()
        ]);
        const fetchedProds = prodRes.data?.data;
        const fetchedCats = catRes.data?.data;
        if (fetchedProds && fetchedProds.length > 0) {
          setAllProducts(fetchedProds);
        } else if (!cachedProds || cachedProds.length === 0) {
          setAllProducts(fallbackCatalog.map(p => ({ ...p, _id: p.id })));
        }
        if (fetchedCats && fetchedCats.length > 0) {
          setCategories(fetchedCats);
        }
      } catch (error) {
        console.error("Fetch failed", error);
        if (!cachedProds || cachedProds.length === 0) {
          setAllProducts(fallbackCatalog.map(p => ({ ...p, _id: p.id })));
        }
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

      {/* The Collection (All Products Grid) */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <motion.div {...fadeUp} className="max-w-xl">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                <p className="text-[10px] uppercase tracking-[0.35em] font-semibold text-brand-primary">
                  All Provisions & Snacks
                </p>
              </div>
              <h2 className="text-3xl lg:text-5xl font-serif text-gray-900 mb-4 font-light tracking-tight">Our Collection</h2>
              <p className="text-sm font-light text-gray-500 leading-relaxed max-w-lg">
                Handcrafted South Indian snacks and delicacies, prepared in small wood-fire batches using 100% pure coconut oil and natural ingredients.
              </p>
            </motion.div>
            <motion.div {...fadeUp} className="hidden md:block pb-2">
              <Link href="/products" className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-black hover:text-brand-primary transition-colors border-b border-black hover:border-brand-primary pb-1">
                <span>View Full Shop ({allProducts.length} Items)</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {loading && allProducts.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {allProducts.map((product) => (
                <motion.div
                  variants={fadeUp}
                  key={product._id || product.id}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-16 text-center md:hidden">
            <Link href="/products" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-brand-primary hover:text-black transition-colors">
              <span>View Full Shop ({allProducts.length} Items)</span>
              <ArrowRight className="w-3.5 h-3.5" />
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



    </div>
  );
}
