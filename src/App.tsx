import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useProductStore } from './store/productStore';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Categories = lazy(() => import('./pages/Categories').then(m => ({ default: m.Categories })));
const ProductDetails = lazy(() => import('./pages/ProductDetails').then(m => ({ default: m.ProductDetails })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

// Global Loading Skeleton
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const initializeStore = useProductStore(state => state.initialize);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<Categories />} />
            <Route path="product/:slug" element={<ProductDetails />} />
            <Route path="about" element={<About />} />
          </Route>
          
          {/* Admin Routes - No public layout */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-secure-dashboard" element={<AdminDashboard />} />
          
          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black text-center p-4">
              <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500 mb-4">404</h1>
              <h2 className="text-2xl font-bold dark:text-white mb-6">Page Not Found</h2>
              <a href="/" className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-semibold rounded-xl hover:scale-105 transition-transform">
                Go Home
              </a>
            </div>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}
