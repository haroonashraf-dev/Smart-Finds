import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  Activity, 
  Plus, 
  Package, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Layers,
  Upload,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useAnalyticsStore, ClickData } from '../store/analyticsStore';
import { useProductStore } from '../store/productStore';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { SEO } from '../components/seo/SEO';
import { Product } from '../data/mockProducts';

type DashboardTab = 'analytics' | 'products' | 'categories' | 'settings';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { clicks, getTopProducts, subscribeToInteractions } = useAnalyticsStore();
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory, updateCategory } = useProductStore();
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('analytics');

  useEffect(() => {
    if (activeTab === 'analytics' && isAuth) {
      const unsubscribe = subscribeToInteractions(30);
      return () => unsubscribe();
    }
  }, [activeTab, isAuth, subscribeToInteractions]);

  // Form states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: '',
    description: '',
    category: categories[0] || '',
    image: '',
    affiliateLink: '',
    features: [''],
    trending: false,
    gallery: []
  });
  const [galleryInputs, setGalleryInputs] = useState<string[]>(['']);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'locked' | 'unauthorized'>('connected');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check if we can actually read/write to the DB
    const checkDb = async () => {
      if (!db || !auth) {
        setDbStatus('locked');
        return;
      }
      try {
        await getDoc(doc(db, 'settings', 'admin'));
        setDbStatus(auth.currentUser ? 'connected' : 'unauthorized');
        setErrorStatus(null);
      } catch (err: any) {
        console.error('Initial DB Check failed:', err);
        if (err.code === 'permission-denied' || err.message?.includes('permissions')) {
          setDbStatus('locked');
          setErrorStatus('Permission Denied: Deployment of Firestore Rules is required.');
        } else {
          setDbStatus('unauthorized');
        }
      }
    };
    checkDb();
  }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions for the image (good balance of quality/size)
          const MAX_SIZE = 1000;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // dataURL with 0.6 quality is usually around 50-150KB for 1000px
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleMainImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        setNewProduct({ ...newProduct, image: base64 });
      } catch (err) {
        console.error("Error uploading image:", err);
        alert("Failed to process image. Try a smaller file.");
      }
    }
  };

  const handleGalleryImageUpload = async (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        updateGalleryInput(index, base64);
      } catch (err) {
        console.error("Error uploading gallery image:", err);
        alert("Failed to process image. Try a smaller file.");
      }
    }
  };

  useEffect(() => {
    const authStorage = localStorage.getItem('admin-auth');
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || authStorage !== 'true') {
        if (authStorage === 'true' && !user) {
           return;
        }
        navigate('/admin-login');
      } else {
        setIsAuth(true);
      }
    });

    const loginTime = parseInt(localStorage.getItem('admin-login-time') || '0');
    if (Date.now() - loginTime > 3600000) {
      handleLogout();
    }

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('admin-login-time');
    navigate('/admin-login');
  };

  const addGalleryInput = () => {
    setGalleryInputs([...galleryInputs, '']);
  };

  const updateGalleryInput = (index: number, value: string) => {
    const newInputs = [...galleryInputs];
    newInputs[index] = value;
    setGalleryInputs(newInputs);
  };

  const removeGalleryInput = (index: number) => {
    setGalleryInputs(galleryInputs.filter((_: string, i: number) => i !== index));
  };

  const [formInputs, setFormInputs] = useState({
    price: '0',
    originalPrice: '0',
    rating: '4.5',
    reviewsCount: '0'
  });

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    
    // Filter out empty gallery inputs
    const gallery = galleryInputs.filter((url: string) => url.trim() !== '');

    const productData = {
      ...newProduct,
      price: parseFloat(formInputs.price) || 0,
      originalPrice: parseFloat(formInputs.originalPrice) || 0,
      rating: parseFloat(formInputs.rating) || 4.5,
      reviewsCount: parseInt(formInputs.reviewsCount) || 0,
      gallery: gallery.length > 0 ? gallery : [newProduct.image || ''],
    };

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        alert('Product updated successfully!');
      } else {
        const id = `p${Date.now()}`;
        const slug = newProduct.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') || id;
        await addProduct({
          ...productData,
          id,
          slug
        } as Product);
        alert('Product deployed successfully to global storefront!');
      }

      setEditingProductId(null);
      setNewProduct({
        title: '',
        description: '',
        category: categories[0] || '',
        image: '',
        affiliateLink: '',
        features: [''],
        trending: false,
      });
      setFormInputs({
        price: '0',
        originalPrice: '0',
        rating: '4.5',
        reviewsCount: '0'
      });
      setGalleryInputs(['']);
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to save product:", err);
      alert('Error saving product. Check console for details.');
    }
  };

  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.id);
    setNewProduct({
      title: product.title,
      description: product.description,
      category: product.category,
      image: product.image,
      affiliateLink: product.affiliateLink,
      features: product.features,
      trending: product.trending,
      gallery: product.gallery
    });
    setFormInputs({
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      rating: product.rating.toString(),
      reviewsCount: product.reviewsCount.toString()
    });
    setGalleryInputs(product.gallery.length > 0 ? product.gallery : ['']);
    setShowAddForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
      alert('Category added successfully!');
    }
  };

  const handleUpdateCategory = async (oldName: string) => {
    if (editCategoryName.trim() && editCategoryName !== oldName) {
      try {
        await updateCategory(oldName, editCategoryName.trim());
        setEditingCategory(null);
        alert('Category renamed successfully and all products updated!');
      } catch (err) {
        console.error("Failed to update category:", err);
        alert('Error updating category.');
      }
    } else {
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (category === 'General') {
      alert('The "General" category is the default fallback and cannot be deleted.');
      return;
    }

    const productCount = products.filter(p => p.category === category).length;
    if (productCount > 0) {
      if (!confirm(`This category contains ${productCount} products. Deleting it will automatically move all these products to the "General" category. Continue?`)) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to delete the "${category}" category?`)) {
        return;
      }
    }
    deleteCategory(category);
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (changePasswordData.newPassword.length < 1) {
      alert('Password cannot be empty');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      if (!db) throw new Error('DB not initialized');
      await setDoc(doc(db, 'settings', 'admin'), { adminPassword: changePasswordData.newPassword });
      alert('Admin password updated successfully!');
      setChangePasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      console.error(err);
      alert('Failed to update password: ' + err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!isAuth) return null;

  const totalViews = clicks.filter(c => c.type === 'view').length;
  const totalClicks = clicks.filter(c => c.type === 'affiliate_click').length;
  
  // Create more realistic day-by-day stats from the actual clicks
  const getDailyStats = () => {
    const now = new Date();
    const stats = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const startOfDay = new Date(d.setHours(0,0,0,0)).getTime();
      const endOfDay = new Date(d.setHours(23,59,59,999)).getTime();
      
      const dayViews = clicks.filter((c: ClickData) => c.type === 'view' && c.timestamp >= startOfDay && c.timestamp <= endOfDay).length;
      const dayClicks = clicks.filter((c: ClickData) => c.type === 'affiliate_click' && c.timestamp >= startOfDay && c.timestamp <= endOfDay).length;
      
      stats.push({ name: dateStr, views: dayViews, clicks: dayClicks });
    }
    return stats;
  };

  const chartData = getDailyStats();

  const topProducts = getTopProducts();

  return (
    <>
      <SEO title="Admin Dashboard" description="Secure management" />
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 relative overflow-hidden">
        {/* Background Mesh Gradients */}
        <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

        {/* Topbar */}
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 gap-4">
          <div className="flex items-center gap-3 md:gap-4 self-start md:self-auto">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
              <Activity size={20} className="md:w-[24px] md:h-[24px]" />
            </div>
            <div>
              <h1 className="font-black text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] dark:text-white pb-0.5">Admin Console</h1>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase leading-tight tracking-wider">
                  {dbStatus === 'connected' ? 'Live DB Connection' : dbStatus === 'locked' ? 'DB Locked (Paste Rules)' : 'Auth Required (Enable Anon)'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
             {(['analytics', 'products', 'categories', 'settings'] as DashboardTab[]).map(tabId => {
               const tabConfig = {
                 analytics: { label: 'Analytics', icon: TrendingUp },
                 products: { label: 'Products', icon: Package },
                 categories: { label: 'Categories', icon: Layers },
                 settings: { label: 'Settings', icon: Settings },
               }[tabId];
               const Icon = tabConfig.icon;
               return (
                 <button
                   key={tabId}
                   onClick={() => setActiveTab(tabId)}
                   className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                     activeTab === tabId 
                       ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' 
                       : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                   }`}
                 >
                   <Icon size={14} />
                   <span className="hidden xs:inline sm:inline">{tabConfig.label}</span>
                 </button>
               );
             })}
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto">
             <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">Site</Link>
            <button 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 relative z-10">
          {activeTab === 'analytics' && (
            <>
              {errorStatus && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500 leading-relaxed">
                    🚨 {errorStatus}
                    <br />
                    <span className="opacity-70">Ensure you have deployed the firestore.rules to your Firebase project.</span>
                  </p>
                </div>
              )}
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
                  <div className="flex items-center gap-4 mb-4 text-emerald-500">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl"><Users size={24} /></div>
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Total Views</h3>
                  </div>
                  <p className="text-4xl font-black subpixel-antialiased tracking-tighter dark:text-white">{totalViews}</p>
                </div>
                
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
                  <div className="flex items-center gap-4 mb-4 text-blue-500">
                    <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-2xl"><MousePointerClick size={24} /></div>
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Clicks</h3>
                  </div>
                  <p className="text-4xl font-black subpixel-antialiased tracking-tighter dark:text-white">{totalClicks}</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
                  <div className="flex items-center gap-4 mb-4 text-primary">
                    <div className="p-3 bg-red-100 dark:bg-primary/10 rounded-2xl"><TrendingUp size={24} /></div>
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Conversion</h3>
                  </div>
                  <p className="text-4xl font-black subpixel-antialiased tracking-tighter dark:text-white">
                    {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl min-h-[400px]">
                  <h2 className="text-xl font-black mb-6 uppercase tracking-tighter dark:text-white">Traffic Overview</h2>
                  <div className="h-[320px] w-full min-w-0 relative">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.1} />
                            <XAxis 
                              dataKey="name" 
                              stroke="#888" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fontWeight: 900 }}
                            />
                            <YAxis 
                              stroke="#888" 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fontWeight: 900 }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#18181b', 
                                border: 'none', 
                                borderRadius: '16px', 
                                color: '#fff',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                              }}
                              itemStyle={{ color: '#fff', fontWeight: 900, fontSize: 12 }}
                            />
                            <Line type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, strokeWidth: 4, fill: '#fff' }} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, strokeWidth: 4, fill: '#fff' }} />
                          </LineChart>
                        </ResponsiveContainer>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                        No activity data available
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">* Chart reflects real interactions from the last 5 days.</p>
                </div>

                {/* Top Products */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
                  <h2 className="text-xl font-black mb-6 uppercase tracking-tighter dark:text-white">Top Performers</h2>
                  <div className="space-y-6">
                    {topProducts.length > 0 ? topProducts.map((p: { name: string; views: number; clicks: number }, i: number) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="max-w-[70%] subpixel-antialiased">
                          <p className="font-black text-xs uppercase tracking-widest dark:text-white truncate">{p.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">{p.views} impressions</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-primary text-sm">{p.clicks} clicks</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-8 font-bold text-xs uppercase tracking-widest">No data collected</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Inventory Control</h2>
                <button 
                  onClick={() => {
                    if (showAddForm && editingProductId) {
                      setEditingProductId(null);
                      setNewProduct({
                        title: '',
                        description: '',
                        category: categories[0] || '',
                        image: '',
                        affiliateLink: '',
                        features: [''],
                        trending: false,
                      });
                      setFormInputs({
                        price: '0',
                        originalPrice: '0',
                        rating: '4.5',
                        reviewsCount: '0'
                      });
                      setGalleryInputs(['']);
                    }
                    setShowAddForm(!showAddForm);
                  }}
                  className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/30"
                >
                  {showAddForm ? <X size={16} /> : <Plus size={16} />} 
                  {showAddForm ? 'Cancel' : 'New Product'}
                </button>
              </div>

              {showAddForm && (
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-2xl">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary">
                      {editingProductId ? `Editing Product: ${newProduct.title}` : 'Drafting New Entry'}
                    </h3>
                  </div>
                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Product Title</label>
                        <input 
                          type="text" required
                          value={newProduct.title}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProduct({...newProduct, title: e.target.value})}
                          className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 ring-primary dark:text-white font-bold"
                          placeholder="e.g. Smart Wireless Earbuds"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Description</label>
                        <textarea 
                          required
                          value={newProduct.description}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewProduct({...newProduct, description: e.target.value})}
                          className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 ring-primary dark:text-white font-bold min-h-[100px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Price ($)</label>
                          <input 
                            type="number" step="0.01" required
                            value={formInputs.price === 'NaN' ? '' : formInputs.price}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormInputs({...formInputs, price: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 ring-primary dark:text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Retail Price ($)</label>
                          <input 
                            type="number" step="0.01"
                            value={formInputs.originalPrice === 'NaN' ? '' : formInputs.originalPrice}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormInputs({...formInputs, originalPrice: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 ring-primary dark:text-white font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Affiliate Link (AliExpress)</label>
                        <input 
                          type="url" required
                          value={newProduct.affiliateLink}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProduct({...newProduct, affiliateLink: e.target.value})}
                          className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 ring-primary dark:text-white font-bold"
                          placeholder="https://s.click.aliexpress.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Main Product Image</label>
                        <div className="flex gap-4 items-start">
                          <div className="flex-1 space-y-2">
                            <input 
                              type="url" 
                              value={newProduct.image}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProduct({...newProduct, image: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 ring-primary dark:text-white font-bold text-xs"
                              placeholder="Image URL"
                            />
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleMainImageUpload}
                                className="hidden"
                                id="main-image-upload"
                              />
                              <label 
                                htmlFor="main-image-upload"
                                className="flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-widest transition-colors dark:text-white"
                              >
                                <Upload size={14} /> Upload Image
                              </label>
                            </div>
                          </div>
                          {newProduct.image && (
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0 border border-gray-200 dark:border-white/5 shadow-inner">
                              <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Category</label>
                        <select 
                          value={newProduct.category}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewProduct({...newProduct, category: e.target.value})}
                          className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 ring-primary dark:text-white font-bold"
                        >
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {/* Gallery Images Section */}
                      <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-4 flex justify-between items-center">
                          Gallery Images
                          <button 
                            type="button" 
                            onClick={addGalleryInput}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-lg hover:bg-primary/20 transition-colors"
                          >
                            + Add Image
                          </button>
                        </label>
                        <div className="space-y-4">
                          {galleryInputs.map((url: string, index: number) => (
                            <div key={index} className="space-y-2 p-3 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100 dark:border-white/5">
                              <div className="flex gap-2">
                                <input 
                                  type="url"
                                  value={url}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateGalleryInput(index, e.target.value)}
                                  className="flex-1 bg-gray-50 dark:bg-zinc-800 p-3 rounded-xl border-none focus:ring-2 ring-primary dark:text-white font-bold text-xs"
                                  placeholder={`Gallery Image URL ${index + 1}`}
                                />
                                {galleryInputs.length > 1 && (
                                  <button 
                                    type="button" 
                                    onClick={() => removeGalleryInput(index)}
                                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                              <div className="flex gap-3 items-center">
                                <div className="relative flex-1">
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleGalleryImageUpload(index, e)}
                                    className="hidden"
                                    id={`gallery-upload-${index}`}
                                  />
                                  <label 
                                    htmlFor={`gallery-upload-${index}`}
                                    className="flex items-center justify-center gap-2 p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg cursor-pointer text-[9px] font-black uppercase tracking-widest transition-colors dark:text-white border border-gray-200 dark:border-white/5"
                                  >
                                    <Upload size={12} /> Upload
                                  </label>
                                </div>
                                {url && (
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0 border border-gray-200 dark:border-white/5">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
 
                      <div className="flex items-center gap-4 py-2">
                        <input 
                          type="checkbox" 
                          checked={newProduct.trending}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProduct({...newProduct, trending: e.target.checked})}
                          className="w-5 h-5 rounded-md border-none bg-gray-100 dark:bg-zinc-800 text-primary focus:ring-primary"
                        />
                        <label className="text-[10px] font-black uppercase text-gray-400">Mark as Trending</label>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                      <button type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all">
                        {editingProductId ? 'Update Product' : 'Deploy Product'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(p => (
                  <div key={p.id} className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl group">
                    <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-zinc-800 overflow-hidden mb-4 relative">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditingProduct(p)} 
                          className="p-2 bg-blue-500 text-white rounded-lg shadow-lg"
                          title="Edit Product"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          onClick={() => deleteProduct(p.id)} 
                          className="p-2 bg-red-500 text-white rounded-lg shadow-lg"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="px-2 pb-2">
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">{p.category}</p>
                      <h3 className="font-black text-xs uppercase tracking-widest dark:text-white truncate mb-2">{p.title}</h3>
                      <div className="flex justify-between items-center">
                        <p className="font-black text-primary text-sm">${p.price}</p>
                        <button 
                          onClick={() => updateProduct(p.id, { trending: !p.trending })}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                            p.trending 
                              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                              : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                          }`}
                        >
                          <TrendingUp size={10} className={p.trending ? 'animate-pulse' : ''} />
                          {p.trending ? 'Trending' : 'Mark Trending'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter text-center">Category Management</h2>
              
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
                <form onSubmit={handleAddCategory} className="flex gap-4">
                  <input 
                    type="text" required
                    value={newCategory}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
                    placeholder="New category name..."
                    className="flex-1 bg-gray-50 dark:bg-zinc-800 p-5 rounded-2xl border-none focus:ring-2 ring-primary dark:text-white font-bold"
                  />
                  <button type="submit" className="bg-primary text-white px-8 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all">
                    Add
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {categories.map(c => (
                  <div key={c} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex justify-between items-center group">
                    {editingCategory === c ? (
                      <div className="flex-1 flex gap-2 mr-4">
                        <input 
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="flex-1 bg-gray-50 dark:bg-zinc-800 p-2 rounded-xl border-none focus:ring-2 ring-primary dark:text-white font-bold text-xs"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleUpdateCategory(c)}
                          className="p-2 bg-emerald-500 text-white rounded-lg"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={() => setEditingCategory(null)}
                          className="p-2 bg-gray-500 text-white rounded-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="font-black text-xs uppercase tracking-widest dark:text-white">{c}</span>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <span className="bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-lg text-[10px] font-black text-gray-500">
                        {products.filter(p => p.category === c).length} Products
                      </span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            setEditingCategory(c);
                            setEditCategoryName(c);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Rename Category"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(c)}
                          className={`p-2 transition-colors ${c === 'General' ? 'opacity-20 cursor-not-allowed text-gray-300' : 'text-gray-400 hover:text-red-500'}`}
                          title={c === 'General' ? 'Default category cannot be deleted' : 'Delete Category'}
                          disabled={c === 'General'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-md mx-auto space-y-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-3xl flex items-center justify-center mb-4">
                  <Settings size={32} />
                </div>
                <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Security Settings</h2>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">Manage your admin credentials</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-2xl">
                <h3 className="font-black text-xs uppercase tracking-widest text-primary mb-6">Change Login Password</h3>
                
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">New Password</label>
                    <input 
                      type="password" required
                      value={changePasswordData.newPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setChangePasswordData({...changePasswordData, newPassword: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 ring-primary dark:text-white font-bold"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Confirm New Password</label>
                    <input 
                      type="password" required
                      value={changePasswordData.confirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setChangePasswordData({...changePasswordData, confirmPassword: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border-none focus:ring-2 ring-primary dark:text-white font-bold"
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isUpdatingPassword}
                    className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-black uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isUpdatingPassword ? 'Updating...' : 'Save New Password'}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 space-y-4">
                  <div className="bg-amber-100/50 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-200/50 dark:border-amber-500/20">
                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase tracking-widest">
                      <span className="block mb-1">⚠️ Warning</span>
                      Changing this will instantly require the new password for your next login attempt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
