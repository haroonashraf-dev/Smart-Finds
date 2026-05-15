import { motion } from 'motion/react';
import { Target, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/seo/SEO';

export function About() {
  return (
    <>
      <SEO 
        title="About Us"
        description="Learn more about Smart Living Finds, our mission, and our curated approach to modern essentials."
        keywords="about Smart Living Finds, curated gadgets mission, affiliate disclosure, smart living finds team"
      />
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-6">Support & Information</div>
          <h1 className="text-4xl md:text-7xl font-black mb-8 text-gray-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
            Empowering Your <br/> Smart Shopping
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Smart Living Finds is more than a directory. We are a professional curation hub dedicated to sourcing high-performance tech and modern essentials from global marketplaces.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: ShieldCheck, title: "RIGOROUS VETTING", desc: "Every product listed undergoes a verify-before-feature process. We analyze seller history, real user feedback, and logistics reliability." },
            { icon: Target, title: "STRATEGIC SOURCING", desc: "Our analysts scour global manufacturing hubs to find early-market innovations and proven best-sellers before they go mainstream." },
            { icon: Heart, title: "AUTHENTIC REVIEWS", desc: "We prioritize products with high-fidelity reviews and verified imagery to ensure what you see is exactly what arrives." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-gray-200/50 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="w-14 h-14 bg-gray-100 dark:bg-zinc-800 text-primary rounded-2xl flex items-center justify-center mb-8 border border-gray-200/50 dark:border-white/5 group-hover:bg-primary group-hover:text-white transition-colors">
                <item.icon size={28} />
              </div>
              <h3 className="text-sm font-black mb-4 uppercase tracking-[0.2em] dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black mb-6 tracking-tighter dark:text-white uppercase italic">Operations & Logistics</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 font-medium">
                Smart Living Finds operates as a specialized affiliate gateway. We do not store inventory or manage post-purchase logistics directly. This model allows our team to focus 100% of their energy on market research and quality assurance.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 p-5 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-white/5">
                  <div className="w-1.5 h-auto bg-primary rounded-full shrink-0" />
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-1 dark:text-white">Direct-to-Seller Orders</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Transactions are handled securely on the seller's verified platform (e.g., AliExpress). We only link to stores with "Standard Shipping" or better logistics.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-white/5">
                  <div className="w-1.5 h-auto bg-primary rounded-full shrink-0" />
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest mb-1 dark:text-white">Consumer Protection</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Every purchase made through our links is protected by the host marketplace's "Money Back Guarantee" and buyer protection policies.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black mb-6 tracking-tighter dark:text-white uppercase italic">Affiliate Transparency</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                To maintain our independence and provide this service free of charge to our users, Smart Living Finds participates in affiliate marketing programs. We may earn a commission on qualifying purchases made through our referral links—at zero extra cost to you.
              </p>
            </div>
          </div>

          <div className="bg-zinc-950 p-10 md:p-14 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase italic">Frequently Asked</h2>
              <div className="space-y-8">
                <div>
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-primary mb-3">Why are prices so low?</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">We find products directly from factory-to-consumer marketplaces, removing middlemen markups common in retail stores.</p>
                </div>
                <div>
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-primary mb-3">How long does shipping take?</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">Standard tracked shipping typically takes 7-15 business days depending on your region. We recommend "Choice" items for the fastest delivery.</p>
                </div>
                <div>
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-primary mb-3">Is my payment secure?</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">Yes. You pay the official host store (like AliExpress) directly using their PCI-compliant encrypted payment gateways.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-black mb-6 dark:text-white uppercase tracking-tighter italic">Elevate your lifestyle today</h3>
            <p className="text-gray-500 mb-10 font-medium">Ready to discover your next smart investment? Browse our full collection of vetted innovations.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/categories" className="w-full sm:w-auto px-12 py-6 bg-primary hover:bg-red-600 text-white font-black rounded-3xl shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-4 group active:scale-95 text-lg uppercase tracking-widest">
                Explore Deals
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/" className="w-full sm:w-auto px-12 py-6 bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white font-black rounded-3xl transition-all hover:bg-gray-200 dark:hover:bg-zinc-800 text-lg uppercase tracking-widest border border-gray-200/50 dark:border-white/5">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
