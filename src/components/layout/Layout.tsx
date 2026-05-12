import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300 text-gray-900 dark:text-gray-100 flex flex-col font-sans relative overflow-x-hidden text-[14px]">
      {/* Background Mesh Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <Navbar />
      <main className="flex-1 z-10 w-full relative pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
