import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { supabase } from "../../lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  ArrowLeft, ArrowRight, AlertCircle, CheckCircle2,
} from "lucide-react";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({
  label, type, value, onChange, placeholder, icon, rightSlot, error, autoComplete,
}: {
  label: string; type: string; value: string; onChange: (v: string) => void;
  placeholder: string; icon: React.ReactNode; rightSlot?: React.ReactNode;
  error?: string; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="text-xs font-bold text-[#64748B] uppercase tracking-widest"
      >
        {label}
      </label>
      <div
        className="relative flex items-center rounded-xl transition-all duration-200"
        style={{
          border: error ? "1.5px solid #EF4444" : focused ? "1.5px solid #3B82F6" : "1.5px solid #E2E8F0",
          background: focused ? "#F8FAFF" : "#F8FAFC",
        }}
      >
        <span className="absolute left-3.5 text-[#94A3B8]">{icon}</span>
        <input
          type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full pl-10 pr-10 py-3.5 bg-transparent focus:outline-none text-[#1E293B] placeholder:text-[#CBD5E1]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}
        />
        {rightSlot && <span className="absolute right-3.5">{rightSlot}</span>}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 text-red-500 text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <AlertCircle size={12} />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Right Branding Panel (shared) ───────────────────────────────────────────
function BrandingPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="hidden md:flex w-[340px] shrink-0 flex-col items-center justify-center relative overflow-hidden rounded-3xl m-2"
      style={{ background: "linear-gradient(160deg, #1E3A5F 0%, #0F2340 50%, #0A1628 100%)" }}
    >
      {/* Animated rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-blue-400/20"
          style={{ width: 100 + i * 80, height: 100 + i * 80, top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        />
      ))}

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{ left: `${15 + (i * 11) % 70}%`, top: `${10 + (i * 17) % 80}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        />
      ))}

      {/* Logo + branding */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
        className="relative z-10 flex flex-col items-center justify-center px-8 text-center gap-4"
      >
        <motion.img
          src={sebangkuLogo}
          alt="Sebangku Game Cafe"
          className="object-contain"
          style={{ width: "200px", height: "auto", filter: "drop-shadow(0 4px 20px rgba(96,165,250,0.4))" }}
          animate={{ filter: ["drop-shadow(0 4px 20px rgba(96,165,250,0.4))", "drop-shadow(0 4px 30px rgba(96,165,250,0.8))", "drop-shadow(0 4px 20px rgba(96,165,250,0.4))"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-white/50 text-xs font-semibold uppercase tracking-[0.2em] mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Selamat Datang di
          </p>
          <p className="text-white font-black text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
            BoardVerse Cafe
          </p>
          <p className="text-white/40 text-xs mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Your ultimate board game experience
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Register Page ───────────────────────────────────────────────────────
export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get("table") || "";

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState<{
    name?: string; phone?: string; email?: string;
    password?: string; confirmPassword?: string;
  }>({});

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState("");

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Nama wajib diisi";
    if (!phone.trim()) e.phone = "Nomor HP wajib diisi";
    else if (!/^08\d{8,11}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Format nomor HP tidak valid (contoh: 08xxxxxxxxxx)";
    if (!email) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Format email tidak valid";
    if (!password) e.password = "Password wajib diisi";
    else if (password.length < 6) e.password = "Password minimal 6 karakter";
    if (!confirmPassword) e.confirmPassword = "Konfirmasi password wajib diisi";
    else if (password !== confirmPassword) e.confirmPassword = "Password tidak cocok";
    return e;
  };

  const handleRegister = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setGeneralError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role: "Customer"
          }
        }
      });

      if (error) {
        setIsLoading(false);
        setGeneralError("Registrasi gagal: " + error.message);
        return;
      }

      if (data.user) {
        const parts = name.trim().split(" ");
        const firstName = parts[0];
        const lastName = parts.slice(1).join(" ");
        
        const { error: profileError } = await supabase
          .from('customer_profiles')
          .insert({
            user_id: data.user.id,
            nama_depan: firstName,
            nama_belakang: lastName,
            phone: phone,
            level: 1,
            kunjungan: 0,
            waktu_bermain: 0,
            win_rate: 0,
            status: "Active · Regular",
            member_sejak: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
          });
          
        if (profileError) {
          console.error("Gagal membuat profil customer:", profileError);
        }
      }

      setIsLoading(false);

      // Tampilkan layar sukses
      setRegisteredName(name.trim().split(" ")[0]);
      setIsSuccess(true);

    } catch (error: any) {
      setIsLoading(false);
      setGeneralError("Koneksi ke server gagal. " + error.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8"
      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #EFF6FF 100%)" }}
    >
      {/* Back button — hidden on success */}
      {!isSuccess && (
        <motion.button
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
          onClick={() => navigate(tableId ? `/login?table=${tableId}` : "/login")}
          className="fixed top-6 left-6 flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] transition-colors cursor-pointer z-10"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-semibold">Kembali ke Login</span>
        </motion.button>
      )}

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[940px] bg-white rounded-3xl shadow-2xl overflow-hidden flex"
        style={{ boxShadow: "0 24px 80px rgba(59,130,246,0.12)" }}
      >
        {/* ── Left Panel ── */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-14 md:py-10 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ── SUCCESS SCREEN ── */}
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-start gap-6"
              >
                {/* Logo badge */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)" }}
                  >
                    <span className="text-white text-sm font-black">S</span>
                  </div>
                  <span style={{ fontFamily: "'Poppins', sans-serif" }} className="font-black text-[#0F172A] text-base">
                    Sebangku
                  </span>
                </div>

                {/* Checkmark + message */}
                <div className="w-full flex flex-col items-center gap-3 py-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
                    className="w-16 h-16 rounded-full border-4 border-emerald-400 flex items-center justify-center"
                    style={{ background: "rgba(52,211,153,0.08)" }}
                  >
                    <CheckCircle2 size={32} className="text-emerald-500" strokeWidth={2.5} />
                  </motion.div>

                  <div className="text-center">
                    <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-2xl font-black text-[#0F172A] mb-1">
                      Registrasi Berhasil! 🎉
                    </h1>
                    <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[#1E293B] text-sm font-medium">
                      Halo, <span className="font-black text-[#0F172A]">{registeredName}</span>!<br />
                      Akun Anda telah berhasil dibuat.
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[#3B82F6] text-xs mt-1.5">
                      Silakan login menggunakan email dan password yang telah Anda daftarkan.
                    </p>
                  </div>
                </div>

                {/* Feature card */}
                <div className="w-full rounded-2xl p-5" style={{ border: "1.5px solid #E2E8F0", background: "#F8FAFC" }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-black text-[#64748B] uppercase tracking-widest mb-3">
                    Sebagai Customer Anda Bisa:
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      { icon: "📋", text: "Melihat riwayat sesi bermain" },
                      { icon: "📝", text: "Menulis catatan di game logbook" },
                      { icon: "📊", text: "Melihat statistik bermain Anda" },
                      { icon: "🧾", text: "Mengakses riwayat transaksi" },
                    ].map((f) => (
                      <div key={f.text} className="flex items-center gap-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <span className="text-sm">{f.icon}</span>
                        <span className="text-sm text-[#1E293B] font-medium">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ translateY: -3, boxShadow: "0 10px 28px rgba(59,130,246,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(tableId ? `/login?table=${tableId}` : "/login")}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl cursor-pointer"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: "linear-gradient(135deg, #3B82F6, #60A5FA)",
                    color: "white", fontWeight: 700, fontSize: "15px",
                    boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
                  }}
                >
                  Masuk Sekarang <ArrowRight size={18} />
                </motion.button>
              </motion.div>

            ) : (
              /* ── FORM SCREEN ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-0"
              >
                {/* Header */}
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)" }}>
                      <span className="text-white text-sm font-black">S</span>
                    </div>
                    <span style={{ fontFamily: "'Poppins', sans-serif" }} className="font-black text-[#0F172A] text-base">
                      Sebangku
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(tableId ? `/login?table=${tableId}` : "/login")}
                    className="flex items-center gap-1.5 text-[#3B82F6] text-sm font-semibold mb-5 hover:underline cursor-pointer"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <ArrowLeft size={14} /> Kembali ke Login
                  </button>

                  <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-3xl font-black text-[#0F172A] mb-1.5">
                    Daftar Akun Player
                  </h1>
                  <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[#3B82F6] text-sm font-medium">
                    Buat akun untuk mencatat riwayat bermain Anda
                  </p>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-4">
                  <InputField label="Nama Lengkap" type="text" value={name} onChange={setName}
                    placeholder="Masukkan nama lengkap" icon={<User size={16} />} error={errors.name} autoComplete="name" />
                  <InputField label="Nomor HP" type="tel" value={phone} onChange={setPhone}
                    placeholder="08xxxxxxxxxx" icon={<Phone size={16} />} error={errors.phone} autoComplete="tel" />
                  <InputField label="Email" type="email" value={email} onChange={setEmail}
                    placeholder="contoh@email.com" icon={<Mail size={16} />} error={errors.email} autoComplete="email" />
                  <InputField
                    label="Password" type={showPassword ? "text" : "password"} value={password} onChange={setPassword}
                    placeholder="Minimal 6 karakter" icon={<Lock size={16} />} error={errors.password} autoComplete="new-password"
                    rightSlot={
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors cursor-pointer" tabIndex={-1}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                  <InputField
                    label="Konfirmasi Password" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={setConfirmPassword}
                    placeholder="Ulangi password" icon={<Lock size={16} />} error={errors.confirmPassword} autoComplete="new-password"
                    rightSlot={
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors cursor-pointer" tabIndex={-1}>
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />

                  {/* Terms */}
                  <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#64748B]">
                    Dengan mendaftar, Anda menyetujui{" "}
                    <Link to="/terms" className="text-[#3B82F6] font-bold hover:underline">Syarat & Ketentuan</Link>{" "}
                    Sebangku.
                  </p>

                  {/* General error from API */}
                  <AnimatePresence>
                    {generalError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2.5 text-sm"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <AlertCircle size={15} />
                        {generalError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    onClick={handleRegister} disabled={isLoading}
                    whileHover={!isLoading ? { translateY: -3, boxShadow: "0 10px 28px rgba(59,130,246,0.4)" } : {}}
                    whileTap={!isLoading ? { scale: 0.97 } : {}}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl cursor-pointer transition-all"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      background: isLoading ? "#E2E8F0" : "linear-gradient(135deg, #3B82F6, #60A5FA)",
                      color: isLoading ? "#94A3B8" : "white", fontWeight: 700, fontSize: "15px",
                      boxShadow: isLoading ? "none" : "0 4px 16px rgba(59,130,246,0.3)",
                    }}
                  >
                    {isLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <> Buat Akun <ArrowRight size={18} /> </>
                    )}
                  </motion.button>
                </div>

                {/* Login link */}
                <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-center text-sm text-[#64748B] mt-5">
                  Sudah punya akun?{" "}
                  <Link to={tableId ? `/login?table=${tableId}` : "/login"} className="text-[#3B82F6] font-bold hover:underline">
                    Masuk Sekarang →
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Branding Panel ── */}
        <BrandingPanel />
      </motion.div>
    </div>
  );
}
