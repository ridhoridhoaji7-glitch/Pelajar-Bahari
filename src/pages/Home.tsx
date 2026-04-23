import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Anchor, Shield, Target, Flag, BookOpen, Clock, Users, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ContactInfo } from '../types';

const Home = () => {
  const { login, user } = useAuth();
  const [contact, setContact] = useState<ContactInfo>({
    phone: '+62 851-XXXX-XXXX',
    email: 'sekre@pelajarbahari.id',
    address: 'Jl. Ahmad Yani No. 12, Kel. Mintaragen, Kec. Tegal Timur, Kota Tegal.'
  });

  useEffect(() => {
    const fetchContact = async () => {
      const docRef = doc(db, 'settings', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContact(docSnap.data() as ContactInfo);
      }
    };
    fetchContact();
  }, []);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Centered Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-full bg-emerald-900 rounded-[40px] p-10 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-emerald-900/30"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400/10 blur-[120px] rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center justify-center gap-6 mb-10">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-3xl p-3 shadow-2xl shadow-black/20 flex items-center justify-center overflow-hidden"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logo_IPNU.png/600px-Logo_IPNU.png" alt="IPNU" className="w-full h-full object-contain" />
            </motion.div>
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-3xl p-3 shadow-2xl shadow-black/20 flex items-center justify-center overflow-hidden"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Logo_IPPNU.png/600px-Logo_IPPNU.png" alt="IPPNU" className="w-full h-full object-contain" />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl lg:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-sm">
              Selamat Datang Rekan dan Rekanita
            </h1>
            <p className="text-emerald-300 font-bold uppercase tracking-[0.4em] text-xs lg:text-sm">
              Pelajar Bahari Kota Tegal
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* About Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm overflow-hidden relative h-full"
          >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
          
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800">
              Profil Singkat
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              KOTA BAHARI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Visi Utama</p>
              <p className="text-sm leading-relaxed italic text-slate-600 font-medium border-l-4 border-emerald-500 pl-4 py-1 bg-emerald-50/30 rounded-r-xl mb-6">
                "Terwujudnya pelajar bangsa yang bertaqwa kepada Allah SWT, berilmu, berakhlak mulia, berwawasan kebangsaan, dan bertanggung jawab atas tegaknya Islam Ahlussunnah Wal Jamaah An-Nahdliyah."
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Visi IPPNU</p>
              <p className="text-[11px] leading-relaxed text-slate-500 font-medium border-l-4 border-yellow-400 pl-4 py-1 bg-yellow-50/30 rounded-r-xl">
                "Terbentuknya kesempurnaan pelajar Putri Indonesia yang bertakwa, berakhlakul karimah, berilmu dan berwawasan kebangsaan."
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Misi IPPNU</p>
              <ul className="text-sm text-slate-600 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield size={10} className="text-emerald-600" />
                  </div>
                  <span>Membangun kader NU yang berkualitas dan berakhlakul karimah.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield size={10} className="text-yellow-600" />
                  </div>
                  <span>Bersikap demokratis dalam kehidupan bermasyarakat, berbangsa dan bernegara.</span>
                </li>
              </ul>
            </div>
          </div>
          
          {!user && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button 
                onClick={login}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
              >
                Masuk untuk Akses Lengkap
              </button>
            </div>
          )}
        </motion.div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/dashboard" className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
              <BookOpen size={24} />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Sejarah & Filosofi</h4>
            <p className="text-xs text-slate-500">Mempelajari akar perjuangan pelajar Nahdliyin di Tegal.</p>
          </Link>

          <Link to="/informasi" className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
              <Clock size={24} />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Agenda Terkini</h4>
            <p className="text-xs text-slate-500">Pantau kegiatan rutin dan besar PC Kota Tegal.</p>
          </Link>
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Statistics Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl shadow-emerald-900/20 relative overflow-hidden"
        >
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <Anchor size={200} />
          </div>
          
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 mb-8">Informasi Kegiatan Pimpinan</h3>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black tracking-tight">0</p>
                <p className="text-[10px] uppercase font-bold text-emerald-400/80 mt-1">Pimpinan IPNU</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-emerald-700 flex items-center justify-center font-bold text-[10px]">
                PC
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black tracking-tight">0</p>
                <p className="text-[10px] uppercase font-bold text-emerald-400/80 mt-1">Pimpinan IPPNU</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-emerald-700 flex items-center justify-center font-bold text-[10px]">
                PC
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-emerald-800 relative z-10 text-[10px] font-medium text-emerald-300/80 leading-relaxed uppercase tracking-widest">
            Total Pimpinan: 0
          </div>
        </motion.div>

        {/* Contact Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider border-b border-slate-50 pb-3">Kontak Sekretariat</h3>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Phone size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Telepon</p>
                <p className="text-sm font-medium text-slate-700">{contact.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Mail size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Email</p>
                <p className="text-sm font-medium text-slate-700">{contact.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Alamat</p>
                <p className="text-[10.5px] font-medium text-slate-600 leading-relaxed">
                  {contact.address}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default Home;
