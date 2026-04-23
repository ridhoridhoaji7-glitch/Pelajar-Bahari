/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Information from './pages/Information';
import Members from './pages/Members';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { AnimatePresence } from 'motion/react';

const PageHeader = () => {
  const location = useLocation();
  const getHeaderInfo = () => {
    switch (location.pathname) {
      case '/': return { title: 'Selamat Datang Rekan dan Rekanita', subtitle: 'Berkhidmat di Kota Tegal, Bergerak Bersama Pelajar Bahari' };
      case '/dashboard': return { title: 'Dashboard Organisasi', subtitle: 'Mengenal Lebih Dekat IPNU IPPNU Kota Tegal' };
      case '/informasi': return { title: 'Informasi Kegiatan Pimpinan', subtitle: 'Portal Berita, Agenda & Dokumen Pimpinan' };
      case '/anggota': return { title: 'Pimpinan PC, PAC & PR', subtitle: 'Direktori Kepengurusan Pelajar Bahari' };
      case '/kontak': return { title: 'Hubungi Kami', subtitle: 'Layanan Pengaduan & Informasi' };
      case '/admin': return { title: 'Panel Admin', subtitle: 'Kelola Pelajar Bahari' };
      default: return { title: 'Pelajar Bahari', subtitle: 'PC Kota Tegal' };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <header className="h-20 bg-white border-b px-8 flex items-center justify-between shadow-sm shrink-0 sticky top-16 lg:top-0 z-30">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
        <p className="text-slate-500 text-[10px] lg:text-xs font-medium uppercase tracking-wider">{subtitle}</p>
      </div>
      <div className="hidden md:block">
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          KOTA TEGAL • {new Date().getFullYear()}
        </span>
      </div>
    </header>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
          <Navbar />
          
          <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
            <PageHeader />
            
            <main className="flex-1 relative overflow-y-auto pt-4 lg:pt-0">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/informasi" element={<Information />} />
                  <Route path="/anggota" element={<Members />} />
                  <Route path="/kontak" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
          
          {/* Global Texture Overlay */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] contrast-150 z-[100] bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
        </div>
      </Router>
    </AuthProvider>
  );
}
