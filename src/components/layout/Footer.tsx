import { Link } from 'react-router-dom';
import { ShoppingBag, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white/40 dark:bg-black/40 backdrop-blur-md border-t border-gray-200/50 dark:border-white/10 transition-colors duration-300 relative z-10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-gradient-to-tr from-red-500 to-orange-500 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                <ShoppingBag size={20} />
              </div>
              <span className="font-black text-xl tracking-tighter text-gray-900 dark:text-white">Smart<span className="text-primary italic">Finds</span></span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Smart Products for Smarter Living. Handpicked premium gadgets and essentials curating the best of technology and design.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"><Twitter size={20} /></a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" aria-label="Youtube" className="text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/categories" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">All Categories</Link></li>
              <li><Link to="/categories" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Smart Home</Link></li>
              <li><Link to="/categories" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Tech Accessories</Link></li>
              <li><Link to="/categories" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Kitchen Gadgets</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/about" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-900 dark:text-white mb-6">Transparency</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              SmartFinds is a professional review and curation site. We receive compensation from the companies whose products we review/recommend. 
              This helps us keep the site running at no extra cost to you.
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200/50 dark:border-white/10 text-center text-sm text-gray-500 dark:text-gray-400 font-mono">
          &copy; {new Date().getFullYear()} SmartFinds. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
