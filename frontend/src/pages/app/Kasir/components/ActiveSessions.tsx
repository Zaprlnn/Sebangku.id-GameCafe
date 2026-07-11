import React from "react";
import { Clock, CheckCircle, AlertTriangle, PlayCircle } from "lucide-react";

interface ActiveSessionsProps {
  sessions: any[];
  sessionFilter: "All" | "Ending Soon" | "All Day";
  setSessionFilter: (filter: "All" | "Ending Soon" | "All Day") => void;
  completedCount: number;
  revenue: number;
  formatTime: (sec: number) => string;
  formatRupiah: (val: number) => string;
  onOpenConfirmModal: (id: number, name: string, action: "end" | "extend") => void;
  onOpenAddSession: () => void;
}

export function ActiveSessions({
  sessions, sessionFilter, setSessionFilter, completedCount, revenue,
  formatTime, formatRupiah, onOpenConfirmModal, onOpenAddSession
}: ActiveSessionsProps) {
  
  // Filter sesi berdasarkan kriteria waktu kasir
  const filtered = sessions.filter(s => {
    if (sessionFilter === "Ending Soon") return s.secondsLeft < 3600 && s.secondsLeft > 0;
    if (sessionFilter === "All Day") return s.duration.toLowerCase().includes("all day");
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ─── KARTU METRIK RINGKASAN RENTAL ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1E293B] border border-[#334155] p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Active Players</p>
            <h3 className="text-xl font-black text-white mt-1">{sessions.length} Meja</h3>
          </div>
          <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center text-[#3B82F6]"><Clock className="w-5 h-5" /></div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Selesai Hari Ini</p>
            <h3 className="text-xl font-black text-white mt-1">{completedCount} Sesi</h3>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400"><CheckCircle className="w-5 h-5" /></div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#64748B] font-bold uppercase tracking-wider">Estimasi Omset Rental</p>
            <h3 className="text-xl font-black text-[#3B82F6] font-mono mt-1">{formatRupiah(revenue)}</h3>
          </div>
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">💰</div>
        </div>
      </div>

      {/* ─── BAR FILTER KASIR & TOMBOL AKSI ─── */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-[#1E293B] p-4 rounded-2xl border border-[#334155]">
        <div className="flex gap-2 p-1 bg-[#0F172A] rounded-xl border border-[#334155]">
          {(["All", "Ending Soon", "All Day"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSessionFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${sessionFilter === filter ? "bg-[#3B82F6] text-white" : "text-[#94A3B8] hover:text-white"}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenAddSession}
          className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-[#3B82F6]/10"
        >
          <PlayCircle className="w-4 h-4" />
          Buka Meja Rental Baru
        </button>
      </div>

      {/* ─── GRID KARTU TIMERS REALTIME ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto max-h-[50vh] pr-1">
        {filtered.map((s) => {
          const isEndingSoon = s.secondsLeft < 600 && s.secondsLeft > 0; // Kurang dari 10 menit
          const isTimeOut = s.secondsLeft === 0;

          return (
            <div
              key={s.id}
              className={`bg-[#1E293B] border p-4 rounded-2xl flex flex-col justify-between h-44 shadow-md transition-all relative overflow-hidden ${isTimeOut ? "border-rose-500/50 shadow-rose-500/5" : isEndingSoon ? "border-amber-500/50 shadow-amber-500/5 animate-pulse" : "border-[#334155]"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase ${isTimeOut ? "bg-rose-500/10 text-rose-400" : isEndingSoon ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                    {isTimeOut ? "Waktu Habis" : isEndingSoon ? "Ending Soon" : s.duration}
                  </span>
                  <h4 className="font-bold text-xs text-white mt-2.5 line-clamp-1">{s.name}</h4>
                  <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">{s.game} • <span className="text-white font-semibold">Meja {s.table}</span></p>
                </div>

                <div className={`flex items-center gap-1.5 font-mono text-xs font-black px-2.5 py-1.5 rounded-xl bg-[#0F172A] border ${isTimeOut ? "text-rose-400 border-rose-500/30" : isEndingSoon ? "text-amber-400 border-amber-500/30" : "text-[#3B82F6] border-[#334155]"}`}>
                  {isEndingSoon && !isTimeOut && <AlertTriangle className="w-3.5 h-3.5" />}
                  {formatTime(s.secondsLeft)}
                </div>
              </div>

              {/* ACTION PANEL BAGIAN BAWAH KARTU */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#334155]/40 text-center">
                <button
                  onClick={() => onOpenConfirmModal(s.id, s.name, "extend")}
                  className="py-1.5 border border-[#334155] text-[#94A3B8] hover:text-white hover:bg-[#0F172A]/40 font-bold text-[11px] rounded-xl transition-all cursor-pointer"
                >
                  ⏳ Perpanjang
                </button>
                <button
                  onClick={() => onOpenConfirmModal(s.id, s.name, "end")}
                  className={`py-1.5 font-bold text-[11px] rounded-xl transition-all cursor-pointer ${isTimeOut ? "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10" : "bg-[#0F172A] border border-[#334155] text-rose-400 hover:bg-rose-500/10"}`}
                >
                  🛑 Selesai Main
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#64748B] italic text-xs">
            Tidak ada sesi bermain aktif yang sesuai dengan filter.
          </div>
        )}
      </div>
    </div>
  );
}