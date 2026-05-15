import { Link } from 'react-router-dom';
import { ShoppingBag, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-black/80 backdrop-blur-3xl border-t border-zinc-200 dark:border-white/5 transition-colors duration-500 relative z-10 pt-20 pb-32 md:pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4 max-w-sm">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="bg-primary text-white p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                <ShoppingBag size={20} strokeWidth={2.5} />
              </div>
              <span className="font-black text-2xl tracking-[-0.04em] text-zinc-950 dark:text-white uppercase font-display">
                Smart Living <span className="text-primary italic">Finds</span>
              </span>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-10 leading-relaxed font-medium">
              Handpicked premium finds for better living. We curate the most unique, useful, and high-quality products from across the globe.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-zinc-400 hover:text-primary transition-all hover:scale-110">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-950 dark:text-white mb-8">Shop</h3>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-zinc-500">
              <li><Link to="/categories" className="hover:text-primary transition-all">All Collections</Link></li>
              <li><Link to="/categories" className="hover:text-primary transition-all">Smart Home</Link></li>
              <li><Link to="/categories" className="hover:text-primary transition-all">Design Tech</Link></li>
              <li><Link to="/categories" className="hover:text-primary transition-all">Everyday Luxe</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-950 dark:text-white mb-8">Company</h3>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-zinc-500">
              <li><Link to="/about" className="hover:text-primary transition-all">Our Story</Link></li>
              <li><a href="#" className="hover:text-primary transition-all">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-all">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-all">Terms</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-4 bg-zinc-950 dark:bg-zinc-900 rounded-[32px] p-8 text-white">
            <h3 className="font-black text-[10px] uppercase tracking-[0.5em] text-zinc-500 mb-6">Transparency</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium mb-6">
              Smart Living Finds is a professional curation site. We may receive commissions when you purchase via our links. This allows us to keep finding the best products at no cost to you.
            </p>
            <div className="h-px bg-white/10 mb-6" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ShoppingBag size={18} className="text-emerald-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Global Partner Choice Find</span>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-zinc-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">
          <p>&copy; {new Date().getFullYear()} Smart Living Finds. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span className="text-[9px]">v2.4.0-Premium</span>
            <span className="text-primary italic">Live Better</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
