import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import sebangkuLogo from "../../assets/images/logo_sebangku_cafee.png";

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

// ─── Input Field ──────────────────────────────────────────────────────────────
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

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get("table") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Format email tidak valid";
    if (!password) newErrors.password = "Password wajib diisi";
    else if (password.length < 6) newErrors.password = "Password minimal 6 karakter";
    return newErrors;
  };

  const handleLogin = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    navigate(tableId ? `/app?table=${tableId}` : "/app");
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    navigate(tableId ? `/app?table=${tableId}` : "/app");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8"
      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #EFF6FF 100%)" }}
    >
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
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
        style={{ minHeight: "520px", boxShadow: "0 24px 80px rgba(59,130,246,0.12)" }}
      >
        {/* ── Left: Form Panel ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-14 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <p
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-[#3B82F6] font-bold text-sm mb-1"
            >
              Board Game Cafe
            </p>
            <h1
              style={{ fontFamily: "'Poppins', sans-serif" }}
              className="text-4xl font-black text-[#0F172A] mb-2"
            >
              Welcome
            </h1>
            <p
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-[#64748B] text-sm"
            >
              Masuk dengan akun email Anda
            </p>
          </div>

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
            <div className="flex justify-end -mt-1">
              <Link
                to={`/forgot-password${tableId ? `?table=${tableId}` : ""}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-sm text-[#3B82F6] font-semibold hover:underline"
              >
                Lupa password?
              </Link>
            </div>

            {/* Sign In Button */}
            <motion.button
              onClick={handleLogin}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              whileHover={!isLoading ? { translateY: -3, boxShadow: "0 10px 28px rgba(59,130,246,0.4)" } : {}}
              whileTap={!isLoading ? { scale: 0.97 } : {}}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl cursor-pointer transition-all"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: isLoading ? "#E2E8F0" : "linear-gradient(135deg, #3B82F6, #60A5FA)",
                color: isLoading ? "#94A3B8" : "white",
                fontWeight: 700,
                fontSize: "15px",
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
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-xs text-[#94A3B8] font-medium"
              >
                atau
              </span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            {/* Google OAuth */}
            <motion.button
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
          <p
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-center text-sm text-[#64748B] mt-6"
          >
            Belum punya akun?{" "}
            <Link
              to={`/register${tableId ? `?table=${tableId}` : ""}`}
              className="text-[#3B82F6] font-bold hover:underline"
            >
              Daftar Sekarang →
            </Link>
          </p>

          {/* Guest mode */}
          {tableId && (
            <p
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
            </p>
          )}
        </div>

        {/* ── Right: Branding Panel ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex w-[320px] shrink-0 flex-col items-center justify-center relative overflow-hidden rounded-3xl m-2"
          style={{
            background: "linear-gradient(160deg, #1E3A5F 0%, #0F2340 50%, #0A1628 100%)",
          }}
        >
          {/* Background decorative circles */}
          <div
            className="absolute w-72 h-72 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #3B82F6, transparent)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute w-48 h-48 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #60A5FA, transparent)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
            className="relative z-10 flex flex-col items-center gap-6 px-8 text-center"
          >
            <img
              src={sebangkuLogo}
              alt="Sebangku Game Cafe"
              className="object-contain"
              style={{
                width: "140px",
                height: "auto",
                imageRendering: "auto",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
              }}
            />

            <div>
              <h2
                style={{ fontFamily: "'Poppins', sans-serif" }}
                className="text-white font-black text-xl mb-1 leading-tight"
              >
                Board Game Cafe
              </h2>
              <p
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-white/70 text-sm font-medium leading-relaxed"
              >
                Experience Management<br />System
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-col gap-2 w-full mt-2">
              {[
                { icon: "🎲", text: "50+ Koleksi Board Game" },
                { icon: "⭐", text: "Sistem Loyalty & Poin" },
                { icon: "🍟", text: "Kuliner Lezat & Taiyaki" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="text-base">{item.icon}</span>
                  <span
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    className="text-white/80 text-xs font-semibold"
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
