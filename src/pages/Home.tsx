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
          <p className="text-gray-500 font-black uppercase tracking-widest text-xs animate-pulse">Syncing with Smart Living Finds Cloud...</p>
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
      <section className="relative min-h-[75vh] flex items-center overflow-hidden pt-4 pb-10 md:pt-8 md:pb-16 bg-white dark:bg-[#050505]">
        {/* Atmospheric Background Effects */}
        <div className="atmospheric-blur opacity-60 dark:opacity-40" />
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-5%] right-[-5%] w-[55%] h-[55%] bg-primary/20 blur-[130px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-orange-500/10 blur-[110px] rounded-full" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-10 lg:px-16 max-w-7xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-[0.4em] rounded-full mb-6 shadow-2xl">
                <Zap size={14} className="fill-current text-primary" />
                Curating the Next-Gen
              </div>
              <h1 className="text-6xl sm:text-8xl lg:text-[110px] font-black tracking-[-0.05em] leading-[0.82] mb-6 text-black dark:text-white uppercase font-display">
                FUTURE <br />
                <span className="text-white dark:text-zinc-900 bg-primary px-4 py-1 -rotate-2 inline-block shadow-2xl">
                  SMART
                </span> <br />
                LIVING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-900 dark:from-zinc-100 dark:to-zinc-500">
                  FINDS.
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-[1.3] font-medium tracking-tight">
                Elite gadgets and home innovations <span className="text-zinc-900 dark:text-white font-black italic">verified by experts.</span> <br className="hidden md:block" /> Hand-picked for quality, style, and future-ready living.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                <Link 
                  to="/categories" 
                  className="w-full sm:w-auto px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black font-black rounded-2xl shadow-2xl hover:bg-primary dark:hover:bg-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-4 group active:scale-95"
                >
                  <ShoppingBag size={20} />
                  EXPLORE THE VAULT
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                
                <div className="flex items-center gap-6 border border-zinc-200 dark:border-white/10 px-8 py-5 rounded-2xl backdrop-blur-sm">
                  <div className="flex -space-x-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white dark:border-zinc-900 bg-zinc-200 overflow-hidden shadow-xl rotate-3 odd:-rotate-3 translate-y-1 odd:-translate-y-1">
                        <img src={`https://i.pravatar.cc/150?img=${i+40}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                       <ShieldCheck size={14} className="text-emerald-500" />
                       <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Verified Community</span>
                    </div>
                    <span className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter">5.2K+ Fans</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 w-full relative group">
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] w-full max-w-[500px] mx-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10 pointer-events-none" />
              
              <img 
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Choice Smart Find" 
                className="w-full h-full object-cover rounded-[40px] shadow-2xl transition-transform duration-[3000ms] group-hover:scale-105"
                fetchPriority="high"
              />

              {/* Floating Accents */}
              <div className="absolute inset-0 rounded-[40px] border border-white/20 z-20 pointer-events-none" />
              
              <div className="absolute top-6 left-6 z-30 flex flex-col gap-3">
                 <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl px-4 py-2 rounded-xl flex items-center gap-3 border border-white/20 shadow-2xl">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                       <Zap size={16} className="fill-current" />
                    </div>
                    <div>
                       <p className="text-[8px] font-black uppercase text-zinc-400 leading-none mb-1">Live Drop</p>
                       <p className="text-xs font-black text-zinc-900 dark:text-white leading-none">Smart Hub v4</p>
                    </div>
                 </div>
              </div>
              
              <div className="absolute bottom-6 right-6 z-30">
                 <div className="bg-zinc-900 dark:bg-white backdrop-blur-xl px-4 py-2 rounded-xl flex items-center gap-3 border border-white/10 shadow-2xl rotate-2">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white">
                       <ShieldCheck size={16} />
                    </div>
                    <div>
                       <p className="text-[8px] font-black uppercase text-zinc-500 leading-none mb-1">Verified</p>
                       <p className="text-xs font-black text-white dark:text-black leading-none">Quality Check</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-gray-200/50 dark:border-white/10 bg-white dark:bg-zinc-950 py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
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



      {/* Categories */}
      <section className="py-8 md:py-12 bg-gray-100 dark:bg-zinc-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center lg:text-left mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-black mb-3 tracking-tighter text-gray-900 dark:text-white uppercase">Shop Collections</h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-2xl font-medium uppercase tracking-widest">Expert-verified collections by theme.</p>
          </div>
          
          <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="flex-shrink-0 w-[140px] sm:w-auto"
              >
                <Link
                  to={`/categories?category=${encodeURIComponent(category.name)}`}
                  className="relative group block h-24 md:h-32 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 active:scale-95 border border-white dark:border-white/5"
                >
                  <div className="absolute inset-0 bg-zinc-900/60 group-hover:bg-zinc-900/40 transition-colors z-10" />
                  <img 
                    src={category.image || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=500&q=60'} 
                    alt={String(category.name)} 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-20 p-3">
                    <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-white text-center leading-tight drop-shadow-md">
                      {String(category.name)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-8 md:py-12 bg-transparent">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-8 md:mb-10">
              <div>
                <div className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded mb-3 shadow-lg shadow-primary/20">Trending Now</div>
                <h2 className="text-2xl md:text-4xl font-black mb-1 tracking-tighter text-gray-900 dark:text-white uppercase">SUPER DEALS</h2>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">Curated smart finds everyone loves.</p>
              </div>
              <Link to="/categories" className="hidden sm:flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em] hover:text-primary transition-colors text-gray-900 dark:text-white">
                View All Deals <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {trendingProducts.map((product, index) => (
                <ProductCard 
                  key={String(product.id)} 
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
      <section className="py-8 md:py-12 bg-gray-50/50 dark:bg-zinc-900/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8 md:mb-10">
            <div>
              <div className="inline-block px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded mb-3">New Arrivals</div>
              <h2 className="text-2xl md:text-4xl font-black mb-1 tracking-tighter text-gray-900 dark:text-white subpixel-antialiased uppercase">RECENT FINDS</h2>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">The latest hand-picked smart gadgets.</p>
            </div>
            <Link to="/categories" className="hidden sm:flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em] hover:text-primary transition-colors text-gray-900 dark:text-white">
              SEE NEW DROPS <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {recentProducts.map((product, index) => (
              <ProductCard 
                key={String(product.id)} 
                product={product} 
                index={index} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Expert Curation / Trust Section */}
      <section className="py-12 bg-white dark:bg-black border-t border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded mb-4">Our Methodology</div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-gray-900 dark:text-white leading-[1.1] uppercase">WHY TRUST <br />SMART LIVING <span className="text-primary italic">FINDS</span>?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center shrink-0 border border-gray-200/50 dark:border-white/5">
                    <ShieldCheck className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-[10px] uppercase tracking-widest mb-1 dark:text-white">Expert Verification</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">Vetting process for seller ratings and real user video reviews.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center shrink-0 border border-gray-200/50 dark:border-white/5">
                    <Zap className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-[10px] uppercase tracking-widest mb-1 dark:text-white">Price Monitoring</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">legitimate discounts and the best value for your money.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center shrink-0 border border-gray-200/50 dark:border-white/5">
                    <ShoppingBag className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-[10px] uppercase tracking-widest mb-1 dark:text-white">Real Logistics Hub</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">Verified tracked shipping methods, insurance on every order.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-xl shadow-black/20">
                  <img src="https://images.unsplash.com/photo-1558562805-4bf1e2a724eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Gadget Review" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="h-48 bg-primary rounded-3xl p-8 flex flex-col justify-end shadow-xl shadow-primary/20">
                  <p className="text-white font-black text-4xl">10k+</p>
                  <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Products Vetted</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-48 bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-8 flex flex-col justify-end border border-gray-200 dark:border-white/5 shadow-xl shadow-black/10">
                  <p className="text-gray-900 dark:text-white font-black text-4xl">4.9</p>
                  <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest">Trust Rating</p>
                </div>
                <div className="h-64 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-xl shadow-black/20">
                  <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Tech Lab" className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-primary rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-500 rounded-full blur-[100px]" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-4 text-primary">
            <Zap size={20} className="fill-current" />
            <span className="font-black text-[10px] uppercase tracking-[0.3em]">Smart Club</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tighter">DON'T MISS A DROP</h2>
          <p className="text-gray-400 mb-8 font-medium text-sm md:text-base">Join our community of smart shoppers and get weekly tech finds.</p>
          
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); alert("Subscribed! (Simulated)"); }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
              required
            />
            <button type="submit" className="px-8 py-4 bg-primary hover:bg-red-600 text-white font-black rounded-xl transition-all shadow-xl shadow-primary/20 active:scale-95 text-xs uppercase tracking-widest">
              JOIN NOW
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
