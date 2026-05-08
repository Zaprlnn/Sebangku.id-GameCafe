import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail, Lock, Eye, EyeOff, AlertCircle,
  CheckSquare, Square, Shield, ChevronRight,
} from "lucide-react";

// ─── Mock credentials ─────────────────────────────────────────────────────────
const VALID_CREDENTIALS = [
  { email: "admin@sebangku.com",  password: "admin123",  role: "Super Admin",  name: "Admin Utama" },
  { email: "owner@sebangku.com",  password: "owner2026", role: "Owner",        name: "Pemilik Cafe" },
  { email: "manager@sebangku.com",password: "mgr2026",   role: "Manager",      name: "Manajer Operasional" },
];

// ─── Version tag ──────────────────────────────────────────────────────────────
const APP_VERSION = "v2.0.1";
const BUILD_DATE  = "Mei 2026";

// ─── Floating particle ────────────────────────────────────────────────────────
function Particle({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        backgroundColor: "rgba(69,161,253,0.15)",
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.15, 0.35, 0.15],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// ─── Background decoration ────────────────────────────────────────────────────
const PARTICLES = [
  { x: 8,  y: 15, size: 80,  delay: 0    },
  { x: 85, y: 10, size: 120, delay: 1.2  },
  { x: 92, y: 65, size: 60,  delay: 2.4  },
  { x: 5,  y: 80, size: 100, delay: 0.8  },
  { x: 50, y: 5,  size: 50,  delay: 1.8  },
  { x: 70, y: 90, size: 90,  delay: 3.1  },
  { x: 20, y: 50, size: 40,  delay: 2.0  },
];

// ─── Dice SVG logo ────────────────────────────────────────────────────────────
function DiceLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="url(#diceGrad)" />
      <rect x="2" y="2" width="36" height="36" rx="8" fill="url(#diceGrad2)" />
      {/* Dots */}
      <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
      <circle cx="28" cy="12" r="3" fill="white" opacity="0.9" />
      <circle cx="20" cy="20" r="3" fill="white" opacity="0.9" />
      <circle cx="12" cy="28" r="3" fill="white" opacity="0.9" />
      <circle cx="28" cy="28" r="3" fill="white" opacity="0.9" />
      <defs>
        <linearGradient id="diceGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#45A1FD" />
          <stop offset="1" stopColor="#82C2FF" />
        </linearGradient>
        <linearGradient id="diceGrad2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B2B" stopOpacity="0" />
          <stop offset="1" stopColor="#1C1410" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Input component ──────────────────────────────────────────────────────────
function AdminInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  rightSlot,
  error,
  autoComplete,
  disabled,
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
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px", color: "#4B5563" }}
      >
        {label}
      </label>
      <div
        className="flex items-center gap-3 rounded-xl px-3.5 transition-all duration-200"
        style={{
          height: "48px",
          backgroundColor: error ? "#FEF2F2" : focused ? "#FFFBFF" : "#F9FAFB",
          border: error
            ? "1.5px solid #EF4444"
            : focused
            ? "1.5px solid #45A1FD"
            : "1.5px solid #E5E7EB",
          boxShadow: focused && !error ? "0 0 0 3px rgba(69,161,253,0.12)" : "none",
        }}
      >
        <span style={{ color: error ? "#EF4444" : focused ? "#45A1FD" : "#9CA3AF" }}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none text-sm text-[#1C1410] placeholder:text-[#C4C4C4]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        {rightSlot}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-red-500"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [remember, setRemember]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [shake, setShake]         = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const cardRef = useRef<HTMLDivElement>(null);

  // Check for remembered session on mount
  useEffect(() => {
    const remembered = localStorage.getItem("sbk_admin_remember");
    if (remembered) {
      const { email: savedEmail } = JSON.parse(remembered);
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const validate = () => {
    const errs: typeof fieldErrors = {};
    if (!email.trim()) errs.email = "Email tidak boleh kosong";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Format email tidak valid";
    if (!password.trim()) errs.password = "Password tidak boleh kosong";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validate()) {
      triggerShake();
      return;
    }

    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1100));

    const match = VALID_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );

    if (!match) {
      setLoading(false);
      setError("Email atau password yang kamu masukkan salah.");
      setFieldErrors({
        email: " ",
        password: " ",
      });
      triggerShake();
      return;
    }

    // Save remember preference
    if (remember) {
      localStorage.setItem("sbk_admin_remember", JSON.stringify({ email: match.email }));
    } else {
      localStorage.removeItem("sbk_admin_remember");
    }

    // Save session
    sessionStorage.setItem(
      "sbk_admin_session",
      JSON.stringify({ name: match.name, role: match.role, email: match.email, loginAt: Date.now() })
    );

    setLoading(false);
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#1C1410" }}
    >
      {/* ── Background decoration ──────────────────────────────────────── */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Radial glow behind card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(69,161,253,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(69,161,253,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(69,161,253,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Login Card ────────────────────────────────────────────────── */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: shake ? [-8, 8, -6, 6, -4, 4, 0] : 0,
        }}
        transition={
          shake
            ? { duration: 0.55, ease: "easeInOut" }
            : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
        }
        className="relative w-full mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxWidth: "420px" }}
      >
        {/* Orange top accent stripe */}
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, #45A1FD, #82C2FF, #45A1FD)" }}
        />

        <div className="px-8 pt-8 pb-8">
          {/* ── Logo block ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center gap-3 mb-8"
          >
            {/* Logo + brand */}
            <div className="flex items-center gap-3">
              <DiceLogo size={44} />
              <div>
                <h1
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#1C1410",
                    lineHeight: 1.1,
                  }}
                >
                  Sebangku
                </h1>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#45A1FD",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Board Game Cafe
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-gray-100" />
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ backgroundColor: "#1C1410" }}
              >
                <Shield size={11} className="text-white" style={{ color: "#82C2FF" }} />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#82C2FF",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Admin Panel
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Version */}
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "#9CA3AF",
              }}
            >
              {APP_VERSION} · Dashboard Manajemen · {BUILD_DATE}
            </p>
          </motion.div>

          {/* ── Form ─────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Global error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 4 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 overflow-hidden"
                >
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#DC2626",
                      }}
                    >
                      Login gagal
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        color: "#EF4444",
                      }}
                    >
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <AdminInput
              label="Email Admin"
              type="email"
              value={email}
              onChange={(v) => { setEmail(v); setError(null); setFieldErrors((p) => ({ ...p, email: undefined })); }}
              placeholder="admin@sebangku.com"
              icon={<Mail size={16} />}
              error={fieldErrors.email && fieldErrors.email !== " " ? fieldErrors.email : undefined}
              autoComplete="email"
              disabled={loading}
            />

            {/* Password */}
            <AdminInput
              label="Password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(v) => { setPassword(v); setError(null); setFieldErrors((p) => ({ ...p, password: undefined })); }}
              placeholder="••••••••"
              icon={<Lock size={16} />}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors shrink-0"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              error={fieldErrors.password && fieldErrors.password !== " " ? fieldErrors.password : undefined}
              autoComplete="current-password"
              disabled={loading}
            />

            {/* Remember checkbox */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setRemember((p) => !p)}
              className="flex items-center gap-2.5 cursor-pointer w-fit"
              disabled={loading}
            >
              <AnimatePresence mode="wait">
                {remember ? (
                  <motion.span
                    key="checked"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <CheckSquare size={18} className="text-[#45A1FD]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="unchecked"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                  >
                    <Square size={18} className="text-gray-300" />
                  </motion.span>
                )}
              </AnimatePresence>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: remember ? "#1C1410" : "#6B7280",
                  fontWeight: remember ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                Ingat perangkat ini
              </span>
            </motion.button>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="relative w-full h-12 rounded-xl flex items-center justify-center gap-2.5 overflow-hidden cursor-pointer mt-1"
              style={{
                background: loading
                  ? "linear-gradient(135deg, #E5E7EB, #D1D5DB)"
                  : "linear-gradient(135deg, #45A1FD 0%, #82C2FF 100%)",
                boxShadow: loading ? "none" : "0 4px 20px rgba(69,161,253,0.38)",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {/* Shimmer on hover */}
              {!loading && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
              )}

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-white block"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Shield size={16} className="text-white" />
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      Masuk sebagai Admin
                    </span>
                    <ChevronRight size={16} className="text-white/80" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* ── Footer hint ───────────────────────────────────────────── */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid #F3F4F6" }}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "#9CA3AF",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Akses terbatas untuk staf Sebangku.{" "}
              <br />
              Lupa password? Hubungi{" "}
              <span style={{ color: "#45A1FD", fontWeight: 600 }}>IT Support</span>.
            </p>

            {/* Back to customer app */}
            <motion.a
              href="/app/beranda?table=T01"
              whileHover={{ x: 3 }}
              className="flex items-center justify-center gap-1.5 mt-3 cursor-pointer"
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "#C4C4C4",
                }}
              >
                ← Kembali ke Aplikasi Pelanggan
              </span>
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* ── Bottom watermark ───────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-0 right-0 text-center"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11px",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        © 2026 Sebangku Board Game Cafe · {APP_VERSION}
      </motion.p>
    </div>
  );
}

