import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { BookOpen, Target, Flag, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const [content, setContent] = useState<Record<string, string>>({
    history: 'Sedang memuat sejarah...',
    vision: 'Sedang memuat visi...',
    mission: 'Sedang memuat misi...',
    objectives: 'Sedang memuat tujuan...'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orgContent'));
        const data: Record<string, string> = {};
        querySnapshot.forEach((doc) => {
          data[doc.id] = doc.data().text;
        });
        if (Object.keys(data).length > 0) {
          setContent(prev => ({ ...prev, ...data }));
        } else {
            setContent({
                history: 'IPNU dan IPPNU di Kota Tegal memiliki sejarah panjang dalam mengawal perjuangan pelajar di pesisir.',
                vision: 'Visi: Terwujudnya pelajar bangsa yang bertaqwa kepada Allah SWT, berilmu, berakhlak mulia, berwawasan kebangsaan, dan bertanggung jawab atas tegaknya Islam Aswaja An-Nahdliyah.',
                mission: 'Misi IPPNU: Membangun kader NU yang berkualitas, berakhlakul karimah, bersikap demokratis dalam kehidupan bermasyarakat, berbangsa dan bernegara.',
                objectives: 'Terbentuknya kader bangsa yang militan dan loyal terhadap nilai-nilai Aswaja An-Nahdliyah.'
            });
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };
    fetchContent();
  }, []);

  const sections = [
    { id: 'history', title: 'Sejarah Organisasi', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'vision', title: 'Visi Perjuangan', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'mission', title: 'Misi Utama', icon: Flag, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'objectives', title: 'Tujuan Strategis', icon: Shield, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col items-start h-full"
          >
            <div className={cn("p-4 rounded-xl mb-6 shadow-sm", section.bg)}>
              <section.icon size={24} className={section.color} />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
              <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {content[section.id]}
            </p>
            
            <div className="mt-auto pt-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>PC IPNU IPPNU</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span>Kota Tegal</span>
            </div>
          </motion.section>
        ))}
      </div>
      
      {/* Editorial Quote Card */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-emerald-900 rounded-3xl p-10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/navy.png')]" />
        <p className="text-emerald-100/60 text-xs font-bold uppercase tracking-[0.3em] mb-6">Motto Juang</p>
        <h3 className="text-2xl md:text-3xl font-serif italic text-white max-w-2xl mx-auto leading-snug">
          "Belajar, Berjuang, Bertaqwa — Menjaga Tradisi, Membangun Generasi di Kota Bahari."
        </h3>
      </motion.div>
    </div>
  );
};

export default Dashboard;
