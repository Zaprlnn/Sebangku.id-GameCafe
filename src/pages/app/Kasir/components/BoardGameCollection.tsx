import React from "react";
import { Search, Grid, List, Tag } from "lucide-react";

interface BoardGameCollectionProps {
  searchGameQuery: string;
  setSearchGameQuery: (query: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (status: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  gameLayoutView: "grid" | "list";
  setGameLayoutView: (view: "grid" | "list") => void;
  filteredBoardGames: any[];
  setSelectedDetailGame: (game: any) => void;
}

export function BoardGameCollection({
  searchGameQuery, setSearchGameQuery, selectedStatusFilter, setSelectedStatusFilter,
  selectedCategoryFilter, setSelectedCategoryFilter, gameLayoutView, setGameLayoutView,
  filteredBoardGames, setSelectedDetailGame
}: BoardGameCollectionProps) {
  return (
    <div className="flex flex-col gap-5 h-full text-left">
      {/* Filter & Kontrol Atas */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center bg-[#1E293B] p-4 rounded-2xl border border-[#334155]">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari koleksi board game..."
            value={searchGameQuery}
            onChange={(e) => setSearchGameQuery(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6] cursor-pointer"
          >
            <option value="All">Semua Status</option>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6] cursor-pointer"
          >
            <option value="All">Semua Kategori</option>
            <option value="Strategy">Strategy</option>
            <option value="Family">Family</option>
            <option value="Party">Party</option>
            <option value="Cooperative">Cooperative</option>
          </select>

          <div className="flex bg-[#0F172A] border border-[#334155] p-0.5 rounded-xl">
            <button onClick={() => setGameLayoutView("grid")} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${gameLayoutView === "grid" ? "bg-[#3B82F6] text-white" : "text-[#64748B]"}`}><Grid className="w-3.5 h-3.5" /></button>
            <button onClick={() => setGameLayoutView("list")} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${gameLayoutView === "list" ? "bg-[#3B82F6] text-white" : "text-[#64748B]"}`}><List className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* Konten Utama Katalog */}
      {gameLayoutView === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto max-h-[60vh] pr-1">
          {filteredBoardGames.map((game) => (
            <div
              key={game.id}
              onClick={() => setSelectedDetailGame(game)}
              className="bg-[#1E293B] border border-[#334155] rounded-2xl p-3 flex flex-col justify-between hover:border-[#3B82F6] cursor-pointer transition-all group relative overflow-hidden shadow"
            >
              <div className="absolute top-2 right-2 z-10">
                <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${game.status === "Available" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : game.status === "In Use" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                  {game.status}
                </span>
              </div>

              <div className="aspect-[4/3] w-full bg-[#0F172A] rounded-xl mb-3 overflow-hidden p-3 flex items-center justify-center">
                <img src={game.image} alt={game.name} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
              </div>

              <div>
                <span className="text-[9px] text-[#64748B] font-bold flex items-center gap-1"><Tag className="w-2.5 h-2.5" /> {game.category}</span>
                <h4 className="font-extrabold text-xs text-[#E2E8F0] mt-1 truncate">{game.name}</h4>
                <div className="flex justify-between items-center text-[10px] text-[#94A3B8] mt-2.5 border-t border-[#334155]/40 pt-2 font-medium">
                  <span>👥 {game.players} Players</span>
                  <span>⏱️ {game.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-1">
          {filteredBoardGames.map((game) => (
            <div
              key={game.id}
              onClick={() => setSelectedDetailGame(game)}
              className="bg-[#1E293B] border border-[#334155] rounded-xl p-3 flex items-center justify-between hover:border-[#3B82F6] cursor-pointer transition-all shadow"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-[#0F172A] rounded-lg p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={game.image} alt={game.name} className="max-h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-[#E2E8F0] truncate">{game.name}</h4>
                  <p className="text-[10px] text-[#64748B] mt-0.5 font-medium">{game.category} • 👥 {game.players} Plrs • ⏱️ {game.duration}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${game.status === "Available" ? "bg-emerald-500/10 text-emerald-400" : game.status === "In Use" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"}`}>
                {game.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}