import { motion } from 'motion/react';
import { ArrowRight, Zap, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { ProductCard } from '../components/product/ProductCard';
import { SEO } from '../components/seo/SEO';

export function Home() {
  const { products, categories, isLoading } = useProductStore();
  const trendingProducts = products.filter(p => p.trending);
  const recentProducts = products.slice(0, 8); // Last 8 added products

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-black uppercase tracking-widest text-xs animate-pulse">Syncing with SmartFinds Cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Home" 
        description="Discover smart products for smarter living. Handpicked modern gadgets, home essentials, and tech finds."
        keywords="AliExpress tech deals, curated gadgets, smart home essentials, tech blog, trending AliExpress finds"
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 md:py-16 bg-white dark:bg-black">
        <div className="container relative z-10 mx-auto px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-[0.2em] rounded-lg mb-6 shadow-sm">
                <Zap size={14} className="fill-current" />
                Featured SuperDeals
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1] mb-8 text-gray-900 dark:text-white">
                CURATED <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                  SMART FINDS.
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Premium gadgets and home innovations verified by experts. <br className="hidden md:block" /> Get the best smart tech, hand-picked for quality.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/categories" className="w-full sm:w-auto px-10 py-5 bg-primary hover:bg-red-600 text-white font-black rounded-2xl shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 group active:scale-95">
                  Explore SuperDeals
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 bg-gray-100 dark:bg-zinc-900 px-6 py-4 rounded-2xl border border-gray-200/50 dark:border-white/5">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">+2.4k Joining Today</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 w-full max-w-[400px] sm:max-w-xl lg:max-w-none relative mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative aspect-square md:aspect-[4/3] w-full rounded-[40px] md:rounded-[60px] bg-gradient-to-br from-primary/5 to-orange-500/5 border border-primary/20 backdrop-blur-3xl p-6 md:p-10 flex flex-col items-center justify-center group shadow-[0_32px_64px_-16px_rgba(255,71,71,0.2)] overflow-hidden"
            >
              <div className="absolute top-8 left-8 bg-gray-900 text-white font-black text-xs px-4 py-2 rounded-xl z-20 shadow-xl border border-white/10 uppercase tracking-widest">
                Top Rated Choice
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-radial from-primary/10 to-transparent blur-3xl opacity-50"></div>
              
              <div className="w-full h-full rounded-[30px] md:rounded-[40px] overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl relative z-10 group-hover:rotate-1 transition-transform duration-700">
                 <img 
                   src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                   alt="Choice Smart Find" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                 />
              </div>

              {/* Floating Stat Card */}
              <div className="absolute bottom-8 right-8 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-2xl z-20 border border-gray-100 dark:border-white/5 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-orange-500 rounded-lg"><Zap size={18} className="fill-current" /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sold (24h)</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">1,500+</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-gray-200/50 dark:border-white/10 bg-white dark:bg-zinc-950 py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            <div className="flex items-center gap-4 group">
               <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                 <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                  <p className="font-black text-xs uppercase tracking-widest text-gray-900 dark:text-white leading-none mb-1">Verified</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Affiliate Partner</p>
               </div>
            </div>
            <div className="flex items-center gap-4 group">
               <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                 <Zap className="w-6 h-6" />
               </div>
               <div>
                  <p className="font-black text-xs uppercase tracking-widest text-gray-900 dark:text-white leading-none mb-1">Fast Global</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">7-10 Day Delivery</p>
               </div>
            </div>
            <div className="flex items-center gap-4 group">
               <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                 <Truck className="w-6 h-6" />
               </div>
               <div>
                  <p className="font-black text-xs uppercase tracking-widest text-gray-900 dark:text-white leading-none mb-1">Insured</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Secure Logistics</p>
               </div>
            </div>
            <div className="flex items-center gap-4 group">
               <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                 <ShoppingBag className="w-6 h-6" />
               </div>
               <div>
                  <p className="font-black text-xs uppercase tracking-widest text-gray-900 dark:text-white leading-none mb-1">SuperDeals</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Best Smart Finds</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Curation / Trust Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded mb-6">Our Methodology</div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-gray-900 dark:text-white leading-[1.1]">WHY TRUST <br />SMART<span className="text-primary italic">FINDS</span>?</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center shrink-0 border border-gray-200/50 dark:border-white/5">
                    <ShieldCheck className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-xs uppercase tracking-widest mb-2 dark:text-white">Expert Verification</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Every item in our collection undergoes a 48-hour vetting process. we check seller ratings, order history, and real user video reviews to ensure high-end quality.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center shrink-0 border border-gray-200/50 dark:border-white/5">
                    <Zap className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-xs uppercase tracking-widest mb-2 dark:text-white">Price Monitoring</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Our system tracks price fluctuations across stores to ensure the "SuperDeals" we feature are legitimate discounts and the best value for your money.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center shrink-0 border border-gray-200/50 dark:border-white/5">
                    <ShoppingBag className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-xs uppercase tracking-widest mb-2 dark:text-white">Real Logistics Hub</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">We only promote sellers who use premium tracked shipping methods, providing you with tracking and insurance on every single order.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                  <img src="https://images.unsplash.com/photo-1558562805-4bf1e2a724eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Gadget Review" className="w-full h-full object-cover" />
                </div>
                <div className="h-48 bg-primary rounded-3xl p-8 flex flex-col justify-end">
                  <p className="text-white font-black text-4xl">10k+</p>
                  <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Products Vetted</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-48 bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-8 flex flex-col justify-end border border-gray-200 dark:border-white/5">
                  <p className="text-gray-900 dark:text-white font-black text-4xl">4.9</p>
                  <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest">Trust Rating</p>
                </div>
                <div className="h-64 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                  <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Tech Lab" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 md:py-16 bg-gray-100 dark:bg-zinc-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center lg:text-left mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter text-gray-900 dark:text-white uppercase">Shop Categories</h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl font-medium">Browse our expert-verified collections by theme.</p>
          </div>
          
          <div className="flex overflow-x-auto pb-6 gap-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[160px] sm:w-auto"
              >
                <Link
                  to={`/categories?category=${encodeURIComponent(category)}`}
                  className="flex flex-col items-center justify-center p-6 md:p-10 bg-white dark:bg-zinc-900 rounded-3xl transition-all border border-gray-200/50 dark:border-white/5 hover:border-primary shadow-sm hover:shadow-xl hover:-translate-y-1 group text-center h-full active:scale-95"
                >
                  <span className="font-black text-xs sm:text-sm uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {category}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-10 md:py-16 bg-transparent">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10 md:mb-16">
              <div>
                <div className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded mb-4 shadow-lg shadow-primary/20">Trending Now</div>
                <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter text-gray-900 dark:text-white">SUPER DEALS</h2>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">Curated smart finds everyone loves.</p>
              </div>
              <Link to="/categories" className="hidden sm:flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em] hover:text-primary transition-colors text-gray-900 dark:text-white">
                View All Deals <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {trendingProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                />
              ))}
            </div>
            <div className="mt-12 text-center sm:hidden">
               <Link to="/categories" className="inline-flex items-center gap-3 font-black text-xs uppercase tracking-widest text-white bg-primary px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 transition-transform active:scale-95">
                  View All SuperDeals <ArrowRight size={16} />
               </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Finds */}
      <section className="py-10 md:py-16 bg-gray-50/50 dark:bg-zinc-900/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10 md:mb-14">
            <div>
              <div className="inline-block px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded mb-4">New Arrivals</div>
              <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter text-gray-900 dark:text-white">RECENT FINDS</h2>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">The latest hand-picked smart gadgets added to our collection.</p>
            </div>
            <Link to="/categories" className="hidden sm:flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em] hover:text-primary transition-colors text-gray-900 dark:text-white">
              SEE NEW DROPS <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {recentProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-[120px]" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-6 text-primary">
            <Zap size={24} className="fill-current" />
            <span className="font-black text-sm uppercase tracking-[0.3em]">Smart Club</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">DON'T MISS A DROP</h2>
          <p className="text-gray-400 mb-10 font-medium text-lg">Join our community of smart shoppers and get the best <br className="hidden md:block" /> hand-picked tech finds weekly in your inbox.</p>
          
          <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => { e.preventDefault(); alert("Subscribed! (Simulated)"); }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
            <button type="submit" className="px-10 py-5 bg-primary hover:bg-red-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-95">
              JOIN NOW
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
