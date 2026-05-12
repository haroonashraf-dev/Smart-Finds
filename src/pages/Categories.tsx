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
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Horizontal Category Selector for Mobile */}
        <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-6 no-scrollbar -mx-4 px-4">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              selectedCategory === null 
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-lg' 
                : 'bg-white/40 dark:bg-black/40 border-gray-200/50 dark:border-white/10 text-gray-500'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                selectedCategory === category
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-lg' 
                  : 'bg-white/40 dark:bg-black/40 border-gray-200/50 dark:border-white/10 text-gray-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Filter Toggle & Search */}
          <div className="md:hidden flex flex-col gap-4 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-white/40 dark:bg-black/20 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm"
              />
              <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center justify-center gap-2 py-3 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest text-gray-700 dark:text-white"
            >
              <Filter size={16} /> Advanced Filters
            </button>
          </div>

          {/* Sidebar / Filters */}
          <AnimatePresence>
            {(isFilterOpen || window.innerWidth >= 768) && (
              <motion.aside
                initial={window.innerWidth < 768 ? { opacity: 0, x: -100 } : false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`${
                  isFilterOpen 
                    ? 'fixed inset-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm p-6 overflow-y-auto' 
                    : 'hidden md:block w-64 shrink-0'
                }`}
              >
                {isFilterOpen && (
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X size={24} />
                  </button>
                )}

                <div className="sticky top-24">
                  <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Filters</h2>
                  
                  <div className="mb-8 p-4 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-white/10">
                    <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Categories</h3>
                    <ul className="space-y-2">
                      <li>
                        <button
                          onClick={() => handleCategorySelect(null)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === null 
                              ? 'bg-black text-white dark:bg-white dark:text-black font-medium shadow-md shadow-black/10' 
                              : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          All Products
                        </button>
                      </li>
                      {categories.map(category => (
                        <li key={category}>
                          <button
                            onClick={() => handleCategorySelect(category)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedCategory === category
                                ? 'bg-black text-white dark:bg-white dark:text-black font-medium shadow-md shadow-black/10' 
                                : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {selectedCategory ? selectedCategory : 'All Products'}
                <span className="text-gray-400 text-xl font-normal ml-2">({products.length})</span>
              </h1>
              
              <div className="hidden md:block relative max-w-xl">
                <input
                  type="text"
                  placeholder="Search inside products..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-emerald-500 transition-all font-medium"
                />
                <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-white/10">
                <Search size={48} className="mx-auto text-gray-300 dark:text-white/20 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => { setLocalSearch(''); handleCategorySelect(null); }}
                  className="mt-6 px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
