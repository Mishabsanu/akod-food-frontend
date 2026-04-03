"use client";

import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const curatedProducts = products.slice(0, 4);

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
      tag: "The Heritage Collection",
      title: "A Symphony <br /> of Crunch.",
      desc: "Elevating South Indian snacking to an art form. Discover our meticulously crafted chips, born from pristine ingredients and generations of mastery.",
      img: "/hero-1.png",
      linkText: "Explore The Atelier"
    },
    {
      id: 2,
      tag: "Wood-Fired Mastery",
      title: "Alchemists <br /> of Flavor.",
      desc: "Experience Jackfruit like never before. Hand-selected from the lush estates of Kerala and tossed in custom-blended spices.",
      img: "/hero-2.png",
      linkText: "Acquire Jackfruit"
    },
    {
      id: 3,
      tag: "The Authentic Process",
      title: "Elegance in <br /> Every Bag.",
      desc: "We refuse to automate the soul out of our process. Every batch is a small-batch, artisanal undertaking crafted for the sophisticated palate.",
      img: "/hero-3.png",
      linkText: "View Collection"
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
            <img
              src={slide.img}
              alt={slide.tag}
              className={`w-full h-full object-cover transition-transform duration-[6s] ease-out ${idx === currentSlide ? "scale-105" : "scale-100"}`}
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

      {/* The Manifesto / Read Our Story (Redesigned Editorial Style) */}
      <section id="story" className="py-24 md:py-40 px-6 sm:px-12 max-w-[1400px] mx-auto bg-[#faf9f6]">
        <motion.div
          {...fadeUp}
          className="flex flex-col md:flex-row items-start lg:items-center gap-12 lg:gap-24"
        >
          <div className="md:w-1/3">
            <h2 className="text-3xl lg:text-5xl font-serif text-gray-900 font-light mb-6">
              The Artisan <br /> Narrative.
            </h2>
            <div className="w-8 h-[1px] bg-brand-primary mb-6"></div>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            <p className="text-sm font-light text-gray-600 leading-loose">
              We believe that true luxury lies in the details. Every slice of our Nendran banana and Tapioca root is a testament to our uncompromising pursuit of perfection. By harmonizing ancestral recipes with contemporary refinement, we create a sensory experience that transcends ordinary snacking.
            </p>
            <p className="text-sm font-light text-gray-600 leading-loose">
              Our craft is a labor of love, demanding patience, precision, and an intimate understanding of raw materials. We don&apos;t just fry chips; we curate moments of pure, unadulterated indulgence for the sophisticated palate.
            </p>
          </div>
        </motion.div>
      </section>

      {/* The Collection (Asymmetrical Grid) */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <motion.div {...fadeUp} className="max-w-md">
              <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-4 font-light">The Collection</h2>
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                Our signature offerings, meticulously prepared using traditional kettle-cooked methods to preserve absolute flavor integrity.
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
            {curatedProducts.map((product, index) => (
              <motion.div
                variants={fadeUp}
                key={product.id}
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
              <p className="text-[10px] uppercase tracking-[0.4em] mb-6 font-medium text-brand-primary">Methodology</p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-gray-900 leading-tight">The Artisanal <br /> Process.</h2>
            </motion.div>
            <motion.div {...fadeUp} className="max-w-md lg:mt-12">
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                We refuse to automate the soul out of our food. Our process is a meticulous human endeavor, combining generational wisdom with the finest raw materials available in Kerala.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-16 lg:gap-x-12 relative">
            {/* Subtle dividing line on desktop */}
            <div className="hidden lg:block absolute top-[80px] left-0 w-full h-[1px] bg-gray-200"></div>

            {[
              { num: "01", title: "Hand Selection", desc: "Every ingredient is scrutinized. Only the most pristine Nendran bananas and flawless tapioca roots pass our rigorous selection process." },
              { num: "02", title: "Precision Slicing", desc: "Calibrated to the millimeter, our specialized slicing technique ensures a uniform surface area for perfectly consistent crispness." },
              { num: "03", title: "Wood-fire Kettles", desc: "We reject industrial fryers. Small batches are slow-fried over open wood fires in traditional brass Urulis, locking in a distinct heritage flavor." }
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

      {/* Categories / Editorials - Enhanced Sourcing */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
          >
            <motion.div variants={fadeUp} className="relative h-[500px] md:h-[700px] bg-[#faf9f6] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/4.jpeg" alt="Spices" className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-[3s] ease-out" />
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col justify-center max-w-lg lg:ml-10">
              <span className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-400 mb-6 block">The AKOD Difference</span>
              <h2 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-8 font-light leading-snug">Purity & Fire</h2>
              <p className="text-sm text-gray-500 font-light leading-loose mb-6">
                What makes AKOD extraordinary is our refusal to compromise. While the industry moves towards high-speed, automated production lines, we have deliberately stepped back in time.
              </p>
              <p className="text-sm text-gray-500 font-light leading-loose mb-12">
                We traverse the lush estates of Kerala to hand-select the purest variants. But the true secret lies in our mastery of the elements. Using pure, unrefined coconut oil heated precisely over wood-fired brass kettles, we achieve a texture and aroma that is impossible to replicate mechanically. It is an alchemy of nature, fire, and human touch.
              </p>
              <Link href="/products" className="group flex items-center gap-4 self-start">
                <span className="text-[10px] uppercase tracking-[0.2em] font-light text-black">Shop Origins</span>
                <div className="w-8 h-[1px] bg-black group-hover:w-16 transition-all duration-500"></div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer Pre-section */}
      <section className="py-32 bg-[#faf9f6] flex flex-col items-center justify-center text-center px-6">
        <motion.div {...fadeUp} className="max-w-xl">
          <h2 className="text-2xl font-serif text-gray-900 mb-4 font-light">Join the Atelier</h2>
          <p className="text-sm text-gray-500 font-light mb-10">Receive early access to seasonal collections and exclusive curations.</p>
          <div className="flex w-full items-center border-b border-gray-300 focus-within:border-black transition-colors px-2 pb-2">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent focus:outline-none text-sm font-light placeholder-gray-400"
            />
            <button className="px-4 text-[10px] uppercase tracking-[0.2em] hover:text-brand-primary transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}


