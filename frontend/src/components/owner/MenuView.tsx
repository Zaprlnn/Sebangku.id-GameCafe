import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Dices,
  Utensils,
  TrendingUp,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  TrendingDown,
  Users,
  ShoppingBag,
  UserPlus,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Power,
  ImageIcon,
  Coffee,
  Package,
  Save,
  Grid3X3,
  List,
  MessageSquare,
  Star,
  Eye,
  EyeOff,
  AlertCircle,
  Tag,
  Table2,
  MapPin,
  Hash,
  Armchair,
  CheckCircle2,
  XCircle,
  Layers,
  Search,
} from "lucide-react";
import sebangkuLogo from "../../../assets/images/logo_sebangku_cafee.png";
import ownerPhoto from "../../../assets/images/owner_photo.png";
import mystKidsImg from "../../../assets/images/Mysterium Kids.png";
import luckyCapImg from "../../../assets/images/Lucky Captain.png";
import krakenAttImg from "../../../assets/images/Kraken Attack.png";
import sleepyCasImg from "../../../assets/images/Sleepy Castle.png";

export default function MenuView(props: any) {
  const {
    fbView,
    setFbView,
    fbMenu,
    triggerAddFb,
    triggerEditFb,
    confirmDelete,
    handleToggleStatusFb,
    togglingId,
    searchFb,
    setSearchFb,
    fbCategory,
    setFbCategory,
  } = props;
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <Coffee size={20} className="text-orange-500" />
            Menu Food & Beverage
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {fbMenu.length} item · {fbMenu.filter((i: any) => i.active).length}{" "}
            tersedia · tersambung ke kasir
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setFbView("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${fbView === "grid" ? "bg-white text-orange-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setFbView("list")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${fbView === "list" ? "bg-white text-orange-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List size={14} />
            </button>
          </div>
          <button
            onClick={triggerAddFb}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-orange-100 hover:shadow-orange-200"
          >
            <Plus size={14} /> Tambah Menu
          </button>
        </div>
      </div>

      {/* Category Quick Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {["Semua", ...(props.dbCategories || []).filter((c: any) => c.type === "fnb").map((c: any) => c.name)].map((cat) => {
          const count =
            cat === "Semua"
              ? fbMenu.length
              : fbMenu.filter((i: any) => i.category === cat).length;
          return (
            <span
              key={cat}
              className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500 cursor-default"
            >
              {cat} ({count})
            </span>
          );
        })}
      </div>

      {/* Grid View */}
      {fbView === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {fbMenu.map((item: any) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${
                item.active ? "border-slate-100" : "border-slate-200 opacity-70"
              }`}
            >
              {/* Card Image */}
              <div className="relative h-32 bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 text-orange-300">
                    <Utensils size={28} strokeWidth={1.5} />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-orange-300">
                      No Image
                    </span>
                  </div>
                )}
                {/* Status badge */}
                <div
                  className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    item.active
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.active ? "Tersedia" : "Habis"}
                </div>
                {/* Category badge */}
                <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {item.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex flex-col gap-2 flex-1">
                <div>
                  <p className="font-black text-sm text-[#0F172A] truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {item.sold || 0} terjual hari ini
                  </p>
                </div>

                <p className="text-base font-black text-orange-500 mt-auto">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>

                {/* Action Row */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => handleToggleStatusFb(item.id)}
                    disabled={togglingId === item.id}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      togglingId === item.id
                        ? "bg-slate-100 text-slate-400 cursor-wait"
                        : item.active
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                          : "bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                    }`}
                  >
                    {togglingId === item.id ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.7,
                          ease: "linear",
                        }}
                        className="w-2.5 h-2.5 border-2 border-slate-300 border-t-slate-500 rounded-full"
                      />
                    ) : (
                      <Power size={11} />
                    )}
                    {togglingId === item.id
                      ? "Loading..."
                      : item.active
                        ? "Tersedia"
                        : "Habis"}
                  </button>
                  <button
                    onClick={() => triggerEditFb(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => confirmDelete("fb", item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Card Placeholder */}
          <motion.button
            onClick={triggerAddFb}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-dashed border-orange-200 rounded-2xl h-52 flex flex-col items-center justify-center gap-2 text-orange-400 hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer"
          >
            <Plus size={24} />
            <span className="text-xs font-bold">Tambah Menu Baru</span>
          </motion.button>
        </div>
      )}

      {/* List View */}
      {fbView === "list" && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#94A3B8] border-b border-slate-100 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Nama Menu</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Terjual</th>
                <th className="px-5 py-3">Harga</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {fbMenu.map((item: any) => (
                <tr
                  key={item.id}
                  className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${!item.active ? "opacity-60" : ""}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-orange-50 flex items-center justify-center shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <Utensils
                            size={15}
                            className="text-orange-400"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                      <p className="font-bold text-[#0F172A]">{item.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-bold">
                    {item.sold || 0} terjual
                  </td>
                  <td className="px-5 py-3.5 font-black text-orange-500">
                    Rp {item.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleStatusFb(item.id)}
                      disabled={togglingId === item.id}
                      className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                        togglingId === item.id
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-wait"
                          : item.active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
                            : "bg-red-50 text-red-600 border border-red-200 cursor-pointer"
                      }`}
                    >
                      {togglingId === item.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.7,
                            ease: "linear",
                          }}
                          className="w-2.5 h-2.5 border-2 border-slate-300 border-t-slate-500 rounded-full"
                        />
                      ) : item.active ? (
                        <ToggleRight size={12} />
                      ) : (
                        <ToggleLeft size={12} />
                      )}
                      {togglingId === item.id
                        ? "Loading..."
                        : item.active
                          ? "Tersedia"
                          : "Habis"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => triggerEditFb(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => confirmDelete("fb", item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
