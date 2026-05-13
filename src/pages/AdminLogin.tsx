import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { SEO } from '../components/seo/SEO';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, signInAnonymously } from '../lib/firebase';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin-auth') === 'true' && auth?.currentUser) {
      navigate('/admin-secure-dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!auth || !db) throw new Error('Database not initialized');

      // 1. Try to get the current admin password from settings
      console.log('Checking admin credentials...');
      const adminRef = doc(db, 'settings', 'admin');
      let correctPassword = 'admin123';
      let dbConnected = false;
      
      try {
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
          correctPassword = adminSnap.data().adminPassword;
          dbConnected = true;
        } else {
          console.log('Admin settings doc not found in DB.');
        }
      } catch (readErr: any) {
        console.warn('Could not read from Firestore. Rules might not be deployed.', readErr);
        // We will fallback to admin123 and let them in, but warn them later
      }

      if (password === correctPassword) {
        // 2. Try to authorize DB access, but don't block login if it fails
        // This allows them to see the dashboard even if Auth isn't enabled yet
        try {
          if (!auth.currentUser) {
            await signInAnonymously(auth);
          }
        } catch (signInErr: any) {
          console.warn('Anonymous sign-in failed. Database writes will be restricted.', signInErr);
          // Don't throw here, just log it.
        }
        
        localStorage.setItem('admin-auth', 'true');
        localStorage.setItem('admin-login-time', Date.now().toString());
        navigate('/admin-secure-dashboard');
      } else {
        setError('Invalid password. Default is admin123');
      }
    } catch (err: any) {
      console.error('Final Login Error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Secure admin access" />
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Mesh Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-white/40 dark:bg-black/40 p-8 rounded-[40px] border border-gray-200/50 dark:border-white/10 shadow-2xl backdrop-blur-xl relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-blue-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white uppercase tracking-tighter">Secure Dashboard</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors backdrop-blur-sm font-bold dark:text-white"
                placeholder="Enter password"
              />
              {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-4 leading-relaxed">{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 text-xs disabled:opacity-50"
            >
              {loading ? 'Authorizing...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
