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

export default function DashboardView(props: any) {
  const { activeSessions, topGames, recentTransactions } = props;
  return (
    <div className="flex flex-col gap-6">
      {/* Greeting & Date Overview (matching image) */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
          Good evening, Owner 👋
        </h1>
        <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">
          Tuesday, June 9, 2025 ·{" "}
          <span className="text-[#3B82F6]">TODAY'S OVERVIEW</span>
        </p>
      </div>

      {/* Row of 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="bg-white rounded-2xl p-5 border-l-4 border-[#3B82F6] border-y border-r border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
              Revenue Today
            </span>
            <TrendingUp size={16} className="text-[#3B82F6]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#0F172A] mt-2">
              Rp 1.245.000
            </h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1.5">
              <TrendingUp size={10} /> +12% vs yesterday
            </span>
          </div>
        </div>

        {/* Active Sessions Card */}
        <div className="bg-white rounded-2xl p-5 border-l-4 border-[#10B981] border-y border-r border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
              Active Sessions
            </span>
            <Users size={16} className="text-[#10B981]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#0F172A]">
              5 tables
            </h2>
            <span className="text-[10px] font-medium text-slate-500 mt-1 block">
              Current occupied game tables
            </span>
          </div>
        </div>

        {/* F&B Orders Card */}
        <div className="bg-white rounded-2xl p-5 border-l-4 border-[#3B82F6] border-y border-r border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
              F&B Orders
            </span>
            <ShoppingBag size={16} className="text-[#3B82F6]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#0F172A]">
              28 orders
            </h2>
            <span className="text-[10px] font-medium text-slate-500 mt-1 block">
              Processed cafe orders today
            </span>
          </div>
        </div>

        {/* New Customers Card */}
        <div className="bg-white rounded-2xl p-5 border-l-4 border-[#3B82F6] border-y border-r border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
              New Customers
            </span>
            <UserPlus size={16} className="text-[#3B82F6]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#0F172A]">
              8 today
            </h2>
            <span className="text-[10px] font-medium text-slate-500 mt-1 block">
              Newly registered gaming members
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Active Sessions Monitor + Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Sessions Monitor (Left, 2 cols width) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="font-black text-sm text-[#0F172A] uppercase tracking-wide">
              Active Sessions Monitor
            </h3>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
              5 active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-[#94A3B8] border-b border-slate-50 font-bold">
                  <th className="pb-3 uppercase tracking-wider">Customer</th>
                  <th className="pb-3 uppercase tracking-wider">Game Title</th>
                  <th className="pb-3 uppercase tracking-wider">Duration</th>
                  <th className="pb-3 uppercase tracking-wider">Time Left</th>
                  <th className="pb-3 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeSessions.map((session) => {
                  const isEndingSoon = session.status === "Ending Soon";
                  return (
                    <tr
                      key={session.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                      style={{
                        backgroundColor: isEndingSoon
                          ? "rgba(245,158,11,0.02)"
                          : "transparent",
                      }}
                    >
                      <td className="py-3.5">
                        <p className="font-bold text-[#0F172A]">
                          {session.customer}
                        </p>
                        <span className="text-[10px] font-bold text-blue-500/80">
                          {session.table}
                        </span>
                      </td>
                      <td className="py-3.5 font-medium text-slate-600">
                        {session.game}
                      </td>
                      <td className="py-3.5 text-slate-500">
                        {session.duration}
                      </td>
                      <td
                        className={`py-3.5 font-bold ${isEndingSoon ? "text-amber-500" : "text-slate-600"}`}
                      >
                        {session.timeLeft}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isEndingSoon
                              ? "text-amber-600 bg-amber-50 border border-amber-200"
                              : "text-emerald-600 bg-emerald-50 border border-emerald-100"
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Chart (Right, 1 col width) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="font-black text-sm text-[#0F172A] uppercase tracking-wide">
              Revenue — Last 7 Days
            </h3>
          </div>

          {/* Pure CSS Bar Chart */}
          <div className="flex items-end justify-between h-40 pt-4 px-2">
            {[
              { day: "Mon", val: 50 },
              { day: "Tue", val: 60 },
              { day: "Wed", val: 40 },
              { day: "Thu", val: 75 },
              { day: "Fri", val: 90 },
              { day: "Sat", val: 110 },
              { day: "Today", val: 70, isToday: true },
            ].map((bar, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="relative w-7 bg-slate-50 rounded-t-lg h-32 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(bar.val / 110) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className={`w-full rounded-t-lg transition-all ${
                      bar.isToday
                        ? "bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300"
                        : "bg-gradient-to-t from-[#3B82F6]/80 to-[#60A5FA]/80 group-hover:from-[#3B82F6] group-hover:to-[#60A5FA]"
                    }`}
                  />
                  {/* Hover tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold py-1 px-1.5 rounded shadow-md pointer-events-none transition-opacity whitespace-nowrap z-10">
                    {bar.val}%
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold ${bar.isToday ? "text-[#3B82F6]" : "text-[#94A3B8]"}`}
                >
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-50 pt-4 mt-4">
            <span>AVERAGE: Rp 940k</span>
            <span className="text-emerald-500 flex items-center gap-0.5">
              <TrendingUp size={10} /> +8.4%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Games + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Games This Week */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="font-black text-sm text-[#0F172A] uppercase tracking-wide">
              Top Games This Week
            </h3>
          </div>
          <div className="flex flex-col gap-3.5">
            {topGames.map((game) => (
              <div key={game.rank} className="flex items-center gap-3">
                <span className="text-sm font-black text-[#94A3B8] w-5 text-center">
                  {game.rank}
                </span>
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <img
                    src={game.img}
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-[#0F172A] truncate">
                    {game.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {game.plays} plays rented
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xs text-[#0F172A]">
                    Rp {game.revenue.toLocaleString("id-ID")}
                  </p>
                  <span className="text-[9px] text-emerald-500 font-bold">
                    Popular
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="font-black text-sm text-[#0F172A] uppercase tracking-wide">
              Recent Transactions
            </h3>
          </div>
          <div className="flex flex-col gap-3.5">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ShoppingBag size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-[#0F172A] truncate">
                      {tx.customer}
                    </p>
                    <span className="text-[9px] text-[#94A3B8] font-bold">
                      {tx.time}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {tx.items}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xs text-[#0F172A]">
                    Rp {tx.amount.toLocaleString("id-ID")}
                  </p>
                  <span className="text-[9px] bg-slate-50 text-slate-400 font-bold px-1 rounded uppercase">
                    {tx.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
