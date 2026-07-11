import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Save,
  X,
  Settings,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function CommunityView() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"reviews" | "suggestions">(
    "reviews",
  );
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<
    number | "All"
  >("All");
  const loadReviews = () => {
    const saved = localStorage.getItem("sebangku_reviews");
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      const defaultReviews = [
        {
          id: "REV-1",
          customerName: "Andi Saputra",
          rating: 5,
          comment:
            "Makanan mie gorengnya enak banget! Game Mysterium Kids seru dimainkan sama anak-anak dan temen. Pelayanan ramah cepat.",
          items: ["Mie Goreng Special", "Mysterium Kids"],
          gameSuggestion: "Splendor",
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
          isVisible: true,
        },
        {
          id: "REV-2",
          customerName: "Citra Dewi",
          rating: 4,
          comment:
            "Kopinya mantap dan tempatnya cozy abis. Main Lucky Captain seru banget, pas buat nongkrong sore.",
          items: ["Es Kopi Susu", "Lucky Captain"],
          gameSuggestion: "Dixit",
          createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
          isVisible: true,
        },
      ];
      localStorage.setItem("sebangku_reviews", JSON.stringify(defaultReviews));
      setReviews(defaultReviews);
    }
  };
  useEffect(() => {
    loadReviews();
    const handleStorage = () => loadReviews();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  const handleDeleteReview = (id: string) => {
    if (!window.confirm("Yakin ingin menghapus ulasan ini?")) return;
    const updated = reviews.filter((r) => r.id !== id);
    localStorage.setItem("sebangku_reviews", JSON.stringify(updated));
    setReviews(updated);
    window.dispatchEvent(new Event("storage"));
  };
  
  const handleDeleteSelected = () => {
    if (selectedReviewIds.length === 0) return;
    if (!window.confirm(`Yakin ingin menghapus ${selectedReviewIds.length} ulasan terpilih?`)) return;
    const updated = reviews.filter((r) => !selectedReviewIds.includes(r.id));
    localStorage.setItem("sebangku_reviews", JSON.stringify(updated));
    setReviews(updated);
    setSelectedReviewIds([]);
    setIsSelectMode(false);
    window.dispatchEvent(new Event("storage"));
  };
  
  const toggleSelection = (id: string) => {
    setSelectedReviewIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  const handleAddSuggestedGame = (suggestionText: string) => {
    const savedGames = localStorage.getItem("sebangku_board_games");
    const gamesList = savedGames
      ? JSON.parse(savedGames)
      : [
          {
            id: "bg1",
            name: "Mysterium Kids",
            rating: 4.8,
            players: "2-6",
            duration: "21 min",
            category: "Cooperative",
            status: "Available",
            minAge: "6+",
            complexity: "Easy",
            description:
              "Mysterium Kids adalah permainan kooperatif di mana pemain harus menebak objek berdasarkan suara dari tamborin kecil.",
          },
          {
            id: "bg2",
            name: "Lucky Captain",
            rating: 4.5,
            players: "2-4",
            duration: "30 min",
            category: "Strategy",
            status: "In Use",
            currentUser: "Budi L.",
            endTime: "17:30",
            minAge: "8+",
            complexity: "Medium",
            description:
              "Lucky Captain adalah permainan strategi bajak laut taktis yang memadukan pengumpulan harta karun dan pertempuran seru di laut lepas.",
          },
          {
            id: "bg3",
            name: "Kraken Attack",
            rating: 4.7,
            players: "1-4",
            duration: "25 min",
            category: "Strategy",
            status: "Available",
            minAge: "5+",
            complexity: "Easy",
            description:
              "Kraken Attack adalah permainan kooperatif seru di mana seluruh kru kapal harus bekerja sama mempertahankan dek dari serbuan tentakel gurita raksasa.",
          },
          {
            id: "bg4",
            name: "Sleepy Castle",
            rating: 4.9,
            players: "1-4",
            duration: "10 min",
            category: "Strategy",
            status: "Available",
            minAge: "6+",
            complexity: "Easy",
            description:
              "Sleepy Castle adalah permainan ingatan dan strategi ringan di mana ksatria menyelinap ke istana yang tertidur untuk menyelamatkan putri.",
          },
          {
            id: "bg5",
            name: "Detective Charlie",
            rating: 4.6,
            players: "1-5",
            duration: "25 min",
            category: "Strategy",
            status: "Maintenance",
            minAge: "7+",
            complexity: "Easy",
            description:
              "Detective Charlie adalah permainan deduksi anak-anak kooperatif untuk memecahkan misteri di Pulau Mainan bersama detektif terbaik.",
          },
          {
            id: "bg6",
            name: "Ruben Rallye",
            rating: 4.6,
            players: "2-4",
            duration: "15 min",
            category: "Family",
            status: "Available",
            minAge: "6+",
            complexity: "Easy",
            description:
              "Ruben Rallye adalah permainan balap mobil taktis yang menyenangkan, melatih ketangkasan berhitung dan keputusan cepat.",
          },
          {
            id: "bg7",
            name: "Waroong Wars",
            rating: 4.4,
            players: "3-5",
            duration: "30 min",
            category: "Strategy",
            status: "Available",
            minAge: "8+",
            complexity: "Medium",
            description:
              "Waroong Wars adalah permainan kartu bertema kuliner khas Indonesia. Jadilah warung terbaik dengan mengelola bahan masakan.",
          },
          {
            id: "bg8",
            name: "Fold it",
            rating: 4.2,
            players: "1-5",
            duration: "20 min",
            category: "Party",
            status: "In Use",
            currentUser: "Reni W.",
            endTime: "18:00",
            minAge: "7+",
            complexity: "Medium",
            description:
              "Fold It melatih kecepatan berpikir dan motorik tangan. Pemain harus melipat saputangan kain sesuai dengan resep pesanan secepat mungkin.",
          },
          {
            id: "bg9",
            name: "Slide Quest",
            rating: 4.5,
            players: "1-4",
            duration: "45 min",
            category: "Party",
            status: "Available",
            minAge: "6+",
            complexity: "Easy",
            description:
              "Slide Quest adalah permainan kooperatif seru di mana para pemain harus memiringkan papan untuk memandu ksatria meluncur melewati rintangan.",
          },
          {
            id: "bg10",
            name: "Gold Am Orinoko",
            rating: 4.4,
            players: "2-4",
            duration: "20 min",
            category: "Strategy",
            status: "Available",
            minAge: "7+",
            complexity: "Medium",
            description:
              "Petualangan melintasi sungai Orinoko yang berbahaya. Gunakan strategi melompat di batang kayu untuk membawa emas kuno kembali ke desa.",
          },
          {
            id: "bg11",
            name: "4 in a Row On The Go",
            rating: 4.3,
            players: "2-2",
            duration: "10 min",
            category: "Family",
            status: "Available",
            minAge: "6+",
            complexity: "Easy",
            description:
              "Permainan menyusun 4 koin berurutan secara horizontal, vertikal, atau diagonal yang legendaris, praktis dibawa ke mana saja.",
          },
          {
            id: "bg12",
            name: "Magic Maze",
            rating: 4.3,
            players: "1-7",
            duration: "15 min",
            category: "Strategy",
            status: "Maintenance",
            minAge: "8+",
            complexity: "Medium",
            description:
              "Magic Maze adalah permainan kooperatif real-time yang unik. Para pemain tidak boleh berbicara saat mengontrol pergerakan pahlawan.",
          },
        ];

    if (
      gamesList.some(
        (g: any) => g.name.toLowerCase() === suggestionText.toLowerCase(),
      )
    ) {
      alert("Game ini sudah ada di koleksi!");
      return;
    }

    const newGame = {
      id: `bg${Date.now()}`,
      name: suggestionText,
      rating: 5.0,
      players: "2-4",
      duration: "30 min",
      category: "Strategy",
      status: "Available",
      minAge: "8+",
      complexity: "Medium",
      description: `${suggestionText} adalah board game baru yang diusulkan oleh komunitas pelanggan.`,
    };

    gamesList.push(newGame);
    localStorage.setItem("sebangku_board_games", JSON.stringify(gamesList));

    // Also save in rent games
    const savedRent = localStorage.getItem("sebangku_rent_games");
    const rentList = savedRent ? JSON.parse(savedRent) : [];
    rentList.push({
      id: `g${Date.now()}`,
      name: suggestionText,
      price: 12000,
      category: "Strategy",
      emoji: "🎲",
    });
    localStorage.setItem("sebangku_rent_games", JSON.stringify(rentList));

    window.dispatchEvent(new Event("storage"));
    alert(
      `Berhasil menambahkan "${suggestionText}" ke daftar Board Game Koleksi!`,
    );
  };
  const filteredReviews = useMemo(() => {
    return reviews.filter(
      (r: any) =>
        selectedRatingFilter === "All" || r.rating === selectedRatingFilter,
    );
  }, [reviews, selectedRatingFilter]);
  const suggestions = useMemo(() => {
    return reviews
      .filter((r: any) => r.gameSuggestion)
      .map((r: any) => ({
        game: r.gameSuggestion,
        user: r.customerName,
        date: r.createdAt,
      }));
  }, [reviews]);
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);
  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r: any) => {
      const rate = r.rating as 5 | 4 | 3 | 2 | 1;
      if (counts[rate] !== undefined) counts[rate]++;
    });
    return counts;
  }, [reviews]);
  return (
    <div
      className="flex flex-col gap-6 text-left"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-[#0F172A]">
          Community Reviews &amp; Suggestions
        </h2>
        <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider mt-0.5">
          Moderasi review dan tindak lanjuti usulan board game baru dari
          pelanggan
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-32">
          <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
            RATA-RATA RATING
          </span>
          <div>
            <h2 className="text-3xl font-black text-[#0F172A] flex items-baseline gap-1.5">
              {avgRating}{" "}
              <span className="text-sm font-bold text-slate-400">/ 5.0</span>
            </h2>
            <div className="flex gap-0.5 mt-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={i < Math.round(Number(avgRating)) ? "#F59E0B" : "none"}
                  className={
                    i < Math.round(Number(avgRating))
                      ? "text-amber-500"
                      : "text-slate-300"
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-32">
          <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
            TOTAL REVIEW
          </span>
          <div>
            <h2 className="text-3xl font-black text-[#3B82F6]">
              {reviews.length}
            </h2>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">
              Ulasan masuk dari pelanggan
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-32">
          <span className="text-[10px] font-black uppercase text-[#94A3B8] tracking-widest">
            USULAN GAME
          </span>
          <div>
            <h2 className="text-3xl font-black text-[#10B981]">
              {suggestions.length}
            </h2>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">
              Permintaan game dari komunitas
            </span>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col gap-1.5 justify-center">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star as 5 | 4 | 3 | 2 | 1] || 0;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div
                key={star}
                className="flex items-center gap-2 text-[10px] font-bold text-slate-500"
              >
                <span className="w-3">{star}★</span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-5 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "reviews"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Ulasan Pelanggan ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === "suggestions"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Usulan Game Baru ({suggestions.length})
        </button>
      </div>

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="flex flex-col gap-4">
          {/* Rating filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-black text-slate-400 uppercase mr-1.5">
              Filter Rating:
            </span>
            {["All", 5, 4, 3, 2, 1].map((rate) => (
              <button
                key={rate}
                onClick={() => setSelectedRatingFilter(rate as any)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                  selectedRatingFilter === rate
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                {rate === "All" ? "Semua" : `${rate} ★`}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-2">
            <button
              onClick={() => {
                setIsSelectMode(!isSelectMode);
                setSelectedReviewIds([]);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              {isSelectMode ? "Batal Pilih" : "Pilih Beberapa (Select)"}
            </button>
            {isSelectMode && selectedReviewIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Hapus Terpilih ({selectedReviewIds.length})
              </button>
            )}
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev: any) => (
              <div
                key={rev.id}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  {/* Header info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {isSelectMode && (
                        <input 
                          type="checkbox" 
                          checked={selectedReviewIds.includes(rev.id)}
                          onChange={() => toggleSelection(rev.id)}
                          className="w-4 h-4 cursor-pointer accent-blue-600 mr-1"
                        />
                      )}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {rev.customerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0F172A]">
                          {rev.customerName}
                        </h4>
                        <span className="text-[9px] text-[#94A3B8] font-bold">
                          {new Date(rev.createdAt).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          fill={i < rev.rating ? "#F59E0B" : "none"}
                          className={
                            i < rev.rating ? "text-amber-500" : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Items reviewed */}
                  <div className="flex flex-wrap gap-1">
                    {rev.items?.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[9px] font-bold bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  {/* Attachment image */}
                  {rev.photo && (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border">
                      <img
                        src={rev.photo}
                        alt="Ulasan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Suggestion badge */}
                  {rev.gameSuggestion && (
                    <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-2.5 flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wide">
                        💡 Usulan Game
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {rev.gameSuggestion}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-50">
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} /> Hapus Ulasan
                  </button>
                </div>
              </div>
            ))}

            {filteredReviews.length === 0 && (
              <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-10 text-center text-slate-400 text-xs">
                Tidak ada ulasan yang sesuai filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suggestions Tab */}
      {activeTab === "suggestions" && (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500">
                <th className="p-4 pl-6">USULAN GAME</th>
                <th className="p-4">DARI CUSTOMER</th>
                <th className="p-4">TANGGAL USULAN</th>
                <th className="p-4 text-right pr-6">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((sug: any, idx: number) => (
                <tr
                  key={idx}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-4 pl-6 font-bold text-[#0F172A]">
                    {sug.game}
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{sug.user}</td>
                  <td className="p-4 text-slate-400 font-bold">
                    {new Date(sug.date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button
                      onClick={() => handleAddSuggestedGame(sug.game)}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      + Tambah ke Koleksi
                    </button>
                  </td>
                </tr>
              ))}
              {suggestions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-slate-400 text-xs"
                  >
                    Belum ada usulan game dari pelanggan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
