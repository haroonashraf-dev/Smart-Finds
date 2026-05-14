import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, MessageCircle, Heart, Zap, Share2 } from 'lucide-react';
import { Product } from '../../data/mockProducts';
import { getWhatsAppLink, formatCurrency } from '../../lib/utils';
import { useAnalyticsStore } from '../../store/analyticsStore';

interface ProductCardProps {
  product: Product;
  index?: number;
  key?: React.Key;
}

export const ProductCard = memo(({ product, index = 0 }: ProductCardProps) => {
  const logInteraction = useAnalyticsStore((state) => state.logInteraction);

  const handleAffiliateClick = () => {
    logInteraction(product.id, product.title, 'affiliate_click');
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/50 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 h-full"
    >
      <div 
        onClick={handleAffiliateClick}
        className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 block cursor-pointer group/img"
      >
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl uppercase tracking-tighter animate-pulse">
            -{discount}% OFF
          </div>
        )}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover/img:opacity-100 transition-all duration-300 translate-x-4 group-hover/img:translate-x-0" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(window.location.origin + '/product/' + product.slug);
              alert('Link copied to clipboard!');
            }}
            className="p-2.5 glass-card text-zinc-900 dark:text-white rounded-xl shadow-lg hover:bg-primary hover:text-white transition-all duration-300"
            title="Copy Link"
          >
            <Share2 size={16} />
          </button>
          <button className="p-2.5 glass-card text-zinc-900 dark:text-white rounded-xl shadow-lg hover:bg-primary hover:text-white transition-all duration-300">
            <Heart size={16} />
          </button>
        </div>
        
        {/* Choice Badge - AliExpress Style */}
        <div className="absolute bottom-4 left-4 z-10 bg-zinc-900/80 dark:bg-zinc-100/10 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg group-hover/img:scale-105 transition-transform border border-white/10 uppercase tracking-widest">
          <Zap size={10} className="fill-current text-primary" /> Choice <span className="opacity-40">|</span> Verified
        </div>

        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000 ease-out" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 text-black dark:text-white font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-full opacity-0 group-hover/img:opacity-100 translate-y-8 group-hover/img:translate-y-0 shadow-2xl transition-all duration-500 border border-white/20">
                Quick View
            </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5 text-orange-500">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={11} className={i <= Math.round(product.rating) ? "fill-current" : "opacity-30"} />
            ))}
          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">({product.reviewsCount} reviews)</span>
        </div>
        
        <Link to={`/product/${product.slug}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-bold text-lg leading-[1.2] mb-3 text-zinc-900 dark:text-white h-11 line-clamp-2 uppercase tracking-tight font-display">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-black text-primary tracking-tighter font-display">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-zinc-400 line-through font-medium opacity-60 tracking-tight">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
             <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2.5 py-1 rounded-full border border-emerald-500/10 whitespace-nowrap uppercase tracking-widest">
               Free Ship
             </div>
             <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black px-2.5 py-1 rounded-full border border-blue-500/10 whitespace-nowrap uppercase tracking-widest">
               Choice
             </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <button 
                onClick={handleAffiliateClick}
                className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary dark:hover:text-white font-black text-xs py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all duration-300 active:scale-95 uppercase tracking-widest"
              >
                Buy Now
                <Zap size={14} className="fill-current" />
              </button>
              <a 
                href={getWhatsAppLink(product.title, window.location.origin + '/product/' + product.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 flex items-center justify-center glass-card text-zinc-600 dark:text-zinc-400 rounded-2xl hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all shrink-0 active:scale-95"
              >
                <MessageCircle size={22} />
              </a>
            </div>
            <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-[0.2em] text-center opacity-40">
              *Price accurate today
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
