import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NewsItem } from '../types';
import { formatDate, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Tag, ChevronRight, MessageSquare, AlertCircle, Search, FileText, Download, ExternalLink } from 'lucide-react';

const Information = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'news' | 'announcement' | 'agenda'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
        setItems(newsData);
      },
      (error) => {
        console.error("Firestore onSnapshot error in Information:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredItems = items
    .filter(i => filter === 'all' ? true : i.type === filter)
    .filter(i => i.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'news': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'announcement': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'agenda': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'news': return 'border-blue-500';
      case 'announcement': return 'border-rose-500';
      case 'agenda': return 'border-emerald-500';
      default: return 'border-slate-300';
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Search & Filter Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative z-20">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari kegiatan atau berita pimpinan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
          />
        </div>
        
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl self-start lg:self-center">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'news', label: 'Berita' },
            { id: 'announcement', label: 'Pengumuman' },
            { id: 'agenda', label: 'Agenda' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                filter === f.id ? "bg-white text-emerald-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={item.id}
              className={cn(
                "group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col border-l-[6px]",
                getBorderColor(item.type)
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={cn("px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border flex items-center gap-1.5", getTypeBadge(item.type))}>
                   {item.type}
                </span>
                <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-tighter text-[9px]">
                  <Calendar size={12} />
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>
              
              <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors mb-4 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-4 font-medium italic">
                "{item.content}"
              </p>
              
              {item.attachmentUrl && (
                <div className="mb-6 space-y-3">
                  {item.attachmentType?.startsWith('image/') && (
                    <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                      <img 
                        src={item.attachmentUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  )}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group/file hover:bg-emerald-50 hover:border-emerald-100 transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={cn(
                        "w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm",
                        item.attachmentType?.startsWith('image/') ? "text-emerald-500" : "text-blue-500"
                      )}>
                        <FileText size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-700 truncate">{item.attachmentName || 'Dokumen Terlampir'}</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest">
                          {item.attachmentType?.includes('pdf') ? 'Dokumen PDF' : 
                           item.attachmentType?.includes('image') ? 'Gambar / Foto' : 
                           'File Dokumen'}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={item.attachmentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                  Lihat Detail <ChevronRight size={14} />
                </button>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300">
                  <MessageSquare size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredItems.length === 0 && (
          <div className="col-span-full py-32 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <Tag size={32} />
            </div>
            <p className="text-slate-400 italic font-medium">Informasi tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Information;
