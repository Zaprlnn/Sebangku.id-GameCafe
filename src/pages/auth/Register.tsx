import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft,
  ArrowRight, AlertCircle, CheckCircle2, Gift,
} from "lucide-react";

// ─── Google Icon ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.576c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.576 9 3.576z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Password strength indicator ─────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Min. 8 karakter", ok: password.length >= 8 },
    { label: "Huruf besar", ok: /[A-Z]/.test(password) },
    { label: "Angka", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["#EF4444", "#F59E0B", "#22C55E"];
  const labels = ["Lemah", "Sedang", "Kuat"];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-1.5 space-y-1.5"
    >
      {/* Bars */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-gray-200">
            <motion.div
              className="h-full rounded-full"
              animate={{ width: i < score ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: colors[score - 1] || "#E5E7EB" }}
            />
          </div>
        ))}
      </div>
      {/* Label + checks */}
      <div className="flex items-center justify-between flex-wrap gap-x-3 gap-y-1">
        <span
          style={{ fontFamily: "'DM Sans', sans-serif", color: colors[score - 1] || "#9CA3AF" }}
          className="text-xs font-semibold"
        >
          {score > 0 ? labels[score - 1] : ""}
        </span>
        <div className="flex gap-2">
          {checks.map((c) => (
            <span
              key={c.label}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="flex items-center gap-0.5 text-xs"
            >
              <CheckCircle2
                size={10}
                className={c.ok ? "text-emerald-500" : "text-gray-300"}
              />
              <span className={c.ok ? "text-emerald-600" : "text-gray-400"}>{c.label}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
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
  hint,
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
  hint?: string;
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
          border: error ? "2px solid #EF4444" : focused ? "2px solid #45A1FD" : "2px solid #E5E7EB",
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
      {hint && !error && (
        <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF]">
          {hint}
        </p>
      )}
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

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  namaLengkap: string;
  email: string;
  noHP: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  namaLengkap?: string;
  email?: string;
  noHP?: string;
  password?: string;
  confirmPassword?: string;
}

// ─── Main Register Page ───────────────────────────────────────────────────────
export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get("table") || "T01";

  const [form, setForm] = useState<FormData>({
    namaLengkap: "",
    email: "",
    noHP: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (field: keyof FormData) => (val: string) => {
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.namaLengkap.trim()) errs.namaLengkap = "Nama lengkap wajib diisi";
    else if (form.namaLengkap.trim().length < 3) errs.namaLengkap = "Nama minimal 3 karakter";

    if (!form.email) errs.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Format email tidak valid";

    if (!form.noHP) errs.noHP = "Nomor HP wajib diisi";
    else if (!/^(\+62|08)\d{8,12}$/.test(form.noHP.replace(/\s|-/g, "")))
      errs.noHP = "Format: 08xx atau +62xx";

    if (!form.password) errs.password = "Password wajib diisi";
    else if (form.password.length < 8) errs.password = "Password minimal 8 karakter";

    if (!form.confirmPassword) errs.confirmPassword = "Konfirmasi password wajib diisi";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Password tidak cocok";

    return errs;
  };

  const handleRegister = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!agreeTerms) return;

    setIsLoading(true);
    // Mock register — replace with Supabase auth.signUp
    await new Promise((r) => setTimeout(r, 1600));
    setIsLoading(false);

    navigate(
      `/onboarding?table=${tableId}&name=${encodeURIComponent(form.namaLengkap.split(" ")[0])}`
    );
  };

  const canSubmit = agreeTerms && !isLoading;

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ background: "linear-gradient(160deg, #EBF5FF 0%, #FFE8D9 100%)" }}
    >
      {/* Back */}
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

      <div className="flex-1 flex flex-col items-center px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-[#45A1FD] rounded-2xl mb-4 shadow-lg"
              style={{ boxShadow: "0 8px 24px rgba(69,161,253,0.35)" }}
            >
              <span className="text-2xl">🎉</span>
            </motion.div>
            <h1
              style={{ fontFamily: "'Fraunces', serif", fontSize: "26px" }}
              className="font-bold text-[#1C1410] leading-tight"
            >
              Bergabung Sekarang
            </h1>
            <p
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-[#6B4436] text-sm mt-1"
            >
              Daftar dan langsung dapat poin pertamamu
            </p>

            {/* Welcome bonus badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 18 }}
              className="inline-flex items-center gap-2 bg-[#45A1FD] text-white px-4 py-1.5 rounded-full mt-3 shadow"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Gift size={14} />
              <span className="text-sm font-semibold">+100 Poin Selamat Datang ✨</span>
            </motion.div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4">
            {/* Google */}
            <motion.button
              onClick={() => navigate(`/onboarding?table=${tableId}`)}
              whileHover={{ translateY: -3, boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 border-[#E5E7EB] bg-white cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px", color: "#1C1410" }}
            >
              <GoogleIcon />
              Daftar dengan Google
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF] font-medium">
                atau isi form
              </span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            {/* Nama Lengkap */}
            <InputField
              label="Nama Lengkap"
              type="text"
              value={form.namaLengkap}
              onChange={setField("namaLengkap")}
              placeholder="Masukkan nama lengkapmu"
              icon={<User size={16} />}
              error={errors.namaLengkap}
              autoComplete="name"
            />

            {/* Email */}
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={setField("email")}
              placeholder="nama@email.com"
              icon={<Mail size={16} />}
              error={errors.email}
              autoComplete="email"
            />

            {/* No HP */}
            <InputField
              label="Nomor HP"
              type="tel"
              value={form.noHP}
              onChange={setField("noHP")}
              placeholder="08xx atau +62xx"
              icon={<Phone size={16} />}
              error={errors.noHP}
              hint="Untuk notifikasi pesanan & promo"
              autoComplete="tel"
            />

            {/* Password */}
            <div>
              <InputField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={setField("password")}
                placeholder="Min. 8 karakter"
                icon={<Lock size={16} />}
                error={errors.password}
                autoComplete="new-password"
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
              <AnimatePresence>
                {form.password && <PasswordStrength password={form.password} />}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <InputField
              label="Konfirmasi Password"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={setField("confirmPassword")}
              placeholder="Ulangi password"
              icon={<Lock size={16} />}
              error={errors.confirmPassword}
              autoComplete="new-password"
              rightSlot={
                <div className="flex items-center gap-1.5">
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <CheckCircle2 size={15} className="text-emerald-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-[#9CA3AF] hover:text-[#45A1FD] transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              }
            />

            {/* T&C Checkbox */}
            <div
              className="flex items-start gap-3 mt-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <button
                type="button"
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                  agreeTerms
                    ? "bg-[#45A1FD] border-[#45A1FD]"
                    : "bg-white border-[#E5E7EB] hover:border-[#45A1FD]"
                }`}
              >
                {agreeTerms && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                )}
              </button>
              <p className="text-sm text-[#6B4436] leading-relaxed">
                Saya menyetujui{" "}
                <span className="text-[#45A1FD] font-semibold cursor-pointer hover:underline">
                  Syarat &amp; Ketentuan
                </span>{" "}
                dan{" "}
                <span className="text-[#45A1FD] font-semibold cursor-pointer hover:underline">
                  Kebijakan Privasi
                </span>{" "}
                Sebangku Board Game Cafe
              </p>
            </div>

            {/* Submit */}
            <motion.button
              onClick={handleRegister}
              disabled={!canSubmit}
              whileHover={canSubmit ? { translateY: -4, boxShadow: "0 10px 28px rgba(69,161,253,0.4)" } : {}}
              whileTap={canSubmit ? { scale: 0.97 } : {}}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl cursor-pointer transition-all mt-1"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: canSubmit
                  ? "linear-gradient(135deg, #45A1FD, #82C2FF)"
                  : "#E5E7EB",
                color: canSubmit ? "white" : "#9CA3AF",
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: canSubmit ? "0 4px 16px rgba(69,161,253,0.3)" : "none",
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
                  <Gift size={17} />
                  Daftar &amp; Dapatkan 100 Poin Selamat Datang
                  <ArrowRight size={17} />
                </>
              )}
            </motion.button>
          </div>

          {/* Login link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-center text-sm text-[#6B4436] mt-5 mb-4"
          >
            Sudah punya akun?{" "}
            <Link
              to={`/login?table=${tableId}`}
              className="text-[#45A1FD] font-bold hover:underline"
            >
              Masuk di sini
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

