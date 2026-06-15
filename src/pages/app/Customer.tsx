import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Gamepad2, Calendar, Receipt, BarChart2, LogOut,
  Bell, Search, Menu, X, Edit2, Flame, Trophy, Target, Zap,
  ChevronRight, Phone, Mail, Check, Save, Undo2
} from "lucide-react";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";

// ─── Mock User Data ──────────────────────────────────────────────────────────
const MOCK_USER = {
  name: "Andi Saputra",
  firstName: "Andi",
  lastName: "Saputra",
  email: "andi@sebangku.com",
  phone: "081234567890",
  birthDate: "1995-03-15", // formatted for date inputs
  memberSince: "Maret 2024",
  level: 12,
  levelLabel: "Regular Player",
  kunjungan: 24,
  waktuJam: 48,
  winRate: 70,
  streakHari: 5,
  totalMenang: 17,
  gameDicoba: 8,
  achievement: "6/12",
  status: "Active · Regular",
  favGames: [
    { rank: 1, name: "Catan", image: "https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400&fit=crop&q=80" },
    { rank: 2, name: "Ticket to Ride", image: "https://images.unsplash.com/photo-1673260984699-44b403381769?w=400&fit=crop&q=80" },
    { rank: 3, name: "Pandemic", image: "https://images.unsplash.com/photo-1577896849786-738ed6c78bd3?w=400&fit=crop&q=80" },
  ],
};

// ─── Nav Config ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "profil",     label: "Profil Saya",       Icon: User,      path: "profil" },
  { id: "history",    label: "History Game",       Icon: Gamepad2,  path: "history" },
  { id: "kunjungan",  label: "History Kunjungan",  Icon: Calendar,  path: "kunjungan" },
  { id: "transaksi",  label: "Riwayat Transaksi",  Icon: Receipt,   path: "transaksi" },
  { id: "statistik",  label: "Statistik Bermain",  Icon: BarChart2, path: "statistik" },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function todayLabel() {
  return new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return "-";
  // Convert YYYY-MM-DD to DD-MM-YYYY
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

// ─── Avatar Component ────────────────────────────────────────────────────────
interface AvatarCircleProps {
  name: string;
  size?: number;
  fontSize?: number;
}

function AvatarCircle({ name, size = 48, fontSize = 18 }: AvatarCircleProps) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-black text-white shrink-0 select-none shadow-sm"
      style={{
        width: size, height: size, fontSize,
        background: "linear-gradient(135deg, #3B82F6, #60A5FA)",
      }}
    >
      {getInitials(name)}
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

// ── Profil Page ──
interface ProfilPageProps {
  userData: typeof MOCK_USER;
  setUserData: React.Dispatch<React.SetStateAction<typeof MOCK_USER>>;
}

function ProfilPage({ userData, setUserData }: ProfilPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    birthDate: userData.birthDate,
  });

  // Keep form in sync when userData changes from elsewhere
  useEffect(() => {
    setEditForm({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      birthDate: userData.birthDate,
    });
  }, [userData, isEditing]);

  const handleSave = () => {
    setUserData(prev => ({
      ...prev,
      ...editForm,
      name: `${editForm.firstName} ${editForm.lastName}`.trim(),
    }));
    setIsEditing(false);
  };

  const statCards = [
    { icon: Flame, label: "STREAK AKTIF", value: `${userData.streakHari} hari`, color: "#EF4444", bg: "#FEF2F2" },
    { icon: Trophy, label: "TOTAL MENANG", value: `${userData.totalMenang} game`, color: "#F59E0B", bg: "#FFFBEB" },
    { icon: Target, label: "GAME DICOBA", value: `${userData.gameDicoba} judul`, color: "#10B981", bg: "#ECFDF5" },
    { icon: Zap, label: "ACHIEVEMENT", value: userData.achievement, color: "#8B5CF6", bg: "#F5F3FF" },
  ];

  return (
    <div className="flex flex-col gap-5 md:gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <span className="text-[#64748B] hover:text-[#3B82F6] cursor-pointer transition-colors">Sebangku</span>
        <ChevronRight size={14} className="text-[#94A3B8]" />
        <span className="text-[#3B82F6] font-semibold">Profil Saya</span>
      </div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0]"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.02)" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar + Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 flex-1 text-center sm:text-left">
            <div className="relative group">
              <AvatarCircle name={userData.name} size={80} fontSize={28} />
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-all duration-200"
                title="Edit Profil"
              >
                <Edit2 size={12} />
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 justify-center sm:justify-start">
                <h1
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  className="text-2xl font-black text-[#0F172A]"
                >
                  {userData.name}
                </h1>
                <div className="flex gap-2 justify-center">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-[#3B82F6] self-center">
                    {userData.levelLabel}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-[#F59E0B] bg-[#FFFBEB] border border-[#FDE68A] self-center">
                    LVL {userData.level}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#64748B] justify-center sm:justify-start" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Mail size={13} className="text-[#94A3B8]" />
                  {userData.email}
                </span>
                <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Phone size={13} className="text-[#94A3B8]" />
                  {userData.phone}
                </span>
                <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Calendar size={13} className="text-[#94A3B8]" />
                  Member sejak {userData.memberSince}
                </span>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 border-t lg:border-t-0 lg:border-l border-[#F1F5F9] pt-4 lg:pt-0 lg:pl-8 shrink-0">
            <div className="text-center px-2">
              <p className="text-2xl md:text-3xl font-black text-[#0F172A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {userData.kunjungan}
              </p>
              <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Kunjungan</p>
            </div>
            <div className="text-center px-2 border-x border-[#F1F5F9]">
              <p className="text-2xl md:text-3xl font-black text-[#3B82F6]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {userData.waktuJam}h
              </p>
              <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Waktu</p>
            </div>
            <div className="text-center px-2">
              <p className="text-2xl md:text-3xl font-black text-[#10B981]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {userData.winRate}%
              </p>
              <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Win Rate</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Informasi Personal */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0]"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.02)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-base font-bold text-[#0F172A]">
            Informasi Personal
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-bold hover:bg-[#EFF6FF] hover:border-[#3B82F6] transition-colors cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Edit2 size={12} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Undo2 size={12} /> Batal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3B82F6] text-white text-xs font-bold hover:bg-[#2563EB] transition-colors cursor-pointer shadow-sm"
              >
                <Save size={12} /> Simpan
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Nama Depan
              </label>
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Nama Belakang
              </label>
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={editForm.birthDate}
                onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Nomor HP
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">
                Status
              </label>
              <input
                type="text"
                disabled
                value={userData.status}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { label: "Nama Depan", value: userData.firstName },
              { label: "Nama Belakang", value: userData.lastName },
              { label: "Tanggal Lahir", value: formatDateDisplay(userData.birthDate) },
              { label: "Email", value: userData.email },
              { label: "Nomor HP", value: userData.phone },
              { label: "Status", value: userData.status },
            ].map((field) => (
              <div key={field.label} className="flex flex-col gap-0.5">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {field.label}
                </p>
                <p className="text-sm font-semibold text-[#0F172A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Profil Gaming */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }}
        className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0]"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.02)" }}
      >
        <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-base font-bold text-[#0F172A] mb-4">
          Profil Gaming
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {statCards.map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-4 flex flex-col gap-2 transition-shadow hover:shadow-md cursor-pointer select-none"
              style={{ background: s.bg, border: `1px solid ${s.color}18` }}
            >
              <div className="flex items-center gap-2">
                <s.icon size={15} style={{ color: s.color }} />
                <span className="text-[9px] font-black uppercase tracking-wider"
                  style={{ color: s.color, fontFamily: "'DM Sans', sans-serif" }}>
                  {s.label}
                </span>
              </div>
              <p className="text-lg font-black text-[#0F172A] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {s.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Game Favorit */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }}
        className="bg-white rounded-2xl p-5 md:p-6 border border-[#E2E8F0] mb-4 md:mb-0"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.02)" }}
      >
        <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-base font-bold text-[#0F172A] mb-4">
          Game Favorit
        </h2>
        
        {/* Responsive Grid with swipeable carousel on mobile */}
        <div 
          className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {userData.favGames.map((g) => (
            <motion.div 
              key={g.rank} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-2xl overflow-hidden aspect-video group cursor-pointer shrink-0 w-[85%] sm:w-[60%] md:w-auto snap-start shadow-sm border border-[#E2E8F0]/50"
            >
              <img 
                src={g.image} 
                alt={g.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-3 left-3 w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-[10px] font-black">#{g.rank}</span>
              </div>
              <p 
                className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold truncate tracking-wide drop-shadow-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {g.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── Placeholder Page ──
function PlaceholderPage({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 px-6">
      <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center text-[#3B82F6]">
        {icon}
      </div>
      <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-xl font-bold text-[#0F172A]">
        {title}
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#64748B] text-center max-w-xs">
        Halaman ini sedang dalam pengembangan. Segera hadir!
      </p>
    </div>
  );
}

// ─── MOBILE BOTTOM NAV ────────────────────────────────────────────────────────
function MobileBottomNav({
  active, onNavigate,
}: {
  active: string;
  onNavigate: (path: string) => void;
}) {
  const mobileNavItems = [
    { id: "profil",    Icon: User,      label: "Profil" },
    { id: "history",   Icon: Gamepad2,  label: "Game" },
    { id: "kunjungan", Icon: Calendar,  label: "Kunjungan" },
    { id: "transaksi", Icon: Receipt,   label: "Transaksi" },
    { id: "statistik", Icon: BarChart2, label: "Statistik" },
  ];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white md:hidden"
      style={{ borderTop: "1px solid #E2E8F0", paddingBottom: "env(safe-area-inset-bottom)", boxShadow: "0 -4px 24px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-stretch">
        {mobileNavItems.map((item) => {
          const isActive = active === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileTap={{ scale: 0.9 }}
              className="flex-1 flex flex-col items-center justify-center py-2 pt-0 relative cursor-pointer gap-0.5"
              style={{ minHeight: "60px" }}
            >
              <div className="absolute top-0 left-2 right-2 h-[2.5px] overflow-hidden rounded-full">
                {isActive && (
                  <motion.div layoutId="mobile-nav-line" className="w-full h-full bg-[#3B82F6] rounded-full" />
                )}
              </div>
              <div className="mt-2">
                <item.Icon size={21} strokeWidth={isActive ? 2.2 : 1.7} color={isActive ? "#3B82F6" : "#94A3B8"} />
              </div>
              <span className="text-[10px]" style={{
                fontFamily: "'DM Sans', sans-serif",
                color: isActive ? "#3B82F6" : "#94A3B8",
                fontWeight: isActive ? 700 : 500,
              }}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── CUSTOMER APP (Self-contained Layout) ────────────────────────────────────
export default function CustomerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("profil");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifCount] = useState(2);
  
  // Real-time interactive user data state synced across layout & pages
  const [userData, setUserData] = useState(MOCK_USER);

  const tableId = searchParams.get("table") || "T01";

  // Sync active page with URL
  useEffect(() => {
    const segment = location.pathname.split("/").pop();
    const found = NAV_ITEMS.find(n => n.path === segment);
    if (found) setActivePage(found.id);
    else setActivePage("profil");
  }, [location.pathname]);

  const handleNavigate = (path: string) => {
    setActivePage(path);
    navigate(`/app/customer/${path}`);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const renderPage = () => {
    switch (activePage) {
      case "profil":     return <ProfilPage userData={userData} setUserData={setUserData} />;
      case "history":    return <PlaceholderPage title="History Game" icon={<Gamepad2 size={28} />} />;
      case "kunjungan":  return <PlaceholderPage title="History Kunjungan" icon={<Calendar size={28} />} />;
      case "transaksi":  return <PlaceholderPage title="Riwayat Transaksi" icon={<Receipt size={28} />} />;
      case "statistik":  return <PlaceholderPage title="Statistik Bermain" icon={<BarChart2 size={28} />} />;
      default:           return <ProfilPage userData={userData} setUserData={setUserData} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F1F5F9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── DESKTOP SIDEBAR ──────────────────────────────────────── */}
      <aside
        className="hidden md:flex w-[220px] shrink-0 flex-col"
        style={{
          background: "linear-gradient(180deg, #0F2340 0%, #0A1628 100%)",
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src={sebangkuLogo} alt="Sebangku" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <div>
            <p className="text-white font-black text-sm leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
              BoardVerse
            </p>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">Game Cafe</p>
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <AvatarCircle name={userData.name} size={40} fontSize={14} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{userData.name}</p>
              <p className="text-white/50 text-[11px]">Regular · LVL {userData.level}</p>
            </div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest px-2 mb-3">Menu</p>
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left cursor-pointer transition-all"
                style={{
                  background: isActive ? "rgba(59,130,246,0.2)" : "transparent",
                  color: isActive ? "#60A5FA" : "rgba(255,255,255,0.55)",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-8 bg-[#3B82F6] rounded-r-full"
                  />
                )}
                <item.Icon size={16} strokeWidth={isActive ? 2.2 : 1.7} />
                <span className="text-sm font-semibold">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <LogOut size={16} />
            <span className="text-sm font-semibold">Keluar</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ───────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 flex flex-col md:hidden"
              style={{ background: "linear-gradient(180deg, #0F2340 0%, #0A1628 100%)" }}
            >
              {/* Close */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img src={sebangkuLogo} alt="Sebangku" style={{ width: 32, height: 32, objectFit: "contain" }} />
                  <p className="text-white font-black text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Sebangku</p>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              {/* User */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
                <AvatarCircle name={userData.name} size={38} fontSize={13} />
                <div>
                  <p className="text-white text-sm font-bold">{userData.name}</p>
                  <p className="text-white/50 text-[11px]">Regular · LVL {userData.level}</p>
                </div>
              </div>
              {/* Nav */}
              <nav className="flex-1 px-3 py-3 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left cursor-pointer"
                      style={{
                        background: isActive ? "rgba(59,130,246,0.2)" : "transparent",
                        color: isActive ? "#60A5FA" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      <item.Icon size={16} />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="px-3 pb-5">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                  style={{ color: "rgba(255,255,255,0.45)" }}>
                  <LogOut size={16} />
                  <span className="text-sm font-semibold">Keluar</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── TOP BAR ── */}
        <header
          className="sticky top-0 z-30 bg-white flex items-center gap-3 px-4 md:px-6 h-14"
          style={{ borderBottom: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            <Menu size={22} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari game, transaksi..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] text-[#0F172A] placeholder:text-[#CBD5E1]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Date — hidden on mobile */}
            <span className="hidden md:block text-xs text-[#64748B] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {todayLabel()}
            </span>

            {/* Notification bell */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F1F5F9] cursor-pointer transition-colors">
              <Bell size={18} className="text-[#64748B]" />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[9px] text-white font-black">{notifCount}</span>
                </span>
              )}
            </button>

            {/* Avatar */}
            <button
              onClick={() => handleNavigate("profil")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <AvatarCircle name={userData.name} size={36} fontSize={13} />
            </button>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <MobileBottomNav active={activePage} onNavigate={handleNavigate} />
    </div>
  );
}
