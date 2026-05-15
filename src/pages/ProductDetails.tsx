import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Star, 
  MessageCircle, 
  ExternalLink, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Users,
  Timer,
  Share2,
  ArrowRight
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useUserStore } from '../store/userStore';
import { getWhatsAppLink, formatCurrency, cn } from '../lib/utils';
import { ProductCard } from '../components/product/ProductCard';
import { SEO } from '../components/seo/SEO';

const BENEFITS = [
  { icon: ShieldCheck, title: "Verified Quality", desc: "Expert-tested for durability and performance." },
  { icon: Truck, title: "Fast Shipping", desc: "Available worldwide with standard tracking." },
  { icon: Zap, title: "Best Value", desc: "Hand-picked for the highest features-to-price ratio." },
  { icon: CheckCircle2, title: "Easy Returns", desc: "Hassle-free return policy on all choice items." },
];

const DUMMY_REVIEWS = [
  { name: "John D.", rating: 5, date: "2 days ago", comment: "Absolutely love this gadget! Exactly as described and works perfectly." },
  { name: "Sarah M.", rating: 5, date: "1 week ago", comment: "Fast shipping and very high quality. Definitely recommend Smart Living Finds!" },
  { name: "Alex P.", rating: 4, date: "2 weeks ago", comment: "Great value for the price. The build quality is impressive." },
];

export function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useProductStore();
  const { logInteraction } = useAnalyticsStore();
  const { addRecentlyViewed } = useUserStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const product = products.find(p => p.slug === slug);
  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 3);

  useEffect(() => {
    if (product) {
      logInteraction(product.id, String(product.title), 'view');
      addRecentlyViewed(product.id);
      setSelectedImage(product.image);
      window.scrollTo(0, 0);
    }
  }, [product, logInteraction, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/categories" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const handleAffiliateClick = () => {
    logInteraction(product.id, String(product.title), 'affiliate_click');
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <>
      <SEO 
        title={String(product.title)}
        description={String(product.description)}
        image={product.image}
        type="product"
        keywords={`${String(product.title)}, AliExpress gadgets, ${String(product.category)}, tech review`}
      />

      <div className="container relative z-10 mx-auto px-4 py-6 pb-24 md:pb-16">
        {/* Atmospheric Background Effects */}
        <div className="atmospheric-blur opacity-40 dark:opacity-20 pointer-events-none" />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-10 font-black">
          <Link to="/" className="hover:text-primary transition-colors">Living</Link>
          <ChevronRight size={12} className="opacity-40" />
          <Link to={`/categories?category=${encodeURIComponent(String(product.category))}`} className="hover:text-primary transition-colors">{String(product.category)}</Link>
          <ChevronRight size={12} className="opacity-40" />
          <span className="text-zinc-900 dark:text-white truncate max-w-[200px]">{String(product.title)}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 mb-16">
          
          {/* Gallery Section */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              layoutId={product.id}
              onClick={handleAffiliateClick}
              className="aspect-square bg-zinc-100 dark:bg-zinc-900/50 rounded-[48px] md:rounded-[64px] overflow-hidden relative border border-zinc-200 dark:border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] cursor-pointer group/mainimg"
            >
              <img src={selectedImage || product.image} alt={String(product.title)} className="w-full h-full object-cover group-hover/mainimg:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-black/0 group-hover/mainimg:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="bg-white dark:bg-zinc-900 text-black dark:text-white font-black text-[11px] uppercase tracking-[0.3em] px-10 py-5 rounded-full opacity-0 group-hover/mainimg:opacity-100 translate-y-8 group-hover/mainimg:translate-y-0 transition-all duration-500 shadow-2xl border border-white/20">
                      View at Store
                  </div>
              </div>
              {discount > 0 && (
                <div className="absolute top-10 left-10 bg-primary text-white font-black px-6 py-3 rounded-full shadow-2xl uppercase tracking-[0.2em] text-xs z-10 animate-pulse">
                  -{discount}% OFF TODAY
                </div>
              )}
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              <button 
                onClick={() => setSelectedImage(product.image)}
                className={cn(
                  "flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 bg-white dark:bg-zinc-900 rounded-[20px] sm:rounded-[32px] overflow-hidden border-2 transition-all p-1",
                  selectedImage === product.image ? "border-primary shadow-xl scale-105" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={product.image} alt="" className="w-full h-full object-cover rounded-[16px] sm:rounded-[24px]" loading="lazy" />
              </button>
              {product.gallery?.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 bg-white dark:bg-zinc-900 rounded-[20px] sm:rounded-[32px] overflow-hidden border-2 transition-all p-1",
                    selectedImage === img ? "border-primary shadow-xl scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-[16px] sm:rounded-[24px]" loading="lazy" />
                </button>
              ))}
            </div>

            {/* Product Benefits Section */}
            <div className="pt-12">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter font-display">Why this find?</h2>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex gap-6 p-8 glass-card rounded-[32px] group hover:border-primary/50 transition-all duration-500">
                    <div className="shrink-0 w-14 h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                      <benefit.icon size={28} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-widest mb-2 dark:text-white">{benefit.title}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Buying Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-10">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                   <div className="px-4 py-1.5 bg-zinc-900 text-white dark:bg-white dark:text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Expert Verified</div>
                   <div className="px-4 py-1.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/20 flex items-center gap-2">
                     <Zap size={12} className="fill-current animate-pulse" /> Choice Choice Choice
                   </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-8 leading-[0.95] tracking-[-0.03em] uppercase font-display">
                  {String(product.title)}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-primary tracking-[-0.04em] font-display">{formatCurrency(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-2xl text-zinc-400 line-through font-medium opacity-50 tracking-tight">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="px-5 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 w-fit">
                    Free Global Delivery
                  </div>
                </div>

                {/* Urgency Section */}
                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-[32px] mb-10 flex items-center gap-5">
                  <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(255,71,71,0.3)] animate-pulse shrink-0">
                    <Timer size={32} />
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-[0.2em] text-primary leading-none mb-1">Price Alert</p>
                    <p className="text-xs font-black text-zinc-900/60 dark:text-white/60 uppercase tracking-tight">Voucher expires in 4 hours. Final price drop.</p>
                  </div>
                </div>

                <p className="text-xl text-zinc-600 dark:text-zinc-300 mb-10 leading-snug font-medium tracking-tight">
                  {String(product.description)}
                </p>

                <div className="space-y-6 mb-12">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-400">Winning Specs</h3>
                    <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {product.features.map(feature => (
                      <div key={feature} className="flex items-center gap-4 font-black text-xs text-zinc-700 dark:text-zinc-200 uppercase tracking-widest">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-6 mb-12 p-6 glass-card rounded-[32px]">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 overflow-hidden shadow-lg">
                        <img src={`https://i.pravatar.cc/100?img=${i+40}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                       <Users size={14} className="text-primary" />
                       <span className="text-xs font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Live Activity</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">23 people viewing this deal right now</span>
                  </div>
                </div>

                {/* Main Actions */}
                <div className="flex flex-col gap-6">
                  <div className="space-y-4">
                    <button 
                      onClick={handleAffiliateClick}
                      className="w-full bg-primary hover:bg-zinc-900 dark:hover:bg-white dark:hover:text-black text-white font-black py-7 rounded-full flex items-center justify-center gap-4 transition-all duration-500 shadow-[0_24px_48px_rgba(255,71,71,0.4)] active:scale-[0.98] text-xl uppercase tracking-[0.2em]"
                    >
                      GET THIS DEAL <ExternalLink size={24} strokeWidth={3} />
                    </button>
                    <div className="flex items-center justify-center gap-4 text-zinc-500 dark:text-zinc-400">
                      <ShieldCheck size={14} />
                      <p className="text-[9px] font-black uppercase tracking-[0.3em]">
                        Verified Affiliate Partner Choice Find
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <a 
                      href={getWhatsAppLink(String(product.title), window.location.href)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] text-xs uppercase tracking-widest"
                    >
                      WhatsApp <MessageCircle size={20} className="stroke-[2.5]" />
                    </a>

                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Product link copied to clipboard!');
                      }}
                      className="glass-card text-zinc-900 dark:text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98] text-xs uppercase tracking-widest"
                    >
                      Share Deal <Share2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-10 py-6 border-t border-zinc-200 dark:border-white/5">
                   <div className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-all cursor-help group" title="Choice Store Verification">
                      <Zap size={24} className="text-orange-500 fill-current group-hover:animate-bounce" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Choice</span>
                   </div>
                   <div className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-all cursor-help group" title="Secure Encrypted Transaction">
                      <ShieldCheck size={24} className="text-emerald-500 group-hover:rotate-12" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Secure</span>
                   </div>
                   <div className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-all cursor-help group" title="Insured Logistics Tracking">
                      <Truck size={24} className="text-blue-500 group-hover:translate-x-1" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Insured</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="pt-16 border-t border-zinc-200 dark:border-white/5 mb-16">
          <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">User Feedback</div>
                  <h2 className="text-4xl md:text-6xl font-black dark:text-white uppercase tracking-tighter font-display leading-none">REAL REVIEWS</h2>
                </div>
                <div className="flex items-center gap-5 glass-card px-8 py-4 rounded-full">
                  <div className="flex gap-1 text-orange-500">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} className="fill-current" />)}
                  </div>
                  <div className="h-8 w-px bg-zinc-200 dark:bg-white/10" />
                  <span className="text-2xl font-black dark:text-white uppercase tracking-tighter font-display">{product.rating} / 5</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {DUMMY_REVIEWS.map((review, i) => (
                  <div key={i} className="p-10 glass-card rounded-[48px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
                    
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xl shadow-xl">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-widest dark:text-white mb-1">{review.name}</p>
                          <div className="flex gap-1 text-orange-500">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className={s <= review.rating ? "fill-current" : "opacity-30"} />)}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-white/5 px-3 py-1 rounded-full">{review.date}</span>
                    </div>
                    <p className="text-lg text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-zinc-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-16">
               <h2 className="text-4xl md:text-6xl font-black dark:text-white uppercase tracking-tighter font-display">SIMILAR FINDS</h2>
               <Link to="/categories" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-4">
                 Explore All <ArrowRight size={18} />
               </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

        {/* Mobile Sticky CTA */}
        <div className="md:hidden fixed bottom-14 sm:bottom-16 left-0 right-0 p-4 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-t border-zinc-200/50 dark:border-white/10 flex items-center gap-4 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
          <div className="shrink-0">
            <p className="text-[8px] uppercase font-black text-zinc-400 tracking-[0.2em] leading-none mb-1">Deal Price</p>
            <p className="text-2xl font-black text-primary tracking-tighter leading-none font-display">{formatCurrency(product.price)}</p>
          </div>
          <div className="flex-1 flex gap-2">
            <button 
              onClick={handleAffiliateClick}
              className="flex-1 bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95 text-[10px] uppercase tracking-widest"
            >
              Get Deal <ExternalLink size={14} strokeWidth={3} />
            </button>
            <a 
              href={getWhatsAppLink(String(product.title), window.location.origin + '/product/' + product.slug)}
              className="w-14 h-14 bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <MessageCircle size={22} />
            </a>
          </div>
        </div>
      </>
    );
}
