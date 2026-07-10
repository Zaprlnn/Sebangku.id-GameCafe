import React from "react";
import { Search, Plus, Minus, ShoppingBag, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface MenuOrderPOSProps {
  activeTab: "f&b" | "rent";
  setActiveTab: (tab: "f&b" | "rent") => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  itemsToDisplay: any[];
  addToCart: (item: any) => void;
  cart: any[];
  updateQuantity: (id: string, delta: number) => void;
  cartTotal: number;
  paymentMethod: "Cash" | "QRIS" | "WINPAY";
  setPaymentMethod: (method: "Cash" | "QRIS" | "WINPAY") => void;
  handleCheckout: () => void;
  formatRupiah: (val: number) => string;
  selectedCustomer?: any;
  winpayChannel?: string;
  setWinpayChannel?: (ch: any) => void;
}

export function MenuOrderPOS({
  activeTab, setActiveTab, categories, selectedCategory, setSelectedCategory,
  searchQuery, setSearchQuery, itemsToDisplay, addToCart, cart, updateQuantity,
  cartTotal, paymentMethod, setPaymentMethod, handleCheckout, formatRupiah,
  selectedCustomer, winpayChannel, setWinpayChannel
}: MenuOrderPOSProps) {
  return (
    <div className="flex w-full h-full text-left">
      {/* Kiri/Tengah: Daftar Menu & Pencarian */}
      <div className="flex-1 flex flex-col h-full bg-white relative z-0">
        
        {/* POS Header / Tabs */}
        <header className="border-b border-[#E2E8F0] px-4 md:px-6 py-3 shrink-0 flex items-center justify-between bg-white">
          <div className="flex gap-4">
            <button
              onClick={() => { setActiveTab("f&b"); setSelectedCategory("All"); }}
              className="px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer"
              style={{
                borderColor: activeTab === "f&b" ? "#3B82F6" : "transparent",
                color: activeTab === "f&b" ? "#3B82F6" : "#64748B"
              }}
            >
              F&B Order
            </button>
            <button
              onClick={() => { setActiveTab("rent"); setSelectedCategory("All"); }}
              className="px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer"
              style={{
                borderColor: activeTab === "rent" ? "#3B82F6" : "transparent",
                color: activeTab === "rent" ? "#3B82F6" : "#64748B"
              }}
            >
              Rent Game
            </button>
          </div>

          <div className="relative w-44 md:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
            <input
              type="text"
              placeholder={`Cari ${activeTab === "f&b" ? "makanan" : "board game"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#3B82F6]"
            />
          </div>
        </header>

        {/* Categories Pills */}
        <div className="px-4 md:px-6 py-3.5 shrink-0 flex gap-2 overflow-x-auto border-b border-[#F1F5F9] bg-[#FAFCFF] scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border"
                style={{
                  background: isSelected ? "#3B82F6" : "white",
                  color: isSelected ? "white" : "#64748B",
                  borderColor: isSelected ? "#3B82F6" : "#E2E8F0"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#FAFCFF]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {itemsToDisplay.map(item => (
              <motion.div
                key={item.id}
                layout
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(item)}
                className="relative overflow-hidden rounded-2xl h-44 flex flex-col justify-between p-4 border border-slate-200/40 shadow-sm group cursor-pointer"
              >
                {/* Full Card Background Image */}
                <img
                  src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop&q=80"}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop&q=80"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {(item.status === "Out of Stock" || item.status === "Maintenance" || item.active === false) && (
                  <div className="absolute inset-0 bg-slate-900/80 z-20 flex flex-col items-center justify-center text-center p-2">
                    <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm mb-1">
                      {item.status === "Out of Stock" ? "Out of Stock" : item.status === "Maintenance" ? "Maintenance" : "Nonaktif"}
                    </span>
                  </div>
                )}

                <div className="relative z-10 flex flex-col justify-between h-full w-full pointer-events-none">
                  <div>
                    <span className="text-[9px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-black text-white mt-1.5 leading-snug drop-shadow" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-extrabold text-white drop-shadow">{formatRupiah(item.price)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                      disabled={item.status === "Out of Stock" || item.status === "Maintenance" || item.active === false}
                      className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-slate-500 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow cursor-pointer active:scale-95 z-30"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {itemsToDisplay.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-sm text-[#94A3B8]">Tidak ada item yang cocok dengan filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Kanan: Ringkasan & Metode Pembayaran */}
      <section className="w-[320px] shrink-0 border-l border-[#E2E8F0] bg-white flex flex-col justify-between h-full">
        {/* Cart Header */}
        <div className="p-4 border-b border-[#E2E8F0] shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 style={{ fontFamily: "'Poppins', sans-serif" }} className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              Order Summary
            </h2>
            {selectedCustomer && (
              <span className="bg-[#EFF6FF] text-[#3B82F6] text-[10px] font-black px-2 py-0.5 rounded-md">
                Customer Selected
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B] mt-1 truncate">
            {selectedCustomer ? `Atas Nama: ${selectedCustomer.name}` : "Pilih customer dari list sebelah kiri"}
          </p>
        </div>

        {/* Cart List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-200 border border-slate-300/40 overflow-hidden flex items-center justify-center shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm select-none">{item.emoji}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1E293B] truncate leading-tight">{item.name}</p>
                  <p className="text-[10px] text-[#64748B] mt-0.5">{formatRupiah(item.price)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-5 h-5 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Minus size={10} />
                </button>
                <span className="text-xs font-bold text-[#1E293B] w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                >
                  <Plus size={10} />
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
              <ShoppingBag size={32} strokeWidth={1.5} className="text-[#94A3B8] mb-2.5" />
              <p className="text-xs text-[#94A3B8]">Keranjang belanja kosong.</p>
              <p className="text-[10px] text-[#CBD5E1] mt-1 max-w-[180px]">Pilih makanan atau board game untuk disewa.</p>
            </div>
          )}
        </div>

        {/* Payment & Checkout Footer */}
        <div className="p-4 border-t border-[#E2E8F0] shrink-0 bg-[#FAFAFC]">
          
          <div className="mb-4">
            <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider block mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod("Cash")}
                className="py-2 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
                style={{ borderColor: paymentMethod === "Cash" ? "#3B82F6" : "#E2E8F0", background: paymentMethod === "Cash" ? "#EFF6FF" : "white", color: paymentMethod === "Cash" ? "#3B82F6" : "#64748B" }}
              >
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod("QRIS")}
                className="py-2 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
                style={{ borderColor: paymentMethod === "QRIS" ? "#3B82F6" : "#E2E8F0", background: paymentMethod === "QRIS" ? "#EFF6FF" : "white", color: paymentMethod === "QRIS" ? "#3B82F6" : "#64748B" }}
              >
                QRIS
              </button>
              <button
                onClick={() => setPaymentMethod("WINPAY")}
                className="py-2 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
                style={{ borderColor: paymentMethod === "WINPAY" ? "#9333ea" : "#E2E8F0", background: paymentMethod === "WINPAY" ? "#faf5ff" : "white", color: paymentMethod === "WINPAY" ? "#9333ea" : "#64748B" }}
              >
                WINPAY
              </button>
            </div>
          </div>
          
          {paymentMethod === "WINPAY" && setWinpayChannel && (
            <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl mb-4 flex flex-col text-xs shadow-sm">
              <span className="text-[#64748B] font-bold mb-2">Pilih Channel Winpay:</span>
              <div className="flex gap-2">
                {(["BCA", "MANDIRI", "SHOPEEPAY"] as const).map(ch => (
                  <button key={ch} onClick={() => setWinpayChannel(ch)} className={`flex-1 py-1.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${winpayChannel === ch ? "bg-purple-600 border-purple-500 text-white shadow" : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-purple-300"}`}>{ch === "SHOPEEPAY" ? "ShopeePay" : `${ch} VA`}</button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-xs text-[#64748B] mb-1.5">
            <span>Subtotal</span>
            <span>{formatRupiah(cartTotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-extrabold text-[#0F172A] mb-4 pt-1.5 border-t border-dashed border-[#E2E8F0]">
            <span>TOTAL</span>
            <span className="text-base text-[#3B82F6]">{formatRupiah(cartTotal)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle size={16} />
            Checkout & Print Receipt
          </button>
        </div>
      </section>
    </div>
  );
}