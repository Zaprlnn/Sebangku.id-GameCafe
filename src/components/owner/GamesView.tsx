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

export default function GamesView(props: any) {
  const {
    gamesView,
    setGamesView,
    boardGames,
    triggerEditGame,
    triggerAddGame,
    confirmDelete,
    handleToggleStatusGame,
    togglingId,
    searchGame,
    setSearchGame,
    gameCategory,
    setGameCategory,
  } = props;
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <Dices size={20} className="text-blue-600" />
            Board Games Collection
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {boardGames.length} games ·{" "}
            {boardGames.filter((g: any) => g.active).length} aktif · tersambung ke
            kasir
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setGamesView("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${gamesView === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setGamesView("list")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${gamesView === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List size={14} />
            </button>
          </div>
          <button
            onClick={triggerAddGame}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-200 hover:shadow-blue-300"
          >
            <Plus size={14} /> Tambah Game
          </button>
        </div>
      </div>

      {/* Grid View */}
      {gamesView === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boardGames.map((game: any) => (
            <motion.div
              key={game.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${
                game.active ? "border-slate-100" : "border-slate-200 opacity-70"
              }`}
            >
              {/* Card Image */}
              <div className="relative h-36 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
                {game.image ? (
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 text-blue-300">
                    <Dices size={32} strokeWidth={1.5} />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">
                      No Image
                    </span>
                  </div>
                )}
                {/* Active badge */}
                <div
                  className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    game.active
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-500 text-white"
                  }`}
                >
                  {game.active ? "Aktif" : "Nonaktif"}
                </div>
                {/* Stock badge */}
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Stok: {game.stock}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex flex-col gap-2 flex-1">
                <div>
                  <p className="font-black text-sm text-[#0F172A] truncate">
                    {game.name}
                  </p>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                    {game.category}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Harga sewa/jam
                    </p>
                    <p className="text-sm font-black text-[#0F172A]">
                      Rp {game.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-medium">
                      Disewa
                    </p>
                    <p className="text-sm font-black text-[#0F172A]">
                      {game.rented || 0}/{game.stock}
                    </p>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50">
                  {/* Toggle Active */}
                  <button
                    onClick={() => handleToggleStatusGame(game.id)}
                    disabled={togglingId === game.id}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      togglingId === game.id
                        ? "bg-slate-100 text-slate-400 cursor-wait"
                        : game.active
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                    }`}
                    title={game.active ? "Nonaktifkan" : "Aktifkan"}
                  >
                    {togglingId === game.id ? (
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
                    {togglingId === game.id
                      ? "Loading..."
                      : game.active
                        ? "Aktif"
                        : "Nonaktif"}
                  </button>
                  <button
                    onClick={() => triggerEditGame(game)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => confirmDelete("game", game.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Card Placeholder */}
          <motion.button
            onClick={triggerAddGame}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-dashed border-blue-200 rounded-2xl h-56 flex flex-col items-center justify-center gap-2 text-blue-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
          >
            <Plus size={24} />
            <span className="text-xs font-bold">Tambah Game Baru</span>
          </motion.button>
        </div>
      )}

      {/* List View */}
      {gamesView === "list" && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#94A3B8] border-b border-slate-100 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Game</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Stok</th>
                <th className="px-5 py-3">Harga/Jam</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {boardGames.map((game: any) => (
                <tr
                  key={game.id}
                  className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${!game.active ? "opacity-60" : ""}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        {game.image ? (
                          <img
                            src={game.image}
                            alt={game.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <Dices
                            size={16}
                            className="text-blue-400"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#0F172A]">{game.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {game.minPlayers || 2}–{game.maxPlayers || 6} pemain
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {game.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-600">
                    {game.rented || 0}/{game.stock} disewa
                  </td>
                  <td className="px-5 py-3.5 font-black text-[#0F172A]">
                    Rp {game.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleStatusGame(game.id)}
                      disabled={togglingId === game.id}
                      className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                        togglingId === game.id
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-wait"
                          : game.active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
                            : "bg-slate-100 text-slate-500 border border-slate-200 cursor-pointer"
                      }`}
                    >
                      {togglingId === game.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.7,
                            ease: "linear",
                          }}
                          className="w-2.5 h-2.5 border-2 border-slate-300 border-t-slate-500 rounded-full"
                        />
                      ) : game.active ? (
                        <ToggleRight size={12} />
                      ) : (
                        <ToggleLeft size={12} />
                      )}
                      {togglingId === game.id
                        ? "Loading..."
                        : game.active
                          ? "Aktif"
                          : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => triggerEditGame(game)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => confirmDelete("game", game.id)}
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
