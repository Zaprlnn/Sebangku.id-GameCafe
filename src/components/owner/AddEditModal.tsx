import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, Dices, Utensils, TrendingUp, Settings, LogOut, 
  Menu, X, TrendingDown, Users, ShoppingBag, UserPlus,
  ChevronRight, Plus, Edit2, Trash2,
  ToggleLeft, ToggleRight, Power, Image as ImageIcon, Coffee, Package, Save,
  Grid3X3, List, MessageSquare, Star,
  Eye, EyeOff, AlertCircle,
  Tag, Table2, MapPin, Hash, Armchair, CheckCircle2, XCircle, Layers
} from "lucide-react";

export default function AddEditModal(props: any) {
  const {
    showFormModal,
    setShowFormModal,
    formType,
    formMode,
    isSavingForm,
    handleSaveForm,
    fieldName,
    setFieldName,
    fieldCategory,
    setFieldCategory,
    fieldPrice,
    setFieldPrice,
    fieldStock,
    setFieldStock,
    fieldMinPlayers,
    setFieldMinPlayers,
    fieldMaxPlayers,
    setFieldMaxPlayers,
    fieldImageUrl,
    setFieldImageUrl,
    fieldStatus,
    setFieldStatus,
    isDragOver,
    setIsDragOver,
    handleImageFile,
  } = props;
  if (!showFormModal) return null;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={() => setShowFormModal(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {/* Modal Header */}
          <div
            className={`p-5 border-b border-slate-100 flex items-center justify-between rounded-t-3xl ${
              formType === "game"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                : "bg-gradient-to-r from-orange-500 to-amber-500"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                {formType === "game" ? (
                  <Dices size={18} className="text-white" />
                ) : (
                  <Utensils size={18} className="text-white" />
                )}
              </div>
              <div>
                <h3 className="text-white font-black text-sm">
                  {formMode === "add" ? "Tambah" : "Edit"}{" "}
                  {formType === "game" ? "Board Game" : "Menu F&B"}
                </h3>
                <p className="text-white/70 text-[10px] font-medium">
                  {formMode === "add"
                    ? "Data akan tersambung ke kasir otomatis"
                    : "Perubahan tersinkron ke kasir"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFormModal(false)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSaveForm} className="p-5 flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Nama {formType === "game" ? "Game" : "Menu"} *
              </label>
              <input
                type="text"
                required
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder={
                  formType === "game" ? "contoh: Pandemic" : "contoh: Kopi Susu"
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Kategori *
              </label>
              <select
                value={fieldCategory}
                onChange={(e) => setFieldCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                {formType === "game" ? (
                  <>
                    <option value="Strategy">Strategy</option>
                    <option value="Cooperative">Cooperative</option>
                    <option value="Party">Party Game</option>
                    <option value="Family">Family</option>
                    <option value="Deduction">Deduction</option>
                    <option value="RPG">RPG</option>
                  </>
                ) : (
                  <>
                    <option value="Food">Food</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Dessert">Dessert</option>
                  </>
                )}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                {formType === "game"
                  ? "Harga Sewa / Jam (Rp)"
                  : "Harga Jual (Rp)"}{" "}
                *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  required
                  min={0}
                  value={fieldPrice}
                  onChange={(e) => setFieldPrice(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Game specific: Stock & Players */}
            {formType === "game" && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                    Stok
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={fieldStock}
                    onChange={(e) => setFieldStock(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                    Min Pemain
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={fieldMinPlayers}
                    onChange={(e) => setFieldMinPlayers(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                    Max Pemain
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={fieldMaxPlayers}
                    onChange={(e) => setFieldMaxPlayers(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Image Upload - Drag & Drop */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Foto {formType === "game" ? "Game" : "Menu"} (opsional)
              </label>

              {fieldImageUrl ? (
                /* Preview with remove button */
                <div className="relative w-full h-36 rounded-2xl overflow-hidden border-2 border-slate-200 group">
                  <img
                    src={fieldImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setFieldImageUrl("")}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <X size={11} /> Hapus Foto
                    </button>
                  </div>
                </div>
              ) : (
                /* Drop Zone — label + hidden input (standar HTML5, tidak trigger form submit) */
                <label
                  className={`flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                    isDragOver
                      ? formType === "game"
                        ? "border-blue-500 bg-blue-50"
                        : "border-orange-400 bg-orange-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleImageFile(file);
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(file);
                      e.target.value = "";
                    }}
                  />
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                      isDragOver
                        ? formType === "game"
                          ? "bg-blue-100"
                          : "bg-orange-100"
                        : "bg-slate-200"
                    }`}
                  >
                    <ImageIcon
                      size={18}
                      className={
                        isDragOver
                          ? formType === "game"
                            ? "text-blue-600"
                            : "text-orange-500"
                          : "text-slate-400"
                      }
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    {isDragOver
                      ? "Lepaskan untuk upload"
                      : "Drag & drop atau klik untuk pilih foto"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    PNG, JPG, WEBP maks. 5MB
                  </p>
                </label>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Status
              </label>
              <div className="flex gap-2">
                {(formType === "game"
                  ? [
                      ["Available", "Tersedia"],
                      ["Maintenance", "Maintenance"],
                    ]
                  : [
                      ["In Stock", "Tersedia"],
                      ["Out of Stock", "Habis"],
                    ]
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFieldStatus(val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                      fieldStatus === val
                        ? val === "Available" || val === "In Stock"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-red-400 bg-red-50 text-red-600"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kasir sync info */}
            <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Package size={13} className="text-blue-600" />
              </div>
              <p className="text-[10px] text-blue-700 font-semibold leading-relaxed">
                Data akan otomatis tersinkron ke <strong>halaman kasir</strong>{" "}
                setelah disimpan.
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSavingForm}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${
                  formType === "game"
                    ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                    : "bg-orange-500 hover:bg-orange-600 shadow-orange-100"
                } ${!isSavingForm ? "cursor-pointer" : ""}`}
              >
                {isSavingForm ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "linear",
                      }}
                      className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    {formMode === "add"
                      ? "Simpan & Tambah"
                      : "Simpan Perubahan"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
