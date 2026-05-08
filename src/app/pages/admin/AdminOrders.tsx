import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu as MenuIcon, Bell, RefreshCw, ShoppingBag,
  TrendingUp, Clock, CheckCircle2, Search, X,
  ArrowUpRight, Zap,
} from "lucide-react";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { OrderCard } from "../../components/admin/OrderCard";
import { OrderDetail, OrderDetailEmpty } from "../../components/admin/OrderDetail";
import type { Order, OrderStatus } from "../../components/admin/OrderCard";

// ─────────────────────────────────────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const INIT_ORDERS: Order[] = [
  // ── Order 1: Baru (2 menit lalu) ─────────────────────────────────────────
  {
    id: "SBK-0845",
    tableId: "T-05",
    tableNum: 5,
    zone: "Tengah",
    member: "Dian P.",
    memberLevel: "Gold",
    memberLevelColor: "#D97706",
    memberPoin: 3_420,
    status: "baru",
    minutesAgo: 2,
    createdAt: "14:41",
    pointsEarned: 31,
    items: [
      { name: "Kopi Susu Aren",  qty: 2, price: 28_000, note: "Gula setengah" },
      { name: "Kentang Goreng",  qty: 1, price: 25_000, note: "Extra saus mayo pedas" },
      { name: "Es Teh Tarik",    qty: 1, price: 15_000 },
    ],
    total: 96_000,
  },

  // ── Order 2: Baru (5 menit lalu) ─────────────────────────────────────────
  {
    id: "SBK-0844",
    tableId: "T-03",
    tableNum: 3,
    zone: "Depan",
    member: "Budi K.",
    memberLevel: "Silver",
    memberLevelColor: "#94A3B8",
    memberPoin: 1_250,
    status: "baru",
    minutesAgo: 5,
    createdAt: "14:38",
    pointsEarned: 23,
    items: [
      { name: "Americano",      qty: 2, price: 22_000 },
      { name: "Brownie Coklat", qty: 2, price: 25_000, note: "Sajikan hangat" },
    ],
    total: 94_000,
  },

  // ── Order 3: Diproses (12 menit lalu) ────────────────────────────────────
  {
    id: "SBK-0843",
    tableId: "T-07",
    tableNum: 7,
    zone: "Tengah",
    member: "Fira A.",
    memberLevel: "Platinum",
    memberLevelColor: "#7C3AED",
    memberPoin: 8_765,
    status: "diproses",
    minutesAgo: 12,
    createdAt: "14:31",
    pointsEarned: 64,
    items: [
      { name: "Matcha Latte",     qty: 3, price: 32_000, note: "Oat milk" },
      { name: "Kentang Goreng",   qty: 2, price: 25_000 },
      { name: "Waffle Strawberry",qty: 1, price: 38_000 },
    ],
    total: 194_000,
  },

  // ── Order 4: Siap (20 menit lalu) ────────────────────────────────────────
  {
    id: "SBK-0842",
    tableId: "T-09",
    tableNum: 9,
    zone: "Belakang",
    member: "Gita H.",
    memberLevel: "Gold",
    memberLevelColor: "#D97706",
    memberPoin: 4_120,
    status: "siap",
    minutesAgo: 20,
    createdAt: "14:23",
    pointsEarned: 47,
    items: [
      { name: "Nasi Goreng Spesial", qty: 2, price: 55_000, note: "Level pedas 2" },
      { name: "Cold Brew",           qty: 2, price: 35_000 },
    ],
    total: 180_000,
  },

  // ── Order 5: Diantar (28 menit lalu) ─────────────────────────────────────
  {
    id: "SBK-0841",
    tableId: "T-13",
    tableNum: 13,
    zone: "Private",
    member: "Ivan B.",
    memberLevel: "Silver",
    memberLevelColor: "#94A3B8",
    memberPoin: 2_300,
    status: "diantar",
    minutesAgo: 28,
    createdAt: "14:15",
    pointsEarned: 89,
    items: [
      { name: "Game Night Bundle", qty: 2, price: 89_000 },
      { name: "Cappuccino",        qty: 3, price: 30_000 },
      { name: "Tiramisu",          qty: 2, price: 42_000, note: "Tanpa taburan kopi" },
    ],
    total: 352_000,
  },

  // ── Order 6: Selesai (47 menit lalu) ─────────────────────────────────────
  {
    id: "SBK-0840",
    tableId: "T-01",
    tableNum: 1,
    zone: "Depan",
    member: "Andi S.",
    memberLevel: "Bronze",
    memberLevelColor: "#CA8A04",
    memberPoin: 540,
    status: "selesai",
    minutesAgo: 47,
    createdAt: "13:56",
    pointsEarned: 17,
    items: [
      { name: "Kopi Susu Aren", qty: 1, price: 28_000 },
      { name: "Club Sandwich",  qty: 1, price: 42_000 },
    ],
    total: 70_000,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  TAB CONFIG
// ─────────────────────────────────────────────────────────────────────────────

type TabKey = "semua" | "baru" | "diproses" | "siap" | "diantar" | "selesai";

const TABS: { key: TabKey; label: string; emoji: string; color: string }[] = [
  { key: "semua",    label: "Semua",    emoji: "",  color: "#1C1410" },
  { key: "baru",     label: "Baru",     emoji: "🔴", color: "#45A1FD" },
  { key: "diproses", label: "Diproses", emoji: "🔵", color: "#3B82F6" },
  { key: "siap",     label: "Siap",     emoji: "🟢", color: "#16A34A" },
  { key: "diantar",  label: "Diantar",  emoji: "🛵", color: "#0284C7" },
  { key: "selesai",  label: "Selesai",  emoji: "✅", color: "#6B7280" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  KPI MINI CARD
// ─────────────────────────────────────────────────────────────────────────────

function KpiChip({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 shrink-0"
      style={{ border: "1.5px solid #F3F4F6", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: bg }}
      >
        <Icon size={15} style={{ color }} />
      </div>
      <div>
        <p
          style={{
            fontFamily: "'Fraunces',serif",
            fontWeight: 700,
            fontSize: "16px",
            color: "#1C1410",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "10px",
            color: "#9CA3AF",
            marginTop: 1,
          }}
        >
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu]       = useState(false);
  const [orders, setOrders]               = useState<Order[]>(INIT_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab]         = useState<TabKey>("semua");
  const [search, setSearch]               = useState("");
  const [refreshing, setRefreshing]       = useState(false);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionStorage.getItem("sbk_admin_session")) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  // ── Tick for "X menit lalu" update ────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(
      () => setOrders((prev) => prev.map((o) => ({ ...o, minutesAgo: o.minutesAgo + 1 }))),
      60_000
    );
    return () => clearInterval(t);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRefreshing(false);
  }, []);

  // ── Status change ──────────────────────────────────────────────────────────
  const handleStatusChange = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setSelectedOrder((prev) =>
        prev?.id === orderId ? { ...prev, status: newStatus } : prev
      );
    },
    []
  );

  // ── Accept ─────────────────────────────────────────────────────────────────
  const handleAccept = useCallback((order: Order) => {
    handleStatusChange(order.id, "diproses");
  }, [handleStatusChange]);

  // ── Reject ─────────────────────────────────────────────────────────────────
  const handleReject = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    setSelectedOrder((prev) => (prev?.id === orderId ? null : prev));
  }, []);

  const handleRejectFromCard = useCallback((order: Order) => {
    handleReject(order.id);
  }, [handleReject]);

  // ── Select ─────────────────────────────────────────────────────────────────
  const handleSelect = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = orders.filter((o) => {
    const matchTab = activeTab === "semua" || o.status === activeTab;
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.member.toLowerCase().includes(search.toLowerCase()) ||
      o.tableId.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const baruCount = orders.filter((o) => o.status === "baru").length;
  const diprosesCount = orders.filter((o) => o.status === "diproses").length;
  const totalRevenue = orders
    .filter((o) => o.status === "selesai")
    .reduce((s, o) => s + o.total, 0);

  const session = JSON.parse(
    sessionStorage.getItem("sbk_admin_session") || "{}"
  );

  const now     = new Date();
  const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F7F7F8", fontFamily: "'DM Sans', sans-serif" }}
    >
      <AdminSidebar mobileOpen={mobileMenu} onClose={() => setMobileMenu(false)} />

      <div className="lg:pl-[240px] min-h-screen flex flex-col">

        {/* ── Top bar ── */}
        <div
          className="sticky top-0 z-20 bg-white flex items-center justify-between px-5 lg:px-6 h-16 shrink-0"
          style={{ borderBottom: "1px solid #F3F4F6", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenu(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 cursor-pointer"
            >
              <MenuIcon size={17} className="text-[#6B4436]" />
            </button>
            <div>
              <h1
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontWeight: 700,
                  fontSize: "17px",
                  color: "#1C1410",
                }}
              >
                POS Pesanan Masuk
              </h1>
              <p style={{ fontSize: "11px", color: "#9CA3AF" }}>
                {dateStr} · {timeStr} WIB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#059669" }}>Live</span>
            </div>

            {/* Baru badge */}
            {baruCount > 0 && (
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{ backgroundColor: "#EBF5FF", border: "1px solid #FED7AA" }}
              >
                <Bell size={13} style={{ color: "#45A1FD" }} />
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#45A1FD",
                  }}
                >
                  {baruCount} pesanan baru
                </span>
              </motion.div>
            )}

            {/* Refresh */}
            <motion.button
              onClick={handleRefresh}
              animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={
                refreshing
                  ? { duration: 0.8, repeat: Infinity, ease: "linear" }
                  : {}
              }
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-[#EBF5FF] cursor-pointer transition-colors"
            >
              <RefreshCw size={15} className="text-[#6B4436]" />
            </motion.button>

            {/* Admin pill */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: "#1C1410" }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#45A1FD,#82C2FF)",
                  fontFamily: "'Fraunces',serif",
                  fontWeight: 700,
                  fontSize: "11px",
                  color: "white",
                }}
              >
                {(session.name ?? "A").charAt(0)}
              </div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "white" }}>
                {session.name ?? "Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div
          className="flex items-center gap-3 px-5 lg:px-6 py-3 overflow-x-auto scrollbar-none"
          style={{ borderBottom: "1px solid #F0F0F0", backgroundColor: "white" }}
        >
          <KpiChip
            icon={ShoppingBag}
            label="Pesanan Aktif"
            value={`${orders.filter((o) => o.status !== "selesai").length}`}
            color="#45A1FD"
            bg="#EBF5FF"
          />
          <KpiChip
            icon={Bell}
            label="Menunggu Konfirmasi"
            value={`${baruCount}`}
            color="#DC2626"
            bg="#FEF2F2"
          />
          <KpiChip
            icon={Clock}
            label="Sedang Diproses"
            value={`${diprosesCount}`}
            color="#3B82F6"
            bg="#EFF6FF"
          />
          <KpiChip
            icon={CheckCircle2}
            label="Selesai Hari Ini"
            value={`${orders.filter((o) => o.status === "selesai").length}`}
            color="#059669"
            bg="#ECFDF5"
          />
          <KpiChip
            icon={TrendingUp}
            label="Omzet Selesai"
            value={`Rp ${(totalRevenue / 1000).toFixed(0)}k`}
            color="#7C3AED"
            bg="#F5F3FF"
          />
          <div className="ml-auto shrink-0">
            <div
              className="flex items-center gap-1 cursor-pointer"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#45A1FD" }}
            >
              <span>Laporan lengkap</span>
              <ArrowUpRight size={12} />
            </div>
          </div>
        </div>

        {/* ── Split content area ── */}
        <div className="flex-1 flex overflow-hidden">

          {/* ════ LEFT PANEL — Order Queue ════ */}
          {/* Mobile: hidden when an order is selected (right panel takes full width) */}
          {/* Desktop: always visible at 55% width */}
          <div
            className={selectedOrder ? "hidden lg:flex lg:flex-col overflow-hidden" : "flex flex-col overflow-hidden"}
            style={{
              flex: selectedOrder ? "0 0 55%" : undefined,
              width: selectedOrder ? undefined : "100%",
              transition: "all 0.3s ease",
              borderRight: "1px solid #F0F0F0",
            }}
          >
            {/* Search + tabs */}
            <div
              className="shrink-0 px-4 lg:px-5 pt-4 pb-3"
              style={{ borderBottom: "1px solid #F0F0F0", backgroundColor: "white" }}
            >
              {/* Search bar */}
              <div className="relative mb-3">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari ID pesanan, nama, atau meja..."
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl"
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "12px",
                    color: "#1C1410",
                    backgroundColor: "#F9FAFB",
                    border: "1.5px solid #E5E7EB",
                    outline: "none",
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X size={13} style={{ color: "#9CA3AF" }} />
                  </button>
                )}
              </div>

              {/* Tab pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {TABS.map((tab) => {
                  const count =
                    tab.key === "semua"
                      ? orders.length
                      : orders.filter((o) => o.status === tab.key).length;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all shrink-0"
                      style={{
                        backgroundColor: isActive ? "#45A1FD" : "#F9FAFB",
                        border: `1.5px solid ${isActive ? "#45A1FD" : "#E5E7EB"}`,
                      }}
                    >
                      {tab.emoji && (
                        <span style={{ fontSize: "10px" }}>{tab.emoji}</span>
                      )}
                      <span
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: isActive ? "white" : "#6B7280",
                        }}
                      >
                        {tab.label}
                      </span>
                      {count > 0 && (
                        <span
                          className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                          style={{
                            fontFamily: "'DM Sans',sans-serif",
                            backgroundColor: isActive
                              ? "rgba(255,255,255,0.25)"
                              : tab.key === "baru"
                              ? "#45A1FD"
                              : "#E5E7EB",
                            color: isActive
                              ? "white"
                              : tab.key === "baru"
                              ? "white"
                              : "#6B7280",
                          }}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order list */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-5">
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 gap-3"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: "#F9FAFB", border: "2px dashed #E5E7EB" }}
                    >
                      <ShoppingBag size={24} style={{ color: "#D1D5DB" }} />
                    </div>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "13px",
                        color: "#9CA3AF",
                      }}
                    >
                      Tidak ada pesanan{" "}
                      {activeTab !== "semua" ? `dengan status "${activeTab}"` : ""}
                    </p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filtered.map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <OrderCard
                          order={order}
                          isSelected={selectedOrder?.id === order.id}
                          onSelect={handleSelect}
                          onAccept={handleAccept}
                          onReject={handleRejectFromCard}
                        />
                      </motion.div>
                    ))}

                    {/* Divider info */}
                    <div className="flex items-center gap-3 py-2">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: "10px",
                          color: "#D1D5DB",
                        }}
                      >
                        {filtered.length} pesanan
                      </span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ════ RIGHT PANEL — Order Detail ════ */}
          {/* Mobile: full-width when order selected (left panel is hidden) */}
          {/* Desktop: always shows at 45% — detail or empty state */}
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="flex flex-col overflow-hidden bg-white"
                style={{ flex: "0 0 45%", borderLeft: "1px solid #F0F0F0" }}
              >
                <OrderDetail
                  order={
                    orders.find((o) => o.id === selectedOrder.id) ?? selectedOrder
                  }
                  onClose={() => setSelectedOrder(null)}
                  onStatusChange={handleStatusChange}
                  onReject={handleReject}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden lg:flex flex-col bg-white"
                style={{ flex: "0 0 45%", borderLeft: "1px solid #F0F0F0" }}
              >
                <OrderDetailEmpty />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

