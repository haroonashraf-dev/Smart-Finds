import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, MessageCircle, Heart, Zap, Share2, ArrowUpRight } from 'lucide-react';
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
    logInteraction(product.id, String(product.title), 'affiliate_click');
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
        className="relative aspect-[2/1] sm:aspect-[2.2/1] overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 block cursor-pointer group/img"
      >
        {discount > 0 && (
          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 z-10 bg-primary text-white text-[6px] sm:text-[9px] font-black px-1 sm:px-2 py-0.5 rounded-full shadow-xl uppercase tracking-tighter">
            -{discount}%
          </div>
        )}
        <div className="absolute top-1 sm:top-2 right-1 sm:top-2 z-10 flex flex-col gap-1 opacity-0 group-hover/img:opacity-100 transition-all duration-300 translate-x-4 group-hover/img:translate-x-0" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(window.location.origin + '/product/' + product.slug);
              alert('Link copied to clipboard!');
            }}
            className="p-1 sm:p-2 glass-card text-zinc-900 dark:text-white rounded-md shadow-lg hover:bg-primary hover:text-white transition-all duration-300"
            title="Copy Link"
          >
            <Share2 size={10} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
        
        <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 z-10 bg-zinc-900/80 dark:bg-zinc-100/10 backdrop-blur-md text-white text-[5px] sm:text-[8px] font-black px-1 sm:px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest">
          Verified
        </div>

        <img 
          src={product.image} 
          alt={String(product.title)} 
          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000 ease-out" 
          loading="lazy"
        />
      </div>
      
      <div className="p-1.5 sm:p-3 flex flex-col flex-1">
        <div className="flex items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1.5">
          <div className="flex items-center gap-0.5 text-orange-500">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={i <= Math.round(product.rating) ? 6 : 5} className={i <= Math.round(product.rating) ? "fill-current" : "opacity-30"} />
            ))}
          </div>
          <span className="text-[6px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-tight">({product.reviewsCount})</span>
        </div>
        
        <Link to={`/product/${product.slug}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-bold text-[8px] sm:text-sm leading-[1] sm:leading-[1.1] mb-0.5 sm:mb-1.5 text-zinc-900 dark:text-white h-auto sm:h-8 line-clamp-2 uppercase tracking-tight font-display">
            {String(product.title)}
          </h3>
        </Link>
        
        <div className="mt-auto pt-0.5 sm:pt-1">
          <div className="flex items-baseline gap-1 mb-1 sm:mb-2 text-primary">
            <span className="text-xs sm:text-xl font-black tracking-tighter font-display">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-[6px] sm:text-xs text-zinc-400 line-through font-medium opacity-50 tracking-tight">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          <div className="flex flex-col gap-0.5 sm:gap-2">
            <div className="flex gap-1">
              <button 
                onClick={handleAffiliateClick}
                className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary dark:hover:text-white font-black text-[6.5px] sm:text-xs py-1 sm:py-2.5 px-1 sm:px-4 rounded-sm sm:rounded-xl flex items-center justify-center gap-1 sm:gap-2 shadow-sm transition-all duration-300 active:scale-95 uppercase tracking-tighter sm:tracking-widest"
              >
                GET DEAL
                <ArrowUpRight size={7} className="sm:w-3.5 sm:h-3.5" />
              </button>
              <a 
                href={getWhatsAppLink(String(product.title), window.location.origin + '/product/' + product.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 sm:w-10 sm:h-10 flex items-center justify-center glass-card text-zinc-600 dark:text-zinc-400 rounded-sm sm:rounded-xl hover:bg-emerald-500 hover:text-white transition-all shrink-0 active:scale-95"
              >
                <MessageCircle size={9} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
