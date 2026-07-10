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

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const defaultCafeInfo = {
  name: "Cafe Sebangku.id",
  phone: "081234567890",
  instagram: "@sebangku.id",
  address: "Jl. Sebangku No. 24, Yogyakarta",
};
const defaultHours: Record<
  string,
  { open: string; close: string; active: boolean }
> = {
  Senin: { open: "10:00", close: "23:00", active: true },
  Selasa: { open: "10:00", close: "23:00", active: true },
  Rabu: { open: "10:00", close: "23:00", active: true },
  Kamis: { open: "10:00", close: "23:00", active: true },
  Jumat: { open: "10:00", close: "24:00", active: true },
  Sabtu: { open: "09:00", close: "24:00", active: true },
  Minggu: { open: "09:00", close: "22:00", active: true },
};
const defaultPayments = { qris: true, cash: true, transfer: false };

export default function SettingsView() {
  const settingsSections = [
    { id: "info", label: "Informasi Cafe" },
    { id: "hours", label: "Jam Operasional" },
    { id: "payment", label: "Metode Pembayaran" },
    { id: "security", label: "Keamanan Akun" },
    { id: "data", label: "Manajemen Data" },
  ];
  const [activeSection, setActiveSection] = useState("info");
  const [cafeInfo, setCafeInfo] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("cafeInfo") || "null") ||
        defaultCafeInfo
      );
    } catch {
      return defaultCafeInfo;
    }
  });
  const saveCafeInfo = () => {
    localStorage.setItem("cafeInfo", JSON.stringify(cafeInfo));
    alert("Informasi cafe berhasil disimpan!");
  };
  const [hours, setHours] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("cafeHours") || "null") || defaultHours
      );
    } catch {
      return defaultHours;
    }
  });
  const saveHours = () => {
    localStorage.setItem("cafeHours", JSON.stringify(hours));
    alert("Jam operasional berhasil disimpan!");
  };
  const [payments, setPayments] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("cafePayments") || "null") ||
        defaultPayments
      );
    } catch {
      return defaultPayments;
    }
  });
  const savePayments = () => {
    localStorage.setItem("cafePayments", JSON.stringify(payments));
    alert("Metode pembayaran berhasil disimpan!");
  };
  const [ownerPw, setOwnerPw] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [kasirPin, setKasirPin] = useState({ next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pinError, setPinError] = useState("");
  const saveOwnerPw = () => {
    if (ownerPw.next !== ownerPw.confirm) {
      setPwError("Password baru tidak cocok!");
      return;
    }
    if (ownerPw.next.length < 6) {
      setPwError("Minimal 6 karakter!");
      return;
    }
    localStorage.setItem("ownerPassword", ownerPw.next);
    setOwnerPw({ current: "", next: "", confirm: "" });
    setPwError("");
    alert("Password berhasil diubah!");
  };
  const saveKasirPin = () => {
    if (kasirPin.next !== kasirPin.confirm) {
      setPinError("PIN tidak cocok!");
      return;
    }
    if (kasirPin.next.length < 4) {
      setPinError("Minimal 4 digit!");
      return;
    }
    localStorage.setItem("kasirPin", kasirPin.next);
    setKasirPin({ next: "", confirm: "" });
    setPinError("");
    alert("PIN kasir berhasil diubah!");
  };
  const exportAll = () => {
    const data = {
      cafeInfo,
      hours,
      payments,
      games: localStorage.getItem("games"),
      menu: localStorage.getItem("menuFnB"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sebangku_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const resetTransactions = () => {
    if (
      window.confirm(
        "Yakin ingin menghapus semua data transaksi? Aksi ini tidak bisa dibatalkan.",
      )
    ) {
      localStorage.removeItem("transactions");
      alert("Data transaksi berhasil direset.");
    }
  };
  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelCls =
    "block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5";
  const saveBtnCls =
    "bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer";
  const sectionCard =
    "bg-white rounded-2xl border border-slate-100 shadow-sm p-6";
  return (
    <div className="flex gap-6 items-start">
      {/* Sidebar tabs */}
      <div className="hidden lg:flex flex-col gap-1 w-52 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
        {settingsSections.map((s) => (
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
        {settingsSections.map((s) => (
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
            <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">
              Informasi Cafe
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Nama Cafe</label>
                <input
                  className={inputCls}
                  value={cafeInfo.name}
                  onChange={(e) =>
                    setCafeInfo({ ...cafeInfo, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Nomor WhatsApp / Telepon</label>
                <input
                  className={inputCls}
                  value={cafeInfo.phone}
                  onChange={(e) =>
                    setCafeInfo({ ...cafeInfo, phone: e.target.value })
                  }
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className={labelCls}>Instagram</label>
                <input
                  className={inputCls}
                  value={cafeInfo.instagram}
                  onChange={(e) =>
                    setCafeInfo({ ...cafeInfo, instagram: e.target.value })
                  }
                  placeholder="@username"
                />
              </div>
              <div>
                <label className={labelCls}>Alamat Lengkap</label>
                <textarea
                  className={inputCls}
                  rows={3}
                  value={cafeInfo.address}
                  onChange={(e) =>
                    setCafeInfo({ ...cafeInfo, address: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={saveCafeInfo} className={saveBtnCls}>
                  Simpan Informasi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Jam Operasional ── */}
        {activeSection === "hours" && (
          <div className={sectionCard}>
            <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">
              Jam Operasional
            </h3>
            <div className="space-y-3">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50"
                >
                  {/* Toggle */}
                  <button
                    onClick={() =>
                      setHours((h: typeof hours) => ({
                        ...h,
                        [day]: { ...h[day], active: !h[day].active },
                      }))
                    }
                    className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${hours[day].active ? "bg-blue-500" : "bg-slate-300"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${hours[day].active ? "left-5" : "left-0.5"}`}
                    />
                  </button>
                  <span
                    className={`w-16 text-sm font-bold shrink-0 ${hours[day].active ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
                  >
                    {day}
                  </span>
                  {hours[day].active ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={hours[day].open}
                        onChange={(e) =>
                          setHours((h: typeof hours) => ({
                            ...h,
                            [day]: { ...h[day], open: e.target.value },
                          }))
                        }
                        className="flex-1 px-2.5 py-1.5 rounded-lg text-sm border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                      />
                      <span className="text-[#94A3B8] text-xs">–</span>
                      <input
                        type="time"
                        value={hours[day].close}
                        onChange={(e) =>
                          setHours((h: typeof hours) => ({
                            ...h,
                            [day]: { ...h[day], close: e.target.value },
                          }))
                        }
                        className="flex-1 px-2.5 py-1.5 rounded-lg text-sm border border-slate-200 bg-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-[#94A3B8] font-medium">
                      Tutup
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={saveHours} className={saveBtnCls}>
                Simpan Jam Operasional
              </button>
            </div>
          </div>
        )}

        {/* ── Metode Pembayaran ── */}
        {activeSection === "payment" && (
          <div className={sectionCard}>
            <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">
              Metode Pembayaran
            </h3>
            <div className="space-y-3">
              {(
                [
                  {
                    key: "qris",
                    label: "QRIS",
                    desc: "QR Code pembayaran digital",
                    color: "bg-blue-50 text-blue-600 border-blue-200",
                  },
                  {
                    key: "cash",
                    label: "Tunai (Cash)",
                    desc: "Pembayaran langsung dengan uang tunai",
                    color: "bg-green-50 text-green-600 border-green-200",
                  },
                  {
                    key: "transfer",
                    label: "Transfer Bank",
                    desc: "Transfer manual ke rekening cafe",
                    color: "bg-purple-50 text-purple-600 border-purple-200",
                  },
                ] as {
                  key: keyof typeof payments;
                  label: string;
                  desc: string;
                  color: string;
                }[]
              ).map(({ key, label, desc, color }) => (
                <div
                  key={key as string}
                  className={`flex items-center justify-between p-4 rounded-xl border ${payments[key] ? color : "bg-slate-50 text-slate-400 border-slate-200"} transition-all`}
                >
                  <div>
                    <p className="font-bold text-sm">{label}</p>
                    <p className="text-xs opacity-70 mt-0.5">{desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setPayments((p: typeof payments) => ({
                        ...p,
                        [key]: !p[key],
                      }))
                    }
                    className={`w-11 h-6 rounded-full relative transition-colors ${payments[key] ? "bg-blue-500" : "bg-slate-300"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${payments[key] ? "left-6" : "left-1"}`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={savePayments} className={saveBtnCls}>
                Simpan Metode Pembayaran
              </button>
            </div>
          </div>
        )}

        {/* ── Keamanan Akun ── */}
        {activeSection === "security" && (
          <div className="space-y-4">
            {/* Ubah Password Owner */}
            <div className={sectionCard}>
              <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">
                Ubah Password Owner
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Password Saat Ini</label>
                  <input
                    type="password"
                    className={inputCls}
                    value={ownerPw.current}
                    onChange={(e) =>
                      setOwnerPw({ ...ownerPw, current: e.target.value })
                    }
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className={labelCls}>Password Baru</label>
                  <input
                    type="password"
                    className={inputCls}
                    value={ownerPw.next}
                    onChange={(e) =>
                      setOwnerPw({ ...ownerPw, next: e.target.value })
                    }
                    placeholder="Minimal 6 karakter"
                  />
                </div>
                <div>
                  <label className={labelCls}>Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    className={inputCls}
                    value={ownerPw.confirm}
                    onChange={(e) =>
                      setOwnerPw({ ...ownerPw, confirm: e.target.value })
                    }
                    placeholder="Ulangi password baru"
                  />
                </div>
                {pwError && (
                  <p className="text-xs text-red-500 font-medium">{pwError}</p>
                )}
                <div className="flex justify-end pt-1">
                  <button onClick={saveOwnerPw} className={saveBtnCls}>
                    Simpan Password
                  </button>
                </div>
              </div>
            </div>

            {/* Ubah PIN Kasir */}
            <div className={sectionCard}>
              <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">
                Ubah PIN Kasir
              </h3>
              <p className="text-xs text-[#64748B] mb-4">
                PIN ini digunakan kasir untuk mengakses halaman kasir.
              </p>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>PIN Baru</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    className={inputCls}
                    value={kasirPin.next}
                    onChange={(e) =>
                      setKasirPin({ ...kasirPin, next: e.target.value })
                    }
                    placeholder="Minimal 4 digit"
                  />
                </div>
                <div>
                  <label className={labelCls}>Konfirmasi PIN Baru</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    className={inputCls}
                    value={kasirPin.confirm}
                    onChange={(e) =>
                      setKasirPin({ ...kasirPin, confirm: e.target.value })
                    }
                    placeholder="Ulangi PIN"
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-red-500 font-medium">{pinError}</p>
                )}
                <div className="flex justify-end pt-1">
                  <button onClick={saveKasirPin} className={saveBtnCls}>
                    Simpan PIN Kasir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Manajemen Data ── */}
        {activeSection === "data" && (
          <div className="space-y-4">
            <div className={sectionCard}>
              <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">
                Export Data
              </h3>
              <p className="text-sm text-[#64748B] mb-4">
                Download semua data cafe (menu, game, pengaturan) dalam format
                JSON untuk backup.
              </p>
              <button
                onClick={exportAll}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Backup JSON
              </button>
            </div>

            <div className={sectionCard}>
              <h3 className="text-base font-black text-[#0F172A] mb-5 pb-3 border-b border-slate-100">
                Reset Data Transaksi
              </h3>
              <p className="text-sm text-[#64748B] mb-4">
                Hapus semua riwayat transaksi.{" "}
                <strong>Aksi ini tidak dapat dibatalkan.</strong>
              </p>
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="shrink-0"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p className="text-xs text-red-600 font-medium flex-1">
                  Data yang sudah dihapus tidak bisa dikembalikan. Pastikan kamu
                  sudah melakukan backup terlebih dahulu.
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={resetTransactions}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
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
