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
  Share2
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
  { name: "Sarah M.", rating: 5, date: "1 week ago", comment: "Fast shipping and very high quality. Definitely recommend SmartFinds!" },
  { name: "Alex P.", rating: 4, date: "2 weeks ago", comment: "Great value for the price. The build quality is impressive." },
];

export function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useProductStore();
  const { logClick } = useAnalyticsStore();
  const { addRecentlyViewed } = useUserStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const product = products.find(p => p.slug === slug);
  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 3);

  useEffect(() => {
    if (product) {
      logClick(product.id, product.title, 'view');
      addRecentlyViewed(product.id);
      setSelectedImage(product.image);
      window.scrollTo(0, 0);
    }
  }, [product, logClick, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/categories" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const handleAffiliateClick = () => {
    logClick(product.id, product.title, 'affiliate_click');
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <>
      <SEO 
        title={product.title}
        description={product.description}
        image={product.image}
        type="product"
        keywords={`${product.title}, AliExpress gadgets, ${product.category}, tech review`}
      />

      <div className="container mx-auto px-4 py-6 pb-28 md:pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400 mb-8 font-black">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to={`/categories?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 dark:text-white truncate max-w-[150px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Gallery Section */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              layoutId={product.id}
              onClick={handleAffiliateClick}
              className="aspect-square bg-white dark:bg-zinc-900 rounded-[32px] md:rounded-[48px] overflow-hidden relative border border-gray-200 dark:border-white/5 shadow-2xl cursor-pointer group/mainimg"
            >
              <img src={selectedImage || product.image} alt={product.title} className="w-full h-full object-cover group-hover/mainimg:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover/mainimg:bg-black/5 transition-colors flex items-center justify-center">
                  <div className="bg-primary text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-full opacity-0 group-hover/mainimg:opacity-100 translate-y-4 group-hover/mainimg:translate-y-0 transition-all duration-300 shadow-xl">
                      Check Store Price
                  </div>
              </div>
              {discount > 0 && (
                <div className="absolute top-6 left-6 bg-primary text-white font-black px-4 py-2 rounded-xl shadow-xl uppercase tracking-widest text-xs z-10">
                  -{discount}% OFF
                </div>
              )}
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              <button 
                onClick={() => setSelectedImage(product.image)}
                className={cn(
                  "aspect-square bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border-2 transition-all",
                  selectedImage === product.image ? "border-primary shadow-lg scale-105" : "border-transparent"
                )}
              >
                <img src={product.image} alt="" className="w-full h-full object-cover" />
              </button>
              {product.gallery?.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "aspect-square bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border-2 transition-all",
                    selectedImage === img ? "border-primary shadow-lg scale-105" : "border-transparent"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Product Benefits Section (Pinterest Style) */}
            <div className="pt-8">
              <h2 className="text-2xl font-black mb-8 dark:text-white uppercase tracking-tighter">Product Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex gap-4 p-6 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-100 dark:border-white/5 group hover:border-primary/30 transition-all">
                    <div className="shrink-0 p-3 bg-white dark:bg-zinc-800 text-primary rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      <benefit.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-wider mb-1 dark:text-white">{benefit.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Customer Reviews</h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-sm">
                  {product.rating} <Star size={16} className="fill-current" />
                </div>
              </div>
              <div className="space-y-6">
                {DUMMY_REVIEWS.map((review, i) => (
                  <div key={i} className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-black text-xs">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-xs uppercase tracking-widest dark:text-white">{review.name}</p>
                          <div className="flex gap-0.5 text-orange-500 mt-0.5">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className={s <= review.rating ? "fill-current" : "opacity-30"} />)}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Buying Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                   <div className="px-3 py-1 bg-gray-900 text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded-lg">Verified Pick</div>
                   <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/10 flex items-center gap-1">
                     <Zap size={10} className="fill-current" /> Choice Item
                   </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-none tracking-tighter">
                  {product.title}
                </h1>

                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-primary tracking-tighter">{formatCurrency(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-xl text-gray-400 line-through font-medium">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                    Free Global Shipping
                  </div>
                </div>

                {/* Urgency Section */}
                <div className="p-5 bg-orange-500/5 border border-orange-500/10 rounded-2xl mb-8 flex items-center gap-4">
                  <div className="p-3 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
                    <Timer size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest text-orange-600">Limited Time Offer</p>
                    <p className="text-[11px] font-bold text-orange-700/70 uppercase">Flash sale, price expected to rise soon.</p>
                  </div>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-medium">
                  {product.description}
                </p>

                <div className="space-y-4 mb-10">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Winning Features:</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {product.features.map(feature => (
                      <div key={feature} className="flex items-center gap-3 font-bold text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-4 mb-10 p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/5">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-gray-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-[11px] font-black uppercase tracking-tighter text-gray-500">142 people ordered today</span>
                  </div>
                </div>

                {/* Main Actions */}
                <div className="flex flex-col gap-4">
                  <div className="space-y-4">
                    <button 
                      onClick={handleAffiliateClick}
                      className="w-full bg-primary hover:bg-red-600 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/30 active:scale-[0.98] text-lg uppercase tracking-widest"
                    >
                      Check Price on Store <ExternalLink size={20} className="stroke-[3]" />
                    </button>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center px-6">
                      *We may earn a commission when you buy through our links. Prices change daily.
                    </p>
                  </div>
                  
                  <a 
                    href={getWhatsAppLink(product.title, window.location.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-500/20 active:scale-[0.98] text-lg uppercase tracking-widest"
                  >
                    Chat on WhatsApp <MessageCircle size={22} className="stroke-[2.5]" />
                  </a>

                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Product link copied to clipboard!');
                    }}
                    className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 transition-all hover:bg-gray-200 dark:hover:bg-zinc-700 active:scale-[0.98] text-sm uppercase tracking-widest"
                  >
                    <Share2 size={18} /> Copy Product Link
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-8 py-4 border-t border-gray-200 dark:border-white/5">
                   <div className="flex flex-col items-center gap-1 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="AliExpress Preferred">
                      <Zap size={20} className="text-orange-500 fill-current" />
                      <span className="text-[9px] font-black uppercase">Choice</span>
                   </div>
                   <div className="flex flex-col items-center gap-1 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="Secure Payment">
                      <ShieldCheck size={20} className="text-emerald-500" />
                      <span className="text-[9px] font-black uppercase">Secure</span>
                   </div>
                   <div className="flex flex-col items-center gap-1 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="Tracked Handling">
                      <Truck size={20} className="text-blue-500" />
                      <span className="text-[9px] font-black uppercase">Tracked</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-gray-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-12">
               <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">You might also like</h2>
               <Link to="/categories" className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                 Shop All <ExternalLink size={14} />
               </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Mobile Sticky CTA */}
        <div className="md:hidden fixed bottom-14 sm:bottom-16 left-0 right-0 p-4 z-40 bg-white dark:bg-zinc-950 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 flex items-center gap-3 shadow-[0_-12px_40px_-12px_rgba(255,71,71,0.3)]">
          <div className="shrink-0 min-w-[100px]">
            <p className="text-[9px] uppercase font-black text-gray-400 tracking-[0.2em] leading-none mb-1">Deal Price</p>
            <p className="text-2xl font-black text-primary tracking-tighter leading-none">{formatCurrency(product.price)}</p>
          </div>
          <div className="flex-1 flex gap-2">
            <button 
              onClick={handleAffiliateClick}
              className="flex-1 bg-primary hover:bg-red-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 text-xs uppercase"
            >
              View Deal <ExternalLink size={14} strokeWidth={3} />
            </button>
            <a 
              href={getWhatsAppLink(product.title, window.location.origin + '/product/' + product.slug)}
              className="w-14 h-14 bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <MessageCircle size={24} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
