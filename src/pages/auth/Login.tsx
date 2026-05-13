import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

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
        className="text-sm font-semibold text-[#1C1410]"
      >
        {label}
      </label>
      <div
        className="relative flex items-center rounded-xl transition-all duration-200"
        style={{
          border: error
            ? "2px solid #EF4444"
            : focused
            ? "2px solid #45A1FD"
            : "2px solid #E5E7EB",
          background: focused ? "#FFFAF8" : "#F9F9F9",
        }}
      >
        <span className="absolute left-3.5 text-[#9CA3AF]">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-10 pr-10 py-3.5 bg-transparent focus:outline-none text-[#1C1410] placeholder:text-[#C4C4C4]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px" }}
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
  const tableId = searchParams.get("table") || "T01";

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

    // Mock login — replace with Supabase auth
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    navigate(`/app?table=${tableId}`);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Mock OAuth — replace with Supabase Google OAuth
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    navigate(`/app?table=${tableId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ background: "linear-gradient(160deg, #EBF5FF 0%, #FFE8D9 100%)" }}
    >
      {/* Back button */}
      <div className="px-5 pt-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/scan?table=${tableId}`)}
          className="flex items-center gap-2 text-[#6B4436] cursor-pointer"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Kembali</span>
        </motion.button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-[#45A1FD] rounded-2xl mb-4 shadow-lg"
              style={{ boxShadow: "0 8px 24px rgba(69,161,253,0.35)" }}
            >
              <span className="text-2xl">🎲</span>
            </motion.div>
            <h1
              style={{ fontFamily: "'Fraunces', serif", fontSize: "28px" }}
              className="font-bold text-[#1C1410] leading-tight"
            >
              Masuk ke Sebangku
            </h1>
            <p
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-[#6B4436] text-sm mt-1.5"
            >
              Meja <span className="text-[#45A1FD] font-semibold">{tableId}</span> menunggumu!
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4">
            {/* General error */}
            <AnimatePresence>
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2.5 text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <AlertCircle size={15} />
                  {errors.general}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google OAuth */}
            <motion.button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              whileHover={{ translateY: -3, boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 border-[#E5E7EB] bg-white cursor-pointer transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C1410" }}
            >
              <GoogleIcon />
              Lanjutkan dengan Google
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-xs text-[#9CA3AF] font-medium"
              >
                atau dengan email
              </span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            {/* Email */}
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="nama@email.com"
              icon={<Mail size={16} />}
              error={errors.email}
              autoComplete="email"
            />

            {/* Password */}
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
                  className="text-[#9CA3AF] hover:text-[#45A1FD] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <Link
                to={`/forgot-password?table=${tableId}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-sm text-[#45A1FD] font-medium hover:underline"
              >
                Lupa password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              onClick={handleLogin}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              whileHover={!isLoading ? { translateY: -4, boxShadow: "0 10px 28px rgba(69,161,253,0.4)" } : {}}
              whileTap={!isLoading ? { scale: 0.97 } : {}}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl cursor-pointer transition-all"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: isLoading ? "#E5E7EB" : "linear-gradient(135deg, #45A1FD, #82C2FF)",
                color: isLoading ? "#9CA3AF" : "white",
                fontWeight: 700,
                fontSize: "15px",
                boxShadow: isLoading ? "none" : "0 4px 16px rgba(69,161,253,0.3)",
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
                  Masuk
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>

          {/* Register link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-center text-sm text-[#6B4436] mt-5"
          >
            Belum punya akun?{" "}
            <Link
              to={`/register?table=${tableId}`}
              className="text-[#45A1FD] font-bold hover:underline"
            >
              Daftar gratis &amp; dapat 100 Poin! 🎉
            </Link>
          </motion.p>

          {/* Guest hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-center text-xs text-[#9CA3AF] mt-2"
          >
            Atau{" "}
            <button
              onClick={() => navigate(`/app?table=${tableId}&mode=guest`)}
              className="text-[#9CA3AF] underline cursor-pointer hover:text-[#6B4436] transition-colors"
            >
              lanjut sebagai tamu
            </button>{" "}
            tanpa akun
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

