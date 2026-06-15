import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, User, Lock, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react"; 
import { supabase } from "../../lib/supabase"; 
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.576c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.576 9 3.576z" fill="#EA4335"/>
    </svg>
  );
}

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
      <label style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-bold text-[#64748B] uppercase tracking-widest">
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
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1 text-red-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <AlertCircle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get("table") || "";

  // Menggunakan nama 'identifier' karena bisa diisi username ataupun email
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!identifier.trim()) newErrors.identifier = "Username atau Email wajib diisi";
    if (!password) newErrors.password = "Password wajib diisi";
    return newErrors;
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    const inputData = identifier.trim();
    let loginEmail = inputData;

    try {
      // 1. DETEKSI OTOMATIS: Jika input TIDAK mengandung '@', artinya ini adalah USERNAME
      if (!inputData.includes("@")) {
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("email")
          .ilike("username", inputData)
          .maybeSingle();

        if (profileError || !userProfile?.email) {
          setErrors({ general: "Username tidak ditemukan." });
          setIsLoading(false);
          return;
        }
        
        // Tukar username dengan email yang didapat dari database
        loginEmail = userProfile.email;
      }

      // 2. Eksekusi Login ke Supabase Auth (Baik input awal email / hasil tukar dari username)
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (authError) {
        setErrors({ general: "Password salah atau kredensial tidak valid." });
        return;
      }

      navigate(tableId ? `/app?table=${tableId}` : "/app");
      
    } catch (err) {
      setErrors({ general: "Terjadi kesalahan pada sistem." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + (tableId ? `/app?table=${tableId}` : "/app"),
        },
      });
      if (error) setErrors({ general: error.message });
    } catch (err) {
      setErrors({ general: "Gagal masuk menggunakan Google." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #EFF6FF 100%)" }}>
      <motion.button onClick={() => navigate("/")} className="fixed top-5 left-5 flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] transition-colors cursor-pointer z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <ArrowLeft size={18} />
        <span className="text-sm font-semibold hidden sm:inline">Kembali</span>
      </motion.button>

      <motion.div className="w-full max-w-[900px] bg-white rounded-3xl shadow-2xl overflow-hidden flex" style={{ minHeight: "520px", boxShadow: "0 24px 80px rgba(59,130,246,0.12)" }}>
        <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-14 md:py-12">
          <div className="mb-8">
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[#3B82F6] font-bold text-sm mb-1">Board Game Cafe</p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-4xl font-black text-[#0F172A] mb-2">Welcome</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[#64748B] text-sm">Masuk dengan Username atau Email Anda</p>
          </div>

          <AnimatePresence>
            {errors.general && (
              <motion.div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2.5 text-sm mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <AlertCircle size={15} />
                {errors.general}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-4">
            <InputField
              label="Username / Email"
              type="text"
              value={identifier}
              onChange={setIdentifier}
              placeholder="Masukkan username atau email"
              icon={<User size={16} />}
              error={errors.identifier}
              autoComplete="username"
              onKeyDown={handleKeyDown}
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Masukkan password"
              icon={<Lock size={16} />}
              autoComplete="current-password"
              error={errors.password}
              onKeyDown={handleKeyDown}
              rightSlot={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors cursor-pointer" tabIndex={-1}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <div className="flex justify-end -mt-1">
              <Link to={`/forgot-password${tableId ? `?table=${tableId}` : ""}`} style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#3B82F6] font-semibold hover:underline">Lupa password?</Link>
            </div>

            <motion.button
              onClick={() => handleLogin()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl cursor-pointer transition-all text-white font-bold text-[15px]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: isLoading ? "#E2E8F0" : "linear-gradient(135deg, #3B82F6, #60A5FA)",
                boxShadow: isLoading ? "none" : "0 4px 16px rgba(59,130,246,0.3)",
              }}
            >
              {isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <><p>Sign In</p><ArrowRight size={18} /></>}
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#94A3B8] font-medium">atau</span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            <motion.button onClick={handleGoogleLogin} disabled={isLoading} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-[#E2E8F0] bg-white cursor-pointer transition-all text-[#1E293B] font-semibold text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <GoogleIcon />
              Lanjutkan dengan Google
            </motion.button>
          </div>

          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-center text-sm text-[#64748B] mt-6">
            Belum punya akun? <Link to={`/register${tableId ? `?table=${tableId}` : ""}`} className="text-[#3B82F6] font-bold hover:underline">Daftar Sekarang →</Link>
          </p>
        </div>

        {/* Right Branding Panel */}
        <div className="hidden md:flex w-[320px] shrink-0 flex-col items-center justify-center relative overflow-hidden rounded-3xl m-2" style={{ background: "linear-gradient(160deg, #1E3A5F 0%, #0F2340 50%, #0A1628 100%)" }}>
          <img src={sebangkuLogo} alt="Logo" className="object-contain w-[140px] mb-4" />
          <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-white font-black text-xl">Board Game Cafe</h2>
        </div>
      </motion.div>
    </div>
  );
}