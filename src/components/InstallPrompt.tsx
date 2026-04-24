import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent browser from showing the default prompt
      e.preventDefault();
      // Save the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show custom UI
      setShowPrompt(true);

      // Also show the navbar button if it exists
      const navBtn = document.getElementById('install-btn');
      if (navBtn) {
        navBtn.classList.remove('hidden');
        navBtn.onclick = () => {
          e.prompt();
          setShowPrompt(false);
          navBtn.classList.add('hidden');
        };
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the browser install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // Also hide the navbar button if it exists
    const navBtn = document.getElementById('install-btn');
    if (navBtn) navBtn.classList.add('hidden');

    // We used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 z-[200] max-w-sm"
        >
          <div className="bg-emerald-900 text-white p-5 rounded-3xl shadow-2xl border border-emerald-700 flex items-center gap-4 relative overflow-hidden">
             {/* Decorative background circle */}
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
            
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <Smartphone className="text-emerald-400" size={24} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold truncate">Install Pelajar Bahari</h4>
              <p className="text-[10px] text-emerald-100/70 leading-relaxed">
                Pasang aplikasi di layar utama HP Anda untuk akses lebih cepat.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleInstallClick}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-900/40"
              >
                Install
              </button>
              <button 
                onClick={() => setShowPrompt(false)}
                className="p-2 text-emerald-100/30 hover:text-white transition-colors"
                title="Tutup"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
