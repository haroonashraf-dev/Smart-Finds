import React from 'react';
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

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const logClick = useAnalyticsStore((state) => state.logClick);

  const handleAffiliateClick = () => {
    logClick(product.id, product.title, 'affiliate_click');
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
        className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800 block cursor-pointer group/img"
      >
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-primary text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-tighter">
            -{discount}% OFF
          </div>
        )}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(window.location.origin + '/product/' + product.slug);
              alert('Link copied to clipboard!');
            }}
            className="p-1.5 bg-white/90 dark:bg-black/80 backdrop-blur text-gray-900 dark:text-white rounded-lg shadow-sm border border-gray-100 dark:border-white/10 hover:bg-primary hover:text-white transition-colors"
            title="Copy Link"
          >
            <Share2 size={14} />
          </button>
          <button className="p-1.5 bg-white/90 dark:bg-black/80 backdrop-blur text-gray-900 dark:text-white rounded-lg shadow-sm border border-gray-100 dark:border-white/10 hover:bg-primary hover:text-white transition-colors">
            <Heart size={14} />
          </button>
        </div>
        
        {/* Choice Badge - AliExpress Style */}
        <div className="absolute bottom-2 left-2 z-10 bg-gradient-to-r from-orange-500 to-primary text-white text-[9px] font-black px-2 py-1 rounded flex items-center gap-1 shadow-lg group-hover/img:scale-105 transition-transform">
          <Zap size={10} className="fill-current" /> CHOICE
        </div>

        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700 ease-out" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm text-black font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full opacity-0 group-hover/img:opacity-100 translate-y-4 group-hover/img:translate-y-0 transition-all duration-300">
                View Deal
            </div>
        </div>
      </div>
      
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex items-center gap-0.5 text-orange-500">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={10} className={i <= Math.round(product.rating) ? "fill-current" : "opacity-30"} />
            ))}
          </div>
          <span className="text-[10px] font-bold text-gray-400">({product.reviewsCount})</span>
        </div>
        
        <Link to={`/product/${product.slug}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-bold text-sm sm:text-base line-clamp-2 leading-tight mb-2 text-gray-900 dark:text-white h-10">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-xl font-black text-primary tracking-tight">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through font-medium">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mb-4">
             <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-500/10 whitespace-nowrap">
               Free Shipping
             </div>
             <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-blue-500/10 whitespace-nowrap">
               10D Delivery
             </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <button 
                onClick={handleAffiliateClick}
                className="flex-1 bg-primary hover:bg-red-600 text-white font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Check Price
              </button>
              <a 
                href={getWhatsAppLink(product.title, window.location.origin + '/product/' + product.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-11 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-gray-200/50 dark:border-white/5 shrink-0"
              >
                <MessageCircle size={20} />
              </a>
            </div>
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest text-center">
              *Price accurate at time of review
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
