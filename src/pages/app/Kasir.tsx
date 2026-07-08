import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Plus, Minus, CreditCard, Banknote, CheckCircle,
  LogOut, PlusCircle, X, ShoppingBag, LayoutDashboard,
  Users, Settings, Printer, Check, Clock, Dices, User, Tag,
  Bell, BellRing
} from "lucide-react";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";

// Import Board Game Images (Sesuaikan path project Anda)
import mystKidsImg from "../../assets/images/Mysterium Kids.png";
import luckyCapImg from "../../assets/images/Lucky Captain.png";
import krakenAttImg from "../../assets/images/Kraken Attack.png";
import sleepyCasImg from "../../assets/images/Sleepy Castle.png";

// ─── IMPORT SUPABASE CLIENT / API HELPER ─────────────────────────────────────
// Silakan un-comment baris di bawah ini jika file konfigurasi Supabase Anda sudah siap:
// import { supabase } from "../../lib/supabase";

// MOCK SERVICE UNTUK SIMULASI DATABASE INTEGRASI (FITUR 1, 2, 4, & 5)
// Jika menggunakan database asli, ganti blok mockService di bawah dengan pemanggilan query asli.
const mockService = {
  getCurrentUser: async () => {
    return { id: 1, name: "Arap Gunawan", username: "arap_kasir", role: "Kasir" };
  },
  getCustomers: async () => {
    return [
      { id: 101, name: "Rafi Amrullah", phone: "08123456789" },
      { id: 102, name: "Dina Kristanti", phone: "08987654321" },
    ];
  },
  getBoardGames: async () => {
    return [
      { id: 1, name: "Mysterium Kids", status: "Available", image: mystKidsImg, complexity: "Easy", duration: "20 mins" },
      { id: 2, name: "Lucky Captain", status: "In Use", image: luckyCapImg, complexity: "Easy", duration: "15 mins" },
      { id: 3, name: "Kraken Attack", status: "Available", image: krakenAttImg, complexity: "Medium", duration: "25 mins" },
      { id: 4, name: "Sleepy Castle", status: "Maintenance", image: sleepyCasImg, complexity: "Easy", duration: "10 mins" },
    ];
  },
  getActiveSessions: async () => {
    // start_time dan end_time menggunakan standar ISO datetime string dari Database
    const now = new Date();
    const futureSession = new Date(now.getTime() + 15 * 60 * 1000); // Sisa 15 menit lagi
    const urgentSession = new Date(now.getTime() + 9 * 60 * 1000);  // Sisa 9 menit lagi (Memicu Alarm < 10 menit)
    
    return [
      { id: 501, customer_id: 101, customer_name: "Rafi Amrullah", boardgame_id: 2, boardgame_name: "Lucky Captain", start_time: now.toISOString(), end_time: futureSession.toISOString() },
      { id: 502, customer_id: 102, customer_name: "Dina Kristanti", boardgame_id: 4, boardgame_name: "Sleepy Castle", start_time: now.toISOString(), end_time: urgentSession.toISOString() }
    ];
  }
};

export default function KasirPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || "T01";

  // ─── STATE MANAGEMENT (REAL BACKEND MAPPING) ───────────────────────────────
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [boardGames, setBoardGames] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [activeMenu, setActiveMenu] = useState("pos"); // pos, sessions, games, customers
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  
  // Sesi Aktif Form States
  const [showAddSession, setShowAddSession] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [rentDuration, setRentDuration] = useState(1); // dalam satuan jam
  
  // Pelanggan Baru Form States
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");

  // Detail Modal State
  const [selectedDetailGame, setSelectedDetailGame] = useState<any>(null);

  // ─── LOAD DATA DARI DATABASE (FITUR INTEGRASI) ──────────────────────────────
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const user = await mockService.getCurrentUser();
        
        // Proteksi Otorisasi Keamanan Hak Akses (FITUR 1)
        if (user.role !== "Kasir" && user.role !== "Owner") {
          alert("Akses Ditolak! Anda tidak memiliki hak akses halaman Kasir.");
          navigate("/login");
          return;
        }
        
        setCurrentUser(user);
        const custData = await mockService.getCustomers();
        const gameData = await mockService.getBoardGames();
        const sessionData = await mockService.getActiveSessions();

        setCustomers(custData);
        setBoardGames(gameData);
        setSessions(sessionData);
      } catch (error) {
        console.error("Gagal memuat data dari database:", error);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [navigate]);

  // ─── LIVE RUNNING TIMER & ALARM NOTIFIKASI 10 MENIT (FITUR 5) ────────────────
  const [liveSessions, setLiveSessions] = useState<any[]>([]);

  useEffect(() => {
    if (sessions.length === 0) return;

    const calculateTimeRemaining = () => {
      const now = Date.now();
      return sessions.map(session => {
        const endTime = new Date(session.end_time).getTime();
        const secondsLeft = Math.max(0, Math.floor((endTime - now) / 1000));
        
        // Aturan Operasional: Memicu alarm jika sisa waktu kurang dari atau sama dengan 10 menit (600 detik)
        const isAlarmTriggered = secondsLeft > 0 && secondsLeft <= 600;

        return {
          ...session,
          secondsLeft,
          isAlarmTriggered
        };
      });
    };

    setLiveSessions(calculateTimeRemaining());

    const interval = setInterval(() => {
      setLiveSessions(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [sessions]);

  // FORMAT TIMER DISPLAY (HH:MM:SS)
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return "WAKTU HABIS";
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ─── ACTION HANDLERS (SINKRONISASI KE SKEMA DATA DB) ───────────────────────
  
  // 1. Registrasi Pelanggan Baru (FITUR 2 - Tabel `Customers`)
  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    // SIMULASI INSERT INTO CUSTOMERS DB
    const newCustomerFromDB = {
      id: Date.now(), // Digantikan Auto Increment BigInt di DB asli
      name: newCustName,
      phone: newCustPhone
    };

    setCustomers(prev => [newCustomerFromDB, ...prev]);
    setSelectedCustomer(newCustomerFromDB);
    setNewCustName("");
    setNewCustPhone("");
    setShowAddCustomer(false);
  };

  // 2. Pembuatan Sesi Sewa Baru (FITUR 5 - Tabel `Game_Sessions` & Status `Boardgames`)
  const handleCreateRentalSession = async () => {
    if (!selectedCustomer || !selectedGame) {
      alert("Harap pilih Pelanggan dan Boardgame terlebih dahulu.");
      return;
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + rentDuration * 60 * 60 * 1000);

    // SIMULASI INSERT INTO GAME_SESSIONS & UPDATE BOARDGAMES STATUS TO 'In Use'
    const newSessionFromDB = {
      id: Date.now(),
      customer_id: selectedCustomer.id,
      customer_name: selectedCustomer.name,
      boardgame_id: selectedGame.id,
      boardgame_name: selectedGame.name,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString()
    };

    // Update Status Fisik Game di UI / DB (FITUR 4)
    setBoardGames(prev => prev.map(g => g.id === selectedGame.id ? { ...g, status: "In Use" } : g));
    setSessions(prev => [newSessionFromDB, ...prev]);

    // Reset Form
    setSelectedCustomer(null);
    setSelectedGame(null);
    setShowAddSession(false);
    alert(`Sesi sewa berhasil dibuat untuk meja ${tableId}!`);
  };

  // 3. Perpanjang Durasi Sewa Sesi Aktif (FITUR 5)
  const handleExtendSession = async (sessionId: number, extraHours: number) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const currentEndTime = new Date(session.end_time).getTime();
        const newEndTime = new Date(currentEndTime + extraHours * 60 * 60 * 1000);
        return { ...session, end_time: newEndTime.toISOString() };
      }
      return session;
    }));
  };

  // 4. Penghentian Sesi Sewa Manual oleh Kasir (FITUR 5 & FITUR 4)
  const handleEndSession = async (sessionId: number, boardgameId: number) => {
    if (confirm("Apakah Anda yakin ingin menyelesaikan sesi rental game ini?")) {
      // Pindahkan status boardgame kembali menjadi Available (FITUR 4)
      setBoardGames(prev => prev.map(g => g.id === boardgameId ? { ...g, status: "Available" } : g));
      // Hapus dari daftar sesi aktif di dashboard (Tabel Game_Sessions di-delete atau dipindah ke History)
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  // ─── FILTER SEARCH FILTERING ────────────────────────────────────────────────
  const filteredGames = useMemo(() => {
    return boardGames.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [boardGames, searchQuery]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => c.name.toLowerCase().includes(searchCustomer.toLowerCase()) || c.phone.includes(searchCustomer));
  }, [customers, searchCustomer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Menghubungkan & Memuat Data Database System...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F1F5F9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* ─── SIDEBAR MANAGEMENT (FITUR 1 ACCESSIBILITY) ───────────────────────── */}
      <aside className="hidden md:flex w-[240px] shrink-0 flex-col justify-between" style={{ background: "linear-gradient(180deg, #0F2340 0%, #0A1628 100%)", height: "100vh", position: "sticky", top: 0 }}>
        <div>
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
            <img src={sebangkuLogo} alt="Sebangku" style={{ width: 36, height: 36, objectFit: "contain" }} />
            <div>
              <p className="text-white font-black text-sm leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>Sebangku</p>
              <p className="text-white/40 text-[10px] tracking-wider mt-1 font-bold">BOARDGAME CAFE</p>
            </div>
          </div>

          <nav className="p-4 flex flex-col gap-1">
            <button onClick={() => setActiveMenu("pos")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeMenu === "pos" ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
              <LayoutDashboard size={16} /> Dashboard POS F&B
            </button>
            <button onClick={() => setActiveMenu("sessions")} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeMenu === "sessions" ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
              <div className="flex items-center gap-3"><Clock size={16} /> Rental Tracking</div>
              {sessions.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{sessions.length}</span>}
            </button>
            <button onClick={() => setActiveMenu("games")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeMenu === "games" ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
              <Dices size={16} /> Boardgame Catalog
            </button>
            <button onClick={() => setActiveMenu("customers")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeMenu === "customers" ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
              <Users size={16} /> Database Pelanggan
            </button>
          </nav>
        </div>

        {/* PROFILE USER OPERASIONAL (FITUR 1) */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center font-bold text-white text-xs">
              {currentUser?.name.charAt(0)}
            </div>
            <div>
              <p className="text-white text-xs font-bold">{currentUser?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{currentUser?.role} MODE</span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-red-500/10 text-red-400 transition-colors text-xs font-bold">
            <LogOut size={14} /> Log Out System
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        
        {/* TOP BAR */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-base font-black text-slate-800 uppercase tracking-tight">
              {activeMenu === "pos" && "Point of Sales (F&B)"}
              {activeMenu === "sessions" && "Live Rental Tracking Sesi Aktif"}
              {activeMenu === "games" && "Board Game Management System"}
              {activeMenu === "customers" && "Manajemen Database Pelanggan"}
            </h1>
            <p className="text-xs text-slate-400 font-medium">Monitoring Aktivitas Operasional Meja: <span className="font-bold text-slate-600">{tableId}</span></p>
          </div>
          
          <div className="flex items-center gap-3">
            {activeMenu === "sessions" && (
              <button onClick={() => setShowAddSession(true)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer">
                <PlusCircle size={14} /> Aktivasi Sesi Sewa Baru
              </button>
            )}
            {activeMenu === "customers" && (
              <button onClick={() => setShowAddCustomer(true)} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer">
                <PlusCircle size={14} /> Registrasi Member Baru
              </button>
            )}
          </div>
        </header>

        {/* CONTAINER DINAMIS MENU */}
        <div className="p-6 flex-1">
          
          {/* MENU 1: RENTAL TRACKING (FITUR 5 INTEGRATION) */}
          {activeMenu === "sessions" && (
            <div className="space-y-4">
              {liveSessions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                  <Clock size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-600">Tidak Ada Sesi Sewa yang Sedang Aktif</p>
                  <p className="text-xs text-slate-400 mt-1">Silakan klik "Aktivasi Sesi Sewa Baru" untuk memulai perhitungan durasi billing.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveSessions.map((session) => (
                    <div key={session.id} className={`p-5 rounded-2xl border transition-all bg-white shadow-sm ${session.isAlarmTriggered ? "border-red-200 bg-red-50/30 animate-pulse" : "border-slate-100"}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${session.isAlarmTriggered ? "bg-red-500 text-white" : "bg-blue-50 text-blue-600"}`}>
                            {session.isAlarmTriggered ? <BellRing size={18} className="animate-bounce" /> : <Clock size={18} />}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-800">{session.customer_name}</h3>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                              <Dices size={12} /> {session.boardgame_name}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`text-sm font-mono font-black px-3 py-1 rounded-lg ${session.secondsLeft <= 0 ? "bg-slate-100 text-slate-400" : session.isAlarmTriggered ? "bg-red-500 text-white" : "bg-slate-900 text-emerald-400"}`}>
                            {formatTime(session.secondsLeft)}
                          </span>
                          {session.isAlarmTriggered && (
                            <p className="text-[10px] text-red-600 font-black mt-1 uppercase tracking-tight flex items-center justify-end gap-1">
                              ⚠️ Sisa Waktu &lt; 10 Menit!
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center gap-2">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleExtendSession(session.id, 1)} className="px-2.5 py-1.5 border border-slate-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                            +1 Jam
                          </button>
                          <button onClick={() => handleExtendSession(session.id, 2)} className="px-2.5 py-1.5 border border-slate-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                            +2 Jam
                          </button>
                        </div>

                        <button onClick={() => handleEndSession(session.id, session.boardgame_id)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer">
                          Selesaikan Sesi
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MENU 2: CATALOG BOARDGAME (FITUR 4 INTEGRATION) */}
          {activeMenu === "games" && (
            <div className="space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Cari Koleksi Board Game..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGames.map((game) => (
                  <div key={game.id} onClick={() => setSelectedDetailGame(game)} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="aspect-square w-full rounded-xl bg-slate-50 overflow-hidden relative mb-3">
                      <img src={game.image} alt={game.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" />
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase shadow ${
                        game.status === "Available" ? "bg-emerald-500 text-white" : game.status === "In Use" ? "bg-blue-500 text-white" : "bg-amber-500 text-white"
                      }`}>
                        {game.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{game.name}</h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{game.duration} • Complexity: {game.complexity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MENU 3: DATABASE PELANGGAN (FITUR 2 INTEGRATION) */}
          {activeMenu === "customers" && (
            <div className="space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Cari Nama Member atau Nomor Telepon..." value={searchCustomer} onChange={(e) => setSearchCustomer(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                      <th className="px-6 py-3">ID Member</th>
                      <th className="px-6 py-3">Nama Lengkap</th>
                      <th className="px-6 py-3">Kontak WA / Telepon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
                    {filteredCustomers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-400">#{c.id}</td>
                        <td className="px-6 py-4 text-slate-800 font-bold">{c.name}</td>
                        <td className="px-6 py-4 text-slate-500">{c.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MENU 4: POINT OF SALES DEFAULT */}
          {activeMenu === "pos" && (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center max-w-sm mx-auto shadow-sm mt-12">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-base font-black text-slate-800">Modul Point of Sales (POS)</h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Kelola pesanan makanan & minuman pelanggan terhubung otomatis dengan dapur kasir utama.</p>
            </div>
          )}

        </div>
      </main>

      {/* ─── MODAL POPUP WINDOWS (INTEGRASI INTERAKSI DATA) ────────────────────── */}
      
      {/* 1. MODAL AKTIVASI SESI RENTAL BARU */}
      <AnimatePresence>
        {showAddSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-slate-100 mx-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Form Sesi Sewa Baru</h2>
                <button onClick={() => setShowAddSession(false)} className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"><X size={16} /></button>
              </div>

              <div className="mt-4 space-y-4">
                {/* PILIH MEMBER */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">1. Pilih Member / Pelanggan</label>
                  <select onChange={(e) => setSelectedCustomer(customers.find(c => c.id === parseInt(e.target.value)))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500">
                    <option value="">-- Pilih Member Terdaftar --</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                </div>

                {/* PILIH BOARD GAME AVAILABLE */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">2. Pilih Board Game Fisik</label>
                  <select onChange={(e) => setSelectedGame(boardGames.find(g => g.id === parseInt(e.target.value)))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500">
                    <option value="">-- Pilih Game Status Available --</option>
                    {boardGames.filter(g => g.status === "Available").map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                {/* PILIH DURASI BILLING TIMING */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">3. Durasi Billing Sesi</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((dur) => (
                      <button key={dur} type="button" onClick={() => setRentDuration(dur)} className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${rentDuration === dur ? "bg-slate-900 border-slate-900 text-white shadow" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                        {dur} Jam
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleCreateRentalSession} className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-colors cursor-pointer text-center">
                  Aktifkan Sesi Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. MODAL REGISTRASI PELANGGAN BARU */}
      <AnimatePresence>
        {showAddCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl border border-slate-100 mx-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Pendaftaran Member Baru</h2>
                <button onClick={() => setShowAddCustomer(false)} className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"><X size={16} /></button>
              </div>

              <form onSubmit={handleAddCustomerSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Nama Lengkap</label>
                  <input type="text" required placeholder="Masukkan nama lengkap..." value={newCustName} onChange={(e) => setNewCustName(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">No. WhatsApp / Telepon</label>
                  <input type="tel" required placeholder="Contoh: 081234567..." value={newCustPhone} onChange={(e) => setNewCustPhone(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>

                <button type="submit" className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-colors cursor-pointer text-center">
                  Simpan Member Database
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. MODAL DETAIL BOARDGAME */}
      <AnimatePresence>
        {selectedDetailGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl border border-slate-100 mx-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Detail Asset Board Game</h2>
                <button onClick={() => setSelectedDetailGame(null)} className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"><X size={16} /></button>
              </div>
              <div className="mt-4 flex flex-col items-center text-center">
                <div className="w-32 h-32 bg-slate-50 rounded-2xl p-2 mb-3">
                  <img src={selectedDetailGame.image} alt={selectedDetailGame.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base font-black text-slate-800">{selectedDetailGame.name}</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Est. Durasi Main: {selectedDetailGame.duration}</p>
                <div className="flex gap-2 mt-4 w-full">
                  <div className="flex-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Kompleksitas</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{selectedDetailGame.complexity}</p>
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Kondisi Fisik</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{selectedDetailGame.status}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}