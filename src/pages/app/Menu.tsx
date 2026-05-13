import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, ShoppingCart, Check, X, Star, Clock, ChevronRight, Minus, Flame } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAppContext } from "../../context/AppContext";

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Menu Data ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

type Badge = "Bestseller" | "New" | "2x Poin" | null;
type Category = "Kopi" | "Cold" | "Dessert" | "Makanan" | "Signature";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  badge: Badge;
  available: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "m1", name: "Kopi Susu Aren",
    description: "Espresso shot dengan susu segar & gula aren asli Jawa",
    price: 28_000, category: "Kopi", badge: "Bestseller", available: true,
    image: "https://images.unsplash.com/photo-1767439327066-36be4e6f0fe4?w=400&q=80",
  },
  {
    id: "m2", name: "Cappuccino",
    description: "Double espresso dengan foam susu creamy sempurna",
    price: 30_000, category: "Kopi", badge: null, available: true,
    image: "https://images.unsplash.com/photo-1623086923609-594e98bb0bff?w=400&q=80",
  },
  {
    id: "m3", name: "Americano",
    description: "Espresso dengan air panas, pahit kaya rasa klasik",
    price: 22_000, category: "Kopi", badge: null, available: true,
    image: "https://images.unsplash.com/photo-1759259639356-6eee63241869?w=400&q=80",
  },
  {
    id: "m4", name: "Matcha Latte",
    description: "Matcha ceremonial grade Jepang dengan oat milk pilihan",
    price: 32_000, category: "Cold", badge: "Bestseller", available: true,
    image: "https://images.unsplash.com/photo-1634473115412-8fa5b647ef59?w=400&q=80",
  },
  {
    id: "m5", name: "Cold Brew",
    description: "Kopi cold brew 18 jam, smooth & tidak pahit",
    price: 35_000, category: "Cold", badge: "2x Poin", available: true,
    image: "https://images.unsplash.com/photo-1759259639356-6eee63241869?w=400&q=80",
  },
  {
    id: "m6", name: "Es Teh Tarik",
    description: "Teh hitam pekat ditarik dengan susu kental manis",
    price: 15_000, category: "Cold", badge: null, available: true,
    image: "https://images.unsplash.com/photo-1767439327066-36be4e6f0fe4?w=400&q=80",
  },
  {
    id: "m7", name: "Brownie Coklat",
    description: "Brownie fudgy dark chocolate, hangat & lumer di mulut",
    price: 25_000, category: "Dessert", badge: "Bestseller", available: true,
    image: "https://images.unsplash.com/photo-1654921913191-f535f8978768?w=400&q=80",
  },
  {
    id: "m8", name: "Waffle Strawberry",
    description: "Waffle crispy dengan krim vanilla & strawberry segar",
    price: 38_000, category: "Dessert", badge: "New", available: true,
    image: "https://images.unsplash.com/photo-1724653213738-3fbc844cea14?w=400&q=80",
  },
  {
    id: "m9", name: "Tiramisu",
    description: "Tiramisu klasik Italia, espresso & mascarpone ringan",
    price: 42_000, category: "Dessert", badge: "New", available: true,
    image: "https://images.unsplash.com/photo-1593545024944-b3c74435b9f3?w=400&q=80",
  },
  {
    id: "m10", name: "Club Sandwich",
    description: "Triple decker dengan ayam panggang, keju & sayuran segar",
    price: 42_000, category: "Makanan", badge: "Bestseller", available: true,
    image: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=400&q=80",
  },
  {
    id: "m11", name: "Nasi Goreng Spesial",
    description: "Nasi goreng kecap dengan telur, ayam & acar segar",
    price: 55_000, category: "Makanan", badge: null, available: true,
    image: "https://images.unsplash.com/photo-1680674814945-7945d913319c?w=400&q=80",
  },
  {
    id: "m12", name: "Kentang Goreng",
    description: "Kentang crispy dengan bumbu paprika & saus mayo pedas",
    price: 25_000, category: "Makanan", badge: null, available: true,
    image: "https://images.unsplash.com/photo-1734774797087-b6435057a15e?w=400&q=80",
  },
  {
    id: "m13", name: "Sebangku Special",
    description: "Minuman signature kami: teh bunga telang, lemon & basil",
    price: 45_000, category: "Signature", badge: "2x Poin", available: true,
    image: "https://images.unsplash.com/photo-1749104028327-a33087ea4f47?w=400&q=80",
  },
  {
    id: "m14", name: "Game Night Bundle",
    description: "2 minuman + 1 snack + 1 dessert, hemat 20% untuk teman bermain",
    price: 89_000, category: "Signature", badge: "New", available: true,
    image: "https://images.unsplash.com/photo-1706295331319-8ec5da63cb91?w=400&q=80",
  },
];

const CATEGORIES: Array<{ key: Category | "Semua"; label: string; emoji: string }> = [
  { key: "Semua",    label: "Semua",    emoji: "🍽️" },
  { key: "Kopi",     label: "Kopi",     emoji: "☕" },
  { key: "Cold",     label: "Cold",     emoji: "🧊" },
  { key: "Dessert",  label: "Dessert",  emoji: "🍰" },
  { key: "Makanan",  label: "Makanan",  emoji: "🥘" },
  { key: "Signature",label: "Signature",emoji: "✨" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Badge component ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const BADGE_STYLES: Record<NonNullable<Badge>, { bg: string; text: string; label: string }> = {
  "Bestseller": { bg: "#EBF5FF", text: "#45A1FD", label: "🔥 Bestseller" },
  "New":        { bg: "#ECFDF5", text: "#059669", label: "✨ Baru" },
  "2x Poin":    { bg: "#EDE9FE", text: "#7C3AED", label: "⭐ 2× Poin" },
};

function BadgePill({ badge }: { badge: NonNullable<Badge> }) {
  const s = BADGE_STYLES[badge];
  return (
    <div
      className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold z-10"
      style={{ backgroundColor: s.bg, color: s.text, fontFamily: "'DM Sans', sans-serif" }}
    >
      {s.label}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Nutrition mock data per category ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const NUTRITION: Record<Category, { kcal: string; prep: string; serve: string; tag: string }> = {
  "Kopi":      { kcal: "120 kcal", prep: "3–5 mnt",   serve: "250 ml",  tag: "☕ Hot / Iced" },
  "Cold":      { kcal: "180 kcal", prep: "2–4 mnt",   serve: "300 ml",  tag: "🧊 Served Cold" },
  "Dessert":   { kcal: "360 kcal", prep: "5–8 mnt",   serve: "1 porsi", tag: "🍰 Hangat/Dingin" },
  "Makanan":   { kcal: "520 kcal", prep: "10–15 mnt", serve: "1 porsi", tag: "🍽️ Bisa request pedas" },
  "Signature": { kcal: "210 kcal", prep: "5–7 mnt",   serve: "350 ml",  tag: "✨ Menu eksklusif" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Menu Detail Modal ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function MenuDetailModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const inCart    = items.find((i) => i.id === item.id);
  const cartQty   = inCart?.qty ?? 0;
  const nutrition = NUTRITION[item.category];
  const badge     = item.badge ? BADGE_STYLES[item.badge] : null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: item.id, name: item.name, description: item.description,
        price: item.price, image: item.image, category: item.category,
      });
    }
    setJustAdded(true);
    setTimeout(() => { setJustAdded(false); onClose(); }, 1100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(28,20,16,0.62)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 36 }}
        className="bg-white rounded-t-3xl overflow-hidden flex flex-col"
        style={{ maxWidth: "512px", width: "100%", margin: "0 auto", maxHeight: "92vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-0 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* Hero image */}
          <div className="relative w-full" style={{ paddingTop: "60%" }}>
            <img
              src={item.image}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center cursor-pointer"
            >
              <X size={18} className="text-white" />
            </button>
            {/* Badge */}
            {badge && (
              <div
                className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: badge.bg, color: badge.text, fontFamily: "'DM Sans',sans-serif" }}
              >
                {badge.label}
              </div>
            )}
            {/* Cart qty indicator */}
            {cartQty > 0 && (
              <div
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm"
                style={{ backgroundColor: "rgba(69,161,253,0.92)" }}
              >
                <ShoppingCart size={12} className="text-white" />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "white" }}>
                  {cartQty} di keranjang
                </span>
              </div>
            )}
          </div>

          {/* Info section */}
          <div className="px-5 pt-4 pb-3">
            {/* Name + price */}
            <div className="flex items-start justify-between gap-3">
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "22px" }} className="font-bold text-[#1C1410] leading-tight flex-1">
                {item.name}
              </h2>
              <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "20px", color: "#45A1FD" }} className="shrink-0">
                Rp {item.price.toLocaleString("id")}
              </span>
            </div>

            {/* Category + tag chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              <div
                className="px-2.5 py-1 rounded-xl text-xs font-bold"
                style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: "#EBF5FF", color: "#45A1FD" }}
              >
                {item.category}
              </div>
              <div
                className="px-2.5 py-1 rounded-xl text-xs font-semibold"
                style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: "#F7F7F8", color: "#6B4436" }}
              >
                {nutrition.tag}
              </div>
              {item.available ? (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold" style={{ backgroundColor: "#ECFDF5", color: "#059669" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Tersedia
                </div>
              ) : (
                <div className="px-2.5 py-1 rounded-xl text-xs font-bold" style={{ backgroundColor: "#F3F4F6", color: "#9CA3AF" }}>
                  Habis
                </div>
              )}
            </div>

            {/* Description */}
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#6B4436", lineHeight: 1.65 }} className="mt-3">
              {item.description}
            </p>

            {/* Nutrition chips */}
            <div className="mt-4">
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF", fontWeight: 600 }} className="uppercase tracking-wide mb-2">
                Info Sajian
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: "🔥", label: "Kalori",   val: nutrition.kcal },
                  { icon: "🕐", label: "Estimasi", val: nutrition.prep },
                  { icon: "🫙", label: "Ukuran",   val: nutrition.serve },
                ].map((n) => (
                  <div
                    key={n.label}
                    className="flex flex-col items-center py-2.5 rounded-2xl"
                    style={{ backgroundColor: "#F8FAFC", border: "1px solid #F3F4F6" }}
                  >
                    <span className="text-lg mb-0.5">{n.icon}</span>
                    <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "12px", color: "#1C1410" }}>
                      {n.val}
                    </span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", color: "#9CA3AF" }}>
                      {n.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergen note */}
            <div className="mt-3 flex items-start gap-2 bg-[#FFFBEB] rounded-xl px-3 py-2.5">
              <span className="text-sm mt-0.5">⚠️</span>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#92400E" }}>
                Mengandung <span className="font-bold">susu & gluten</span>. Beritahu staf jika ada alergi.
              </p>
            </div>

            {/* Notes field */}
            <div className="mt-4">
              <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#9CA3AF", fontWeight: 600 }} className="uppercase tracking-wide">
                Catatan Pesanan (opsional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: kurang manis, es batu sedikit, extra shot..."
                rows={2}
                className="w-full mt-1.5 px-3 py-2.5 rounded-2xl text-sm resize-none outline-none"
                style={{
                  fontFamily: "'DM Sans',sans-serif", color: "#1C1410",
                  backgroundColor: "#F8FAFC", border: "1.5px solid #E5E7EB",
                  fontSize: "12px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Sticky bottom: qty + add */}
        <div
          className="px-5 py-4 shrink-0"
          style={{ borderTop: "1px solid #F3F4F6", backgroundColor: "white" }}
        >
          {/* Row 1: Qty selector */}
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#6B4436", fontWeight: 600 }}>
              Jumlah
            </span>
            <div className="flex items-center gap-3 bg-[#F8FAFC] rounded-2xl px-3 py-2" style={{ border: "1.5px solid #E5E7EB" }}>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: qty <= 1 ? "#F3F4F6" : "#EBF5FF" }}
              >
                <Minus size={14} className={qty <= 1 ? "text-gray-300" : "text-[#45A1FD]"} />
              </motion.button>
              <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "18px", color: "#1C1410", minWidth: "24px", textAlign: "center" }}>
                {qty}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQty((q) => q + 1)}
                className="w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "#EBF5FF" }}
              >
                <Plus size={14} className="text-[#45A1FD]" />
              </motion.button>
            </div>
          </div>

          {/* Row 2: Full-width Add button */}
          <motion.button
            whileHover={!justAdded ? { scale: 1.02 } : {}}
            whileTap={!justAdded ? { scale: 0.97 } : {}}
            onClick={handleAdd}
            disabled={!item.available || justAdded}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
            style={{
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "14px",
              background: justAdded
                ? "linear-gradient(135deg,#059669,#10B981)"
                : item.available
                  ? "linear-gradient(135deg,#45A1FD,#82C2FF)"
                  : "#E5E7EB",
              color: item.available || justAdded ? "white" : "#9CA3AF",
              boxShadow: item.available && !justAdded ? "0 4px 16px rgba(69,161,253,0.35)" : "none",
            }}
          >
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                  <Check size={16} /> Ditambahkan! 🎉
                </motion.div>
              ) : (
                <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <ShoppingCart size={16} />
                  {item.available
                    ? `Tambah ke Pesanan · Rp ${(item.price * qty).toLocaleString("id")}`
                    : "Tidak Tersedia"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Menu Card ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function MenuCard({ item, index, onPress }: { item: MenuItem; index: number; onPress: () => void }) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = items.find((i) => i.id === item.id);
  const qty = inCart?.qty ?? 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ translateY: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}
      onClick={onPress}
      className="bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Photo 4:3 aspect ratio */}
      <div className="relative w-full" style={{ paddingTop: "75%" }}>
        <img
          src={item.image}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* Badge */}
        {item.badge && <BadgePill badge={item.badge} />}
        {/* Cart qty indicator */}
        <AnimatePresence>
          {qty > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="absolute top-2 right-2 w-5 h-5 bg-[#45A1FD] rounded-full flex items-center justify-center z-10"
            >
              <span
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-[10px] font-bold text-white"
              >
                {qty}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col flex-1">
        <p
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}
          className="leading-tight"
        >
          {item.name}
        </p>
        <p
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#9CA3AF" }}
          className="mt-0.5 leading-snug line-clamp-1 flex-1"
        >
          {item.description}
        </p>

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-2">
          <span
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#45A1FD" }}
          >
            Rp {item.price.toLocaleString("id")}
          </span>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleAdd}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors shrink-0"
            style={{
              backgroundColor: justAdded ? "#22C55E" : "#45A1FD",
              boxShadow: `0 3px 10px ${justAdded ? "#22C55E" : "#45A1FD"}44`,
            }}
          >
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Check size={14} className="text-white" />
                </motion.div>
              ) : (
                <motion.div key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Plus size={14} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Floating Cart Button ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function FloatingCartButton() {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || "T01";

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-30 max-w-lg mx-auto">
      <motion.button
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        whileHover={{ translateY: -3, boxShadow: "0 12px 32px rgba(69,161,253,0.45)" }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate(`/app/cart?table=${tableId}`)}
        className="w-full flex items-center justify-between px-5 py-3.5 rounded-full cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #45A1FD, #82C2FF)",
          boxShadow: "0 6px 24px rgba(69,161,253,0.4)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ShoppingCart size={20} className="text-white" />
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <span
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-[9px] font-bold text-[#45A1FD]"
              >
                {totalItems}
              </span>
            </div>
          </div>
          <span
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px" }}
            className="text-white"
          >
            🛒 Keranjang ({totalItems} item)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px" }}
            className="text-white"
          >
            Rp {totalPrice.toLocaleString("id")}
          </span>
          <span className="text-white/80 text-lg">→</span>
        </div>
      </motion.button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Menu Page ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function MenuPage() {
  const { tableId } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<Category | "Semua">("Semua");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filtered = MENU_ITEMS.filter((item) => {
    const matchCat = activeCategory === "Semua" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <div className="flex flex-col pb-28">
        {/* ── Header ── */}
        <div className="px-4 pt-4 pb-3 bg-white sticky top-0 z-20"
             style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410]">
            Menu & Pesanan
          </h2>

          {/* Search bar */}
          <div className="flex items-center gap-2.5 bg-[#F7F7F8] rounded-2xl px-4 py-2.5 mt-2.5 border border-gray-100">
            <Search size={15} className="text-[#9CA3AF] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu..."
              className="flex-1 bg-transparent text-sm text-[#1C1410] placeholder:text-[#C4C4C4] focus:outline-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-[#9CA3AF] cursor-pointer">
                ✕
              </button>
            )}
          </div>

          {/* Category filter tabs */}
          <div className="flex gap-2 mt-2.5 overflow-x-auto pb-0.5 -mx-4 px-4 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.key;
              return (
                <motion.button
                  key={cat.key}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setActiveCategory(cat.key)}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    backgroundColor: active ? "#45A1FD" : "#F7F7F8",
                    color: active ? "#fff" : "#6B4436",
                    border: active ? "1.5px solid #45A1FD" : "1.5px solid #E5E7EB",
                  }}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Results count ── */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF]">
            {filtered.length} menu ditemukan
          </p>
          {activeCategory !== "Semua" && (
            <button
              onClick={() => { setActiveCategory("Semua"); setSearch(""); }}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-xs text-[#45A1FD] font-semibold cursor-pointer"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <span className="text-5xl">🍽️</span>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#9CA3AF]">
              Tidak ada menu yang sesuai
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4 pt-1">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  index={i}
                  onPress={() => setSelectedItem(item)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Floating Cart ── */}
      <AnimatePresence>
        <FloatingCartButton />
      </AnimatePresence>

      {/* ── Menu Detail Modal ── */}
      <AnimatePresence>
        {selectedItem && (
          <MenuDetailModal
            key={selectedItem.id}
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
