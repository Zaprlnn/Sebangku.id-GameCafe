import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";

// ─── Input Field Component ────────────────────────────────────────────────────
function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  rightSlot,
  error,
  autoComplete,
  onKeyDown,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
  error?: string;
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
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
          border: error
            ? "1.5px solid #EF4444"
            : focused
            ? "1.5px solid #3B82F6"
            : "1.5px solid #E2E8F0",
          background: focused ? "#F8FAFF" : "#F8FAFC",
        }}
      >
        <span className="absolute left-3.5 text-[#94A3B8]">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          className="w-full pl-10 pr-10 py-3.5 bg-transparent focus:outline-none text-[#1E293B] placeholder:text-[#CBD5E1]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}
        />
        {rightSlot && <span className="absolute right-3.5">{rightSlot}</span>}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 text-red-500 text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <AlertCircle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Register Page ───────────────────────────────────────────────────────
export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get("table") || "";

  // State untuk menampung seluruh data form pendaftaran
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    general?: string;
  }>({});

  // Fungsi Validasi Client-side
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) newErrors.fullName = "Nama lengkap wajib diisi";
    
    if (!username.trim()) {
      newErrors.username = "Username wajib diisi";
    } else if (username.includes(" ") || username.includes("@")) {
      newErrors.username = "Username tidak boleh mengandung spasi atau karakter '@'";
    }

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!phone.trim()) newErrors.phone = "Nomor telepon wajib diisi";

    if (!password) {
      newErrors.password = "Password wajib diisi";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    return newErrors;
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // 1. Validasi duplikasi: Cek apakah username sudah dipakai orang lain
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("username")
        .ilike("username", username.trim())
        .maybeSingle();

      if (existingUser) {
        setErrors({ username: "Username ini sudah digunakan oleh orang lain." });
        setIsLoading(false);
        return;
      }

      // 2. Daftarkan kredensial akun ke Supabase Auth internal
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setErrors({ general: authError.message });
        setIsLoading(false);
        return;
      }

      // 3. Masukkan profil lengkap user ke tabel public.users
      if (authData?.user) {
       // KODE LAMA YANG LALU (Hapus/Ganti bagian ini)
// ✨ KODE BARU (Menggunakan UPDATE karena baris sudah dibuat oleh Trigger)
const { error: dbError } = await supabase
  .from("users")
  .update({
    username: username.trim().toLowerCase(),
    name: fullName.trim(),
    phone: phone.trim(),
  })
  .eq("id", authData.user.id); // Mencari baris yang ID-nya sama dengan akun auth baru

        if (dbError) {
          console.error("Gagal insert profile:", dbError.message);
          setErrors({ general: "Akun auth berhasil dibuat, tetapi gagal menyimpan data ke profil database." });
          setIsLoading(false);
          return;
        }
      }

      // 4. Registrasi sukses, arahkan ke halaman login
      alert("Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.");
      navigate(`/login${tableId ? `?table=${tableId}` : ""}`);

    } catch (err) {
      setErrors({ general: "Terjadi kesalahan sistem saat memproses registrasi." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8"
      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #EFF6FF 100%)" }}
    >
      {/* Tombol Kembali */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="fixed top-5 left-5 flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] transition-colors cursor-pointer z-10"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-semibold hidden sm:inline">Kembali</span>
      </motion.button>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[900px] bg-white rounded-3xl shadow-2xl overflow-hidden flex"
        style={{ minHeight: "580px", boxShadow: "0 24px 80px rgba(59,130,246,0.12)" }}
      >
        {/* ── Left Panel: Form ───────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-14 md:py-10">
          {/* Header */}
          <div className="mb-6">
            <p
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-[#3B82F6] font-bold text-sm mb-1"
            >
              Join Us
            </p>
            <h1
              style={{ fontFamily: "'Poppins', sans-serif" }}
              className="text-4xl font-black text-[#0F172A] mb-1"
            >
              Sign Up
            </h1>
            <p
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-[#64748B] text-sm"
            >
              Lengkapi data di bawah untuk membuat akun baru
            </p>
          </div>

          {/* General Error Alert */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2.5 text-sm mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <AlertCircle size={15} />
                {errors.general}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields Group */}
          <div className="flex flex-col gap-3.5">
            <InputField
              label="Nama Lengkap"
              type="text"
              value={fullName}
              onChange={setFullName}
              placeholder="Masukkan nama lengkap Anda"
              icon={<User size={16} />}
              error={errors.fullName}
              onKeyDown={handleKeyDown}
            />

            <InputField
              label="Username"
              type="text"
              value={username}
              onChange={setUsername}
              placeholder="Buat username unik (tanpa spasi)"
              icon={<User size={16} />}
              error={errors.username}
              onKeyDown={handleKeyDown}
            />

            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Masukkan alamat email aktif"
              icon={<Mail size={16} />}
              error={errors.email}
              autoComplete="email"
              onKeyDown={handleKeyDown}
            />

            <InputField
              label="Nomor Telepon"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="Contoh: 08123456789"
              icon={<Phone size={16} />}
              error={errors.phone}
              onKeyDown={handleKeyDown}
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Minimal 6 karakter"
              icon={<Lock size={16} />}
              autoComplete="new-password"
              error={errors.password}
              onKeyDown={handleKeyDown}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Submit Button */}
            <motion.button
              onClick={() => handleRegister()}
              disabled={isLoading}
              whileHover={!isLoading ? { translateY: -3, boxShadow: "0 10px 28px rgba(59,130,246,0.4)" } : {}}
              whileTap={!isLoading ? { scale: 0.97 } : {}}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl cursor-pointer transition-all text-white font-bold text-[15px] mt-2"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: isLoading ? "#E2E8F0" : "linear-gradient(135deg, #3B82F6, #60A5FA)",
                boxShadow: isLoading ? "none" : "0 4px 16px rgba(59,130,246,0.3)",
              }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  Daftar Akun
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>

          {/* Footer Link */}
          <p
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-center text-sm text-[#64748B] mt-6"
          >
            Sudah memiliki akun?{" "}
            <Link
              to={`/login${tableId ? `?table=${tableId}` : ""}`}
              className="text-[#3B82F6] font-bold hover:underline"
            >
              Masuk Di Sini
            </Link>
          </p>
        </div>

        {/* ── Right Panel: Branding ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex w-[320px] shrink-0 flex-col items-center justify-center relative overflow-hidden rounded-3xl m-2"
          style={{
            background: "linear-gradient(160deg, #1E3A5F 0%, #0F2340 50%, #0A1628 100%)",
          }}
        >
          {/* Efek Lingkaran Dekoratif */}
          <div
            className="absolute w-72 h-72 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #3B82F6, transparent)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Logo & Info Samping */}
          <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
            <img
              src={sebangkuLogo}
              alt="Sebangku Game Cafe"
              className="object-contain w-[140px]"
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}
            />

            <div>
              <h2
                style={{ fontFamily: "'Poppins', sans-serif" }}
                className="text-white font-black text-xl mb-1"
              >
                Board Game Cafe
              </h2>
              <p
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-white/70 text-xs font-medium leading-relaxed"
              >
                Daftar sekali untuk akses pesanan makanan, booking board game, dan kumpulkan poin reward!
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}