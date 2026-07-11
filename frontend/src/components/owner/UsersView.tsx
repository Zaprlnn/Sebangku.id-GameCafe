import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Save,
  X,
  Settings,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

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

export default function UsersView() {
  const [users, setUsers] = useState<KasirUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<KasirUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KasirUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [form, setForm] = useState<UserForm>({
    name: "",
    username: "",
    password: "",
    phone: "",
  });
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
  useEffect(() => {
    fetchUsers();
  }, []);
  const openAdd = () => {
    setEditUser(null);
    setForm({ name: "", username: "", password: "", phone: "" });
    setFormError("");
    setShowPw(false);
    setShowModal(true);
  };
  const openEdit = (u: KasirUser) => {
    setEditUser(u);
    setForm({
      name: u.name,
      username: u.username,
      password: u.password,
      phone: u.phone || "",
    });
    setFormError("");
    setShowPw(false);
    setShowModal(true);
  };
  const validateForm = () => {
    if (!form.name.trim()) return "Nama wajib diisi";
    if (!form.username.trim()) return "Email/Username wajib diisi";
    if (!editUser && !form.password.trim()) return "Password wajib diisi";
    if (form.password && form.password.length < 6)
      return "Password minimal 6 karakter";
    return "";
  };
  const handleSave = async () => {
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }

    setSaving(true);
    setFormError("");

    if (editUser) {
      const updates: Partial<UserForm> = {
        name: form.name,
        username: form.username,
        phone: form.phone,
      };
      if (form.password) updates.password = form.password;

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", editUser.id);
      if (error) showToast("Gagal update: " + error.message, "error");
      else {
        showToast("Akun kasir berhasil diperbarui!");
        setShowModal(false);
        fetchUsers();
      }
    } else {
      const { error } = await supabase.from("users").insert({
        name: form.name,
        username: form.username,
        password: form.password,
        phone: form.phone,
        role: "Kasir",
      });
      if (error) showToast("Gagal tambah: " + error.message, "error");
      else {
        showToast("Akun kasir berhasil dibuat!");
        setShowModal(false);
        fetchUsers();
      }
    }
    setSaving(false);
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", deleteTarget.id);
    if (error) showToast("Gagal hapus: " + error.message, "error");
    else {
      showToast("Akun kasir berhasil dihapus!");
      fetchUsers();
    }
    setDeleteTarget(null);
    setDeleting(false);
  };
  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelCls =
    "block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5";
  return (
    <div className="flex flex-col gap-5">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
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
          <p className="text-xs text-[#64748B] mt-0.5">
            Kelola akun kasir yang bisa mengakses sistem
          </p>
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
          {
            label: "Total Kasir",
            value: users.length,
            color: "text-blue-600",
            bg: "bg-blue-50 border-blue-100",
          },
          {
            label: "Aktif",
            value: users.length,
            color: "text-emerald-600",
            bg: "bg-emerald-50 border-emerald-100",
          },
          {
            label: "Dibuat Bulan Ini",
            value: users.filter(
              (u) =>
                new Date(u.created_at).getMonth() === new Date().getMonth(),
            ).length,
            color: "text-purple-600",
            bg: "bg-purple-50 border-purple-100",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border rounded-2xl p-4`}>
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">
              {s.label}
            </p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#94A3B8] gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full"
            />
            Memuat data...
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#94A3B8]">
            <Users size={40} strokeWidth={1} />
            <p className="text-sm font-semibold">Belum ada akun kasir</p>
            <button
              onClick={openAdd}
              className="text-blue-600 text-xs font-bold hover:underline cursor-pointer"
            >
              + Tambah sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {[
                    "Nama",
                    "Email / Username",
                    "No. Telepon",
                    "Dibuat",
                    "Aksi",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[11px] font-black text-[#94A3B8] uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
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
                          <p className="font-bold text-[#0F172A] text-sm">
                            {u.name}
                          </p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                            Kasir
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#64748B] text-xs font-medium">
                      {u.username}
                    </td>
                    <td className="px-5 py-4 text-[#64748B] text-xs">
                      {u.phone || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-5 py-4 text-[#94A3B8] text-xs whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                    <h3 className="text-white font-black text-base">
                      {editUser ? "Edit Akun Kasir" : "Tambah Akun Kasir"}
                    </h3>
                    <p className="text-blue-100 text-xs mt-0.5">
                      {editUser
                        ? `Mengedit: ${editUser.name}`
                        : "Buat akun kasir baru"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className={labelCls}>Nama Lengkap</label>
                    <input
                      className={inputCls}
                      placeholder="contoh: Kasir Utama"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email / Username</label>
                    <input
                      className={inputCls}
                      placeholder="kasir@sebangku.id"
                      type="email"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      {editUser
                        ? "Password Baru (kosongkan jika tidak diubah)"
                        : "Password"}
                    </label>
                    <div className="relative">
                      <input
                        className={inputCls + " pr-10"}
                        placeholder={
                          editUser
                            ? "Kosongkan jika tidak diubah"
                            : "Minimal 6 karakter"
                        }
                        type={showPw ? "text" : "password"}
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>No. Telepon (opsional)</label>
                    <input
                      className={inputCls}
                      placeholder="08xxxxxxxxxx"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                  {formError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-red-600 text-xs font-medium">
                      <AlertCircle size={14} /> {formError}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[#64748B] text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Menyiampan...
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        {editUser ? "Simpan Perubahan" : "Buat Akun"}
                      </>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              onClick={() => setDeleteTarget(null)}
            />
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
                <h3 className="text-lg font-black text-[#0F172A] mb-1">
                  Hapus Akun Kasir?
                </h3>
                <p className="text-sm text-[#64748B] mb-5">
                  Akun <strong>{deleteTarget.name}</strong> akan dihapus
                  permanen dan tidak bisa dikembalikan.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[#64748B] text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
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
