import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Moon, Sun, Menu, X, Heart, UserCog, Home, Grid } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useProductStore } from '../../store/productStore';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { searchQuery, setSearchQuery } = useProductStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/categories');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Categories', path: '/categories', icon: Grid },
    { name: 'Favorites', path: '#', icon: Heart },
    { name: 'Admin', path: '/admin-secure-dashboard', icon: UserCog },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white dark:bg-black transition-colors duration-300">
        {/* Top Mini Bar */}
        <div className="hidden md:block bg-gray-100 dark:bg-zinc-900 border-b border-gray-200/50 dark:border-white/5 py-1.5 px-4 text-[11px] font-medium text-gray-500">
          <div className="container mx-auto flex justify-between">
            <div className="flex gap-4">
              <span>7-Day Delivery on Choice Items</span>
            </div>
            <div className="flex gap-4">
              <Link to="/about" className="hover:text-primary transition-colors">Help Center</Link>
              <Link to="/admin-secure-dashboard" className="hover:text-primary transition-colors">Admin Access</Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-gradient-to-tr from-red-500 to-orange-500 text-white p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-red-500/20">
              <ShoppingBag size={22} strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl sm:text-2xl tracking-tighter text-gray-900 dark:text-white">Smart<span className="text-primary italic">Finds</span></span>
          </Link>
          
          {/* Central Search Bar - AliExpress Style */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearch} className="flex h-11 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden border-2 border-transparent focus-within:border-primary transition-all">
              <div className="flex items-center px-4 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search smart finds, gadgets, home decor..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-red-600 text-white px-8 font-black text-xs uppercase tracking-widest transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            
            <button className="hidden sm:flex p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-white/10">
              <Heart size={22} />
            </button>

            <Link to="/categories" className="md:hidden p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-red-500/20">
              <Search size={22} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-white/10 px-4 py-2 flex items-center justify-between shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.1)]">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-300",
                isActive ? "text-primary scale-105" : "text-gray-500 dark:text-gray-400"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive && "bg-primary/10"
              )}>
                <Icon size={24} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
