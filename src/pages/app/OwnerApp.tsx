import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  LogOut, 
  DollarSign, 
  Users, 
  Gamepad2, 
  Coffee, 
  TrendingUp, 
  Clock,
  FileText,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";

export default function OwnerPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // MOCK DATA SESUAI SKEMA DATABASE PM BRIEF
  // ==========================================
  
  // 1. Data Transaksi Keuangan (Skema: Table Transactions)
  const mockTransactions = [
    { id: "1001", customer_name: "Rafi Amrullah", total: 145000, payment_method: "Transfer", created_at: "2026-06-16 10:15" },
    { id: "1002", customer_name: "Dina Kristanti", total: 85000, payment_method: "Cash", created_at: "2026-06-16 11:00" },
    { id: "1003", customer_name: "Ahmad Fauzi", total: 210000, payment_method: "Transfer", created_at: "2026-06-15 19:30" },
  ];

  // 2. Data Pelanggan (Skema: Table Customers)
  const mockCustomers = [
    { id: "1", name: "Rafi Amrullah", phone: "081234567890", email: "rafiamrullah2112@gmail.com", join_date: "2026-01-15" },
    { id: "2", name: "Dina Kristanti", phone: "089876543210", email: "dina.kris@gmail.com", join_date: "2026-02-20" },
    { id: "3", name: "Ahmad Fauzi", phone: "085211223344", email: "fauzi_ahmad@yahoo.com", join_date: "2026-03-05" },
  ];

  // 3. Data Koleksi Boardgame & Status Fisik
  const mockBoardgames = [
    { id: "BG-01", name: "Catan", category: "Strategy", status: "In Use", location: "Meja 01" },
    { id: "BG-02", name: "Exploding Kittens", category: "Card Game", status: "In Use", location: "Meja 02" },
    { id: "BG-03", name: "Dixit", category: "Party Game", status: "Available", location: "Rak A-3" },
    { id: "BG-04", name: "Werewolf Artifacts", category: "Social Deduction", status: "Maintenance", location: "Ruang Perbaikan" },
  ];

  // 4. Data Menu Food & Beverages (F&B)
  const mockFnBMenus = [
    { id: "FB-01", name: "Ice Caramel Latte", category: "Beverages", price: 28000, stock: "Tersedia" },
    { id: "FB-02", name: "French Fries XL", category: "Food", price: 22000, stock: "Tersedia" },
    { id: "FB-03", name: "Croissant Chocolate", category: "Food", price: 25000, stock: "Habis" },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* SIDEBAR: NAVIGASI UTAMA OWNER */}
      <aside
        className="hidden md:flex w-[250px] shrink-0 flex-col border-r border-slate-200"
        style={{ background: "linear-gradient(180deg, #0F2340 0%, #0A1628 100%)", minHeight: "100vh", position: "sticky", top: 0, height: "100vh" }}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src={sebangkuLogo} alt="Sebangku" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <div>
            <p className="text-white font-black text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Sebangku</p>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">Owner Panel</p>
          </div>
        </div>

        {/* Menu Navigasi Dinamis Berdasarkan Brief PM */}
        <div className="flex-1 px-3 py-4 flex flex-col gap-1.5">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer w-full text-left ${activeTab === "overview" ? "bg-blue-500 text-white font-semibold shadow-md shadow-blue-500/20" : "text-white/60 hover:bg-white/5"}`}
          >
            <LayoutDashboard size={16} />
            <span className="text-sm">Analitik Makro</span>
          </button>

          <button 
            onClick={() => setActiveTab("keuangan")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer w-full text-left ${activeTab === "keuangan" ? "bg-blue-500 text-white font-semibold shadow-md shadow-blue-500/20" : "text-white/60 hover:bg-white/5"}`}
          >
            <DollarSign size={16} />
            <span className="text-sm">Laporan Keuangan</span>
          </button>

          <button 
            onClick={() => setActiveTab("pelanggan")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer w-full text-left ${activeTab === "pelanggan" ? "bg-blue-500 text-white font-semibold shadow-md shadow-blue-500/20" : "text-white/60 hover:bg-white/5"}`}
          >
            <Users size={16} />
            <span className="text-sm">Data Pelanggan</span>
          </button>

          <button 
            onClick={() => setActiveTab("boardgame")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer w-full text-left ${activeTab === "boardgame" ? "bg-blue-500 text-white font-semibold shadow-md shadow-blue-500/20" : "text-white/60 hover:bg-white/5"}`}
          >
            <Gamepad2 size={16} />
            <span className="text-sm">Koleksi Boardgame</span>
          </button>

          <button 
            onClick={() => setActiveTab("fnb")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer w-full text-left ${activeTab === "fnb" ? "bg-blue-500 text-white font-semibold shadow-md shadow-blue-500/20" : "text-white/60 hover:bg-white/5"}`}
          >
            <Coffee size={16} />
            <span className="text-sm">Menu F&B</span>
          </button>
        </div>

        <div className="px-3 pb-5">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors text-white/40">
            <LogOut size={16} />
            <span className="text-sm font-semibold">Keluar</span>
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA (KONDISIONAL BERDASARKAN TAB) */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ANALITIK BISNIS MAKRO & DASHBOARD VISUAL */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="mb-6">
                <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-2xl font-black text-[#0F172A]">Analitik Bisnis Makro</h1>
                <p className="text-sm text-[#64748B]">Metrik performa finansial dan operasional kafe secara visual.</p>
              </div>

              {/* Metrik Grid Atas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Omzet Bulan Ini</span>
                    <p className="text-xl font-black text-slate-800 mt-1">Rp 42.850.000</p>
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1"><TrendingUp size={10} /> +15.4% m-o-m</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600"><DollarSign size={20} /></div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Pelanggan</span>
                    <p className="text-xl font-black text-slate-800 mt-1">1,248 Member</p>
                    <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1 mt-1"><TrendingUp size={10} /> +48 member baru</span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Users size={20} /></div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Boardgame</span>
                    <p className="text-xl font-black text-slate-800 mt-1">142 Unit</p>
                    <span className="text-[10px] text-amber-500 font-bold mt-1 block">4 Unit dalam perbaikan</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600"><Gamepad2 size={20} /></div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Item F&B Terjual</span>
                    <p className="text-xl font-black text-slate-800 mt-1">384 Porsi</p>
                    <span className="text-[10px] text-purple-500 font-bold mt-1 block">Kopi mendominasi 70%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600"><Coffee size={20} /></div>
                </div>
              </div>

              {/* Tampilan Visual Grafik Mock */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Grafik Tren Pendapatan Mingguan</h3>
                <div className="h-[180px] w-full bg-slate-50 rounded-xl flex items-end justify-between p-4 pt-8 gap-2">
                  <div className="bg-blue-500/40 w-full rounded-t-lg transition-all hover:bg-blue-500" style={{ height: "40%" }}><p className="text-[10px] text-center font-bold text-slate-600 -mt-5">W1</p></div>
                  <div className="bg-blue-500/40 w-full rounded-t-lg transition-all hover:bg-blue-500" style={{ height: "65%" }}><p className="text-[10px] text-center font-bold text-slate-600 -mt-5">W2</p></div>
                  <div className="bg-blue-500/40 w-full rounded-t-lg transition-all hover:bg-blue-500" style={{ height: "50%" }}><p className="text-[10px] text-center font-bold text-slate-600 -mt-5">W3</p></div>
                  <div className="bg-blue-500 w-full rounded-t-lg" style={{ height: "90%" }}><p className="text-[10px] text-center font-bold text-blue-600 -mt-5">W4 (Active)</p></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: LAPORAN KEUANGAN */}
          {activeTab === "keuangan" && (
            <motion.div key="keuangan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-2xl font-black text-[#0F172A]">Laporan Keuangan</h1>
                  <p className="text-sm text-[#64748B]">Riwayat penjualan F&B dan billing sewa yang tercatat di tabel `Transactions`.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 transition-all cursor-pointer">
                  <FileText size={14} /> Ekspor CSV/Excel
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="p-4">ID Transaksi</th>
                      <th className="p-4">Nama Pelanggan</th>
                      <th className="p-4">Metode Pembayaran</th>
                      <th className="p-4">Waktu Transaksi</th>
                      <th className="p-4 text-right">Total Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-700">
                    {mockTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-blue-600">#TX-{tx.id}</td>
                        <td className="p-4 font-semibold">{tx.customer_name}</td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs font-bold ${tx.payment_method === "Transfer" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"}`}>{tx.payment_method}</span></td>
                        <td className="p-4 text-slate-400">{tx.created_at}</td>
                        <td className="p-4 text-right font-bold text-slate-900">Rp {tx.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 3: MANAJEMEN DATA PELANGGAN */}
          {activeTab === "pelanggan" && (
            <motion.div key="pelanggan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-2xl font-black text-[#0F172A]">Manajemen Data Pelanggan</h1>
                  <p className="text-sm text-[#64748B]">Integrasi data member pelanggan sesuai skema database `Customers`.</p>
                </div>
                <div className="relative flex items-center">
                  <Search size={14} className="absolute left-3 text-slate-400" />
                  <input 
                    type="text" placeholder="Cari nama pelanggan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 w-[200px]"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="p-4">ID</th>
                      <th className="p-4">Nama Lengkap</th>
                      <th className="p-4">Nomor HP</th>
                      <th className="p-4">Alamat Email</th>
                      <th className="p-4">Tanggal Gabung</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-700">
                    {mockCustomers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((cust) => (
                      <tr key={cust.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-slate-400 font-mono">#{cust.id}</td>
                        <td className="p-4 font-bold text-slate-800">{cust.name}</td>
                        <td className="p-4 text-slate-600">{cust.phone}</td>
                        <td className="p-4 text-slate-600">{cust.email}</td>
                        <td className="p-4 text-slate-400">{cust.join_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 4: KOLEKSI BOARDGAME */}
          {activeTab === "boardgame" && (
            <motion.div key="boardgame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-2xl font-black text-[#0F172A]">Koleksi Boardgame</h1>
                  <p className="text-sm text-[#64748B]">Manajemen inventaris fisik dan pelacakan status ketersediaan rak.</p>
                </div>
                <button className="flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 transition-all cursor-pointer">
                  <Plus size={14} /> Tambah Boardgame
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockBoardgames.map((bg) => (
                  <div key={bg.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-[130px]">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{bg.category}</span>
                        <h4 className="font-bold text-slate-800 text-sm mt-1.5 truncate max-w-[150px]">{bg.name}</h4>
                      </div>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        bg.status === "Available" ? "bg-emerald-50 text-emerald-600" :
                        bg.status === "In Use" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {bg.status === "Available" && <CheckCircle size={10} />}
                        {bg.status === "Maintenance" && <AlertTriangle size={10} />}
                        {bg.status}
                      </span>
                    </div>
                    <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs text-slate-400">
                      <span>ID: {bg.id}</span>
                      <span className="font-medium text-slate-600">📍 {bg.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: MENU F&B */}
          {activeTab === "fnb" && (
            <motion.div key="fnb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-2xl font-black text-[#0F172A]">Katalog Menu Food & Beverages</h1>
                  <p className="text-sm text-[#64748B]">Manajemen daftar harga makanan, minuman, dan ketersediaan stok dapur.</p>
                </div>
                <button className="flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 transition-all cursor-pointer">
                  <Plus size={14} /> Tambah Menu Baru
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="p-4">Nama Menu</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Status Stok</th>
                      <th className="p-4 text-right">Harga Satuan</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-700">
                    {mockFnBMenus.map((menu) => (
                      <tr key={menu.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{menu.name}</td>
                        <td className="p-4 text-slate-500">{menu.category}</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold ${menu.stock === "Tersedia" ? "text-emerald-600" : "text-red-500"}`}>
                            ● {menu.stock}
                          </span>
                        </td>
                        <td className="p-4 text-right font-black text-slate-900">Rp {menu.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}