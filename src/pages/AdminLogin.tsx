import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import { SEO } from '../components/seo/SEO';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin-auth') === 'true' && auth?.currentUser) {
      navigate('/admin-secure-dashboard');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('admin-auth', 'true');
      localStorage.setItem('admin-login-time', Date.now().toString());
      setError('Password verified. Now please sign in with Google to authorize DB writes.');
    } else {
      setError('Invalid password. Hint: admin123');
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError('Firebase Auth is not initialized. Check your config.');
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email === 'whynotmrijan11@gmail.com') {
        localStorage.setItem('admin-auth', 'true');
        localStorage.setItem('admin-login-time', Date.now().toString());
        navigate('/admin-secure-dashboard');
      } else {
        setError('Unauthorized email. Only whynotmrijan11@gmail.com can access the DB.');
      }
    } catch (err) {
      console.error(err);
      setError('Auth failed. Enable Google Auth in Firebase Console.');
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
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 transition-colors backdrop-blur-sm font-bold dark:text-white"
                placeholder="Enter admin password"
              />
              {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-4 leading-relaxed">{error}</p>}
            </div>
            
            <div className="space-y-4 pt-4">
               <button
                type="submit"
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 text-xs"
              >
                1. Verify Password
              </button>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">then</span>
                <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-primary text-white font-black uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 text-xs flex items-center justify-center gap-2"
              >
                <LogIn size={16} strokeWidth={3} />
                2. Authenticate DB
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
