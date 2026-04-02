"use client";

import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import { motion } from "framer-motion";

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  const fadeInUp: any = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
  };

  return (
    <div className="flex flex-col w-full bg-brand-background">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/1.jpeg" // Using actual image from the user
            alt="Premium Chips"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/95 via-brand-text/70 to-brand-text/30"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center"
        >
          <span className="text-brand-primary font-bold tracking-[0.3em] mb-6 text-xs md:text-sm uppercase bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm border border-brand-primary/20">
            Heritage • Quality • Craft
          </span>
          <h1 className="text-5xl md:text-8xl font-serif text-brand-bgLight mb-8 leading-[1.1] drop-shadow-2xl">
            The Art of <br />
            <span className="text-brand-primary italic font-light">Fine Snacking</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-2xl font-light mb-12 max-w-2xl mx-auto drop-shadow-md">
            Handcrafted banana, tapioca, and jackfruit chips, made from pristine ingredients for the ultimate luxury crunch.
          </p>
          <Link
            href="/products"
            className="group relative inline-flex items-center justify-center bg-brand-primary text-white px-10 py-5 overflow-hidden rounded-sm transition-all shadow-xl hover:shadow-brand-primary/50"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative text-sm tracking-[0.2em] font-medium uppercase group-hover:scale-105 transition-transform">
              Explore Collection
            </span>
          </Link>
        </motion.div>
      </section>

      {/* Shop Categories */}
      <section className="py-32 bg-brand-bgLight relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-text mb-6">
              Our Collections
            </h2>
            <div className="h-1 w-24 bg-brand-primary mx-auto opacity-50"></div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: "Banana Chips", image: "/2.jpeg", desc: "Classic & Premium Flavors" },
              { title: "Tapioca Chips", image: "/4.jpeg", desc: "Crunchy Root Snacks" },
              { title: "Jackfruit Chips", image: "/3.jpeg", desc: "Rare & Exotic Delicacy" }
            ].map((cat, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group relative h-[450px] overflow-hidden rounded-2xl cursor-pointer shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={cat.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-text/90 via-brand-text/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-brand-primary text-xs font-bold tracking-widest uppercase mb-2">{cat.desc}</p>
                    <h3 className="text-3xl font-serif text-white mb-4">{cat.title}</h3>
                    <Link href="/products" className="inline-block text-white border-b border-brand-primary pb-1 text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto md:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="flex flex-col md:flex-row justify-between items-end mb-16 px-4 md:px-0">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-text mb-4">Curated Selection</h2>
              <p className="text-gray-500 font-light text-lg">
                Discover our signature products, beloved by connoisseurs worldwide.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-6 md:mt-0 text-brand-text hover:text-brand-primary border-b border-brand-text hover:border-brand-primary transition-colors pb-1 uppercase tracking-widest text-sm font-semibold"
            >
              View All Products
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 md:px-0"
          >
            {featuredProducts.map((product) => (
              <motion.div variants={fadeInUp} key={product.id}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Process & Craft */}
      <section className="py-32 bg-white relative overflow-hidden text-center md:text-left border-t border-brand-bgAccent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-text mb-6">
              The Artisan Process
            </h2>
            <div className="h-1 w-24 bg-brand-primary mx-auto mb-10 opacity-50"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeInUp} className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] border border-gray-100">
              {/* Dummy Video Section */}
              <img src="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=1470&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Frying Process Video Snapshot" />
              <div className="absolute inset-0 bg-brand-text/40 flex flex-col items-center justify-center">
                <button className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 hover:bg-brand-primary text-white hover:border-brand-primary transition-all duration-300 group shadow-2xl">
                  <svg className="w-10 h-10 ml-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                </button>
                <p className="text-white mt-6 font-semibold uppercase tracking-widest text-sm drop-shadow-md">Watch How It&apos;s Made</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col justify-center space-y-8">
              <h3 className="text-3xl font-serif text-brand-text leading-snug">
                From Soil to Snack: <br /><span className="italic text-brand-primary font-light">Rooted in Tradition</span>
              </h3>
              <p className="text-gray-500 leading-relaxed font-light text-lg text-left">
                For over three generations, we have maintained the sacred art of chip-making. It starts with handpicking the finest Nendran bananas and tapioca roots straight from local Kerala farms, ensuring unparalleled freshness and flavor.
              </p>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-brand-bgLight rounded-2xl border border-brand-bgAccent shadow-sm">
                <div className="w-32 h-32 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-shrink-0 p-2">
                  <img src="/sketch.png" alt="Hand drawn sketch of frying banana chips" className="w-full h-full object-cover grayscale opacity-90 sepia" />
                </div>
                <div className="text-left">
                  <p className="font-serif text-xl text-brand-text mb-2">The Authentic Crunch</p>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">
                    Every batch is slow-fried in traditional woks over wood fires, capturing the artisan spirit and bringing the timeless taste of our heritage to every bite.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-brand-bgAccent relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-text mb-6">
              The AKOD FOOD Difference
            </h2>
            <div className="h-1 w-24 bg-brand-primary mx-auto mb-10 opacity-50"></div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          >
            <motion.div variants={fadeInUp} className="p-10 bg-white shadow-2xl rounded-tr-[4rem] rounded-bl-[4rem] border border-white hover:border-brand-primary/20 transition-colors duration-500">
              <div className="h-20 w-20 bg-brand-bgLight text-brand-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </div>
              <h3 className="text-2xl font-serif mb-4 text-brand-text">Pristine Ingredients</h3>
              <p className="text-gray-500 font-light text-base leading-relaxed">
                We source only the most premium potatoes, plantains, and single-origin spices. Zero compromises on quality.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="p-10 bg-brand-text shadow-2xl rounded-tr-[4rem] rounded-bl-[4rem] transform mt-0 md:-mt-10 relative">
              <div className="h-20 w-20 bg-brand-primary text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-2xl font-serif mb-4 text-white">Artisan Crafted</h3>
              <p className="text-gray-300 font-light text-base leading-relaxed">
                Handcrafted in small batches by master chefs using traditional kettle-cooked methods to preserve the perfect crunch.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="p-10 bg-white shadow-2xl rounded-tr-[4rem] rounded-bl-[4rem] border border-white hover:border-brand-primary/20 transition-colors duration-500">
              <div className="h-20 w-20 bg-brand-bgLight text-brand-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-serif mb-4 text-brand-text">Unforgettable Flavors</h3>
              <p className="text-gray-500 font-light text-base leading-relaxed">
                From truffles to saffron, our exotic flavor profiles are meticulously developed to indulge your sophisticated palate.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-text mb-6">
              What Our Patrons Say
            </h2>
            <div className="h-1 w-24 bg-brand-primary mx-auto opacity-50"></div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              {
                text: "The spicy banana chips are absolutely incredible! The crunch and freshness is unmatched compared to anything I've bought at the supermarket.",
                author: "Priya M."
              },
              {
                text: "I ordered the Jackfruit chips and the Sweet Tapioca chips. The quality is premium and the packaging kept everything perfectly intact.",
                author: "Rahul K."
              },
              {
                text: "As someone who loves authentic snacks, this is the only place I buy from now. The Sarkara Upperi is exactly how my grandmother used to make it.",
                author: "Sneha V."
              }
            ].map((test, idx) => (
              <motion.div variants={fadeInUp} key={idx} className="bg-brand-bgLight p-10 rounded-xl shadow-md border border-brand-bgAccent hover:shadow-xl transition-shadow duration-500">
                <div className="flex text-brand-primary mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  ))}
                </div>
                <p className="text-gray-600 font-light italic mb-8 leading-relaxed text-lg">&quot;{test.text}&quot;</p>
                <div className="font-semibold text-brand-text text-sm uppercase tracking-widest">- {test.author}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 bg-brand-text relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-brand-primary opacity-10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[600px] h-[600px] bg-brand-primary opacity-10 rounded-full blur-[100px]"></div>

        <motion.div
          {...fadeInUp}
          className="max-w-4xl mx-auto px-4 relative z-10 text-center"
        >
          <span className="text-brand-primary font-bold tracking-[0.3em] mb-4 text-xs md:text-sm uppercase inline-block">
            Priority Access
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-bgLight mb-6">
            Join the AKOD FOOD Family
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light">
            Subscribe to our newsletter and get 15% off your first order of premium chips and luxury snacks.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 px-8 py-5 rounded-none bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:bg-white/10 transition-all font-light"
            />
            <button
              type="submit"
              className="bg-brand-primary text-white px-10 py-5 rounded-none font-semibold uppercase tracking-widest text-sm hover:bg-white hover:text-brand-text transition-colors duration-500"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
