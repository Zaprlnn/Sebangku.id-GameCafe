import { useState, useEffect, useCallback, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, Dices, Utensils, TrendingUp, Settings, LogOut, 
  Menu, X, TrendingDown, Users, ShoppingBag, UserPlus,
  ChevronRight, Plus, Edit2, Trash2,
  ToggleLeft, ToggleRight, Power, ImageIcon, Coffee, Package, Save,
  Grid3X3, List, MessageSquare, Star,
  Eye, EyeOff, AlertCircle,
  Tag, Table2, MapPin, Hash, Armchair, CheckCircle2, XCircle, Layers
} from "lucide-react";

import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";
import ownerPhoto from "../../assets/images/owner_photo.png";

// Import Board Game Images for Top Games
import { supabase } from "../../lib/supabase";
import { useOwnerData } from "../../components/owner/hooks/useOwnerData";
import { useOwnerForms } from "../../components/owner/hooks/useOwnerForms";
import { useOwnerActions } from "../../components/owner/hooks/useOwnerActions";
import AddEditModal from "../../components/owner/AddEditModal";
import DeleteConfirmModal from "../../components/owner/DeleteConfirmModal";
import DashboardView from "../../components/owner/DashboardView";
import GamesView from "../../components/owner/GamesView";
import MenuView from "../../components/owner/MenuView";
import CategoriesTablesView from "./CategoriesTablesView";
import ReportsView from "./ReportsView";

const sidebarMenu = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "games", label: "Board Games", Icon: Dices },
  { id: "menu", label: "Menu F&B", Icon: Utensils },
  { id: "categories-tables", label: "Kategori & Meja", Icon: Layers },
  { id: "reports", label: "Reports", Icon: TrendingUp },
  { id: "users", label: "Users", Icon: Users },
  { id: "community", label: "Community", Icon: MessageSquare },
  { id: "settings", label: "Settings", Icon: Settings },
];

// ─────────────────────────────────────────────────────────────────────────────
// (ReportsView is now imported from ReportsView.tsx)
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// USERS VIEW COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
type KasirUser = {
  id: number;
  name: string;
  username: string;
  password: string;
  role: string;
  phone: string;
  created_at: string;
};

type UserForm = {
  name: string;
  username: string;
  password: string;
  phone: string;
};

// ─── COMMUNITY VIEW COMPONENT ───────────────────────────────────────────────
import UsersView from "../../components/owner/UsersView";
import SettingsView from "../../components/owner/SettingsView";
import CommunityView from "../../components/owner/CommunityView";

export default function OwnerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sync active page/tab with URL
  useEffect(() => {
    const segment = location.pathname.split("/").pop();
    const found = sidebarMenu.find(m => m.id === segment);
    if (found) setActiveTab(found.id);
    else if (location.pathname.endsWith("/owner") || location.pathname.endsWith("/owner/")) setActiveTab("dashboard");
  }, [location.pathname]);

  const handleNavigate = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/app/owner/${tabId === "dashboard" ? "" : tabId}`);
    setSidebarOpen(false);
  };

  const ownerData = useOwnerData();
  const ownerForms = useOwnerForms();
  const ownerActions = useOwnerActions(ownerData, ownerForms);

  const sharedProps = {
    activeTab, setActiveTab,
    ...ownerData,
    ...ownerForms,
    ...ownerActions,
    handleEditGame: ownerForms.triggerEditGame,
    handleAddNew: (type: any) => type === 'game' ? ownerForms.triggerAddGame() : ownerForms.triggerAddFb(),
    setDeleteConfirm: ownerActions.confirmDelete,
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className="hidden md:flex w-[220px] shrink-0 flex-col"
        style={{
          background: "linear-gradient(180deg, #0F2340 0%, #0A1628 100%)",
          minHeight: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          zIndex: 40
        }}
      >
        {/* Logo Branding */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src={sebangkuLogo} alt="Sebangku Logo" className="w-8 h-8 object-contain" />
          <div>
            <p className="text-white font-black text-sm tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>BoardVerse</p>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">Owner Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {sidebarMenu.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all relative"
                style={{
                  background: isActive ? "rgba(59,130,246,0.2)" : "transparent",
                  color: isActive ? "#60A5FA" : "rgba(255,255,255,0.55)",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="owner-sidebar-active"
                    className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                  />
                )}
                <item.Icon size={16} strokeWidth={isActive ? 2.2 : 1.7} />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile Info */}
        <div className="px-4 py-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
              <img src={ownerPhoto} alt="Owner" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight">Pemilik Cafe</p>
              <span className="text-[9px] bg-blue-500/30 text-blue-300 font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 inline-block">
                Owner
              </span>
            </div>
          </div>
          <button 
            onClick={() => navigate("/")} 
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left cursor-pointer transition-colors hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <LogOut size={14} />
            <span className="text-xs font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
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
              {/* Close / Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img src={sebangkuLogo} alt="Sebangku Logo" className="w-8 h-8 object-contain" />
                  <p className="text-white font-black text-sm tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>BoardVerse</p>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {sidebarMenu.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all"
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

              {/* Bottom profile info */}
              <div className="px-4 py-4 border-t border-white/10 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                    <img src={ownerPhoto} alt="Owner" className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">Pemilik Cafe</p>
                    <span className="text-[9px] bg-blue-500/30 text-blue-300 font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 inline-block">
                      Owner
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/")} 
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left cursor-pointer transition-colors hover:bg-white/5"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <LogOut size={14} />
                  <span className="text-xs font-semibold">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[220px]">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white flex items-center justify-between px-4 md:px-6 h-14 border-b border-[#E2E8F0] shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            <Menu size={22} />
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-[#64748B]">
            <span>Admin</span>
            <ChevronRight size={14} className="text-[#94A3B8]" />
            <span className="text-[#3B82F6] font-semibold uppercase tracking-wider text-xs">
              {sidebarMenu.find(m => m.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
              OW
            </div>
          </div>
        </header>

        {/* ── VIEW CONTAINER ── */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* ───────────────── 1. DASHBOARD VIEW ───────────────── */}
              {activeTab === "dashboard" && <DashboardView {...sharedProps} />}
              {activeTab === "games" && <GamesView {...sharedProps} />}
              {activeTab === "menu" && <MenuView {...sharedProps} />}
              {activeTab === "categories-tables" && (
                <CategoriesTablesView />
              )}

              {/* ───────────────── 4. REPORTS VIEW ───────────────── */}
              {activeTab === "reports" && (
                <ReportsView />
              )}

              {/* ───────────────── 5. COMMUNITY VIEW ───────────────── */}
              {activeTab === "community" && (
                <CommunityView />
              )}

              {/* ───────────────── 6. USERS VIEW ───────────────── */}
              {activeTab === "users" && (
                <UsersView />
              )}

              {/* ───────────────── 7. SETTINGS VIEW ───────────────── */}
              {activeTab === "settings" && (
                <SettingsView />
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── ADD / EDIT FORM MODAL ── */}
      <AnimatePresence>
        <AddEditModal {...sharedProps} />
      </AnimatePresence>

      {/* ── DELETE CONFIRM MODAL ── */}
      <AnimatePresence>
        <DeleteConfirmModal {...sharedProps} />
      </AnimatePresence>

    </div>
  );
}
