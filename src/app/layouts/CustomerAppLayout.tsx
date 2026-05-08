import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation, useSearchParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, UtensilsCrossed, Gamepad2, Trophy, User,
  Bell, ChevronRight, X, Check, LogIn, ShoppingCart,
} from "lucide-react";
import { AppProvider, useAppContext, type Notification } from "../context/AppContext";
import { CartProvider, useCart } from "../context/CartContext";
import { CallGMSheet } from "../components/CallGMSheet";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "beranda", path: "/app/beranda", label: "Beranda",  Icon: Home },
  { id: "menu",    path: "/app/menu",    label: "Menu",     Icon: UtensilsCrossed },
  { id: "games",   path: "/app/games",   label: "Game",     Icon: Gamepad2 },
  { id: "loyalty", path: "/app/loyalty", label: "Poin",     Icon: Trophy },
  { id: "profile", path: "/app/profile", label: "Profil",   Icon: User },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

function sessionDuration(start: Date): string {
  const diff = Math.floor((Date.now() - start.getTime()) / 1000 / 60);
  if (diff < 1) return "Baru mulai";
  if (diff < 60) return `${diff} mnt`;
  return `${Math.floor(diff / 60)}j ${diff % 60}m`;
}

// ─── Notification Panel ───────────────────────────────────────────────────────
function NotifTypeColor(type: Notification["type"]) {
  return { order: "#45A1FD", loyalty: "#F59E0B", promo: "#8B5CF6", system: "#6B7280" }[type];
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, unreadCount, markRead, markAllRead } = useAppContext();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 10);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
      style={{ maxHeight: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410] text-base">
            Notifikasi
          </span>
          {unreadCount > 0 && (
            <span className="bg-[#45A1FD] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-xs text-[#45A1FD] font-semibold hover:underline cursor-pointer"
            >
              Tandai semua dibaca
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="text-4xl">🔔</span>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#9CA3AF]">
              Belum ada notifikasi
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <motion.button
              key={notif.id}
              layout
              onClick={() => markRead(notif.id)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors cursor-pointer border-b border-gray-50 last:border-0"
            >
              {/* Icon circle */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 mt-0.5"
                style={{ backgroundColor: `${NotifTypeColor(notif.type)}18` }}
              >
                {notif.icon}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: notif.read ? 400 : 700,
                    color: notif.read ? "#6B4436" : "#1C1410",
                  }}
                  className="text-sm leading-tight"
                >
                  {notif.title}
                </p>
                <p
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  className="text-xs text-[#9CA3AF] mt-0.5 leading-snug"
                >
                  {notif.body}
                </p>
                <p
                  style={{ fontFamily: "'DM Sans', sans-serif", color: NotifTypeColor(notif.type) }}
                  className="text-xs mt-1"
                >
                  {timeAgo(notif.createdAt)}
                </p>
              </div>
              {/* Unread dot */}
              {!notif.read && (
                <div className="w-2 h-2 bg-[#45A1FD] rounded-full mt-1.5 shrink-0" />
              )}
            </motion.button>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────
function TopBar() {
  const { tableId, isGuest, user, unreadCount, sessionStart } = useAppContext();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showNotif, setShowNotif] = useState(false);
  const [tick, setTick] = useState(0);

  // Update session timer every minute
  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const tableNumber = tableId.replace(/^[A-Za-z]+/, "");
  const displayName = isGuest ? "Tamu" : (user?.name.split(" ")[0] ?? "Member");

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 bg-white"
      style={{ borderBottom: "1px solid rgba(69,161,253,0.12)" }}
    >
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        {/* Left: Table badge + name */}
        <div className="flex items-center gap-2.5">
          {/* Meja badge */}
          <Link to={`/scan?table=${tableId}`}>
            <div className="flex items-center gap-1.5 bg-[#EBF5FF] px-3 py-1.5 rounded-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-xs font-bold text-[#1C1410]"
              >
                Meja {tableNumber}
              </span>
            </div>
          </Link>

          {/* User / session info */}
          <div className="flex flex-col leading-none">
            <span
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-xs font-semibold text-[#1C1410]"
            >
              {displayName}
              {isGuest && (
                <span className="ml-1 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
                  Tamu
                </span>
              )}
            </span>
            <span
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-[10px] text-[#9CA3AF] mt-0.5"
            >
              ⏱ {sessionDuration(sessionStart)}
            </span>
          </div>
        </div>

        {/* Right: Cart + Notif + Avatar */}
        <div className="flex items-center gap-2">
          {/* Cart icon */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => navigate(`/app/cart?table=${tableId}`)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-[#EBF5FF] transition-colors cursor-pointer"
            >
              <ShoppingCart size={18} className="text-[#6B4436]" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.div
                    key="cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#45A1FD] rounded-full flex items-center justify-center"
                  >
                    <span
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                      className="text-[10px] font-bold text-white px-1"
                    >
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Notification bell */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setShowNotif(!showNotif)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-[#EBF5FF] transition-colors cursor-pointer"
            >
              <Bell size={18} className="text-[#6B4436]" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.div
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#45A1FD] rounded-full flex items-center justify-center"
                  >
                    <span
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                      className="text-[10px] font-bold text-white px-1"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
            </AnimatePresence>
          </div>

          {/* Avatar */}
          {isGuest ? (
            <motion.button
              whileHover={{ translateY: -2, boxShadow: "0 4px 12px rgba(69,161,253,0.3)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/login?table=${tableId}`)}
              className="flex items-center gap-1.5 bg-[#45A1FD] text-white text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <LogIn size={13} />
              Masuk
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate(`/app/profile?table=${tableId}`)}
              className="w-9 h-9 rounded-xl overflow-hidden border-2 border-[#45A1FD] cursor-pointer"
            >
              <img
                src={user?.avatarSrc}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────
function BottomNav() {
  const { isGuest, unreadCount } = useAppContext();
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || "T01";

  const activeTab = TABS.find((t) => location.pathname === t.path)?.id ?? "beranda";

  const handleTabPress = (tab: typeof TABS[number]) => {
    navigate(`${tab.path}?table=${tableId}`);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white"
      style={{
        borderTop: "1px solid rgba(0,0,0,0.07)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-stretch max-w-lg mx-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isLoyalty = tab.id === "loyalty";

          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabPress(tab)}
              whileTap={{ scale: 0.9 }}
              className="flex-1 flex flex-col items-center justify-center py-2.5 pt-0 relative cursor-pointer gap-0.5"
              style={{ minHeight: "60px" }}
            >
              {/* Active top indicator */}
              <div className="absolute top-0 left-3 right-3 overflow-hidden" style={{ height: "2.5px" }}>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="active-line"
                      layoutId="nav-active-line"
                      className="w-full h-full rounded-full bg-[#45A1FD]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Icon */}
              <div className="relative mt-2">
                <motion.div
                  animate={{ scale: isActive ? 1.12 : 1, y: isActive ? -1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <tab.Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    color={isActive ? "#45A1FD" : "#6B4436"}
                  />
                </motion.div>

                {/* Loyalty lock badge for guests */}
                {isLoyalty && isGuest && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-[8px]">🔒</span>
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: isActive ? "#45A1FD" : "#6B4436",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "10px",
                  lineHeight: 1.2,
                }}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Guest Loyalty Overlay ────────────────────────────────────────────────────
export function GuestLoyaltyGate({ tableId }: { tableId: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="w-full max-w-xs bg-white rounded-3xl shadow-xl p-7 flex flex-col items-center gap-5 text-center"
      >
        {/* Trophy animation */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="text-6xl"
        >
          🏆
        </motion.div>

        <div className="space-y-1.5">
          <h2
            style={{ fontFamily: "'Fraunces', serif" }}
            className="text-xl font-bold text-[#1C1410]"
          >
            Akses Loyalty & Poin
          </h2>
          <p
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-sm text-[#6B4436] leading-relaxed"
          >
            Login atau daftar untuk kumpulkan poin, naik level, unlock badge eksklusif &amp; tukar reward!
          </p>
        </div>

        {/* Benefits list */}
        <div className="w-full space-y-2">
          {[
            { icon: "⭐", text: "Kumpulkan poin setiap transaksi" },
            { icon: "🎖️", text: "Naik level Bronze → Silver → Gold" },
            { icon: "🎁", text: "Tukar poin jadi reward & diskon" },
            { icon: "🔥", text: "Daily streak & tantangan harian" },
          ].map((b) => (
            <div
              key={b.text}
              className="flex items-center gap-3 bg-[#EBF5FF] rounded-xl px-3 py-2 text-left"
            >
              <span className="text-base">{b.icon}</span>
              <span
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-xs text-[#6B4436] font-medium"
              >
                {b.text}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <motion.button
            whileHover={{ translateY: -3, boxShadow: "0 8px 24px rgba(69,161,253,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/login?table=${tableId}`)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl cursor-pointer"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "linear-gradient(135deg, #45A1FD, #82C2FF)",
              color: "white",
              fontWeight: 700,
              fontSize: "14px",
              boxShadow: "0 4px 16px rgba(69,161,253,0.3)",
            }}
          >
            <LogIn size={16} />
            Masuk sebagai Member
          </motion.button>
          <motion.button
            whileHover={{ translateY: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/register?table=${tableId}`)}
            className="w-full py-3 rounded-2xl border-2 border-[#45A1FD] cursor-pointer"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "#45A1FD",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Daftar & Dapat 100 Poin Gratis 🎉
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Inner layout (uses context) ──────────────────────────────────────────────
function AppShell() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  // Detect slide direction
  const tabIndex = TABS.findIndex((t) => location.pathname === t.path);
  const prevIndex = TABS.findIndex((t) => prevPath.current === t.path);
  const direction = tabIndex >= prevIndex ? 1 : -1;

  useEffect(() => {
    prevPath.current = location.pathname;
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F7F7F8]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <TopBar />

      {/* Content area */}
      <main
        className="flex-1 flex flex-col overflow-hidden"
        style={{ paddingTop: "56px", paddingBottom: "60px" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex-1 flex flex-col h-full overflow-y-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />

      {/* ── Global GM Sheet ── mounts here, triggered from anywhere via context */}
      <CallGMSheet />
    </div>
  );
}

// ─── Main Export: CustomerAppLayout ──────────────────────────────────────────
export default function CustomerAppLayout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tableId = searchParams.get("table") || "T01";
  const isGuest = searchParams.get("mode") === "guest";

  // Redirect /app → /app/beranda
  useEffect(() => {
    if (location.pathname === "/app") {
      navigate(`/app/beranda?table=${tableId}${isGuest ? "&mode=guest" : ""}`, { replace: true });
    }
  }, [location.pathname, navigate, tableId, isGuest]);

  return (
    <AppProvider tableId={tableId} isGuest={isGuest}>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </AppProvider>
  );
}
