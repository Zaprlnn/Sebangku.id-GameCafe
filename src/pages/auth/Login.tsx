import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { supabase } from "../../lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";
import ownerPhoto from "../../assets/images/owner_photo.png";

// ─── Google Icon SVG ──────────────────────────────────────────────────────────
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

// ─── Floating Orb ─────────────────────────────────────────────────────────────
function FloatingOrb({ size, x, y, delay, color }: { size: number; x: string; y: string; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color, filter: "blur(40px)", opacity: 0.35 }}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({
  label, type, value, onChange, placeholder, icon, rightSlot, error, autoComplete, delay = 0,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string;
  icon: React.ReactNode; rightSlot?: React.ReactNode;
  error?: string; autoComplete?: string; delay?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      className="flex flex-col gap-1.5"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <label style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-bold text-[#64748B] uppercase tracking-widest">
        {label}
      </label>
      <motion.div
        className="relative flex items-center rounded-xl transition-all duration-200"
        animate={{
          border: error ? "1.5px solid #EF4444" : focused ? "1.5px solid #3B82F6" : "1.5px solid #E2E8F0",
          background: focused ? "#F8FAFF" : "#F8FAFC",
          boxShadow: focused ? "0 0 0 4px rgba(59,130,246,0.1)" : "none",
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          className="absolute left-3.5 text-[#94A3B8]"
          animate={{ color: focused ? "#3B82F6" : error ? "#EF4444" : "#94A3B8", scale: focused ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-10 pr-10 py-3.5 bg-transparent focus:outline-none text-[#1E293B] placeholder:text-[#CBD5E1]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}
        />
        {rightSlot && <span className="absolute right-3.5">{rightSlot}</span>}
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 text-red-500 text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <AlertCircle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get("table") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Username/Email wajib diisi";
    if (!password) newErrors.password = "Password wajib diisi";
    else if (password.length < 6) newErrors.password = "Password minimal 6 karakter";
    return newErrors;
  };

  const handleLogin = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setIsLoading(false);
        setErrors({ general: "Gagal login. " + error.message });
        return;
      }

      setIsLoading(false);
      setLoginSuccess(true);
      
      const role = data.user?.user_metadata?.role || "Customer";

      const userData = {
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.email,
        username: data.user.email,
        role: role,
      };

      // Save authenticated user data
      localStorage.setItem("sebangku_user", JSON.stringify(userData));

      await new Promise((r) => setTimeout(r, 900));

      if (role === "Kasir") {
        navigate(tableId ? `/app/kasir?table=${tableId}` : "/app/kasir");
      } else if (role === "Owner") {
        navigate(tableId ? `/app/owner?table=${tableId}` : "/app/owner");
      } else {
        navigate(tableId ? `/app/customer?table=${tableId}` : "/app/customer");
      }
    } catch (error: any) {
      setIsLoading(false);
      setErrors({ general: "Koneksi ke server gagal. " + error.message });
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    navigate(tableId ? `/app/customer?table=${tableId}` : "/app/customer");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  // Detect if owner is typing
  const isOwnerEmail = email.toLowerCase().includes("owner");

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #EFF6FF 100%)" }}
    >
      {/* ── Animated background orbs ── */}
      <FloatingOrb size={350} x="-8%" y="-10%" delay={0} color="radial-gradient(circle, #BFDBFE, transparent)" />
      <FloatingOrb size={280} x="70%" y="60%" delay={2} color="radial-gradient(circle, #C7D2FE, transparent)" />
      <FloatingOrb size={200} x="80%" y="-15%" delay={1.5} color="radial-gradient(circle, #BAE6FD, transparent)" />
      <FloatingOrb size={180} x="10%" y="75%" delay={3} color="radial-gradient(circle, #DDD6FE, transparent)" />

      {/* ── Animated grid dots ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #93C5FD 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.25,
        }}
      />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="fixed top-5 left-5 flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] transition-colors cursor-pointer z-10 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-semibold hidden sm:inline">Kembali</span>
      </motion.button>

      {/* ── Success overlay flash ── */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1E3A5F, #0F2340)" }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center"
              >
                <CheckCircle2 size={40} className="text-emerald-400" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white font-black text-2xl"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Login Berhasil!
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/60 text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Mengalihkan ke dashboard...
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "linear" }}
                className="h-1 bg-emerald-400 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[920px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex relative z-10"
        style={{ minHeight: "540px", boxShadow: "0 32px 80px rgba(59,130,246,0.15), 0 0 0 1px rgba(255,255,255,0.8)" }}
      >
        {/* ── Left: Form Panel ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-14 md:py-12">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[#3B82F6] font-bold text-sm mb-1">
              Board Game Cafe
            </p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-4xl font-black text-[#0F172A] mb-2">
              Welcome Back 👋
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[#64748B] text-sm">
              Masuk dengan akun email Anda
            </p>
          </motion.div>

          {/* Owner detected hint */}
          <AnimatePresence>
            {isOwnerEmail && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 mb-4 overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-200 shrink-0">
                  <img src={ownerPhoto} alt="Owner" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="text-blue-700 font-bold text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Login sebagai Owner</p>
                  <p className="text-blue-500 text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Kamu akan diarahkan ke Owner Dashboard</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-auto w-2 h-2 rounded-full bg-blue-500"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* General error */}
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

          {/* Form */}
          <div className="flex flex-col gap-4">
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="contoh@boardverse.com"
              icon={<Mail size={16} />}
              error={errors.email}
              autoComplete="email"
              delay={0.2}
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
              delay={0.3}
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

            {/* Forgot password */}
            <motion.div
              className="flex justify-end -mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to={`/forgot-password${tableId ? `?table=${tableId}` : ""}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-sm text-[#3B82F6] font-semibold hover:underline"
              >
                Lupa password?
              </Link>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              onClick={handleLogin}
              onKeyDown={handleKeyDown}
              disabled={isLoading || loginSuccess}
              whileHover={!isLoading ? { translateY: -3, boxShadow: "0 12px 32px rgba(59,130,246,0.45)" } : {}}
              whileTap={!isLoading ? { scale: 0.97 } : {}}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl cursor-pointer transition-all overflow-hidden relative"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: loginSuccess
                  ? "linear-gradient(135deg, #10B981, #059669)"
                  : isLoading
                  ? "#E2E8F0"
                  : "linear-gradient(135deg, #3B82F6, #60A5FA)",
                color: isLoading ? "#94A3B8" : "white",
                fontWeight: 700,
                fontSize: "15px",
                boxShadow: isLoading ? "none" : "0 4px 16px rgba(59,130,246,0.3)",
              }}
            >
              {/* Shimmer on loading */}
              {isLoading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
              )}
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Memproses...</span>
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle2 size={18} />
                  Berhasil!
                </>
              ) : (
                <>
                  Sign In
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight size={18} />
                  </motion.span>
                </>
              )}
            </motion.button>

            {/* Divider */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#94A3B8] font-medium">
                atau
              </span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </motion.div>

            {/* Google OAuth */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              whileHover={{ translateY: -2, boxShadow: "0 6px 16px rgba(0,0,0,0.10)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-[#E2E8F0] bg-white cursor-pointer transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px", color: "#1E293B" }}
            >
              <GoogleIcon />
              Lanjutkan dengan Google
            </motion.button>
          </div>

          {/* Register link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-center text-sm text-[#64748B] mt-6"
          >
            Belum punya akun?{" "}
            <Link to={`/register${tableId ? `?table=${tableId}` : ""}`} className="text-[#3B82F6] font-bold hover:underline">
              Daftar Sekarang →
            </Link>
          </motion.p>

          {tableId && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-center text-xs text-[#94A3B8] mt-2"
            >
              Atau{" "}
              <button
                onClick={() => navigate(`/app?table=${tableId}&mode=guest`)}
                className="text-[#94A3B8] underline cursor-pointer hover:text-[#64748B] transition-colors"
              >
                lanjut sebagai tamu
              </button>{" "}
              tanpa akun
            </motion.p>
          )}
        </div>

        {/* ── Right: Branding Panel ─────────────────────────────── */}
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
      </motion.div>
    </div>
  );
}
