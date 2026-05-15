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
      <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-black/70 backdrop-blur-3xl border-b border-zinc-200/50 dark:border-white/5 transition-all duration-500">
        {/* Top Mini Bar */}
        <div className="hidden md:block bg-zinc-900 border-b border-white/5 py-1.5 px-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
          <div className="container mx-auto flex justify-between">
            <div className="flex gap-8">
              <span>Curated Selection</span>
              <span>Express Delivery Available</span>
            </div>
            <div className="flex gap-8">
              <Link to="/about" className="hover:text-primary transition-colors">Help Center</Link>
              <Link to="/admin-secure-dashboard" className="hover:text-primary transition-colors">Partner Access</Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-10">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-primary text-white p-2.5 rounded-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-[0_10px_20px_rgba(255,71,71,0.3)]">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl sm:text-3xl tracking-[-0.04em] text-zinc-950 dark:text-white uppercase font-display">
              Smart Living <span className="text-primary italic">Finds</span>
            </span>
          </Link>
          
          {/* Central Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block group">
            <form onSubmit={handleSearch} className="flex h-14 w-full glass-card rounded-full overflow-hidden border border-zinc-200/50 dark:border-white/10 group-focus-within:border-primary/50 group-focus-within:shadow-[0_0_30px_rgba(255,71,71,0.1)] transition-all duration-500">
              <div className="flex items-center px-6 text-zinc-400 group-focus-within:text-primary transition-colors">
                <Search size={22} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search premium finds..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-500 tracking-tight"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-zinc-950 dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary dark:hover:text-white px-10 font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500"
              >
                Find
              </button>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl glass-card hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-600 dark:text-zinc-300 border-zinc-200/50 dark:border-white/10"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            
            <button className="hidden sm:flex p-3 rounded-2xl glass-card hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-600 dark:text-zinc-300 border-zinc-200/50 dark:border-white/10">
              <Heart size={24} />
            </button>

            <Link to="/categories" className="md:hidden p-3 rounded-2xl bg-primary text-white shadow-[0_10px_20px_rgba(255,71,71,0.3)] transition-transform active:scale-95">
              <Search size={22} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex overflow-hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm glass-card border border-zinc-200/50 dark:border-white/10 rounded-[28px] p-2 items-center justify-between shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "flex flex-col items-center gap-1.5 px-5 py-3 rounded-[20px] transition-all duration-500",
                isActive ? "bg-primary text-white scale-105 shadow-lg shadow-primary/20" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 3 : 2} />
              <span className="text-[9px] font-black uppercase tracking-widest">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
