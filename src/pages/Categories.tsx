import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { ProductCard } from '../components/product/ProductCard';
import { SEO } from '../components/seo/SEO';

export function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const { categories, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, filteredProducts } = useProductStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory(null);
    }
  }, [categoryParam, setSelectedCategory]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
    setIsFilterOpen(false);
  };

  const products = filteredProducts();

  return (
    <>
      <SEO 
        title={selectedCategory ? `${selectedCategory} Products` : "All Smart Products"}
        description="Browse our complete collection of smart finds, gadgets, and everyday essentials."
        keywords={`best ${selectedCategory || 'tech'} gadgets, curated ${selectedCategory || 'gadget'} list, smart home tools`}
      />
      
      <div className="container relative z-10 mx-auto px-4 py-8 md:py-16">
        {/* Atmospheric Background Effects */}
        <div className="atmospheric-blur opacity-30 dark:opacity-20 pointer-events-none" />

        {/* Horizontal Category Selector for Mobile */}
        <div className="md:hidden flex overflow-x-auto gap-3 pb-6 mb-8 no-scrollbar -mx-4 px-4">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
              selectedCategory === null 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent shadow-[0_10px_20px_rgba(0,0,0,0.2)] scale-105' 
                : 'glass-card border-zinc-200/50 dark:border-white/10 text-zinc-500'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                selectedCategory === category
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent shadow-[0_10px_20px_rgba(0,0,0,0.2)] scale-105' 
                  : 'glass-card border-zinc-200/50 dark:border-white/10 text-zinc-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-12 xl:gap-20">
          
          {/* Mobile Filter Toggle & Search */}
          <div className="md:hidden flex flex-col gap-4 mb-10">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search premium finds..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full glass-card border-zinc-200/50 dark:border-white/10 rounded-2xl px-6 py-4 pl-14 focus:outline-none focus:border-primary/50 transition-all font-bold text-sm tracking-tight"
              />
              <Search size={22} className="absolute left-6 top-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center justify-center gap-3 py-4 glass-card border-zinc-200/50 dark:border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] text-zinc-900 dark:text-white"
            >
              <Filter size={18} /> refine your search
            </button>
          </div>

          {/* Sidebar / Filters */}
          <AnimatePresence>
            {(isFilterOpen || window.innerWidth >= 768) && (
              <motion.aside
                initial={window.innerWidth < 768 ? { opacity: 0, x: -50 } : false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`${
                  isFilterOpen 
                    ? 'fixed inset-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-2xl p-8 overflow-y-auto' 
                    : 'hidden md:block w-72 shrink-0'
                }`}
              >
                {isFilterOpen && (
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="absolute top-8 right-8 p-3 glass-card rounded-full hover:bg-primary hover:text-white transition-all"
                  >
                    <X size={24} />
                  </button>
                )}

                <div className="sticky top-24 space-y-12">
                  <div>
                    <h2 className="text-3xl font-black mb-8 text-zinc-900 dark:text-white uppercase tracking-tighter font-display">THE GUIDE</h2>
                    
                    <div className="space-y-10">
                      <div className="glass-card p-6 rounded-[32px] border-zinc-200/50 dark:border-white/10">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-6">Collections</h3>
                        <ul className="space-y-3">
                          <li>
                            <button
                              onClick={() => handleCategorySelect(null)}
                              className={`w-full text-left px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                selectedCategory === null 
                                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-xl ring-4 ring-zinc-500/10' 
                                  : 'hover:bg-zinc-900/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400'
                              }`}
                            >
                              ALL FINDS
                            </button>
                          </li>
                          {categories.map(category => (
                            <li key={category}>
                              <button
                                onClick={() => handleCategorySelect(category)}
                                className={`w-full text-left px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                  selectedCategory === category
                                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-xl ring-4 ring-zinc-500/10' 
                                    : 'hover:bg-zinc-900/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400'
                                }`}
                              >
                                {category}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <h1 className="text-4xl md:text-7xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter leading-none font-display">
                    {selectedCategory ? selectedCategory : 'SELECTED FINDS'}
                  </h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-4">
                    CURATED COLLECTION · {products.length} ITEMS
                  </p>
                </div>
                
                <div className="hidden md:block relative group max-w-md w-full">
                  <input
                    type="text"
                    placeholder="Quick search..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full glass-card border-zinc-200/50 dark:border-white/10 rounded-2xl px-6 py-4 pl-14 focus:outline-none focus:border-primary/50 transition-all font-bold tracking-tight"
                  />
                  <Search size={22} className="absolute left-6 top-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="relative overflow-hidden py-32 glass-card rounded-[48px] border-zinc-200/50 dark:border-white/10 text-center">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 animate-pulse" />
                <div className="relative z-10">
                  <Search size={64} className="mx-auto text-zinc-300 dark:text-white/20 mb-8" />
                  <h3 className="text-3xl font-black mb-4 dark:text-white uppercase tracking-tighter font-display">Nothing matches</h3>
                  <p className="text-zinc-500 font-medium tracking-tight mb-10">We couldn't find any premium finds matching your criteria.</p>
                  <button 
                    onClick={() => { setLocalSearch(''); handleCategorySelect(null); }}
                    className="px-10 py-4 bg-zinc-950 text-white dark:bg-white dark:text-black rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl transition-transform active:scale-95"
                  >
                    Reset Explorer
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
