import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Member } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, Plus, Phone, Award, Shield, User, Filter, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orgFilter, setOrgFilter] = useState<'all' | 'IPNU' | 'IPPNU'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'PC' | 'PAC' | 'PR'>('all');
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'members'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const memberData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
        setMembers(memberData);
      },
      (error) => {
        console.error("Firestore onSnapshot error in Members:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredMembers = members
    .filter(m => orgFilter === 'all' ? true : m.organization === orgFilter)
    .filter(m => levelFilter === 'all' ? true : m.level === levelFilter)
    .filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Search & Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative z-20">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama pimpinan atau jabatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {['all', 'IPNU', 'IPPNU'].map((f) => (
              <button
                key={f}
                onClick={() => setOrgFilter(f as any)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                  orgFilter === f ? "bg-white text-emerald-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {['all', 'PC', 'PAC', 'PR'].map((f) => (
              <button
                key={f}
                onClick={() => setLevelFilter(f as any)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                  levelFilter === f ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          
          {user?.isAdmin && (
            <Link to="/admin" className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95">
              <Plus size={20} />
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMembers.map((member) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all group relative overflow-hidden"
            >
              <div className={cn(
                  "absolute top-0 right-0 w-20 h-20 blur-3xl opacity-5 transition-opacity group-hover:opacity-10",
                  member.organization === 'IPNU' ? "bg-emerald-500" : "bg-yellow-500"
              )} />

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                   <div className={cn("px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                     member.level === 'PC' ? "bg-slate-900 text-white border-slate-900" :
                     member.level === 'PAC' ? "bg-emerald-600 text-white border-emerald-600" :
                     "bg-slate-200 text-slate-700 border-slate-300"
                   )}>
                     {member.level}
                   </div>
                </div>

                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm overflow-hidden",
                  member.organization === 'IPNU' ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-600"
                )}>
                   {member.imageUrl ? (
                     <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                   ) : (
                     <User size={30} strokeWidth={1.5} />
                   )}
                </div>
                
                <span className={cn("px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.2em] mb-3 border", 
                  member.organization === 'IPNU' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-yellow-50 text-yellow-700 border-yellow-200")}>
                  {member.organization}
                </span>

                <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{member.name}</h3>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-6">
                  <Award size={10} />
                  <span>{member.position}</span>
                </div>

                <div className="w-full flex gap-2">
                  <a 
                    href={`tel:${member.phone}`}
                    className="flex-1 py-2 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  >
                    <Phone size={14} />
                  </a>
                  <button className="flex-1 py-2 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white transition-all shadow-sm">
                    <Shield size={14} />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-50 text-[9px] text-slate-400 flex justify-between font-bold uppercase tracking-widest">
                <span>NIA: {member.nia || 'N/A'}</span>
                <span>SINCE {member.joinDate ? new Date(member.joinDate).getFullYear() : '-'}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredMembers.length === 0 && (
         <div className="py-32 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <Users size={32} />
            </div>
            <p className="text-slate-400 italic font-medium">Data pimpinan tidak ditemukan.</p>
         </div>
      )}
    </div>
  );
};

export default Members;
