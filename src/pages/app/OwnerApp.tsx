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
import mystKidsImg from "../../assets/images/Mysterium Kids.png";
import luckyCapImg from "../../assets/images/Lucky Captain.png";
import krakenAttImg from "../../assets/images/Kraken Attack.png";
import sleepyCasImg from "../../assets/images/Sleepy Castle.png";
import { supabase } from "../../lib/supabase";
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

function UsersView() {
  const [users, setUsers] = useState<KasirUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<KasirUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KasirUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState<UserForm>({ name: "", username: "", password: "", phone: "" });
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState("");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "Kasir")
      .order("created_at", { ascending: true });
    if (error) showToast("Gagal memuat data: " + error.message, "error");
    else setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const openAdd = () => {
    setEditUser(null);
    setForm({ name: "", username: "", password: "", phone: "" });
    setFormError("");
    setShowPw(false);
    setShowModal(true);
  };

  const openEdit = (u: KasirUser) => {
    setEditUser(u);
    setForm({ name: u.name, username: u.username, password: u.password, phone: u.phone || "" });
    setFormError("");
    setShowPw(false);
    setShowModal(true);
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Nama wajib diisi";
    if (!form.username.trim()) return "Email/Username wajib diisi";
    if (!editUser && !form.password.trim()) return "Password wajib diisi";
    if (form.password && form.password.length < 6) return "Password minimal 6 karakter";
    return "";
  };

  const handleSave = async () => {
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setSaving(true);
    setFormError("");

    if (editUser) {
      const updates: Partial<UserForm> = { name: form.name, username: form.username, phone: form.phone };
      if (form.password) updates.password = form.password;
      const { error } = await supabase.from("users").update(updates).eq("id", editUser.id);
      if (error) showToast("Gagal update: " + error.message, "error");
      else { showToast("Akun kasir berhasil diperbarui!"); setShowModal(false); fetchUsers(); }
    } else {
      const { error } = await supabase.from("users").insert({
        name: form.name, username: form.username, password: form.password,
        phone: form.phone, role: "Kasir",
      });
      if (error) showToast("Gagal tambah: " + error.message, "error");
      else { showToast("Akun kasir berhasil dibuat!"); setShowModal(false); fetchUsers(); }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("users").delete().eq("id", deleteTarget.id);
    if (error) showToast("Gagal hapus: " + error.message, "error");
    else { showToast("Akun kasir berhasil dihapus!"); fetchUsers(); }
    setDeleteTarget(null);
    setDeleting(false);
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelCls = "block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5";

  return (
    <div className="flex flex-col gap-5">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className={`fixed top-5 right-5 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold ${
              toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
            }`}
          >
            {toast.type === "success" ? <span>✅</span> : <span>❌</span>}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-[#0F172A]">Manajemen Kasir</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Kelola akun kasir yang bisa mengakses sistem</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold transition-all shadow-md hover:shadow-blue-200 cursor-pointer"
        >
          <UserPlus size={16} />
          Tambah Kasir
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Kasir", value: users.length, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
          { label: "Aktif", value: users.length, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Dibuat Bulan Ini", value: users.filter(u => new Date(u.created_at).getMonth() === new Date().getMonth()).length, color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border rounded-2xl p-4`}>
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#94A3B8] gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full" />
            Memuat data...
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#94A3B8]">
            <Users size={40} strokeWidth={1} />
            <p className="text-sm font-semibold">Belum ada akun kasir</p>
            <button onClick={openAdd} className="text-blue-600 text-xs font-bold hover:underline cursor-pointer">+ Tambah sekarang</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {["Nama", "Email / Username", "No. Telepon", "Dibuat", "Aksi"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-black text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#0F172A] text-sm">{u.name}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Kasir</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#64748B] text-xs font-medium">{u.username}</td>
                    <td className="px-5 py-4 text-[#64748B] text-xs">{u.phone || <span className="text-slate-300">—</span>}</td>
                    <td className="px-5 py-4 text-[#94A3B8] text-xs whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-[#64748B] hover:text-blue-600 border border-slate-200 hover:border-blue-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 text-[#64748B] hover:text-red-600 border border-slate-200 hover:border-red-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Trash2 size={12} /> Hapus
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600">
                  <div>
                    <h3 className="text-white font-black text-base">{editUser ? "Edit Akun Kasir" : "Tambah Akun Kasir"}</h3>
                    <p className="text-blue-100 text-xs mt-0.5">{editUser ? `Mengedit: ${editUser.name}` : "Buat akun kasir baru"}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer">
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className={labelCls}>Nama Lengkap</label>
                    <input className={inputCls} placeholder="contoh: Kasir Utama" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Email / Username</label>
                    <input className={inputCls} placeholder="kasir@sebangku.id" type="email" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>{editUser ? "Password Baru (kosongkan jika tidak diubah)" : "Password"}</label>
                    <div className="relative">
                      <input
                        className={inputCls + " pr-10"}
                        placeholder={editUser ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"}
                        type={showPw ? "text" : "password"}
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>No. Telepon (opsional)</label>
                    <input className={inputCls} placeholder="08xxxxxxxxxx" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  {formError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-red-600 text-xs font-medium">
                      <AlertCircle size={14} /> {formError}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 pb-6 flex gap-3">
                  <button onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[#64748B] text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer">
                    Batal
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60">
                    {saving ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />Menyimpan...</>
                    ) : (
                      <><Save size={15} />{editUser ? "Simpan Perubahan" : "Buat Akun"}</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" onClick={() => setDeleteTarget(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} className="text-red-500" />
                </div>
                <h3 className="text-lg font-black text-[#0F172A] mb-1">Hapus Akun Kasir?</h3>
                <p className="text-sm text-[#64748B] mb-5">Akun <strong>{deleteTarget.name}</strong> akan dihapus permanen dan tidak bisa dikembalikan.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[#64748B] text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer">
                    Batal
                  </button>
                  <button onClick={handleDelete} disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60">
                    {deleting ? "Menghapus..." : "Ya, Hapus"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS VIEW COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const DAYS = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];

const defaultCafeInfo = {
  name: "Cafe Sebangku.id",
  phone: "081234567890",
  instagram: "@sebangku.id",
  address: "Jl. Sebangku No. 24, Yogyakarta",
};

const defaultHours: Record<string, { open: string; close: string; active: boolean }> = {
  Senin:  { open:"10:00", close:"23:00", active:true },
  Selasa: { open:"10:00", close:"23:00", active:true },
  Rabu:   { open:"10:00", close:"23:00", active:true },
  Kamis:  { open:"10:00", close:"23:00", active:true },
  Jumat:  { open:"10:00", close:"24:00", active:true },
  Sabtu:  { open:"09:00", close:"24:00", active:true },
  Minggu: { open:"09:00", close:"22:00", active:true },
};

const defaultPayments = { qris: true, cash: true, transfer: false };

function SettingsView() {
  const settingsSections = [
    { id:"info",     label:"Informasi Cafe" },
    { id:"hours",    label:"Jam Operasional" },
    { id:"payment",  label:"Metode Pembayaran" },
    { id:"security", label:"Keamanan Akun" },
    { id:"data",     label:"Manajemen Data" },
  ];
  const [activeSection, setActiveSection] = useState("info");

  // ── Cafe Info ──
  const [cafeInfo, setCafeInfo] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cafeInfo") || "null") || defaultCafeInfo; }
    catch { return defaultCafeInfo; }
  });
  const saveCafeInfo = () => {
    localStorage.setItem("cafeInfo", JSON.stringify(cafeInfo));
    alert("Informasi cafe berhasil disimpan!");
  };

  // ── Hours ──
  const [hours, setHours] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cafeHours") || "null") || defaultHours; }
    catch { return defaultHours; }
  });
  const saveHours = () => {
    localStorage.setItem("cafeHours", JSON.stringify(hours));
    alert("Jam operasional berhasil disimpan!");
  };

  // ── Payment ──
  const [payments, setPayments] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cafePayments") || "null") || defaultPayments; }
    catch { return defaultPayments; }
  });
  const savePayments = () => {
    localStorage.setItem("cafePayments", JSON.stringify(payments));
    alert("Metode pembayaran berhasil disimpan!");
  };

  // ── Security ──
  const [ownerPw, setOwnerPw] = useState({ current:"", next:"", confirm:"" });
  const [kasirPin, setKasirPin] = useState({ next:"", confirm:"" });
  const [pwError, setPwError] = useState("");
  const [pinError, setPinError] = useState("");

  const saveOwnerPw = () => {
    if (ownerPw.next !== ownerPw.confirm) { setPwError("Password baru tidak cocok!"); return; }
    if (ownerPw.next.length < 6) { setPwError("Minimal 6 karakter!"); return; }
    localStorage.setItem("ownerPassword", ownerPw.next);
    setOwnerPw({ current:"", next:"", confirm:"" });
    setPwError("");
    alert("Password berhasil diubah!");
  };

  const saveKasirPin = () => {
    if (kasirPin.next !== kasirPin.confirm) { setPinError("PIN tidak cocok!"); return; }
    if (kasirPin.next.length < 4) { setPinError("Minimal 4 digit!"); return; }
    localStorage.setItem("kasirPin", kasirPin.next);
    setKasirPin({ next:"", confirm:"" });
    setPinError("");
    alert("PIN kasir berhasil diubah!");
  };

  // ── Data ──
  const exportAll = () => {
    const data = { cafeInfo, hours, payments, games: localStorage.getItem("games"), menu: localStorage.getItem("menuFnB") };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "sebangku_data.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const resetTransactions = () => {
    if (window.confirm("Yakin ingin menghapus semua data transaksi? Aksi ini tidak bisa dibatalkan.")) {
      localStorage.removeItem("transactions");
      alert("Data transaksi berhasil direset.");
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelCls = "block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5";
  const saveBtnCls = "bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer";
  const sectionCard = "bg-white rounded-2xl border border-slate-100 shadow-sm p-6";

  return (
    <div className="flex gap-6 items-start">
      {/* Sidebar tabs */}
      <div className="hidden lg:flex flex-col gap-1 w-52 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
        {settingsSections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeSection === s.id
                ? "bg-blue-600 text-white shadow"
                : "text-[#64748B] hover:bg-slate-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Mobile tabs */}
      <div className="flex lg:hidden gap-2 overflow-x-auto w-full pb-2 shrink-0">
        {settingsSections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              activeSection === s.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-[#64748B] border-slate-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">

        {/* ── Informasi Cafe ── */}
        {activeSection === "info" && (
          <div className={sectionCard}>
            <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">Informasi Cafe</h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Nama Cafe</label>
                <input className={inputCls} value={cafeInfo.name} onChange={e => setCafeInfo({...cafeInfo, name: e.target.value})} />
              </div>
              <div>
                <label className={labelCls}>Nomor WhatsApp / Telepon</label>
                <input className={inputCls} value={cafeInfo.phone} onChange={e => setCafeInfo({...cafeInfo, phone: e.target.value})} placeholder="08xxxxxxxxxx" />
              </div>
              <div>
                <label className={labelCls}>Instagram</label>
                <input className={inputCls} value={cafeInfo.instagram} onChange={e => setCafeInfo({...cafeInfo, instagram: e.target.value})} placeholder="@username" />
              </div>
              <div>
                <label className={labelCls}>Alamat Lengkap</label>
                <textarea className={inputCls} rows={3} value={cafeInfo.address} onChange={e => setCafeInfo({...cafeInfo, address: e.target.value})} />
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={saveCafeInfo} className={saveBtnCls}>Simpan Informasi</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Jam Operasional ── */}
        {activeSection === "hours" && (
          <div className={sectionCard}>
            <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">Jam Operasional</h3>
            <div className="space-y-3">
              {DAYS.map(day => (
                <div key={day} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  {/* Toggle */}
                  <button
                    onClick={() => setHours((h: typeof hours) => ({ ...h, [day]: { ...h[day], active: !h[day].active } }))}
                    className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${hours[day].active ? "bg-blue-500" : "bg-slate-300"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${hours[day].active ? "left-5" : "left-0.5"}`} />
                  </button>
                  <span className={`w-16 text-sm font-bold shrink-0 ${hours[day].active ? "text-[#0F172A]" : "text-[#94A3B8]"}`}>{day}</span>
                  {hours[day].active ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={hours[day].open}
                        onChange={e => setHours((h: typeof hours) => ({ ...h, [day]: { ...h[day], open: e.target.value } }))}
                        className="flex-1 px-2.5 py-1.5 rounded-lg text-sm border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                      />
                      <span className="text-[#94A3B8] text-xs">–</span>
                      <input
                        type="time"
                        value={hours[day].close}
                        onChange={e => setHours((h: typeof hours) => ({ ...h, [day]: { ...h[day], close: e.target.value } }))}
                        className="flex-1 px-2.5 py-1.5 rounded-lg text-sm border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-[#94A3B8] font-medium">Tutup</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={saveHours} className={saveBtnCls}>Simpan Jam Operasional</button>
            </div>
          </div>
        )}

        {/* ── Metode Pembayaran ── */}
        {activeSection === "payment" && (
          <div className={sectionCard}>
            <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">Metode Pembayaran</h3>
            <div className="space-y-3">
              {([
                { key:"qris",     label:"QRIS",          desc:"QR Code pembayaran digital",         color:"bg-blue-50 text-blue-600 border-blue-200" },
                { key:"cash",     label:"Tunai (Cash)",  desc:"Pembayaran langsung dengan uang tunai", color:"bg-green-50 text-green-600 border-green-200" },
                { key:"transfer", label:"Transfer Bank", desc:"Transfer manual ke rekening cafe",    color:"bg-purple-50 text-purple-600 border-purple-200" },
              ] as { key: keyof typeof payments; label: string; desc: string; color: string }[]).map(({ key, label, desc, color }) => (
                <div key={key as string} className={`flex items-center justify-between p-4 rounded-xl border ${payments[key] ? color : "bg-slate-50 text-slate-400 border-slate-200"} transition-all`}>
                  <div>
                    <p className="font-bold text-sm">{label}</p>
                    <p className="text-xs opacity-70 mt-0.5">{desc}</p>
                  </div>
                  <button
                    onClick={() => setPayments((p: typeof payments) => ({ ...p, [key]: !p[key] }))}
                    className={`w-11 h-6 rounded-full relative transition-colors ${payments[key] ? "bg-blue-500" : "bg-slate-300"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${payments[key] ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={savePayments} className={saveBtnCls}>Simpan Metode Pembayaran</button>
            </div>
          </div>
        )}

        {/* ── Keamanan Akun ── */}
        {activeSection === "security" && (
          <div className="space-y-4">
            {/* Ubah Password Owner */}
            <div className={sectionCard}>
              <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">Ubah Password Owner</h3>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Password Saat Ini</label>
                  <input type="password" className={inputCls} value={ownerPw.current} onChange={e => setOwnerPw({...ownerPw, current: e.target.value})} placeholder="••••••••" />
                </div>
                <div>
                  <label className={labelCls}>Password Baru</label>
                  <input type="password" className={inputCls} value={ownerPw.next} onChange={e => setOwnerPw({...ownerPw, next: e.target.value})} placeholder="Minimal 6 karakter" />
                </div>
                <div>
                  <label className={labelCls}>Konfirmasi Password Baru</label>
                  <input type="password" className={inputCls} value={ownerPw.confirm} onChange={e => setOwnerPw({...ownerPw, confirm: e.target.value})} placeholder="Ulangi password baru" />
                </div>
                {pwError && <p className="text-xs text-red-500 font-medium">{pwError}</p>}
                <div className="flex justify-end pt-1">
                  <button onClick={saveOwnerPw} className={saveBtnCls}>Simpan Password</button>
                </div>
              </div>
            </div>

            {/* Ubah PIN Kasir */}
            <div className={sectionCard}>
              <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">Ubah PIN Kasir</h3>
              <p className="text-xs text-[#64748B] mb-4">PIN ini digunakan kasir untuk mengakses halaman kasir.</p>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>PIN Baru</label>
                  <input type="password" inputMode="numeric" maxLength={6} className={inputCls} value={kasirPin.next} onChange={e => setKasirPin({...kasirPin, next: e.target.value})} placeholder="Minimal 4 digit" />
                </div>
                <div>
                  <label className={labelCls}>Konfirmasi PIN Baru</label>
                  <input type="password" inputMode="numeric" maxLength={6} className={inputCls} value={kasirPin.confirm} onChange={e => setKasirPin({...kasirPin, confirm: e.target.value})} placeholder="Ulangi PIN" />
                </div>
                {pinError && <p className="text-xs text-red-500 font-medium">{pinError}</p>}
                <div className="flex justify-end pt-1">
                  <button onClick={saveKasirPin} className={saveBtnCls}>Simpan PIN Kasir</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Manajemen Data ── */}
        {activeSection === "data" && (
          <div className="space-y-4">
            <div className={sectionCard}>
              <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">Export Data</h3>
              <p className="text-sm text-[#64748B] mb-4">Download semua data cafe (menu, game, pengaturan) dalam format JSON untuk backup.</p>
              <button onClick={exportAll} className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Backup JSON
              </button>
            </div>

            <div className={sectionCard}>
              <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">Reset Data Transaksi</h3>
              <p className="text-sm text-[#64748B] mb-4">Hapus semua riwayat transaksi. <strong>Aksi ini tidak dapat dibatalkan.</strong></p>
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <svg width="20" height="20" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <p className="text-xs text-red-600 font-medium flex-1">Data yang sudah dihapus tidak bisa dikembalikan. Pastikan kamu sudah melakukan backup terlebih dahulu.</p>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={resetTransactions} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  Reset Transaksi
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── COMMUNITY VIEW COMPONENT ───────────────────────────────────────────────
function CommunityView() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"reviews" | "suggestions">("reviews");
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | "All">("All");

  const loadReviews = () => {
    const saved = localStorage.getItem("sebangku_reviews");
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      const defaultReviews = [
        {
          id: "REV-1",
          customerName: "Andi Saputra",
          rating: 5,
          comment: "Makanan mie gorengnya enak banget! Game Mysterium Kids seru dimainkan sama anak-anak dan temen. Pelayanan ramah cepat.",
          items: ["Mie Goreng Special", "Mysterium Kids"],
          gameSuggestion: "Splendor",
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
          isVisible: true
        },
        {
          id: "REV-2",
          customerName: "Citra Dewi",
          rating: 4,
          comment: "Kopinya mantap dan tempatnya cozy abis. Main Lucky Captain seru banget, pas buat nongkrong sore.",
          items: ["Es Kopi Susu", "Lucky Captain"],
          gameSuggestion: "Dixit",
          createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
          isVisible: true
        }
      ];
      localStorage.setItem("sebangku_reviews", JSON.stringify(defaultReviews));
      setReviews(defaultReviews);
    }
  };

  useEffect(() => {
    loadReviews();
    const handleStorage = () => loadReviews();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleDeleteReview = (id: string) => {
    if (!window.confirm("Yakin ingin menghapus ulasan ini?")) return;
    const updated = reviews.filter(r => r.id !== id);
    localStorage.setItem("sebangku_reviews", JSON.stringify(updated));
    setReviews(updated);
    window.dispatchEvent(new Event("storage"));
  };

  const handleAddSuggestedGame = (suggestionText: string) => {
    const savedGames = localStorage.getItem("sebangku_board_games");
    const gamesList = savedGames ? JSON.parse(savedGames) : [
      { id: "bg1", name: "Mysterium Kids", rating: 4.8, players: "2-6", duration: "21 min", category: "Cooperative", status: "Available", minAge: "6+", complexity: "Easy", description: "Mysterium Kids adalah permainan kooperatif di mana pemain harus menebak objek berdasarkan suara dari tamborin kecil." },
      { id: "bg2", name: "Lucky Captain", rating: 4.5, players: "2-4", duration: "30 min", category: "Strategy", status: "In Use", currentUser: "Budi L.", endTime: "17:30", minAge: "8+", complexity: "Medium", description: "Lucky Captain adalah permainan strategi bajak laut taktis yang memadukan pengumpulan harta karun dan pertempuran seru di laut lepas." },
      { id: "bg3", name: "Kraken Attack", rating: 4.7, players: "1-4", duration: "25 min", category: "Strategy", status: "Available", minAge: "5+", complexity: "Easy", description: "Kraken Attack adalah permainan kooperatif seru di mana seluruh kru kapal harus bekerja sama mempertahankan dek dari serbuan tentakel gurita raksasa." },
      { id: "bg4", name: "Sleepy Castle", rating: 4.9, players: "1-4", duration: "10 min", category: "Strategy", status: "Available", minAge: "6+", complexity: "Easy", description: "Sleepy Castle adalah permainan ingatan dan strategi ringan di mana ksatria menyelinap ke istana yang tertidur untuk menyelamatkan putri." },
      { id: "bg5", name: "Detective Charlie", rating: 4.6, players: "1-5", duration: "25 min", category: "Strategy", status: "Maintenance", minAge: "7+", complexity: "Easy", description: "Detective Charlie adalah permainan deduksi anak-anak kooperatif untuk memecahkan misteri di Pulau Mainan bersama detektif terbaik." },
      { id: "bg6", name: "Ruben Rallye", rating: 4.6, players: "2-4", duration: "15 min", category: "Family", status: "Available", minAge: "6+", complexity: "Easy", description: "Ruben Rallye adalah permainan balap mobil taktis yang menyenangkan, melatih ketangkasan berhitung dan keputusan cepat." },
      { id: "bg7", name: "Waroong Wars", rating: 4.4, players: "3-5", duration: "30 min", category: "Strategy", status: "Available", minAge: "8+", complexity: "Medium", description: "Waroong Wars adalah permainan kartu bertema kuliner khas Indonesia. Jadilah warung terbaik dengan mengelola bahan masakan." },
      { id: "bg8", name: "Fold it", rating: 4.2, players: "1-5", duration: "20 min", category: "Party", status: "In Use", currentUser: "Reni W.", endTime: "18:00", minAge: "7+", complexity: "Medium", description: "Fold It melatih kecepatan berpikir dan motorik tangan. Pemain harus melipat saputangan kain sesuai dengan resep pesanan secepat mungkin." },
      { id: "bg9", name: "Slide Quest", rating: 4.5, players: "1-4", duration: "45 min", category: "Party", status: "Available", minAge: "6+", complexity: "Easy", description: "Slide Quest adalah permainan kooperatif seru di mana para pemain harus memiringkan papan untuk memandu ksatria meluncur melewati rintangan." },
      { id: "bg10", name: "Gold Am Orinoko", rating: 4.4, players: "2-4", duration: "20 min", category: "Strategy", status: "Available", minAge: "7+", complexity: "Medium", description: "Petualangan melintasi sungai Orinoko yang berbahaya. Gunakan strategi melompat di batang kayu untuk membawa emas kuno kembali ke desa." },
      { id: "bg11", name: "4 in a Row On The Go", rating: 4.3, players: "2-2", duration: "10 min", category: "Family", status: "Available", minAge: "6+", complexity: "Easy", description: "Permainan menyusun 4 koin berurutan secara horizontal, vertikal, atau diagonal yang legendaris, praktis dibawa ke mana saja." },
      { id: "bg12", name: "Magic Maze", rating: 4.3, players: "1-7", duration: "15 min", category: "Strategy", status: "Maintenance", minAge: "8+", complexity: "Medium", description: "Magic Maze adalah permainan kooperatif real-time yang unik. Para pemain tidak boleh berbicara saat mengontrol pergerakan pahlawan." }
    ];

    if (gamesList.some((g: any) => g.name.toLowerCase() === suggestionText.toLowerCase())) {
      alert("Game ini sudah ada di koleksi!");
      return;
    }

    const newGame = {
      id: `bg${Date.now()}`,
      name: suggestionText,
      rating: 5.0,
      players: "2-4",
      duration: "30 min",
      category: "Strategy",
      status: "Available",
      minAge: "8+",
      complexity: "Medium",
      description: `${suggestionText} adalah board game baru yang diusulkan oleh komunitas pelanggan.`
    };

    gamesList.push(newGame);
    localStorage.setItem("sebangku_board_games", JSON.stringify(gamesList));
    // Also save in rent games
    const savedRent = localStorage.getItem("sebangku_rent_games");
    const rentList = savedRent ? JSON.parse(savedRent) : [];
    rentList.push({ id: `g${Date.now()}`, name: suggestionText, price: 12000, category: "Strategy", emoji: "🎲" });
    localStorage.setItem("sebangku_rent_games", JSON.stringify(rentList));

    window.dispatchEvent(new Event("storage"));
    alert(`Berhasil menambahkan "${suggestionText}" ke daftar Board Game Koleksi!`);
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((r: any) => selectedRatingFilter === "All" || r.rating === selectedRatingFilter);
  }, [reviews, selectedRatingFilter]);

  const suggestions = useMemo(() => {
    return reviews.filter((r: any) => r.gameSuggestion).map((r: any) => ({
      game: r.gameSuggestion,
      user: r.customerName,
      date: r.createdAt
    }));
  }, [reviews]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r: any) => {
      const rate = r.rating as 5|4|3|2|1;
      if (counts[rate] !== undefined) counts[rate]++;
    });
    return counts;
  }, [reviews]);

  return (
    <div className="flex flex-col gap-6 text-left" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-[#0F172A]">Community Reviews &amp; Suggestions</h2>
        <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider mt-0.5">Moderasi review dan tindak lanjuti usulan board game baru dari pelanggan</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-32">
          <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">RATA-RATA RATING</span>
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] flex items-baseline gap-1.5">
              {avgRating} <span className="text-sm font-bold text-slate-400">/ 5.0</span>
            </h2>
            <div className="flex gap-0.5 mt-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill={i < Math.round(Number(avgRating)) ? "#F59E0B" : "none"} className={i < Math.round(Number(avgRating)) ? "text-amber-500" : "text-slate-300"} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-32">
          <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">TOTAL REVIEW</span>
          <div>
            <h2 className="text-3xl font-black text-[#3B82F6]">{reviews.length}</h2>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">Ulasan masuk dari pelanggan</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-32">
          <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">USULAN GAME</span>
          <div>
            <h2 className="text-3xl font-black text-[#10B981]">{suggestions.length}</h2>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">Permintaan game dari komunitas</span>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col gap-1.5 justify-center">
          {[5, 4, 3, 2, 1].map(star => {
            const count = ratingCounts[star as 5|4|3|2|1] || 0;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="w-3">{star}★</span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-5 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "reviews" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Ulasan Pelanggan
        </button>
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "suggestions" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Usulan Game Baru ({suggestions.length})
        </button>
      </div>

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="flex flex-col gap-4">
          {/* Rating filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-black text-slate-400 uppercase mr-1.5">Filter Rating:</span>
            {["All", 5, 4, 3, 2, 1].map(rate => (
              <button
                key={rate}
                onClick={() => setSelectedRatingFilter(rate as any)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                  selectedRatingFilter === rate
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                {rate === "All" ? "Semua" : `${rate} ★`}
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev: any) => (
              <div key={rev.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-3">
                  {/* Header info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {rev.customerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0F172A]">{rev.customerName}</h4>
                        <span className="text-[9px] text-[#94A3B8] font-bold">{new Date(rev.createdAt).toLocaleString("id-ID")}</span>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={11} fill={i < rev.rating ? "#F59E0B" : "none"} className={i < rev.rating ? "text-amber-500" : "text-slate-200"} />
                      ))}
                    </div>
                  </div>

                  {/* Items reviewed */}
                  <div className="flex flex-wrap gap-1">
                    {rev.items?.map((item: string, idx: number) => (
                      <span key={idx} className="text-[9px] font-bold bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded">
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  {/* Attachment image */}
                  {rev.photo && (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border">
                      <img src={rev.photo} alt="Ulasan" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Suggestion badge */}
                  {rev.gameSuggestion && (
                    <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-2.5 flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wide">💡 Usulan Game</span>
                      <span className="text-xs font-bold text-slate-700">{rev.gameSuggestion}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-50">
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} /> Hapus Ulasan
                  </button>
                </div>
              </div>
            ))}

            {filteredReviews.length === 0 && (
              <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-10 text-center text-slate-400 text-xs">
                Tidak ada ulasan yang sesuai filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suggestions Tab */}
      {activeTab === "suggestions" && (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500">
                <th className="p-4 pl-6">USULAN GAME</th>
                <th className="p-4">DARI CUSTOMER</th>
                <th className="p-4">TANGGAL USULAN</th>
                <th className="p-4 text-right pr-6">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((sug: any, idx: number) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-bold text-[#0F172A]">{sug.game}</td>
                  <td className="p-4 text-slate-600 font-medium">{sug.user}</td>
                  <td className="p-4 text-slate-400 font-bold">{new Date(sug.date).toLocaleDateString("id-ID")}</td>
                  <td className="p-4 text-right pr-6">
                    <button
                      onClick={() => handleAddSuggestedGame(sug.game)}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      + Tambah ke Koleksi
                    </button>
                  </td>
                </tr>
              ))}

              {suggestions.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 text-xs">
                    Belum ada usulan game dari pelanggan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

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

  // Mock Active Sessions Data (matching design image)
  const [activeSessions] = useState([
    { id: 1, customer: "Andi Saputra", table: "Table A1", game: "Pandemic", duration: "2h 15m", timeLeft: "45m", status: "Active" },
    { id: 2, customer: "Budi Laksono", table: "Table B3", game: "Catan", duration: "1h 05m", timeLeft: "8m", status: "Ending Soon" },
    { id: 3, customer: "Citra Dewi", table: "Table C2", game: "Ticket to Ride", duration: "3h 00m", timeLeft: "All Day", status: "Active" },
    { id: 4, customer: "Dika Pratama", table: "Table A2", game: "Wingspan", duration: "0h 45m", timeLeft: "2h 15m", status: "Active" },
{ id: 5, customer: "Eva Susanti", table: "Table D1", game: "Root", duration: "1h 30m", timeLeft: "30m", status: "Active" },
  ]);

  // Mock Top Games
  const [topGames] = useState([
    { rank: 1, name: "Lucky Captain", plays: 42, revenue: 840000, img: luckyCapImg },
    { rank: 2, name: "Mysterium Kids", plays: 36, revenue: 720000, img: mystKidsImg },
    { rank: 3, name: "Kraken Attack", plays: 28, revenue: 560000, img: krakenAttImg },
    { rank: 4, name: "Sleepy Castle", plays: 22, revenue: 440000, img: sleepyCasImg },
  ]);

  // Mock Recent Transactions
  const [recentTransactions] = useState([
    { id: "TX-9021", customer: "Farhan Malik", items: "F&B Order (Kopi, Roti)", amount: 75000, type: "F&B", time: "10m ago" },
    { id: "TX-9020", customer: "Budi Laksono", items: "Rental Session (Catan)", amount: 45000, type: "Rent", time: "25m ago" },
    { id: "TX-9019", customer: "Gita Lestari", items: "Rent + F&B (Mysterium + Tea)", amount: 112000, type: "Combo", time: "1h ago" },
    { id: "TX-9018", customer: "Hendra Wijaya", items: "F&B Order (Nasi Goreng)", amount: 38000, type: "F&B", time: "2h ago" },
  ]);
  // State for Inventory (will be fetched from DB)
  const [boardGames, setBoardGames] = useState<any[]>([]);
  const [rentGames, setRentGames] = useState<any[]>([]);
  const [fbMenu, setFbMenu] = useState<any[]>([]);

  // ── FETCH DATA DARI SUPABASE ──
  useEffect(() => {
    const fetchDbData = async () => {
      try {
        // Fetch Boardgames
        const { data: bgData, error: bgError } = await supabase.from('boardgames').select('*');
        if (bgError) throw bgError;

        if (bgData) {
          const mappedGames = bgData.map((g: any) => ({
            id: g.id,
            name: g.title,
            category: g.genre,
            stock: g.stock ?? 1,
            rented: g.rented ?? 0,
            price: g.price ?? 0,
            status: g.status === 'Available' ? 'Available' : g.status === 'Maintenance' ? 'Maintenance' : 'In Use',
            active: g.active ?? (g.status === 'Available'),
            image: g.image ?? "",
            emoji: g.emoji ?? "🎲",
            minPlayers: g.min_players ?? 2,
            maxPlayers: g.max_players ?? 6
          }));
          setBoardGames(mappedGames);
          
          // Rent games syncs with board games for POS
          const mappedRentGames = mappedGames.map((g: any) => ({
            id: `g_${g.id}`,
            name: g.name,
            price: g.price,
            category: g.category,
            emoji: g.emoji,
            image: g.image,
            status: g.status,
            active: g.active
          }));
          setRentGames(mappedRentGames);
        }

        // Fetch F&B Menus
        const { data: menuData, error: menuError } = await supabase.from('menus').select('*');
        if (menuError) throw menuError;

        if (menuData) {
          const mappedMenus = menuData.map((m: any) => ({
            id: m.id,
            name: m.name,
            price: m.price ?? 0,
            category: m.category,
            image: m.image ?? "",
            status: m.status === 'Available' ? 'In Stock' : 'Out of Stock',
            active: m.status === 'Available',
            sold: 0 // Local property for UI if needed
          }));
          setFbMenu(mappedMenus);
        }
      } catch (err) {
        console.error("Gagal mengambil data dari database:", err);
      }
    };
    
    fetchDbData();
  }, []);

  // View mode for pages
  const [gamesView, setGamesView] = useState<"grid" | "list">("grid");
  const [fbView, setFbView] = useState<"grid" | "list">("grid");

  // Modal States for Add/Edit
  const [showFormModal, setShowFormModal] = useState(false);
  const [formType, setFormType] = useState<"game" | "fb">("game");
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<any>(null);

  // Loading/guard states to prevent double-submit
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<any>(null);

  // Form Fields
  const [fieldName, setFieldName] = useState("");
  const [fieldCategory, setFieldCategory] = useState("");
  const [fieldPrice, setFieldPrice] = useState(0);
  const [fieldStock, setFieldStock] = useState(1);
  const [fieldStatus, setFieldStatus] = useState("");
  const [fieldImageUrl, setFieldImageUrl] = useState("");
  const [fieldEmoji, setFieldEmoji] = useState("🎲");
  const [fieldMinPlayers, setFieldMinPlayers] = useState(2);
  const [fieldMaxPlayers, setFieldMaxPlayers] = useState(6);
  const [isDragOver, setIsDragOver] = useState(false);

  // Convert uploaded image file → base64 string
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) setFieldImageUrl(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Confirm delete modal
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "game" | "fb"; id: string } | null>(null);

  const triggerAddGame = () => {
    setFormType("game");
    setFormMode("add");
    setFieldName("");
    setFieldCategory("Strategy");
    setFieldPrice(10000);
    setFieldStock(1);
    setFieldStatus("Available");
    setFieldImageUrl("");
    setFieldEmoji("🎲");
    setFieldMinPlayers(2);
    setFieldMaxPlayers(6);
    setEditId(null);
    setShowFormModal(true);
  };

  const triggerEditGame = (game: any) => {
    setFormType("game");
    setFormMode("edit");
    setEditId(game.id);
    setFieldName(game.name);
    setFieldCategory(game.category);
    setFieldPrice(game.price);
    setFieldStock(game.stock);
    setFieldStatus(game.status);
    setFieldImageUrl(game.image || "");
    setFieldEmoji(game.emoji || "🎲");
    setFieldMinPlayers(game.minPlayers || 2);
    setFieldMaxPlayers(game.maxPlayers || 6);
    setShowFormModal(true);
  };

  const triggerAddFb = () => {
    setFormType("fb");
    setFormMode("add");
    setFieldName("");
    setFieldCategory("Food");
    setFieldPrice(15000);
    setFieldStatus("In Stock");
    setFieldImageUrl("");
    setFieldEmoji("🍛");
    setEditId(null);
    setShowFormModal(true);
  };

  const triggerEditFb = (item: any) => {
    setFormType("fb");
    setFormMode("edit");
    setEditId(item.id);
    setFieldName(item.name);
    setFieldCategory(item.category);
    setFieldPrice(item.price);
    setFieldStatus(item.status);
    setFieldImageUrl(item.image || "");
    setFieldEmoji(item.emoji || "🍛");
    setShowFormModal(true);
  };

  // ── Helper: re-fetch DB data after mutations ──
  const refreshDbData = async () => {
    try {
      const { data: bgData } = await supabase.from('boardgames').select('*');
      if (bgData) {
        const mappedGames = bgData.map((g: any) => ({
          id: g.id, name: g.name || g.title, category: g.category || g.genre,
          stock: g.stock ?? 1, rented: g.rented ?? 0, price: g.price ?? 0,
          status: g.status, active: g.active ?? (g.status === 'Available'),
          image: g.image ?? '', emoji: g.emoji ?? '🎲',
          minPlayers: g.min_players ?? 2, maxPlayers: g.max_players ?? 6
        }));
        setBoardGames(mappedGames);
        setRentGames(mappedGames.map((g: any) => ({ id: `g_${g.id}`, name: g.name, price: g.price, category: g.category, emoji: g.emoji, image: g.image, status: g.status, active: g.active })));
      }
      const { data: menuData } = await supabase.from('menus').select('*');
      if (menuData) {
        setFbMenu(menuData.map((m: any) => ({
          id: m.id, name: m.name, price: m.price ?? 0, category: m.category,
          image: m.image ?? '', status: m.status === 'Available' ? 'In Stock' : 'Out of Stock',
          active: m.status === 'Available', sold: 0, emoji: m.emoji ?? '🍛'
        })));
      }
    } catch (err) { console.error('Refresh DB error:', err); }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fieldName.trim()) return;
    // Guard: prevent double-submit
    if (isSavingForm) return;
    setIsSavingForm(true);

    try {
      if (formType === "game") {
        if (formMode === "add") {
          const { error } = await supabase.from('boardgames').insert({
            name: fieldName, title: fieldName, category: fieldCategory, genre: fieldCategory,
            stock: fieldStock, rented: 0, price: fieldPrice,
            status: fieldStatus, active: fieldStatus === 'Available',
            image: fieldImageUrl, emoji: fieldEmoji,
            min_players: fieldMinPlayers, max_players: fieldMaxPlayers
          });
          if (error) { alert('Gagal tambah game: ' + error.message); return; }
        } else {
          const { error } = await supabase.from('boardgames').update({
            name: fieldName, title: fieldName, category: fieldCategory, genre: fieldCategory,
            stock: fieldStock, price: fieldPrice, status: fieldStatus,
            active: fieldStatus === 'Available', image: fieldImageUrl,
            emoji: fieldEmoji, min_players: fieldMinPlayers, max_players: fieldMaxPlayers
          }).eq('id', editId);
          if (error) { alert('Gagal update game: ' + error.message); return; }
        }
      } else {
        const dbStatus = fieldStatus === 'In Stock' ? 'Available' : 'Unavailable';
        if (formMode === "add") {
          const { error } = await supabase.from('menus').insert({
            name: fieldName, category: fieldCategory, price: fieldPrice, status: dbStatus
          });
          if (error) { alert('Gagal tambah menu: ' + error.message); return; }
        } else {
          const { error } = await supabase.from('menus').update({
            name: fieldName, category: fieldCategory, price: fieldPrice, status: dbStatus
          }).eq('id', editId);
          if (error) { alert('Gagal update menu: ' + error.message); return; }
        }
      }

      setShowFormModal(false);
      await refreshDbData();
    } finally {
      setIsSavingForm(false);
    }
  };

  const confirmDelete = (type: "game" | "fb", id: string) => {
    setDeleteConfirm({ type, id });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    // Guard: prevent double-delete
    if (isDeleting) return;
    setIsDeleting(true);

    // Optimistic UI: remove from local state immediately
    if (deleteConfirm.type === "game") {
      setBoardGames(prev => prev.filter(g => String(g.id) !== String(deleteConfirm.id)));
    } else {
      setFbMenu(prev => prev.filter((m: any) => String(m.id) !== String(deleteConfirm.id)));
    }
    setDeleteConfirm(null);

    try {
      if (deleteConfirm.type === "game") {
        const { error } = await supabase.from('boardgames').delete().eq('id', deleteConfirm.id);
        if (error) { alert('Gagal hapus game: ' + error.message); await refreshDbData(); }
      } else {
        const { error } = await supabase.from('menus').delete().eq('id', deleteConfirm.id);
        if (error) { alert('Gagal hapus menu: ' + error.message); await refreshDbData(); }
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatusGame = async (id: any) => {
    // Guard: prevent rapid toggle on same item
    if (togglingId === id) return;
    const game = boardGames.find(g => g.id === id);
    if (!game) return;
    const newStatus = game.status === 'Available' ? 'Maintenance' : 'Available';

    // Optimistic update: update UI immediately, no lag
    setTogglingId(id);
    setBoardGames(prev => prev.map(g =>
      g.id === id ? { ...g, status: newStatus, active: newStatus === 'Available' } : g
    ));

    try {
      const { error } = await supabase.from('boardgames')
        .update({ status: newStatus, active: newStatus === 'Available' })
        .eq('id', id);
      if (error) {
        // Rollback on error
        setBoardGames(prev => prev.map(g =>
          g.id === id ? { ...g, status: game.status, active: game.active } : g
        ));
        alert('Gagal ubah status: ' + error.message);
      }
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleStatusFb = async (id: any) => {
    // Guard: prevent rapid toggle on same item
    if (togglingId === id) return;
    const item = fbMenu.find((m: any) => m.id === id);
    if (!item) return;
    const newUiStatus = item.status === 'In Stock' ? 'Out of Stock' : 'In Stock';
    const newDbStatus = newUiStatus === 'In Stock' ? 'Available' : 'Unavailable';

    // Optimistic update: update UI immediately, no lag
    setTogglingId(id);
    setFbMenu(prev => prev.map((m: any) =>
      m.id === id ? { ...m, status: newUiStatus, active: newUiStatus === 'In Stock' } : m
    ));

    try {
      const { error } = await supabase.from('menus')
        .update({ status: newDbStatus })
        .eq('id', id);
      if (error) {
        // Rollback on error
        setFbMenu(prev => prev.map((m: any) =>
          m.id === id ? { ...m, status: item.status, active: item.active } : m
        ));
        alert('Gagal ubah status: ' + error.message);
      }
    } finally {
      setTogglingId(null);
    }
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
              {activeTab === "dashboard" && (
                <div className="flex flex-col gap-6">
                  {/* Greeting & Date Overview (matching image) */}
                  <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
                      Good evening, Owner 👋
                    </h1>
                    <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">
                      Tuesday, June 9, 2025 · <span className="text-[#3B82F6]">TODAY'S OVERVIEW</span>
                    </p>
                  </div>

                  {/* Row of 4 Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Revenue Card */}
                    <div className="bg-white rounded-2xl p-5 border-l-4 border-[#3B82F6] border-y border-r border-slate-100 shadow-sm flex flex-col justify-between h-32">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
                          Revenue Today
                        </span>
                        <TrendingUp size={16} className="text-[#3B82F6]" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-[#0F172A] mt-2">
                          Rp 1.245.000
                        </h2>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1.5">
                          <TrendingUp size={10} /> +12% vs yesterday
                        </span>
                      </div>
                    </div>

                    {/* Active Sessions Card */}
                    <div className="bg-white rounded-2xl p-5 border-l-4 border-[#10B981] border-y border-r border-slate-100 shadow-sm flex flex-col justify-between h-32">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
                          Active Sessions
                        </span>
                        <Users size={16} className="text-[#10B981]" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-[#0F172A]">
                          5 tables
                        </h2>
                        <span className="text-[10px] font-medium text-slate-500 mt-1 block">
                          Current occupied game tables
                        </span>
                      </div>
                    </div>

                    {/* F&B Orders Card */}
                    <div className="bg-white rounded-2xl p-5 border-l-4 border-[#3B82F6] border-y border-r border-slate-100 shadow-sm flex flex-col justify-between h-32">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
                          F&B Orders
                        </span>
                        <ShoppingBag size={16} className="text-[#3B82F6]" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-[#0F172A]">
                          28 orders
                        </h2>
                        <span className="text-[10px] font-medium text-slate-500 mt-1 block">
                          Processed cafe orders today
                        </span>
                      </div>
                    </div>

                    {/* New Customers Card */}
                    <div className="bg-white rounded-2xl p-5 border-l-4 border-[#3B82F6] border-y border-r border-slate-100 shadow-sm flex flex-col justify-between h-32">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
                          New Customers
                        </span>
                        <UserPlus size={16} className="text-[#3B82F6]" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-[#0F172A]">
                          8 today
                        </h2>
                        <span className="text-[10px] font-medium text-slate-500 mt-1 block">
                          Newly registered gaming members
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Section: Active Sessions Monitor + Revenue Chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Sessions Monitor (Left, 2 cols width) */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm lg:col-span-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                        <h3 className="font-black text-sm text-[#0F172A] uppercase tracking-wide">
                          Active Sessions Monitor
                        </h3>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 5 active
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="text-[#94A3B8] border-b border-slate-50 font-bold">
                              <th className="pb-3 uppercase tracking-wider">Customer</th>
                              <th className="pb-3 uppercase tracking-wider">Game Title</th>
                              <th className="pb-3 uppercase tracking-wider">Duration</th>
                              <th className="pb-3 uppercase tracking-wider">Time Left</th>
                              <th className="pb-3 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeSessions.map((session) => {
                              const isEndingSoon = session.status === "Ending Soon";
                              return (
                                <tr 
                                  key={session.id} 
                                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                                  style={{
                                    backgroundColor: isEndingSoon ? "rgba(245,158,11,0.02)" : "transparent"
                                  }}
                                >
                                  <td className="py-3.5">
                                    <p className="font-bold text-[#0F172A]">{session.customer}</p>
                                    <span className="text-[10px] font-bold text-blue-500/80">{session.table}</span>
                                  </td>
                                  <td className="py-3.5 font-medium text-slate-600">{session.game}</td>
                                  <td className="py-3.5 text-slate-500">{session.duration}</td>
                                  <td className={`py-3.5 font-bold ${isEndingSoon ? "text-amber-500" : "text-slate-600"}`}>
                                    {session.timeLeft}
                                  </td>
                                  <td className="py-3.5">
                                    <span 
                                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                        isEndingSoon 
                                          ? "text-amber-600 bg-amber-50 border border-amber-200" 
                                          : "text-emerald-600 bg-emerald-50 border border-emerald-100"
                                      }`}
                                    >
                                      {session.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Revenue Chart (Right, 1 col width) */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                        <h3 className="font-black text-sm text-[#0F172A] uppercase tracking-wide">
                          Revenue — Last 7 Days
                        </h3>
                      </div>

                      {/* Pure CSS Bar Chart */}
                      <div className="flex items-end justify-between h-40 pt-4 px-2">
                        {[
                          { day: "Mon", val: 50 },
                          { day: "Tue", val: 60 },
                          { day: "Wed", val: 40 },
                          { day: "Thu", val: 75 },
                          { day: "Fri", val: 90 },
                          { day: "Sat", val: 110 },
                          { day: "Today", val: 70, isToday: true },
                        ].map((bar, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="relative w-7 bg-slate-50 rounded-t-lg h-32 flex items-end">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(bar.val / 110) * 100}%` }}
                                transition={{ delay: i * 0.05, duration: 0.5 }}
                                className={`w-full rounded-t-lg transition-all ${
                                  bar.isToday 
                                    ? "bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300" 
                                    : "bg-gradient-to-t from-[#3B82F6]/80 to-[#60A5FA]/80 group-hover:from-[#3B82F6] group-hover:to-[#60A5FA]"
                                }`}
                              />
                              {/* Hover tooltip */}
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold py-1 px-1.5 rounded shadow-md pointer-events-none transition-opacity whitespace-nowrap z-10">
                                {bar.val}%
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold ${bar.isToday ? "text-[#3B82F6]" : "text-[#94A3B8]"}`}>
                              {bar.day}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-50 pt-4 mt-4">
                        <span>AVERAGE: Rp 940k</span>
                        <span className="text-emerald-500 flex items-center gap-0.5">
                          <TrendingUp size={10} /> +8.4%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Top Games + Recent Transactions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Games This Week */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                        <h3 className="font-black text-sm text-[#0F172A] uppercase tracking-wide">
                          Top Games This Week
                        </h3>
                      </div>
                      <div className="flex flex-col gap-3.5">
                        {topGames.map((game) => (
                          <div key={game.rank} className="flex items-center gap-3">
                            <span className="text-sm font-black text-[#94A3B8] w-5 text-center">
                              {game.rank}
                            </span>
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                              <img src={game.img} alt={game.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs text-[#0F172A] truncate">{game.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{game.plays} plays rented</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-xs text-[#0F172A]">Rp {game.revenue.toLocaleString("id-ID")}</p>
                              <span className="text-[9px] text-emerald-500 font-bold">Popular</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                        <h3 className="font-black text-sm text-[#0F172A] uppercase tracking-wide">
                          Recent Transactions
                        </h3>
                      </div>
                      <div className="flex flex-col gap-3.5">
                        {recentTransactions.map((tx) => (
                          <div key={tx.id} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <ShoppingBag size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-xs text-[#0F172A] truncate">{tx.customer}</p>
                                <span className="text-[9px] text-[#94A3B8] font-bold">{tx.time}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate mt-0.5">{tx.items}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-xs text-[#0F172A]">Rp {tx.amount.toLocaleString("id-ID")}</p>
                              <span className="text-[9px] bg-slate-50 text-slate-400 font-bold px-1 rounded uppercase">
                                {tx.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────── 2. BOARD GAMES INVENTORY ───────────────── */}
              {activeTab === "games" && (
                <div className="flex flex-col gap-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                        <Dices size={20} className="text-blue-600" />
                        Board Games Collection
                      </h2>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {boardGames.length} games · {boardGames.filter(g => g.active).length} aktif · tersambung ke kasir
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
                        <button
                          onClick={() => setGamesView("grid")}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${gamesView === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          <Grid3X3 size={14} />
                        </button>
                        <button
                          onClick={() => setGamesView("list")}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${gamesView === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          <List size={14} />
                        </button>
                      </div>
                      <button
                        onClick={triggerAddGame}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-200 hover:shadow-blue-300"
                      >
                        <Plus size={14} /> Tambah Game
                      </button>
                    </div>
                  </div>

                  {/* Grid View */}
                  {gamesView === "grid" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {boardGames.map((game) => (
                        <motion.div
                          key={game.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${
                            game.active ? "border-slate-100" : "border-slate-200 opacity-70"
                          }`}
                        >
                          {/* Card Image */}
                          <div className="relative h-36 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
                            {game.image ? (
                              <img
                                src={game.image}
                                alt={game.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-1 text-blue-300">
                                <Dices size={32} strokeWidth={1.5} />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">No Image</span>
                              </div>
                            )}
                            {/* Active badge */}
                            <div className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              game.active
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-500 text-white"
                            }`}>
                              {game.active ? "Aktif" : "Nonaktif"}
                            </div>
                            {/* Stock badge */}
                            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                              Stok: {game.stock}
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-3.5 flex flex-col gap-2 flex-1">
                            <div>
                              <p className="font-black text-sm text-[#0F172A] truncate">{game.name}</p>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                                {game.category}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <div>
                                <p className="text-[10px] text-slate-400 font-medium">Harga sewa/jam</p>
                                <p className="text-sm font-black text-[#0F172A]">Rp {game.price.toLocaleString("id-ID")}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-medium">Disewa</p>
                                <p className="text-sm font-black text-[#0F172A]">{game.rented || 0}/{game.stock}</p>
                              </div>
                            </div>

                            {/* Action Row */}
                            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50">
                              {/* Toggle Active */}
                              <button
                                onClick={() => handleToggleStatusGame(game.id)}
                                disabled={togglingId === game.id}
                                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                  togglingId === game.id
                                    ? "bg-slate-100 text-slate-400 cursor-wait"
                                    : game.active
                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                                }`}
                                title={game.active ? "Nonaktifkan" : "Aktifkan"}
                              >
                                {togglingId === game.id ? (
                                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                                    className="w-2.5 h-2.5 border-2 border-slate-300 border-t-slate-500 rounded-full" />
                                ) : (
                                  <Power size={11} />
                                )}
                                {togglingId === game.id ? "Loading..." : game.active ? "Aktif" : "Nonaktif"}
                              </button>
                              <button
                                onClick={() => triggerEditGame(game)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => confirmDelete("game", game.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                title="Hapus"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Add Card Placeholder */}
                      <motion.button
                        onClick={triggerAddGame}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="border-2 border-dashed border-blue-200 rounded-2xl h-56 flex flex-col items-center justify-center gap-2 text-blue-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
                      >
                        <Plus size={24} />
                        <span className="text-xs font-bold">Tambah Game Baru</span>
                      </motion.button>
                    </div>
                  )}

                  {/* List View */}
                  {gamesView === "list" && (
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[#94A3B8] border-b border-slate-100 font-bold uppercase tracking-wider">
                            <th className="px-5 py-3">Game</th>
                            <th className="px-5 py-3">Kategori</th>
                            <th className="px-5 py-3">Stok</th>
                            <th className="px-5 py-3">Harga/Jam</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {boardGames.map((game) => (
                            <tr key={game.id} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${!game.active ? "opacity-60" : ""}`}>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                    {game.image ? (
                                      <img src={game.image} alt={game.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                    ) : (
                                      <Dices size={16} className="text-blue-400" strokeWidth={1.5} />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-[#0F172A]">{game.name}</p>
                                    <p className="text-[10px] text-slate-400">{game.minPlayers || 2}–{game.maxPlayers || 6} pemain</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{game.category}</span>
                              </td>
                              <td className="px-5 py-3.5 font-medium text-slate-600">{game.rented || 0}/{game.stock} disewa</td>
                              <td className="px-5 py-3.5 font-black text-[#0F172A]">Rp {game.price.toLocaleString("id-ID")}</td>
                              <td className="px-5 py-3.5">
                                <button
                                  onClick={() => handleToggleStatusGame(game.id)}
                                  disabled={togglingId === game.id}
                                  className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                                    togglingId === game.id
                                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-wait"
                                      : game.active
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
                                      : "bg-slate-100 text-slate-500 border border-slate-200 cursor-pointer"
                                  }`}
                                >
                                  {togglingId === game.id ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                                      className="w-2.5 h-2.5 border-2 border-slate-300 border-t-slate-500 rounded-full" />
                                  ) : game.active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                                  {togglingId === game.id ? "Loading..." : game.active ? "Aktif" : "Nonaktif"}
                                </button>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button onClick={() => triggerEditGame(game)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
                                    <Edit2 size={13} />
                                  </button>
                                  <button onClick={() => confirmDelete("game", game.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ───────────────── 3. MENU F&B VIEW ───────────────── */}
              {activeTab === "menu" && (
                <div className="flex flex-col gap-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                        <Coffee size={20} className="text-orange-500" />
                        Menu Food & Beverage
                      </h2>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {fbMenu.length} item · {fbMenu.filter(i => i.active).length} tersedia · tersambung ke kasir
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
                        <button
                          onClick={() => setFbView("grid")}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${fbView === "grid" ? "bg-white text-orange-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          <Grid3X3 size={14} />
                        </button>
                        <button
                          onClick={() => setFbView("list")}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${fbView === "list" ? "bg-white text-orange-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          <List size={14} />
                        </button>
                      </div>
                      <button
                        onClick={triggerAddFb}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-orange-100 hover:shadow-orange-200"
                      >
                        <Plus size={14} /> Tambah Menu
                      </button>
                    </div>
                  </div>

                  {/* Category Quick Filter */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {["Semua", "Food", "Drinks", "Snacks"].map(cat => {
                      const count = cat === "Semua" ? fbMenu.length : fbMenu.filter(i => i.category === cat).length;
                      return (
                        <span key={cat} className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500 cursor-default">
                          {cat} ({count})
                        </span>
                      );
                    })}
                  </div>

                  {/* Grid View */}
                  {fbView === "grid" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {fbMenu.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${
                            item.active ? "border-slate-100" : "border-slate-200 opacity-70"
                          }`}
                        >
                          {/* Card Image */}
                          <div className="relative h-32 bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-1 text-orange-300">
                                <Utensils size={28} strokeWidth={1.5} />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-orange-300">No Image</span>
                              </div>
                            )}
                            {/* Status badge */}
                            <div className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              item.active ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                            }`}>
                              {item.active ? "Tersedia" : "Habis"}
                            </div>
                            {/* Category badge */}
                            <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                              {item.category}
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-3.5 flex flex-col gap-2 flex-1">
                            <div>
                              <p className="font-black text-sm text-[#0F172A] truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{item.sold || 0} terjual hari ini</p>
                            </div>

                            <p className="text-base font-black text-orange-500 mt-auto">
                              Rp {item.price.toLocaleString("id-ID")}
                            </p>

                            {/* Action Row */}
                            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50">
                              <button
                                onClick={() => handleToggleStatusFb(item.id)}
                                disabled={togglingId === item.id}
                                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                  togglingId === item.id
                                    ? "bg-slate-100 text-slate-400 cursor-wait"
                                    : item.active
                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                                    : "bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                                }`}
                              >
                                {togglingId === item.id ? (
                                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                                    className="w-2.5 h-2.5 border-2 border-slate-300 border-t-slate-500 rounded-full" />
                                ) : (
                                  <Power size={11} />
                                )}
                                {togglingId === item.id ? "Loading..." : item.active ? "Tersedia" : "Habis"}
                              </button>
                              <button
                                onClick={() => triggerEditFb(item)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => confirmDelete("fb", item.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Add Card Placeholder */}
                      <motion.button
                        onClick={triggerAddFb}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="border-2 border-dashed border-orange-200 rounded-2xl h-52 flex flex-col items-center justify-center gap-2 text-orange-400 hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer"
                      >
                        <Plus size={24} />
                        <span className="text-xs font-bold">Tambah Menu Baru</span>
                      </motion.button>
                    </div>
                  )}

                  {/* List View */}
                  {fbView === "list" && (
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[#94A3B8] border-b border-slate-100 font-bold uppercase tracking-wider">
                            <th className="px-5 py-3">Nama Menu</th>
                            <th className="px-5 py-3">Kategori</th>
                            <th className="px-5 py-3">Terjual</th>
                            <th className="px-5 py-3">Harga</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fbMenu.map((item) => (
                            <tr key={item.id} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${!item.active ? "opacity-60" : ""}`}>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-orange-50 flex items-center justify-center shrink-0">
                                    {item.image ? (
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                    ) : (
                                      <Utensils size={15} className="text-orange-400" strokeWidth={1.5} />
                                    )}
                                  </div>
                                  <p className="font-bold text-[#0F172A]">{item.name}</p>
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{item.category}</span>
                              </td>
                              <td className="px-5 py-3.5 text-slate-500 font-bold">{item.sold || 0} terjual</td>
                              <td className="px-5 py-3.5 font-black text-orange-500">Rp {item.price.toLocaleString("id-ID")}</td>
                              <td className="px-5 py-3.5">
                                <button
                                  onClick={() => handleToggleStatusFb(item.id)}
                                  disabled={togglingId === item.id}
                                  className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                                    togglingId === item.id
                                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-wait"
                                      : item.active
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
                                      : "bg-red-50 text-red-600 border border-red-200 cursor-pointer"
                                  }`}
                                >
                                  {togglingId === item.id ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                                      className="w-2.5 h-2.5 border-2 border-slate-300 border-t-slate-500 rounded-full" />
                                  ) : item.active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                                  {togglingId === item.id ? "Loading..." : item.active ? "Tersedia" : "Habis"}
                                </button>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button onClick={() => triggerEditFb(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
                                    <Edit2 size={13} />
                                  </button>
                                  <button onClick={() => confirmDelete("fb", item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ───────────────── 3.5 CATEGORIES & TABLES VIEW ───────────────── */}
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
        {showFormModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setShowFormModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {/* Modal Header */}
                <div className={`p-5 border-b border-slate-100 flex items-center justify-between rounded-t-3xl ${
                  formType === "game" ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-gradient-to-r from-orange-500 to-amber-500"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                      {formType === "game" ? <Dices size={18} className="text-white" /> : <Utensils size={18} className="text-white" />}
                    </div>
                    <div>
                      <h3 className="text-white font-black text-sm">
                        {formMode === "add" ? "Tambah" : "Edit"} {formType === "game" ? "Board Game" : "Menu F&B"}
                      </h3>
                      <p className="text-white/70 text-[10px] font-medium">
                        {formMode === "add" ? "Data akan tersambung ke kasir otomatis" : "Perubahan tersinkron ke kasir"}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowFormModal(false)} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSaveForm} className="p-5 flex flex-col gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                      Nama {formType === "game" ? "Game" : "Menu"} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fieldName}
                      onChange={e => setFieldName(e.target.value)}
                      placeholder={formType === "game" ? "contoh: Pandemic" : "contoh: Kopi Susu"}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Kategori *</label>
                    <select
                      value={fieldCategory}
                      onChange={e => setFieldCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                    >
                      {formType === "game" ? (
                        <>
                          <option value="Strategy">Strategy</option>
                          <option value="Cooperative">Cooperative</option>
                          <option value="Party">Party Game</option>
                          <option value="Family">Family</option>
                          <option value="Deduction">Deduction</option>
                          <option value="RPG">RPG</option>
                        </>
                      ) : (
                        <>
                          <option value="Food">Food</option>
                          <option value="Drinks">Drinks</option>
                          <option value="Snacks">Snacks</option>
                          <option value="Dessert">Dessert</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                      {formType === "game" ? "Harga Sewa / Jam (Rp)" : "Harga Jual (Rp)"} *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                      <input
                        type="number"
                        required
                        min={0}
                        value={fieldPrice}
                        onChange={e => setFieldPrice(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Game specific: Stock & Players */}
                  {formType === "game" && (
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Stok</label>
                        <input
                          type="number"
                          min={1}
                          value={fieldStock}
                          onChange={e => setFieldStock(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Min Pemain</label>
                        <input
                          type="number"
                          min={1}
                          value={fieldMinPlayers}
                          onChange={e => setFieldMinPlayers(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Max Pemain</label>
                        <input
                          type="number"
                          min={1}
                          value={fieldMaxPlayers}
                          onChange={e => setFieldMaxPlayers(Number(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>
                  )}


                  {/* Image Upload - Drag & Drop */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                      Foto {formType === "game" ? "Game" : "Menu"} (opsional)
                    </label>

                    {fieldImageUrl ? (
                      /* Preview with remove button */
                      <div className="relative w-full h-36 rounded-2xl overflow-hidden border-2 border-slate-200 group">
                        <img
                          src={fieldImageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setFieldImageUrl("")}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <X size={11} /> Hapus Foto
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Drop Zone — label + hidden input (standar HTML5, tidak trigger form submit) */
                      <label
                        className={`flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                          isDragOver
                            ? (formType === "game" ? "border-blue-500 bg-blue-50" : "border-orange-400 bg-orange-50")
                            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                        }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOver(false);
                          const file = e.dataTransfer.files[0];
                          if (file) handleImageFile(file);
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFile(file);
                            e.target.value = "";
                          }}
                        />
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                          isDragOver
                            ? (formType === "game" ? "bg-blue-100" : "bg-orange-100")
                            : "bg-slate-200"
                        }`}>
                          <ImageIcon size={18} className={isDragOver ? (formType === "game" ? "text-blue-600" : "text-orange-500") : "text-slate-400"} />
                        </div>
                        <p className="text-xs font-bold text-slate-500">
                          {isDragOver ? "Lepaskan untuk upload" : "Drag & drop atau klik untuk pilih foto"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP maks. 5MB</p>
                      </label>
                    )}

                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Status</label>
                    <div className="flex gap-2">
                      {(formType === "game"
                        ? [["Available", "Tersedia"], ["Maintenance", "Maintenance"]]
                        : [["In Stock", "Tersedia"], ["Out of Stock", "Habis"]]
                      ).map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFieldStatus(val)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                            fieldStatus === val
                              ? (val === "Available" || val === "In Stock")
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-red-400 bg-red-50 text-red-600"
                              : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kasir sync info */}
                  <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Package size={13} className="text-blue-600" />
                    </div>
                    <p className="text-[10px] text-blue-700 font-semibold leading-relaxed">
                      Data akan otomatis tersinkron ke <strong>halaman kasir</strong> setelah disimpan.
                    </p>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowFormModal(false)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingForm}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${
                        formType === "game"
                          ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                          : "bg-orange-500 hover:bg-orange-600 shadow-orange-100"
                      } ${!isSavingForm ? 'cursor-pointer' : ''}`}
                    >
                      {isSavingForm ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                            className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save size={13} />
                          {formMode === "add" ? "Simpan & Tambah" : "Simpan Perubahan"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRM MODAL ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
                  <Trash2 size={20} className="text-red-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-black text-[#0F172A] text-base">Hapus Item?</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Item ini akan dihapus dari inventori dan juga dari halaman kasir. Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={executeDelete}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
