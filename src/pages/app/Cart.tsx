import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import {
  ArrowLeft, Trash2, Minus, Plus, ShoppingBag,
  FileText, Zap, ChevronRight, AlertCircle,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Swipeable Cart Item ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function CartItemRow({ item }: { item: ReturnType<typeof useCart>["items"][number] }) {
  const { increment, decrement, remove } = useCart();
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-100, -40], [1, 0]);
  const bgColor = useTransform(x, [-100, -40, 0], ["#FEE2E2", "#FEE2E2", "#ffffff"]);
  const constraintsRef = useRef(null);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -80) {
      remove(item.cartId);
    } else {
      x.set(0);
    }
  };

  return (
    <div ref={constraintsRef} className="relative overflow-hidden rounded-2xl">
      {/* Delete background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-5 rounded-2xl"
        style={{
          opacity: deleteOpacity,
          backgroundColor: "#FEE2E2",
        }}
      >
        <Trash2 size={20} className="text-red-400" />
      </motion.div>

      {/* Draggable row */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={{ left: 0.2, right: 0 }}
        style={{ x, backgroundColor: bgColor as unknown as string }}
        onDragEnd={handleDragEnd}
        className="relative flex items-center gap-3 p-3 rounded-2xl cursor-grab active:cursor-grabbing"
      >
        {/* Product image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}
            className="leading-tight truncate"
          >
            {item.name}
          </p>
          <p
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9CA3AF" }}
            className="mt-0.5 truncate"
          >
            {item.description}
          </p>
          <p
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#45A1FD" }}
            className="mt-1"
          >
            Rp {(item.price * item.qty).toLocaleString("id")}
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => decrement(item.cartId)}
            className="w-7 h-7 rounded-full border-2 border-[#45A1FD] flex items-center justify-center cursor-pointer"
          >
            <Minus size={12} className="text-[#45A1FD]" />
          </motion.button>
          <motion.span
            key={item.qty}
            initial={{ scale: 1.3, color: "#45A1FD" }}
            animate={{ scale: 1, color: "#1C1410" }}
            transition={{ duration: 0.2 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "15px", minWidth: "20px", textAlign: "center" }}
          >
            {item.qty}
          </motion.span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => increment(item.cartId)}
            className="w-7 h-7 rounded-full bg-[#45A1FD] flex items-center justify-center cursor-pointer"
          >
            <Plus size={12} className="text-white" />
          </motion.button>
        </div>

        {/* Explicit delete button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => remove(item.cartId)}
          className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center cursor-pointer shrink-0"
        >
          <Trash2 size={12} className="text-red-400" />
        </motion.button>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Cart Page ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function CartPage() {
  const { items, note, setNote, totalItems, totalPrice, estimatedPoints, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || "T01";
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOrder = async () => {
    setIsOrdering(true);
    await new Promise((r) => setTimeout(r, 1200));
    // Generate order number
    const orderNum = `SBK-${Math.floor(1000 + Math.random() * 9000)}`;
    clearCart();
    navigate(`/app/order-confirmation?table=${tableId}`, {
      state: { orderNum, totalPrice, estimatedPoints, itemCount: totalItems },
    });
  };

  const subtotal = totalPrice;
  const serviceCharge = Math.floor(subtotal * 0.05);
  const grandTotal = subtotal + serviceCharge;
  const grandPoints = Math.floor(grandTotal / 2_000);

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 bg-white sticky top-0 z-20"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(`/app/menu?table=${tableId}`)}
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft size={18} className="text-[#1C1410]" />
        </motion.button>
        <div className="flex-1">
          <h2 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410]">
            Keranjang
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436]">
            Meja {tableId.replace(/^[A-Za-z]+/, "")} · {totalItems} item
          </p>
        </div>
        {items.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={clearCart}
            className="text-xs text-red-400 font-medium cursor-pointer px-2 py-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Kosongkan
          </motion.button>
        )}
      </div>

      {/* ── Empty state ── */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="text-7xl"
          >
            🛒
          </motion.div>
          <div className="text-center">
            <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-bold text-[#1C1410]">
              Keranjang Kosong
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#6B4436] mt-1">
              Yuk tambahkan menu favoritmu!
            </p>
          </div>
          <motion.button
            whileHover={{ translateY: -3, boxShadow: "0 8px 24px rgba(69,161,253,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/app/menu?table=${tableId}`)}
            className="px-6 py-3 rounded-2xl cursor-pointer"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "linear-gradient(135deg, #45A1FD, #82C2FF)",
              color: "white",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            Lihat Menu
          </motion.button>
        </div>
      ) : (
        <div className="flex flex-col pb-6 px-4">
          {/* ── Swipe hint ── */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-3">
            <AlertCircle size={13} className="text-amber-500 shrink-0" />
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-amber-600">
              Geser item ke kiri atau tekan 🗑️ untuk menghapus
            </p>
          </div>

          {/* ── Cart items ── */}
          <div className="mt-3 flex flex-col gap-2.5">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.cartId}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <CartItemRow item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Add more ── */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/app/menu?table=${tableId}`)}
            className="mt-3 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#45A1FD]/40 cursor-pointer hover:bg-[#EBF5FF] transition-colors"
          >
            <Plus size={15} className="text-[#45A1FD]" />
            <span
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-sm font-semibold text-[#45A1FD]"
            >
              Tambah Item Lain
            </span>
          </motion.button>

          {/* ── Order notes ── */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={15} className="text-[#6B4436]" />
              <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410] text-sm">
                Catatan Pesanan
              </h3>
              <span
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-xs text-[#9CA3AF]"
              >
                (opsional)
              </span>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: kopi tanpa gula, tambah es batu..."
              rows={3}
              className="w-full bg-white rounded-2xl px-4 py-3 text-sm text-[#1C1410] placeholder:text-[#C4C4C4] resize-none focus:outline-none border-2 border-gray-100 focus:border-[#45A1FD]/40 transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          {/* ── Summary card ── */}
          <div className="mt-4 bg-white rounded-3xl p-5 shadow-sm">
            <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410] mb-3">
              Ringkasan Pesanan
            </h3>

            {/* Line items */}
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.cartId} className="flex items-center justify-between">
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436]">
                    {item.qty}× {item.name}
                  </span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-medium text-[#1C1410]">
                    Rp {(item.price * item.qty).toLocaleString("id")}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#6B4436]">
                  Subtotal
                </span>
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm font-medium text-[#1C1410]">
                  Rp {subtotal.toLocaleString("id")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#6B4436]">
                  Service (5%)
                </span>
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm font-medium text-[#1C1410]">
                  Rp {serviceCharge.toLocaleString("id")}
                </span>
              </div>
            </div>

            <div className="border-t-2 border-gray-100 mt-3 pt-3 flex items-center justify-between">
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: "#1C1410" }}>
                Total
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "17px", color: "#45A1FD" }}>
                Rp {grandTotal.toLocaleString("id")}
              </span>
            </div>

            {/* Points estimation */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 flex items-center gap-2.5 bg-[#EBF5FF] rounded-xl px-3.5 py-2.5"
            >
              <div className="text-xl">🎯</div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#45A1FD" }}>
                  Estimasi poin: +{grandPoints} poin
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
                  Akan ditambahkan setelah pesanan selesai
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Order button ── */}
          <motion.button
            whileHover={!isOrdering ? { translateY: -3, boxShadow: "0 12px 32px rgba(69,161,253,0.45)" } : {}}
            whileTap={!isOrdering ? { scale: 0.97 } : {}}
            onClick={handleOrder}
            disabled={isOrdering}
            className="mt-5 w-full py-4 rounded-2xl flex items-center justify-center gap-3 cursor-pointer"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: isOrdering
                ? "linear-gradient(135deg, #FDA07A, #FDB896)"
                : "linear-gradient(135deg, #45A1FD, #82C2FF)",
              color: "white",
              fontWeight: 700,
              fontSize: "15px",
              boxShadow: isOrdering ? "none" : "0 6px 20px rgba(69,161,253,0.4)",
            }}
          >
            {isOrdering ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Memproses Pesanan...
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                Pesan Sekarang · Rp {grandTotal.toLocaleString("id")}
              </>
            )}
          </motion.button>

          <p
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-center text-xs text-[#9CA3AF] mt-3"
          >
            Pesanan akan langsung diteruskan ke dapur ☕
          </p>
        </div>
      )}
    </div>
  );
}

