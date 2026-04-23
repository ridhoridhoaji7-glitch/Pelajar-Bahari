import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, setDoc, writeBatch, onSnapshot, query, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Plus, Newspaper, Users, BookOpen, ShieldCheck, Settings, Upload, FileJson, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { ContactInfo, NewsItem } from '../types';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'news' | 'members' | 'settings'>('news');
  
  // News/Activity Form
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsType, setNewsType] = useState<'news' | 'announcement' | 'agenda'>('news');
  const [newsAttachment, setNewsAttachment] = useState<{url: string, name: string, type: string} | null>(null);

  // News list and editing
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Leader Form
  const [memberName, setMemberName] = useState('');
  const [memberPos, setMemberPos] = useState('');
  const [memberOrg, setMemberOrg] = useState<'IPNU' | 'IPPNU'>('IPNU');
  const [memberLevel, setMemberLevel] = useState<'PC' | 'PAC' | 'PR'>('PC');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberImage, setMemberImage] = useState<string>('');

  // Contact Info Form
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    instagram: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContactInfo(docSnap.data() as ContactInfo);
      }
    };

    // Real-time news listener
    const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'));
    const unsubscribeNews = onSnapshot(newsQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
      setNewsItems(items);
    });

    if (user?.isAdmin) {
      fetchSettings();
    }
    return () => unsubscribeNews();
  }, [user]);

  if (!user?.isAdmin) {
    return (
      <div className="p-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Akses Terbatas</h1>
        <p className="text-slate-500 max-w-xs mx-auto">Halaman ini hanya dapat diakses oleh Administrator Pimpinan Cabang.</p>
      </div>
    );
  }

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'news'), {
        title: newsTitle,
        content: newsContent,
        type: newsType,
        date: new Date().toISOString(),
        authorId: user.uid,
        createdAt: new Date().toISOString(),
        attachmentUrl: newsAttachment?.url || null,
        attachmentName: newsAttachment?.name || null,
        attachmentType: newsAttachment?.type || null
      });
      setNewsTitle('');
      setNewsContent('');
      setNewsAttachment(null);
      alert('Informasi Kegiatan Pimpinan berhasil ditambahkan!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'members'), {
        name: memberName,
        position: memberPos,
        organization: memberOrg,
        level: memberLevel,
        phone: memberPhone,
        address: 'Kota Tegal',
        joinDate: new Date().toISOString(),
        imageUrl: memberImage
      });
      setMemberName('');
      setMemberPos('');
      setMemberPhone('');
      setMemberImage('');
      alert('Data Pimpinan berhasil ditambahkan!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'contact'), contactInfo);
      alert('Kontak Sekretariat berhasil diperbarui!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    try {
      const newsRef = doc(db, 'news', editingNews.id);
      await updateDoc(newsRef, {
        title: editingNews.title,
        content: editingNews.content,
        type: editingNews.type,
        attachmentUrl: editingNews.attachmentUrl || null,
        attachmentName: editingNews.attachmentName || null,
        attachmentType: editingNews.attachmentType || null,
        updatedAt: new Date().toISOString()
      });
      setIsEditModalOpen(false);
      setEditingNews(null);
      alert('Informasi berhasil diperbarui!');
    } catch (e) {
      console.error(e);
      alert('Gagal memperbarui informasi.');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus informasi ini?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
        alert('Informasi berhasil dihapus!');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleNewsFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = {
          url: reader.result as string,
          name: file.name,
          type: file.type
        };
        if (isEdit && editingNews) {
          setEditingNews({
            ...editingNews,
            attachmentUrl: fileData.url,
            attachmentName: fileData.name,
            attachmentType: fileData.type
          });
        } else {
          setNewsAttachment(fileData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemberImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const membersData = JSON.parse(event.target?.result as string);
          if (Array.isArray(membersData)) {
            const batch = writeBatch(db);
            membersData.forEach((m) => {
              const newDocRef = doc(collection(db, 'members'));
              batch.set(newDocRef, {
                ...m,
                joinDate: m.joinDate || new Date().toISOString(),
                organization: m.organization || 'IPNU'
              });
            });
            await batch.commit();
            alert(`${membersData.length} anggota berhasil diimpor!`);
          }
        } catch (error) {
          console.error('Import failed:', error);
          alert('Format file tidak valid. Gunakan JSON array.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-4 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <button 
          onClick={() => setActiveTab('news')}
          className={cn(
            "flex-1 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-[10px] transition-all border", 
            activeTab === 'news' ? "bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-900/10" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
          )}
        >
          <Newspaper size={16} /> Kegiatan Pimpinan
        </button>
        <button 
          onClick={() => setActiveTab('members')}
          className={cn(
            "flex-1 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-[10px] transition-all border", 
            activeTab === 'members' ? "bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-900/10" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
          )}
        >
          <Users size={16} /> Struktur Kepengurusan
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "flex-1 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-[10px] transition-all border", 
            activeTab === 'settings' ? "bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-900/10" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
          )}
        >
          <Settings size={16} /> Pengaturan
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 lg:p-12 rounded-[32px] border border-slate-200 shadow-sm"
      >
        {activeTab === 'news' && (
          <div className="space-y-12">
            <form onSubmit={handleAddNews} className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                <h2 className="text-xl font-bold text-slate-800">Tambah Kegiatan Pimpinan</h2>
              </div>
              
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Judul Kegiatan / Berita</label>
                  <input 
                    required
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                    placeholder="Contoh: Rakerda PC IPNU IPPNU Kota Tegal..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Kategori</label>
                    <select 
                      value={newsType}
                      onChange={(e) => setNewsType(e.target.value as any)}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700 appearance-none"
                    >
                      <option value="news">Berita Terkini</option>
                      <option value="announcement">Pengumuman Resmi</option>
                      <option value="agenda">Agenda Pimpinan</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Lampiran (PDF/Doc/Gambar)</label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1 group">
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
                          onChange={(e) => handleNewsFileUpload(e)}
                          className="hidden" 
                          id="news-file" 
                        />
                        <label 
                          htmlFor="news-file" 
                          className={cn(
                            "cursor-pointer flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-xl border border-dashed transition-all text-xs font-bold",
                            newsAttachment ? "border-emerald-500 bg-emerald-50/50 text-emerald-700" : "border-slate-300 hover:border-emerald-500 text-slate-500"
                          )}
                        >
                          <Upload size={14} />
                          {newsAttachment ? (
                            <span className="truncate max-w-[200px]">{newsAttachment.name}</span>
                          ) : (
                            "Upload Dokumen/Gambar"
                          )}
                        </label>
                      </div>
                      {newsAttachment && (
                        <button 
                          type="button"
                          onClick={() => setNewsAttachment(null)}
                          className="p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors border border-rose-100"
                          title="Hapus Lampiran"
                        >
                          <Plus size={18} className="rotate-45" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Isi / Narasi Kegiatan</label>
                  <textarea 
                    required
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    rows={6}
                    className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                    placeholder="Tuliskan detail kegiatan atau isi berita di sini..."
                  />
                </div>
              </div>

              <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-3">
                <Save size={18} /> Publish Sekarang
              </button>
            </form>

            <div className="pt-12 border-t border-slate-100">
               <div className="flex items-center gap-3 mb-8">
                <span className="w-1 h-6 bg-slate-400 rounded-full"></span>
                <h2 className="text-xl font-bold text-slate-800">Daftar Kegiatan</h2>
              </div>

              <div className="grid gap-4">
                {newsItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 group hover:border-emerald-200 hover:bg-white transition-all">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      item.type === 'news' ? "bg-blue-100 text-blue-600" : 
                      item.type === 'announcement' ? "bg-rose-100 text-rose-600" : 
                      "bg-emerald-100 text-emerald-600"
                    )}>
                      <Newspaper size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.type} • {formatDate(item.date)}</p>
                      <h4 className="font-bold text-slate-800 truncate">{item.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => handleEditNews(item)}
                        className="p-2.5 bg-white text-slate-400 hover:text-emerald-600 rounded-lg border border-slate-200 hover:border-emerald-200 transition-all shadow-sm"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-2.5 bg-white text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 hover:border-rose-200 transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {newsItems.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-slate-400 italic text-sm">Belum ada kegiatan yang dipublikasikan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-12">
            <form onSubmit={handleAddMember} className="space-y-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                  <h2 className="text-xl font-bold text-slate-800">Tambah Pimpinan Baru</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Nama Lengkap</label>
                  <input 
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Tingkatan Pimpinan</label>
                   <select 
                      value={memberLevel}
                      onChange={(e) => setMemberLevel(e.target.value as any)}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700 appearance-none"
                   >
                     <option value="PC">PC (Pimpinan Cabang)</option>
                     <option value="PAC">PAC (Pimpinan Anak Cabang)</option>
                     <option value="PR">PR (Pimpinan Ranting)</option>
                   </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Organisasi</label>
                  <select 
                     value={memberOrg}
                     onChange={(e) => setMemberOrg(e.target.value as any)}
                     className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700 appearance-none"
                  >
                    <option value="IPNU">IPNU</option>
                    <option value="IPPNU">IPPNU</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Jabatan Sesuai SK</label>
                  <input 
                    required
                    value={memberPos}
                    onChange={(e) => setMemberPos(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">WhatsApp Aktif</label>
                  <input 
                    required
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                    placeholder="08..."
                  />
                </div>
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Foto Anggota (Opsional)</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-emerald-500 cursor-pointer transition-all bg-slate-50">
                      <Upload size={24} className="text-slate-400 mb-2" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pilih Gambar</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                    {memberImage && (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group">
                        <img src={memberImage} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setMemberImage('')}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="rotate-45" size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-emerald-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black active:scale-[0.98] transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-3">
                <Plus size={18} /> Simpan Data Pimpinan
              </button>
            </form>

            <div className="pt-12 border-t border-slate-100">
              <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
                <div className="flex items-center gap-3 mb-4">
                   <FileJson className="text-emerald-700" size={24} />
                   <h3 className="text-lg font-bold text-emerald-900">Bulk Import Data</h3>
                </div>
                <p className="text-xs text-emerald-700/70 mb-6 leading-relaxed">
                  Unggah file JSON berisi array objek anggota untuk sinkronisasi massal ke database.
                </p>
                <label className="inline-flex items-center px-6 py-3 bg-emerald-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-900 cursor-pointer transition-all">
                  <Upload size={14} className="mr-2" /> Pilih File JSON
                  <input type="file" accept=".json" className="hidden" onChange={handleBulkImport} />
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <form onSubmit={handleUpdateContact} className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
              <h2 className="text-xl font-bold text-slate-800">Kontak Sekretariat</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Telepon / HP</label>
                <input 
                   value={contactInfo.phone}
                   onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                   className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Email Resmi</label>
                <input 
                   value={contactInfo.email}
                   onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                   className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">WhatsApp</label>
                <input 
                   value={contactInfo.whatsapp}
                   onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                   className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Instagram</label>
                <input 
                   value={contactInfo.instagram}
                   onChange={(e) => setContactInfo({...contactInfo, instagram: e.target.value})}
                   className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                />
              </div>
              <div className="space-y-2 col-span-full">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Alamat Lengkap</label>
                <textarea 
                   rows={3}
                   value={contactInfo.address}
                   onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                   className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                />
              </div>
            </div>

            <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-3">
              <Save size={18} /> Simpan Data Kontak
            </button>
          </form>
        )}
      </motion.div>

      {/* Edit News Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingNews && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl p-8 lg:p-10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Edit2 size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Edit Informasi Kegiatan</h3>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateNews} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Judul Kegiatan</label>
                  <input 
                    required
                    value={editingNews.title}
                    onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Kategori</label>
                    <select 
                      value={editingNews.type}
                      onChange={(e) => setEditingNews({...editingNews, type: e.target.value as any})}
                      className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                    >
                      <option value="news">Berita Terkini</option>
                      <option value="announcement">Pengumuman Resmi</option>
                      <option value="agenda">Agenda Pimpinan</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Lampiran Baru (Opsional)</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
                        onChange={(e) => handleNewsFileUpload(e, true)}
                        className="hidden" 
                        id="edit-news-file" 
                      />
                      <label 
                        htmlFor="edit-news-file" 
                        className="cursor-pointer flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 transition-all text-xs font-bold text-slate-500"
                      >
                        <Upload size={14} />
                        <span className="truncate max-w-[150px]">
                          {editingNews.attachmentName || "Ganti Dokumen"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Isi Kegiatan</label>
                  <textarea 
                    required
                    value={editingNews.content}
                    onChange={(e) => setEditingNews({...editingNews, content: e.target.value})}
                    rows={4}
                    className="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
