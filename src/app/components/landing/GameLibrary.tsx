import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  ArrowRight, Users, Clock, Star, Info, BookOpen, X, Zap, ChevronDown
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA GAME UNGGULAN (Sesuai Katalog App)
// ─────────────────────────────────────────────────────────────────────────────

interface BoardGame {
  id: string;
  name: string;
  category: string;
  description: string;
  howToPlay: string[];
  minPlayers: number;
  maxPlayers: number;
  duration: string;
  difficulty: string;
  rating: number;
  image: string;
  tags: string[];
}

const FEATURED_GAMES: BoardGame[] = [
  {
    id: "g1", name: "Catan", category: "Strategy",
    description: "Bangun permukiman, kumpulkan sumber daya, dan jadilah penguasa pulau Catan.",
    howToPlay: [
      "Susun papan heksagonal secara acak.",
      "Lempar 2 dadu, kumpulkan resource sesuai angka.",
      "Gunakan resource untuk membangun jalan atau kota.",
      "Pemain pertama yang mencapai 10 Victory Points menang!",
    ],
    minPlayers: 3, maxPlayers: 4, duration: "60-120 mnt",
    difficulty: "Sedang", rating: 4.8,
    image: "https://images.unsplash.com/photo-1635921152718-06a19ec70a6c?w=600&q=80",
    tags: ["Populer", "Klasik"],
  },
  {
    id: "g2", name: "Codenames", category: "Deduction",
    description: "Dua tim bersaing untuk menemukan agen rahasia berdasarkan petunjuk kata.",
    howToPlay: [
      "Bagi pemain menjadi 2 tim: Merah & Biru.",
      "Spymaster memberi petunjuk 1 kata + angka.",
      "Tim menebak kartu berdasarkan petunjuk.",
      "Temukan semua agen timmu lebih dulu untuk menang!",
    ],
    minPlayers: 4, maxPlayers: 8, duration: "15-30 mnt",
    difficulty: "Mudah", rating: 4.7,
    image: "https://images.unsplash.com/photo-1733297190314-b49a52ac1f98?w=600&q=80",
    tags: ["Cepat", "Tim"],
  },
  {
    id: "g3", name: "Ticket to Ride", category: "Family",
    description: "Bangun jaringan kereta api melintasi peta Amerika untuk skor tertinggi.",
    howToPlay: [
      "Ambil kartu kereta atau klaim rute.",
      "Klaim rute dengan meletakkan wagonmu.",
      "Selesaikan tiket tujuan untuk poin bonus.",
      "Poin tertinggi di akhir permainan menang!",
    ],
    minPlayers: 2, maxPlayers: 5, duration: "45-75 mnt",
    difficulty: "Mudah", rating: 4.6,
    image: "https://images.unsplash.com/photo-1716817279221-d815f96dce7e?w=600&q=80",
    tags: ["Keluarga", "Santai"],
  },
  {
    id: "g4", name: "Pandemic", category: "Co-op",
    description: "Bekerja sama sebagai tim ilmuwan untuk menghentikan penyebaran penyakit.",
    howToPlay: [
      "Setiap pemain memiliki peran unik (Dokter, Peneliti, dll).",
      "Lakukan 4 aksi: bergerak, obati, atau bangun stasiun.",
      "Waspadai outbreak yang bisa menyebabkan kekalahan instan.",
      "Temukan 4 obat penyembuh bersama untuk menang!",
    ],
    minPlayers: 2, maxPlayers: 4, duration: "45-60 mnt",
    difficulty: "Sedang", rating: 4.9,
    image: "https://images.unsplash.com/photo-1653201927638-f752117e29d0?w=600&q=80",
    tags: ["Kooperatif", "Intens"],
  },
  {
    id: "g5", name: "Dixit", category: "Party",
    description: "Game imajinasi berbasis ilustrasi surreal yang indah dan penuh teka-teki.",
    howToPlay: [
      "Storyteller memilih 1 kartu dan memberi petunjuk.",
      "Pemain lain memilih kartu yang paling cocok.",
      "Vote kartu mana yang milik Storyteller.",
      "Gunakan imajinasi untuk menebak dan menipu lawan!",
    ],
    minPlayers: 3, maxPlayers: 6, duration: "30-45 mnt",
    difficulty: "Mudah", rating: 4.5,
    image: "https://images.unsplash.com/photo-1672483036851-b34c69a39a83?w=600&q=80",
    tags: ["Kreatif", "Santai"],
  },
  {
    id: "g6", name: "Azul", category: "Abstract",
    description: "Hiasi dinding istana dengan ubin mozaik yang indah dan elegan.",
    howToPlay: [
      "Ambil ubin warna yang sama dari factory disc.",
      "Susun ubin di baris pola milikmu.",
      "Pindahkan ubin ke dinding istana untuk skor.",
      "Lengkapi baris horizontal untuk mengakhiri game.",
    ],
    minPlayers: 2, maxPlayers: 4, duration: "30-45 mnt",
    difficulty: "Mudah", rating: 4.6,
    image: "https://images.unsplash.com/photo-1643567560585-2f769e995c91?w=600&q=80",
    tags: ["Visual", "Elegan"],
  },
  {
    id: "g12", name: "Coup", category: "Deduction",
    description: "Bluff & counter-bluff dalam permainan kartu intrik istana yang cepat.",
    howToPlay: [
      "Setiap pemain mendapat 2 kartu peran rahasia.",
      "Gunakan aksi karakter (atau bohong) untuk mengeliminasi lawan.",
      "Challenge pemain lain jika kamu rasa mereka berbohong.",
      "Jadilah pemain terakhir yang bertahan untuk menang!",
    ],
    minPlayers: 2, maxPlayers: 6, duration: "15-20 mnt",
    difficulty: "Sedang", rating: 4.5,
    image: "https://images.unsplash.com/photo-1733297190314-b49a52ac1f98?w=600&q=80",
    tags: ["Bluff", "Seru"],
  },
  {
    id: "g11", name: "7 Wonders", category: "Strategy",
    description: "Bangun peradaban kuno melalui kartu dalam 3 era yang epik.",
    howToPlay: [
      "Pilih 1 kartu dan berikan sisanya ke pemain lain.",
      "Bangun bangunan atau kembangkan Wonder milikmu.",
      "Kumpulkan poin dari militer, sains, atau perdagangan.",
      "Skor tertinggi setelah 3 era menjadi pemenang!",
    ],
    minPlayers: 2, maxPlayers: 7, duration: "30-45 mnt",
    difficulty: "Sedang", rating: 4.7,
    image: "https://images.unsplash.com/photo-1635921152718-06a19ec70a6c?w=600&q=80",
    tags: ["Simultan", "Cepat"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────────────────────────────────────

export default function GameLibrary() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<BoardGame | null>(null);

  // Floating tags configuration
  const floatingTags = [
    { label: "Strategy 🎯", top: "12%", left: "10%", delay: 0 },
    { label: "Party 🎉", top: "35%", right: "8%", delay: 0.2 },
    { label: "RPG ⚔️", top: "60%", left: "5%", delay: 0.4 },
    { label: "Family 👨‍👩‍👧", bottom: "15%", right: "12%", delay: 0.6 },
  ];

  return (
    <section id="games" ref={ref} className="py-24 bg-white px-5 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-14">

        {/* ════════════ HEADER SPLIT (2 KOLOM) ════════════ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

          {/* Header Kiri */}
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full mb-5"
              style={{
                backgroundColor: "#EBF5FF",
                border: "1px solid #45A1FD",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: "12px",
                  color: "#45A1FD",
                  letterSpacing: "0.05em",
                }}
              >
                500+ KOLEKSI
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 900,
                fontSize: "clamp(32px, 4vw, 48px)",
                color: "#1C1410",
                lineHeight: 1.15,
                margin: "0 0 16px 0"
              }}
            >
              Temukan Game Favoritmu 🎲
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "16px",
                color: "#6B4436",
                lineHeight: 1.6,
              }}
            >
              Dari strategy berat sampai party game seru, semua ada di sini.
            </motion.p>
          </div>

          {/* Header Kanan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 max-w-md flex flex-col lg:items-end text-left lg:text-right gap-6"
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                color: "#6B4436",
                lineHeight: 1.6,
              }}
            >
              Koleksi board game premium kami terus bertambah setiap bulan. Jelajahi berbagai kategori yang cocok untuk pemula hingga expert.
            </p>
            <button
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full cursor-pointer w-fit"
              style={{
                backgroundColor: "transparent",
                border: "2px solid #45A1FD",
                transition: "all 300ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#45A1FD";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#45A1FD";
              }}
            >
              <span
                className="group-hover:text-white"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#45A1FD",
                  transition: "color 300ms ease",
                }}
              >
                Lihat Semua Game
              </span>
              <ArrowRight size={18} className="group-hover:text-white transition-colors duration-300" style={{ color: "#45A1FD" }} />
            </button>
          </motion.div>
        </div>

        {/* ════════════ LAYOUT BAWAH (2 KOLOM) ════════════ */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-4">

          {/* Kolom Kiri - Foto Besar (40%) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-[40%] relative rounded-3xl overflow-hidden shadow-sm"
            style={{ aspectRatio: "3/4" }}
          >
            <img
              src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80"
              alt="Koleksi Board Game"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Overlay Gradient sedikit */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Floating Tags */}
            {floatingTags.map((tag, i) => (
              <motion.div
                key={tag.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + tag.delay,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="absolute px-4 py-2 rounded-full"
                style={{
                  top: tag.top,
                  bottom: tag.bottom,
                  left: tag.left,
                  right: tag.right,
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "13px",
                    color: "#1C1410",
                  }}
                >
                  {tag.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Kolom Kanan - Grid 8 Kartu (60%) */}
          <div className="w-full lg:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max">
            {FEATURED_GAMES.map((game, i) => {
              const isHovered = hoveredCard === i;

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setSelectedGame(game)}
                  className="rounded-2xl p-5 cursor-pointer overflow-hidden relative min-h-[160px] group"
                  style={{
                    backgroundColor: isHovered ? "#45A1FD" : "#FFFFFF",
                    border: isHovered ? "1px solid #45A1FD" : "1px solid #E5E7EB",
                    boxShadow: isHovered ? "0 8px 24px rgba(69,161,253,0.3)" : "0 1px 3px rgba(0,0,0,0.02)",
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    transition: "all 300ms ease",
                  }}
                >
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-500"
                      style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0"
                      style={{
                        background: isHovered
                          ? "linear-gradient(135deg, rgba(69,161,253,0.92) 0%, rgba(69,161,253,0.8) 100%)"
                          : "linear-gradient(135deg, rgba(28,20,16,0.6) 0%, rgba(28,20,16,0.4) 100%)"
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        style={{
                          fontFamily: "'Fraunces', serif",
                          fontWeight: 700,
                          fontSize: "20px",
                          color: "#FFFFFF",
                        }}
                      >
                        {game.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                        <Star size={10} fill="#FFD700" stroke="none" />
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "10px", color: "#FFFFFF" }}>
                          {game.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm border border-white/10">
                        {game.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-white/90">
                        <Users size={10} /> {game.minPlayers}-{game.maxPlayers}p
                      </span>
                    </div>

                    <p
                      className="line-clamp-2"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.9)",
                        lineHeight: 1.4,
                      }}
                    >
                      {game.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ════════════ GAME DETAIL MODAL ════════════ */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
            style={{ backgroundColor: "rgba(28,20,16,0.8)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelectedGame(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedGame(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} className="text-[#1C1410]" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 relative h-[300px] md:h-auto">
                <img
                  src={selectedGame.image}
                  alt={selectedGame.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />

                <div className="absolute bottom-6 left-6 right-6 block md:hidden">
                  <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "32px", color: "white" }}>
                    {selectedGame.name}
                  </h2>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto max-h-[70vh] md:max-h-[85vh]">
                <div className="hidden md:block mb-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5FF] text-[#45A1FD] mb-3 inline-block">
                    {selectedGame.category}
                  </span>
                  <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "40px", color: "#1C1410", lineHeight: 1.1 }}>
                    {selectedGame.name}
                  </h2>
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pemain</p>
                      <p className="text-sm font-bold text-[#1C1410]">{selectedGame.minPlayers}-{selectedGame.maxPlayers} orang</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Durasi</p>
                      <p className="text-sm font-bold text-[#1C1410]">{selectedGame.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                      <Zap size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Kesulitan</p>
                      <p className="text-sm font-bold text-[#1C1410]">{selectedGame.difficulty}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <section>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-[#1C1410] mb-3 uppercase tracking-widest">
                      <Info size={16} className="text-[#45A1FD]" /> Deskripsi
                    </h4>
                    <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-gray-600 leading-relaxed text-sm">
                      {selectedGame.description}
                    </p>
                  </section>

                  <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-[#1C1410] mb-4 uppercase tracking-widest">
                      <BookOpen size={16} className="text-[#45A1FD]" /> Ketentuan Main
                    </h4>
                    <ul className="space-y-3">
                      {selectedGame.howToPlay.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-gray-600 leading-snug">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#45A1FD] text-white text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className="mt-auto pt-8">
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="w-full py-4 rounded-2xl bg-[#1C1410] text-white font-bold text-sm hover:bg-[#45A1FD] transition-colors shadow-lg shadow-black/10 cursor-pointer"
                  >
                    Tutup Detail
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

