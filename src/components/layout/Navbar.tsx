import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Users, Phone, LogIn, LogOut, ShieldCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Informasi', path: '/informasi', icon: Newspaper },
    { name: 'Pimpinan PC, PAC & PR', path: '/anggota', icon: Users },
    { name: 'Kontak', path: '/kontak', icon: Phone },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 flex flex-col items-center border-b border-emerald-800">
        <Link to="/" className="flex flex-col items-center group">
          <div className="flex space-x-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-emerald-500 shadow-sm transition-transform group-hover:scale-110 overflow-hidden">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logo_IPNU.png/600px-Logo_IPNU.png" alt="IPNU" className="w-full h-full object-contain" />
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform group-hover:rotate-12 overflow-hidden">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Logo_IPPNU.png/600px-Logo_IPPNU.png" alt="IPPNU" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Pelajar Bahari</h1>
          <p className="text-emerald-300 text-[10px] uppercase tracking-widest mt-1">PC Kota Tegal</p>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                isActive 
                  ? "bg-emerald-800 text-white shadow-inner" 
                  : "text-emerald-100/70 hover:bg-emerald-800/50 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "opacity-100" : "opacity-60")} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
        
        {user?.isAdmin && (
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
              location.pathname === '/admin' 
                ? "bg-emerald-800 text-white shadow-inner" 
                : "text-emerald-100/70 hover:bg-emerald-800/50 hover:text-white"
            )}
          >
            <ShieldCheck size={20} className={location.pathname === '/admin' ? "opacity-100" : "opacity-60"} />
            <span className="text-sm">Panel Admin</span>
          </Link>
        )}
      </nav>

      <div className="p-6 bg-emerald-950/40 mt-auto border-t border-emerald-800/50">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden border border-emerald-400/30">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
              </div>
              <div className="text-[10px] truncate max-w-[100px]">
                <p className="font-semibold text-white truncate">{user.displayName || 'Admin'}</p>
                <p className="opacity-60 text-emerald-200 truncate">{user.isAdmin ? 'Administrator' : 'Kader'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-emerald-300 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-white text-emerald-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors"
          >
            <LogIn size={18} />
            <span>Masuk</span>
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-emerald-900 border-b border-emerald-800 flex items-center justify-between px-6 z-50">
        <span className="text-white font-bold tracking-tight">Pelajar Bahari</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-emerald-900 text-white flex-col shrink-0 z-40 shadow-2xl">
        <NavContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-emerald-900 text-white flex flex-col z-[60] shadow-2xl"
          >
            <NavContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-[55] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
