import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { SEO } from '../components/seo/SEO';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin-auth') === 'true') {
      navigate('/admin-secure-dashboard');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Fake authentication for demo purposes
    if (password === 'admin123') {
      localStorage.setItem('admin-auth', 'true');
      localStorage.setItem('admin-login-time', Date.now().toString());
      navigate('/admin-secure-dashboard');
    } else {
      setError('Invalid password. Hint: admin123');
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
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Secure Dashboard</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors backdrop-blur-sm"
                placeholder="Enter admin password"
              />
              {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
