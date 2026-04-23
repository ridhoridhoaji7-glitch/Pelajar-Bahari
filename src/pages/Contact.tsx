import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Instagram, Globe, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { ContactInfo } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Contact = () => {
  const [contact, setContact] = useState<ContactInfo>({
    phone: '+62 812-3456-7890',
    email: 'pc.ipnuippnutegal@gmail.com',
    address: 'Jl. Ahmad Yani No. 12, Kota Tegal',
    whatsapp: '6281234567890',
    instagram: 'pelajarbahari.tegal'
  });

  useEffect(() => {
    const fetchContact = async () => {
      const docRef = doc(db, 'settings', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as ContactInfo;
        setContact(data);
      }
    };
    fetchContact();
  }, []);

  const contactChannels = [
    { name: 'WhatsApp Sekretariat', value: contact.whatsapp || contact.phone, icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', link: `https://wa.me/${(contact.whatsapp || contact.phone).replace(/[^0-9]/g, '')}` },
    { name: 'Instagram Resmi', value: `@${contact.instagram || 'pelajarbahari.tegal'}`, icon: Instagram, color: 'text-rose-600', bg: 'bg-rose-50', link: `https://instagram.com/${contact.instagram || ''}` },
    { name: 'Email Korespondensi', value: contact.email, icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50', link: `mailto:${contact.email}` },
    { name: 'Alamat Kantor', value: contact.address, icon: MapPin, color: 'text-slate-600', bg: 'bg-slate-50', link: `https://maps.google.com/?q=${encodeURIComponent(contact.address)}` },
  ];

  return (
    <div className="p-4 lg:p-10 max-w-5xl mx-auto space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactChannels.map((channel, idx) => (
          <motion.a
            key={channel.name}
            href={channel.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white p-8 rounded-3xl border border-slate-200 hover:border-emerald-200 hover:shadow-xl transition-all flex items-center gap-6"
          >
            <div className={cn("p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110", channel.bg, channel.color)}>
              <channel.icon size={28} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">{channel.name}</h3>
              <p className="font-bold text-slate-800 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors uppercase">{channel.value}</p>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-emerald-900 text-white p-10 lg:p-16 rounded-[40px] text-center relative overflow-hidden shadow-2xl shadow-emerald-900/20"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Globe size={240} strokeWidth={0.5} />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-800/50 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-700/50">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Layanan Pengaduan Aktif
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight max-w-xl mx-auto">Punya Pertanyaan atau Ingin Bergabung?</h2>
          
          <p className="text-emerald-100/70 max-w-lg mx-auto leading-relaxed font-medium text-sm">
            Kami siap melayani setiap aspirasi, pertanyaan seputar keorganisasian, dan pendaftaran anggota baru Pelajar Bahari Kota Tegal.
          </p>
          
          <div className="pt-4">
            <button className="px-10 py-4 bg-white text-emerald-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-50 active:scale-95 transition-all shadow-lg">
              Hubungi Sekretariat Sekarang
            </button>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="flex flex-col items-center gap-4 py-8 border-t border-slate-200">
        <div className="flex space-x-2">
           <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logo_IPNU.png/600px-Logo_IPNU.png" alt="IPNU" className="w-full h-full object-contain" />
           </div>
           <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Logo_IPPNU.png/600px-Logo_IPPNU.png" alt="IPPNU" className="w-full h-full object-contain" />
           </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Pimpinan Cabang Kota Tegal</p>
      </div>
    </div>
  );
};

export default Contact;
