import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Edit2, Trash2, X, Save, AlertCircle, 
  Layers, Table2, Tag, Hash, Armchair, MapPin, 
  Gamepad2, Utensils
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type Category = {
  id: string;
  name: string;
  type: 'game' | 'fnb';
  color: string;
  icon: string;
};

type CafeTable = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
};

export default function CategoriesTablesView() {
  const [activeTab, setActiveTab] = useState<"categories" | "tables">("categories");
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCatModal, setShowCatModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "category" | "table", id: string } | null>(null);
  
  // Form state
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Cat form
  const [catId, setCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState<'game'|'fnb'>('game');
  
  // Table form
  const [tableId, setTableId] = useState<string | null>(null);
  const [tableName, setTableName] = useState("");
  const [tableCapacity, setTableCapacity] = useState(4);
  const [tableLocation, setTableLocation] = useState("");
  const [tableStatus, setTableStatus] = useState<'Available' | 'Occupied' | 'Reserved' | 'Maintenance'>('Available');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: catData } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      if (catData) setCategories(catData);
      
      const { data: tableData } = await supabase.from('cafe_tables').select('*').order('name', { ascending: true });
      if (tableData) setTables(tableData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Category Actions ---
  const openAddCategory = () => {
    setCatId(null); setCatName(""); setCatType('game'); setShowCatModal(true);
  };
  const openEditCategory = (c: Category) => {
    setCatId(c.id); setCatName(c.name); setCatType(c.type); setShowCatModal(true);
  };
  const saveCategory = async () => {
    if (!catName.trim()) return;
    setIsSaving(true);
    try {
      if (catId) {
        await supabase.from('categories').update({ name: catName, type: catType }).eq('id', catId);
      } else {
        await supabase.from('categories').insert({ name: catName, type: catType });
      }
      setShowCatModal(false);
      fetchData();
    } finally {
      setIsSaving(false);
    }
  };

  // --- Table Actions ---
  const openAddTable = () => {
    setTableId(null); setTableName(""); setTableCapacity(4); setTableLocation(""); setTableStatus('Available'); setShowTableModal(true);
  };
  const openEditTable = (t: CafeTable) => {
    setTableId(t.id); setTableName(t.name); setTableCapacity(t.capacity); setTableLocation(t.location || ""); setTableStatus(t.status); setShowTableModal(true);
  };
  const saveTable = async () => {
    if (!tableName.trim()) return;
    setIsSaving(true);
    try {
      if (tableId) {
        await supabase.from('cafe_tables').update({ 
          name: tableName, capacity: tableCapacity, location: tableLocation, status: tableStatus 
        }).eq('id', tableId);
      } else {
        await supabase.from('cafe_tables').insert({ 
          name: tableName, capacity: tableCapacity, location: tableLocation, status: tableStatus 
        });
      }
      setShowTableModal(false);
      fetchData();
    } finally {
      setIsSaving(false);
    }
  };

  // --- Delete ---
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      if (deleteConfirm.type === 'category') {
        await supabase.from('categories').delete().eq('id', deleteConfirm.id);
      } else {
        await supabase.from('cafe_tables').delete().eq('id', deleteConfirm.id);
      }
      setDeleteConfirm(null);
      fetchData();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header & Tabs */}
      <div>
        <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Kategori &amp; Daftar Meja</h2>
        <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider mt-0.5">
          Kelola master data untuk menu, game, dan layout meja
        </p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "categories" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Layers size={14} /> Kategori
        </button>
        <button
          onClick={() => setActiveTab("tables")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "tables" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Table2 size={14} /> Daftar Meja
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full" />
        </div>
      ) : (
        <>
          {/* TAB CATEGORIES */}
          {activeTab === "categories" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <button onClick={openAddCategory} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
                  <Plus size={14} /> Tambah Kategori
                </button>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[#94A3B8] border-b border-slate-100 font-bold uppercase tracking-wider">
                      <th className="px-5 py-3">Nama Kategori</th>
                      <th className="px-5 py-3">Tipe</th>
                      <th className="px-5 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-8 text-slate-400">Belum ada kategori.</td></tr>
                    ) : categories.map(c => (
                      <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 font-bold text-[#0F172A] flex items-center gap-2">
                          <Tag size={14} className="text-blue-500" /> {c.name}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                            c.type === 'game' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {c.type === 'game' ? 'Board Game' : 'F&B'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => openEditCategory(c)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => setDeleteConfirm({ type: 'category', id: c.id })} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB TABLES */}
          {activeTab === "tables" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <button onClick={openAddTable} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
                  <Plus size={14} /> Tambah Meja
                </button>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[#94A3B8] border-b border-slate-100 font-bold uppercase tracking-wider">
                      <th className="px-5 py-3">Nama Meja</th>
                      <th className="px-5 py-3">Kapasitas</th>
                      <th className="px-5 py-3">Lokasi</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-400">Belum ada meja terdaftar.</td></tr>
                    ) : tables.map(t => (
                      <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 font-bold text-[#0F172A] flex items-center gap-2">
                          <Hash size={14} className="text-slate-400" /> {t.name}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-600 flex items-center gap-1.5">
                          <Armchair size={13} className="text-slate-400"/> {t.capacity} org
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-600">
                           <div className="flex items-center gap-1.5">
                             <MapPin size={12} className="text-slate-400"/> {t.location || '-'}
                           </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            t.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            t.status === 'Occupied' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            t.status === 'Reserved' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => openEditTable(t)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => setDeleteConfirm({ type: 'table', id: t.id })} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL CATEGORY */}
      <AnimatePresence>
        {showCatModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
               <div className="flex justify-between items-center mb-5">
                 <h3 className="font-black text-[#0F172A] text-lg">{catId ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                 <button onClick={() => setShowCatModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
               </div>
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5">Nama Kategori</label>
                   <input value={catName} onChange={e => setCatName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" placeholder="Cth: Strategy" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5">Tipe</label>
                   <div className="flex gap-2">
                     <button onClick={() => setCatType('game')} className={`flex-1 py-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-2 ${catType === 'game' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500'}`}><Gamepad2 size={14}/> Board Game</button>
                     <button onClick={() => setCatType('fnb')} className={`flex-1 py-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-2 ${catType === 'fnb' ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-slate-200 text-slate-500'}`}><Utensils size={14}/> F&B Menu</button>
                   </div>
                 </div>
               </div>
               <div className="mt-6 flex justify-end gap-2">
                 <button onClick={() => setShowCatModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Batal</button>
                 <button onClick={saveCategory} disabled={isSaving || !catName.trim()} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg disabled:opacity-50 flex items-center gap-2">
                   {isSaving ? "Menyimpan..." : <><Save size={14}/> Simpan</>}
                 </button>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* MODAL TABLE */}
      <AnimatePresence>
        {showTableModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
               <div className="flex justify-between items-center mb-5">
                 <h3 className="font-black text-[#0F172A] text-lg">{tableId ? 'Edit Meja' : 'Tambah Meja'}</h3>
                 <button onClick={() => setShowTableModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
               </div>
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5">Nama/Nomor Meja</label>
                   <input value={tableName} onChange={e => setTableName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" placeholder="Cth: Meja 1" />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1.5">Kapasitas</label>
                     <input type="number" value={tableCapacity} onChange={e => setTableCapacity(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1.5">Status</label>
                     <select value={tableStatus} onChange={e => setTableStatus(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none">
                       <option value="Available">Available</option>
                       <option value="Occupied">Occupied</option>
                       <option value="Reserved">Reserved</option>
                       <option value="Maintenance">Maintenance</option>
                     </select>
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1.5">Lokasi (Opsional)</label>
                   <input value={tableLocation} onChange={e => setTableLocation(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" placeholder="Cth: Lantai 1, Dekat Jendela" />
                 </div>
               </div>
               <div className="mt-6 flex justify-end gap-2">
                 <button onClick={() => setShowTableModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Batal</button>
                 <button onClick={saveTable} disabled={isSaving || !tableName.trim()} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg disabled:opacity-50 flex items-center gap-2">
                   {isSaving ? "Menyimpan..." : <><Save size={14}/> Simpan</>}
                 </button>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {deleteConfirm && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center flex flex-col gap-4">
               <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
                 <Trash2 size={20} className="text-red-500" />
               </div>
               <div>
                 <h3 className="font-black text-[#0F172A] text-base">Hapus {deleteConfirm.type === 'category' ? 'Kategori' : 'Meja'}?</h3>
                 <p className="text-xs text-slate-500 mt-1">Tindakan ini tidak dapat dibatalkan.</p>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">Batal</button>
                 <button onClick={executeDelete} disabled={isDeleting} className="flex-1 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50">
                   {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                 </button>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

    </div>
  );
}
