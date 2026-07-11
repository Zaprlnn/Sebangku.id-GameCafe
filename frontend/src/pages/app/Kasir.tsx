
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Plus, Minus, CheckCircle,
  LogOut, PlusCircle, X, ShoppingBag, LayoutDashboard,
  Users, Settings, Printer, Check, Clock, Dices, User, Tag,
  Bell, BellRing, ChevronRight, Receipt, DollarSign, ToggleLeft, ToggleRight, AlertTriangle, Gamepad2, Trash2
} from "lucide-react";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";
import { useKasirSupabase } from "../app/hooks/useKasirSupabase";

export default function KasirPage() {
  const navigate = useNavigate();

  const {
    dbCustomers, dbSessions, dbBoardgames, dbMenus, dbTransactions, dbIncomingOrders, dbTables,
    dbCategories,
    startRentalSession, endRentalSession, extendRentalSession, checkoutPOSToSupabase, 
    approveIncomingOrder, rejectIncomingOrder, deleteIncomingOrder
  } = useKasirSupabase();

  // Sidebar active state
  const [activeMenu, setActiveMenu] = useState("pos"); // pos, orders, sessions, games, history, settings

  // ─── 1. POS STATE ─────────────────────────────────────────────────────────
  // Customers
  const [searchCustomer, setSearchCustomer] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // POS Navigation / Tabs
  const [activeTab, setActiveTab] = useState<"f&b" | "rent">("f&b");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Search product/game
  const [searchQuery, setSearchQuery] = useState("");

  // Cart
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"Kasir" | "Winpay">("Kasir");
  const [selectedTable, setSelectedTable] = useState("A1");
  const [posPlayers, setPosPlayers] = useState(2);

  // Modals
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState<any>(null);
  
  // Settings
  const [isPb1Active, setIsPb1Active] = useState(true);

  // Active Sessions States for "Sessions" menu
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  useEffect(() => { setLiveSessions(dbSessions); }, [dbSessions]);

  useEffect(() => {
    if (liveSessions.length === 0) return;
    const interval = setInterval(() => {
      setLiveSessions(prev =>
        prev.map(s => s.secondsLeft > 0 ? { ...s, secondsLeft: s.secondsLeft - 1 } : s).filter(s => s.secondsLeft > 0)
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [liveSessions]);

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return dbCustomers.filter(c =>
      c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      (c.phone && c.phone.includes(searchCustomer))
    );
  }, [dbCustomers, searchCustomer]);

  // Filtered Products/Games
  const itemsToDisplay = useMemo(() => {
    const list = activeTab === "f&b" ? dbMenus : dbBoardgames;
    return list.filter((item: any) => {
      const matchesSearch = item.name ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : item.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const category = item.category || "All";
      const matchesCategory = selectedCategory === "All" || category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeTab, selectedCategory, searchQuery, dbMenus, dbBoardgames]);

  const categories = useMemo(() => {
    const typeFilter = activeTab === "f&b" ? "fnb" : "game";
    const list = dbCategories?.filter((c: any) => c.type === typeFilter).map((c: any) => c.name) || [];
    return ["All", ...list];
  }, [activeTab, dbCategories]);

  const unreadOrdersCount = useMemo(() => dbIncomingOrders.length, [dbIncomingOrders]);

  const addToCart = (item: any) => {
    if (item.status === "Out of Stock" || item.status === "Maintenance" || item.status === "In Use" || item.active === false) {
      alert(`${item.name || item.title} sedang tidak tersedia!`);
      return;
    }
    const prefixedId = activeTab === "f&b" ? `p${item.id}` : `g${item.id}`;
    setCart(prev => {
      const exists = prev.find(i => i.id === prefixedId);
      if (exists) return prev.map(i => i.id === prefixedId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { 
        id: prefixedId, 
        name: item.name || item.title, 
        price: item.price, 
        type: activeTab === "rent" || item.category === "Strategy" || item.category === "Family" || item.category === "Co-op" || item.category === "Classic" || item.category === "Party" ? "game" : "fnb",
        duration: activeTab === "rent" ? "2 Hours" : undefined,
        emoji: item.emoji || (activeTab === "f&b" ? "🍛" : "🎲"), 
        image: item.image, 
        quantity: 1 
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = i.quantity + delta;
        return newQty > 0 ? { ...i, quantity: newQty } : null;
      }
      return i;
    }).filter(Boolean) as any[]);
  };

  const updateDuration = (id: string, duration: string) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, duration } : i));
  };

  const cartSubtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const cartTotal = useMemo(() => {
    let total = cartSubtotal;
    if (isPb1Active) total += cartSubtotal * 0.10;
    return total;
  }, [cartSubtotal, isPb1Active]);

  const handleCheckoutPOS = async () => {
    if (!selectedCustomer || cart.length === 0) {
      alert("Pilih customer dan tambahkan item ke keranjang terlebih dahulu.");
      return;
    }
    try {
      const txn = await checkoutPOSToSupabase(selectedCustomer.id, cartTotal, paymentMethod, selectedTable, cart, posPlayers);
      setLastInvoiceId(txn.id);
      setCart([]);
      setSelectedCustomer(null);
      setShowCheckoutSuccess(true);
    } catch (err) {
      alert("Gagal memproses transaksi POS");
    }
  };

  // Session states for Add Session Modal
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [sessionCustomer, setSessionCustomer] = useState<any>(null);
  const [sessionTable, setSessionTable] = useState("A1");
  const [sessionGame, setSessionGame] = useState<any>(null);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionCost, setSessionCost] = useState(15000);
  const [sessionPlayers, setSessionPlayers] = useState(2);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"end" | "extend">("end");
  const [targetSessionId, setTargetSessionId] = useState<number | null>(null);

  const handleStartSession = async () => {
    if (!sessionCustomer || !sessionGame) return;
    try {
      await startRentalSession(sessionCustomer.id, sessionTable, sessionGame.id, sessionDuration, sessionCost, sessionPlayers);
      setShowAddSessionModal(false);
      setSessionCustomer(null);
      setSessionGame(null);
    } catch (err) {
      alert("Gagal mengaktifkan sesi bermain");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ── 1. SIDEBAR (Navy Style) ────────────────────────────────── */}
      <aside
        className="hidden lg:flex w-[220px] shrink-0 flex-col justify-between"
        style={{
          background: "linear-gradient(180deg, #0F2340 0%, #0A1628 100%)",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 40
        }}
      >
        <div>
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
            <img src={sebangkuLogo} alt="Sebangku Logo" className="w-8 h-8 object-contain" />
            <div>
              <p className="text-white font-black text-sm tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
                BoardVerse
              </p>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">Cafe Admin</p>
            </div>
          </div>

          <nav className="px-3 py-6 flex flex-col gap-1.5">
            {[
              { id: "pos", label: "POS", Icon: ShoppingBag },
              { id: "orders", label: "Incoming Orders", Icon: Bell },
              { id: "sessions", label: "Sessions", Icon: Clock },
              { id: "games", label: "Board Games", Icon: Dices },
              { id: "history", label: "Laporan", Icon: Receipt },
              { id: "settings", label: "Settings", Icon: Settings },
            ].map(m => {
              const isActive = activeMenu === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMenu(m.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors relative"
                  style={{
                    background: isActive ? "rgba(59,130,246,0.15)" : "transparent",
                    color: isActive ? "#60A5FA" : "rgba(255,255,255,0.6)"
                  }}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#3B82F6] rounded-r-md" />
                  )}
                  <m.Icon size={17} strokeWidth={1.6} />
                  <span className="text-sm font-semibold">{m.label}</span>
                  {m.id === "orders" && unreadOrdersCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white animate-pulse">
                      {unreadOrdersCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center text-[#60A5FA] shrink-0">
              <User size={16} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-white text-xs font-bold">Kasir Utama</p>
              <span className="text-[9px] bg-[#3B82F6] text-white px-2 py-0.5 rounded font-black uppercase tracking-wider mt-0.5 inline-block">
                KASIR
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            Keluar (Logout)
          </button>
        </div>
      </aside>

      <div className="hidden lg:block w-[220px] shrink-0" />

      {activeMenu === "pos" ? (
        <>
          {/* ── 2. CUSTOMERS PANEL (Middle Left) ─────────────────────── */}
          <section className="hidden md:flex w-[260px] shrink-0 border-r border-[#E2E8F0] bg-white flex-col justify-between">
            <div className="p-4 flex flex-col flex-1 overflow-hidden">
              <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-base font-bold text-[#0F172A] mb-3">
                Customers
              </h2>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1">
                {filteredCustomers.map(c => {
                  const isSelected = selectedCustomer?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left border cursor-pointer transition-all"
                      style={{
                        borderColor: isSelected ? "#3B82F6" : "#F1F5F9",
                        background: isSelected ? "#EFF6FF" : "transparent"
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                        style={{ background: isSelected ? "#3B82F6" : "#94A3B8" }}
                      >
                        <User size={14} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1E293B] truncate">{c.name}</p>
                        <p className="text-[10px] text-[#64748B]">{c.phone}</p>
                      </div>
                    </button>
                  );
                })}
                {filteredCustomers.length === 0 && (
                  <p className="text-xs text-[#94A3B8] text-center py-6">Customer tidak ditemukan.</p>
                )}
              </div>
            </div>
          </section>

          {/* ── 3. POS MAIN CONTENT (Middle Center) ──────────────────── */}
          <main className="flex-1 flex flex-col overflow-hidden bg-white">
            <header className="border-b border-[#E2E8F0] px-4 md:px-6 py-3 shrink-0 flex items-center justify-between bg-white">
              <div className="flex gap-4">
                <button
                  onClick={() => { setActiveTab("f&b"); setSelectedCategory("All"); }}
                  className="px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer"
                  style={{
                    borderColor: activeTab === "f&b" ? "#3B82F6" : "transparent",
                    color: activeTab === "f&b" ? "#3B82F6" : "#64748B"
                  }}
                >
                  F&B Order
                </button>
                <button
                  onClick={() => { setActiveTab("rent"); setSelectedCategory("All"); }}
                  className="px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer"
                  style={{
                    borderColor: activeTab === "rent" ? "#3B82F6" : "transparent",
                    color: activeTab === "rent" ? "#3B82F6" : "#64748B"
                  }}
                >
                  Rent Game
                </button>
              </div>

              <div className="relative w-44 md:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
                <input
                  type="text"
                  placeholder={`Cari ${activeTab === "f&b" ? "makanan" : "board game"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </header>

            <div className="px-4 md:px-6 py-3.5 shrink-0 flex gap-2 overflow-x-auto border-b border-[#F1F5F9] bg-[#FAFCFF] scrollbar-none">
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border"
                    style={{
                      background: isSelected ? "#3B82F6" : "white",
                      color: isSelected ? "white" : "#64748B",
                      borderColor: isSelected ? "#3B82F6" : "#E2E8F0"
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#FAFCFF]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {itemsToDisplay.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden rounded-2xl h-44 flex flex-col justify-between p-4 border border-slate-200/40 shadow-sm group cursor-pointer"
                  >
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop&q=80"}
                      alt={item.name || item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                    {(item.status === "Out of Stock" || item.status === "Maintenance" || item.status === "In Use" || item.active === false) && (
                      <div className="absolute inset-0 bg-slate-900/80 z-20 flex flex-col items-center justify-center text-center p-2">
                        <span className={`text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm mb-1 ${item.status === 'In Use' ? 'bg-orange-500' : 'bg-red-500'}`}>
                          {item.status === "Out of Stock" ? "Out of Stock" : item.status === "Maintenance" ? "Maintenance" : item.status === "In Use" ? "Sedang Dimainkan" : "Nonaktif"}
                        </span>
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col justify-between h-full w-full">
                      <div>
                        <span className="text-[9px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                          {item.category || (activeTab === "f&b" ? "Food" : "Board Game")}
                        </span>
                        <h3 className="text-sm font-black text-white mt-1.5 leading-snug drop-shadow" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {item.name || item.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm font-extrabold text-white drop-shadow">{formatRupiah(item.price)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          disabled={item.status === "Out of Stock" || item.status === "Maintenance" || item.status === "In Use" || item.active === false}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-slate-500 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow cursor-pointer active:scale-95 z-30"
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {itemsToDisplay.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-4xl mb-3">🔍</span>
                  <p className="text-sm text-[#94A3B8]">Tidak ada item yang cocok dengan filter.</p>
                </div>
              )}
            </div>
          </main>

          {/* ── 4. ORDER SUMMARY PANEL (Right) ───────────────────────── */}
          <section className="w-[320px] shrink-0 border-l border-[#E2E8F0] bg-white flex flex-col justify-between">
            <div className="p-4 border-b border-[#E2E8F0] shrink-0">
              <div className="flex items-center justify-between">
                <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  Order Summary
                </h2>
                {selectedCustomer && (
                  <span className="bg-[#EFF6FF] text-[#3B82F6] text-[10px] font-black px-2 py-0.5 rounded-md">
                    Customer Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] mt-1 truncate">
                {selectedCustomer ? `Atas Nama: ${selectedCustomer.name}` : "Pilih customer dari list sebelah kiri"}
              </p>
              
              <div className="mt-4 flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider block mb-1">
                    Pilih Meja Customer
                  </label>
                  <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#3B82F6]">
                    {dbTables.map(t => (
                      <option key={t.id} value={t.code}>{t.code}</option>
                    ))}
                    {dbTables.length === 0 && <option value="A1">A1 (Fallback)</option>}
                  </select>
                </div>
                <div className="w-[100px]">
                  <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider block mb-1">
                    Pemain
                  </label>
                  <input type="number" min="1" max="10" value={posPlayers} onChange={(e) => setPosPlayers(parseInt(e.target.value) || 1)} className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#3B82F6]" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {cart.map(item => (
                <div key={item.id} className="flex flex-col gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 border border-slate-300/40 overflow-hidden flex items-center justify-center shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm select-none">{item.emoji}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1E293B] truncate leading-tight">{item.name}</p>
                      <p className="text-[10px] text-[#64748B] mt-0.5">{formatRupiah(item.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-5 h-5 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-xs font-bold text-[#1E293B] w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                  </div>
                  {item.type === "game" && (
                    <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5 mt-0.5 px-2 w-full">
                      <span className="text-[9px] text-[#94A3B8] font-bold uppercase">Durasi Sewa</span>
                      <select
                        value={item.duration}
                        onChange={(e) => updateDuration(item.id, e.target.value)}
                        className="text-[10px] font-bold text-[#3B82F6] bg-transparent border-none outline-none focus:ring-0 cursor-pointer"
                      >
                        <option value="1 Hour">1 Jam</option>
                        <option value="2 Hours">2 Jam</option>
                        <option value="3 Hours">3 Jam</option>
                        <option value="All Day">Seharian</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}

              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
                  <ShoppingBag size={32} strokeWidth={1.5} className="text-[#94A3B8] mb-2.5" />
                  <p className="text-xs text-[#94A3B8]">Keranjang belanja kosong.</p>
                  <p className="text-[10px] text-[#CBD5E1] mt-1 max-w-[180px]">Pilih makanan atau board game untuk disewa.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E2E8F0] shrink-0 bg-[#FAFAFC]">
              <div className="mb-4">
                <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider block mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod("Kasir")}
                    className="py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
                    style={{
                      borderColor: paymentMethod === "Kasir" ? "#3B82F6" : "#E2E8F0",
                      background: paymentMethod === "Kasir" ? "#EFF6FF" : "white",
                      color: paymentMethod === "Kasir" ? "#3B82F6" : "#64748B"
                    }}
                  >
                    Kasir (Tunai)
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Winpay")}
                    className="py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
                    style={{
                      borderColor: paymentMethod === "Winpay" ? "#3B82F6" : "#E2E8F0",
                      background: paymentMethod === "Winpay" ? "#EFF6FF" : "white",
                      color: paymentMethod === "Winpay" ? "#3B82F6" : "#64748B"
                    }}
                  >
                    Winpay QRIS
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-[#64748B] mb-1.5">
                <span>Subtotal</span>
                <span>{formatRupiah(cartSubtotal)}</span>
              </div>
              {isPb1Active && (
                <div className="flex justify-between items-center text-xs text-[#64748B] mb-1.5">
                  <span>PB1 (10%)</span>
                  <span>{formatRupiah(cartSubtotal * 0.10)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm font-extrabold text-[#0F172A] mb-4 pt-1.5 border-t border-dashed border-[#E2E8F0]">
                <span>TOTAL</span>
                <span className="text-base text-[#3B82F6]">{formatRupiah(cartTotal)}</span>
              </div>

              <button
                onClick={handleCheckoutPOS}
                disabled={!selectedCustomer || cart.length === 0}
                className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#CBD5E1] text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <CheckCircle size={16} /> Process Payment
              </button>
            </div>
          </section>
        </>
      ) : activeMenu === "orders" ? (
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAFCFF]">
          <header className="p-6 flex items-center gap-4 border-b border-[#E2E8F0] bg-white">
            <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Incoming Orders</h1>
            <span className="px-3 py-0.5 bg-blue-50 text-blue-600 font-mono font-black text-xs rounded-full border border-blue-200">{dbIncomingOrders.length} pending</span>
          </header>
          <div className="flex-1 p-6 overflow-y-auto">
            {dbIncomingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-14 h-14 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-300 shadow-sm"><Bell className="w-6 h-6 stroke-[1.5]" /></div>
                <p className="text-xs text-[#94A3B8] font-semibold">Tidak ada pesanan masuk.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dbIncomingOrders.map((order: any) => {
                  const isPending = order.status === "Pending" || order.status === "Awaiting Payment";
                  const isCompleted = order.status === "Completed" || order.status === "Success";
                  const isActive = order.status === "Active" || order.status === "Diterima";

                  return (
                  <div key={order.id} className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="flex flex-col gap-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm text-[#0F172A]">{order.customers?.name || "Walk-in Guest"}</h4>
                            <span className="bg-[#F1F5F9] text-[#475569] font-black text-[9px] px-2 py-0.5 rounded uppercase border border-[#E2E8F0]">{order.table_id || "A1"}</span>
                          </div>
                          <p className="text-[10px] font-mono font-bold text-[#94A3B8] mt-1">{order.customers?.phone || "085133758414"}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {isPending ? (
                            <span className="bg-amber-50 text-amber-600 font-black text-[9px] px-2 py-0.5 rounded-md uppercase border border-amber-200">PENDING</span>
                          ) : isCompleted ? (
                            <span className="bg-slate-50 text-slate-500 font-black text-[9px] px-2 py-0.5 rounded-md uppercase border border-slate-200">SELESAI</span>
                          ) : (
                            <span className="bg-[#ECFDF5] text-[#10B981] font-black text-[9px] px-2 py-0.5 rounded-md uppercase border border-emerald-100">DITERIMA / AKTIF</span>
                          )}
                          <span className="text-[9px] font-mono font-bold text-[#94A3B8]">{new Date(order.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 flex-1 min-h-[60px]">
                        {order.transaction_details?.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-xs text-[#64748B] font-semibold">
                            <span>{item.qty}x {item.menus?.name || "Sewa Game / FnB"}</span>
                            <span className="font-bold text-[#0F172A]">Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                          </div>
                        ))}
                        {order.rentals?.map((item: any, idx: number) => (
                          <div key={`rent-${idx}`} className="flex justify-between items-center text-xs text-[#3B82F6] font-semibold">
                            <span className="flex items-center gap-1.5"><Gamepad2 size={12} className="shrink-0" /> {item.name} ({item.duration})</span>
                            <span className="font-bold">Rp {item.price.toLocaleString("id-ID")}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#64748B]">Total Tagihan ({order.payment_method || "Cash"}):</span>
                        <span className="font-black text-[#3B82F6]">Rp {order.total.toLocaleString("id-ID")}</span>
                      </div>
                      
                      {isPending ? (
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button onClick={() => rejectIncomingOrder(order.id, order.customer_id, order.table_id)} className="flex items-center justify-center gap-1.5 py-2.5 border border-[#E2E8F0] hover:bg-rose-50 text-[#64748B] hover:text-rose-600 font-bold text-xs rounded-xl transition-colors cursor-pointer">Tolak</button>
                          <button onClick={() => approveIncomingOrder(order.id, order.customer_id, order.table_id)} className="flex items-center justify-center gap-1.5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black text-xs rounded-xl transition-colors cursor-pointer shadow-sm shadow-blue-500/20">Terima</button>
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-1">
                          <button disabled className="flex-1 py-2.5 bg-[#F8FAFC] text-[#94A3B8] font-bold text-xs rounded-xl border border-[#F1F5F9] cursor-not-allowed">
                            Telah Diproses
                          </button>
                          <button onClick={() => deleteIncomingOrder(order.id)} title="Hapus Riwayat Order Ini" className="w-[42px] flex items-center justify-center bg-white border border-rose-200 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors cursor-pointer shrink-0">
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )})}
              </div>
            )}
          </div>
        </div>
      ) : activeMenu === "sessions" ? (
        <div className="flex-1 p-6 bg-[#FAFCFF] overflow-y-auto space-y-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Active Sessions</h1>
              <span className="ml-4 px-3 py-1 bg-[#ECFDF5] text-[#10B981] font-black text-xs rounded-full flex items-center gap-1.5 shadow-sm border border-emerald-100/50">
                <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                {liveSessions.length} active
              </span>
            </div>
            <button onClick={() => setShowAddSessionModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-colors">
              <PlusCircle className="w-4 h-4" /> New Session
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {liveSessions.map(session => (
              <div key={session.id} className="bg-white border border-[#E2E8F0] rounded-[24px] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col space-y-5">
                
                {/* 1. Header (User & Table) */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#3B82F6] shrink-0">
                      <User size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="font-black text-[15px] text-[#0F172A] leading-tight truncate max-w-[150px]">{session.name}</h4>
                      <p className="text-[11px] font-mono text-[#94A3B8] font-semibold mt-0.5">{session.phone}</p>
                    </div>
                  </div>
                  <span className="bg-[#EFF6FF] text-[#3B82F6] font-black text-xs px-3 py-1.5 rounded-xl">{session.table}</span>
                </div>

                {/* 2. Game Pill */}
                <div className="relative h-12 w-full rounded-full overflow-hidden shadow-inner bg-slate-100 flex items-center px-4">
                  {session.image && (
                    <img src={session.image} alt={session.game} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {/* Dark gradient overlay so text is readable */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                  
                  <div className="relative z-10 flex items-center gap-2 text-white">
                    <Gamepad2 size={14} className="opacity-90" />
                    <span className="font-bold text-sm tracking-wide">{session.game}</span>
                  </div>
                </div>

                {/* 3. Timer section */}
                <div className="flex flex-col items-center justify-center pt-2 pb-1">
                  <div className="text-[34px] font-black tracking-tight text-[#10B981] leading-none drop-shadow-sm">
                    {formatTimer(session.secondsLeft)}
                  </div>
                  <div className="flex items-center gap-1.5 text-[#94A3B8] mt-2.5">
                    <Clock size={12} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold tracking-widest uppercase">{session.duration}</span>
                  </div>
                </div>

                {/* 4. Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button onClick={() => { setConfirmAction("end"); setTargetSessionId(session.id); setShowConfirmModal(true); }} className="py-2.5 bg-white border border-[#FCA5A5] text-[#EF4444] hover:bg-rose-50 font-bold text-xs rounded-full shadow-sm transition-colors cursor-pointer">
                    End Session
                  </button>
                  <button onClick={() => { setConfirmAction("extend"); setTargetSessionId(session.id); setShowConfirmModal(true); }} className="py-2.5 bg-white border border-[#93C5FD] text-[#3B82F6] hover:bg-blue-50 font-bold text-xs rounded-full shadow-sm transition-colors cursor-pointer">
                    Extend
                  </button>
                </div>

              </div>
            ))}
            
            {liveSessions.length === 0 && (
              <div className="col-span-full py-20 text-center text-[#94A3B8] text-sm flex flex-col items-center">
                <Gamepad2 size={40} className="mb-3 text-slate-300" strokeWidth={1} />
                <p>Tidak ada Active Sessions saat ini.</p>
              </div>
            )}
          </div>
        </div>
      ) : activeMenu === "games" ? (
        <div className="flex-1 p-6 bg-[#FAFCFF] overflow-y-auto space-y-4">
          <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Katalog Board Games</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {dbBoardgames.map((game: any) => (
              <div key={game.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-3 shadow-sm flex flex-col justify-between">
                <div className="h-24 bg-[#F8FAFC] rounded-xl mb-2 flex items-center justify-center text-xl overflow-hidden relative">
                  {game.image ? <img src={game.image} alt={game.name || game.title} className="w-full h-full object-cover" /> : "🎲"}
                </div>
                <div><h4 className="font-bold text-xs text-[#0F172A] truncate">{game.name || game.title}</h4><span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-1.5 ${game.status === "Available" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-amber-50 text-amber-600 animate-pulse border border-amber-200"}`}>{game.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      ) : activeMenu === "history" ? (
        <div className="flex-1 p-6 bg-[#FAFCFF] overflow-y-auto space-y-4">
          <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Laporan Finansial Transaksi</h1>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-bold text-[#64748B]">
                  <th className="p-4">KODE NOTA</th><th className="p-4">NAMA CUSTOMER</th><th className="p-4">METODE</th><th className="p-4">STATUS</th><th className="p-4 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {dbTransactions.map((t: any) => (
                  <tr key={t.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] font-medium text-[#334155]">
                    <td className="p-4 font-mono font-bold">ORD-SBK#{t.id}</td><td className="p-4 font-bold text-[#0F172A]">{t.customers?.name || "Walk-in Guest"}</td><td className="p-4 font-mono">{t.payment_method}</td><td><span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${t.status === "Success" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>{t.status}</span></td><td className="p-4 text-right font-mono font-black text-[#0F172A]">{formatRupiah(t.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-6 bg-[#FAFCFF] overflow-y-auto space-y-6">
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Settings</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><DollarSign className="w-4 h-4" /></div>
                <div><h3 className="text-sm font-black text-[#0F172A]">Pajak & Biaya</h3><p className="text-[10px] text-[#94A3B8]">Atur parameter PB1 restoran kafe.</p></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 border border-[#E2E8F0] rounded-xl bg-white">
                  <span className="text-xs font-bold text-[#334155]">Pajak PB1 Resto (10%)</span>
                  <button onClick={() => setIsPb1Active(!isPb1Active)} className="cursor-pointer">
                    {isPb1Active ? <ToggleRight className="w-8 h-8 text-[#3B82F6] fill-blue-50" /> : <ToggleLeft className="w-8 h-8 text-[#CBD5E1]" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showAddSessionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl p-6 w-full max-w-md space-y-4 text-xs shadow-xl">
            <div className="flex justify-between items-center"><h3 className="text-sm font-black text-slate-800">Buka Sesi Meja Baru</h3><button onClick={() => setShowAddSessionModal(false)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer"><X className="w-4 h-4" /></button></div>
            <div className="space-y-3">
              <label className="block font-bold text-slate-600">Pilih Customer</label>
              <select onChange={(e) => setSessionCustomer(dbCustomers.find(c => String(c.id) === String(e.target.value)))} className="w-full p-2.5 bg-slate-50 border rounded-xl">
                <option value="">-- Pilih Customer --</option>
                {dbCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label className="block font-bold text-slate-600">Pilih Judul Game</label>
              <select onChange={(e) => setSessionGame(dbBoardgames.find((g: any) => String(g.id) === String(e.target.value)))} className="w-full p-2.5 bg-slate-50 border rounded-xl">
                <option value="">-- Pilih Judul Game --</option>
                {dbBoardgames.filter((g: any) => g.status === "Available").map((g: any) => <option key={g.id} value={g.id}>{g.name || g.title}</option>)}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Nomor Meja</label>
                  <select value={sessionTable} onChange={(e) => setSessionTable(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
                    {dbTables.map(t => (
                      <option key={t.id} value={t.code}>Meja {t.code}</option>
                    ))}
                    {dbTables.length === 0 && <option value="A1">Meja A1 (Fallback)</option>}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Durasi</label>
                  <select value={sessionDuration} onChange={(e) => { const v = parseInt(e.target.value); setSessionDuration(v); setSessionCost(v === 60 ? 15000 : 25000); }} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
                    <option value={60}>1 Jam (Rp 15k)</option>
                    <option value={120}>2 Jam (Rp 25k)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-600 mb-1">Jumlah Pemain</label>
                  <input type="number" min="1" max="10" value={sessionPlayers} onChange={(e) => setSessionPlayers(parseInt(e.target.value) || 1)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" />
                </div>
              </div>
            </div>
            <button onClick={handleStartSession} disabled={!sessionCustomer || !sessionGame} className="w-full py-2.5 bg-[#3B82F6] hover:bg-blue-700 text-white font-black rounded-xl disabled:bg-slate-300 cursor-pointer transition-colors">Aktifkan Sesi</button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl p-5 w-full max-w-sm text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto"><AlertTriangle className="w-6 h-6" /></div>
            <h3 className="text-sm font-black text-slate-800">{confirmAction === "end" ? "Tutup Sesi Sewa Meja?" : "Perpanjang +60 Menit?"}</h3>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-2 border rounded-xl font-bold text-slate-500 cursor-pointer hover:bg-slate-50">Batal</button>
              <button onClick={async () => {
                if (targetSessionId) {
                  if (confirmAction === "end") await endRentalSession(targetSessionId);
                  else await extendRentalSession(targetSessionId, 0, 60);
                }
                setShowConfirmModal(false);
              }} className="flex-1 py-2 bg-[#3B82F6] hover:bg-blue-700 text-white font-black rounded-xl cursor-pointer">Konfirmasi</button>
            </div>
          </div>
        </div>
      )}

      {showCheckoutSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl p-6 w-full max-w-sm flex flex-col items-center text-center space-y-3 shadow-2xl">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500"><Check className="w-6 h-6" /></div>
            <h3 className="text-base font-black text-slate-800">Transaksi Lunas Tercatat!</h3>
            <p className="text-xs text-slate-400 font-medium">Nomor invoice resmi yang terbit cloud: <strong className="font-mono text-slate-700">ORD-SBK#{lastInvoiceId}</strong></p>
            <button onClick={() => setShowCheckoutSuccess(false)} className="w-full py-2 bg-slate-900 text-white font-black text-xs rounded-xl shadow cursor-pointer mt-2 hover:bg-slate-800">Selesai</button>
          </div>
        </div>
      )}

    </div>
  );
}
