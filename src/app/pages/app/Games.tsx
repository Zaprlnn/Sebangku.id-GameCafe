import { useState, useMemo, useRef, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, SlidersHorizontal, X, Star, Users, Clock,
  ChevronDown, ChevronRight, Phone,
  CheckCircle2, Loader2, Zap, Info,
  BookOpen,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Types ────────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

type GameCategory = "Strategy" | "Party" | "Family" | "Card" | "RPG" | "Deduction" | "Co-op" | "Abstract";
type DurationBucket = "<30" | "30-60" | "60-120" | "120+";
type Difficulty = "Mudah" | "Sedang" | "Expert";
type PlayerFilter = "2" | "3-4" | "5-6" | "6+";

interface BoardGame {
  id: string;
  name: string;
  description: string;
  howToPlay: string[];
  category: GameCategory;
  minPlayers: number;
  maxPlayers: number;
  duration: string;
  durationBucket: DurationBucket;
  difficulty: Difficulty;
  minAge: number;
  rating: number;
  ratingCount: number;
  image: string;
  gallery: string[];
  available: boolean;
  gmRecommended: boolean;
  tags: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Category Config ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORY_CONFIG: Record<GameCategory, { bg: string; text: string; emoji: string }> = {
  Strategy:  { bg: "#FFF8E7", text: "#D97706", emoji: "♟️" },
  Party:     { bg: "#FDF2F8", text: "#BE185D", emoji: "🎉" },
  Family:    { bg: "#ECFDF5", text: "#059669", emoji: "👨‍👩‍👧" },
  Card:      { bg: "#EFF6FF", text: "#2563EB", emoji: "🃏" },
  RPG:       { bg: "#F5F3FF", text: "#7C3AED", emoji: "⚔️" },
  Deduction: { bg: "#ECFEFF", text: "#0891B2", emoji: "🔍" },
  "Co-op":   { bg: "#EBF5FF", text: "#45A1FD", emoji: "🤝" },
  Abstract:  { bg: "#F8FAFC", text: "#475569", emoji: "🎯" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Game Catalog ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const GALLERY_A = "https://images.unsplash.com/photo-1706295331319-8ec5da63cb91?w=600&q=80";
const GALLERY_B = "https://images.unsplash.com/photo-1677188010559-0667a1ed33a0?w=600&q=80";
const GALLERY_C = "https://images.unsplash.com/photo-1752652409596-8e5fda5652eb?w=600&q=80";

const GAMES: BoardGame[] = [
  {
    id: "g1", name: "Catan", category: "Strategy",
    description: "Bangun permukiman, kumpulkan sumber daya, dan jadilah penguasa pulau Catan. Game strategi klasik yang selalu seru dimainkan bersama.",
    howToPlay: [
      "Susun papan heksagonal secara acak untuk variasi setiap permainan.",
      "Giliran kamu: lempar 2 dadu, kumpulkan resource sesuai angka & hexagonal yang kamu miliki.",
      "Gunakan resource untuk membangun jalan, permukiman, atau kota.",
      "Dapatkan kartu Development untuk aksi spesial.",
      "Pemain pertama yang mencapai 10 Victory Points menang!",
    ],
    minPlayers: 3, maxPlayers: 4, duration: "60–120 mnt", durationBucket: "60-120",
    difficulty: "Sedang", minAge: 10, rating: 4.8, ratingCount: 1240,
    image: "https://images.unsplash.com/photo-1635921152718-06a19ec70a6c?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1635921152718-06a19ec70a6c?w=600&q=80", GALLERY_A, GALLERY_B],
    available: true, gmRecommended: true, tags: ["Populer", "Klasik"],
  },
  {
    id: "g2", name: "Codenames", category: "Deduction",
    description: "Dua tim bersaing untuk menemukan agen rahasia mereka berdasarkan petunjuk kata satu suku kata. Cepat berpikir, jangan sampai tertipu!",
    howToPlay: [
      "Bagi pemain menjadi 2 tim: Merah & Biru.",
      "Setiap tim memiliki 1 Spymaster yang tahu posisi semua agen.",
      "Spymaster memberi petunjuk 1 kata + angka (jumlah kartu yang berkaitan).",
      "Tim menebak kartu berdasarkan petunjuk tersebut.",
      "Tim yang menemukan semua agennya lebih dulu menang. Hindari kartu Assassin!",
    ],
    minPlayers: 4, maxPlayers: 8, duration: "15–30 mnt", durationBucket: "<30",
    difficulty: "Mudah", minAge: 8, rating: 4.7, ratingCount: 980,
    image: "https://images.unsplash.com/photo-1733297190314-b49a52ac1f98?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1733297190314-b49a52ac1f98?w=600&q=80", GALLERY_B, GALLERY_A],
    available: true, gmRecommended: false, tags: ["Cepat", "Tim"],
  },
  {
    id: "g3", name: "Ticket to Ride", category: "Family",
    description: "Bangun jaringan kereta api melintasi peta Amerika. Kumpulkan kartu kereta, klaim rute, dan hubungkan kota-kota untuk skor tertinggi.",
    howToPlay: [
      "Setiap pemain ambil 3 Tiket Tujuan (Destination Tickets) di awal.",
      "Setiap giliran: ambil kartu kereta ATAU klaim rute dengan kartu yang sesuai ATAU ambil Tiket baru.",
      "Klaim rute dengan meletakkan wagonmu sepanjang jalur peta.",
      "Poin dari rute panjang & tiket terpenuhi, minus poin dari tiket gagal.",
      "Pemain dengan poin tertinggi menang!",
    ],
    minPlayers: 2, maxPlayers: 5, duration: "45–75 mnt", durationBucket: "30-60",
    difficulty: "Mudah", minAge: 7, rating: 4.6, ratingCount: 870,
    image: "https://images.unsplash.com/photo-1716817279221-d815f96dce7e?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1716817279221-d815f96dce7e?w=600&q=80", GALLERY_C, GALLERY_A],
    available: false, gmRecommended: false, tags: ["Keluarga", "Santai"],
  },
  {
    id: "g4", name: "Pandemic", category: "Co-op",
    description: "Bekerja sama sebagai tim ilmuwan global untuk menghentikan 4 penyakit menyebar ke seluruh dunia. Kalah bersama, menang bersama!",
    howToPlay: [
      "Setiap pemain memiliki peran unik: Dokter, Peneliti, dll.",
      "Setiap giliran: 4 aksi (bergerak, obati, bangun stasiun, dll) + ambil 2 kartu kota.",
      "Setelah itu, infeksi kartu ditarik — kota tersebut bertambah kubenya.",
      "Jika satu kota sudah 3 kubus & kena lagi: OUTBREAK terjadi!",
      "Menang: temukan semua 4 obat penyembuh. Kalah: wabah meledak.",
    ],
    minPlayers: 2, maxPlayers: 4, duration: "45–60 mnt", durationBucket: "30-60",
    difficulty: "Sedang", minAge: 8, rating: 4.9, ratingCount: 1450,
    image: "https://images.unsplash.com/photo-1653201927638-f752117e29d0?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1653201927638-f752117e29d0?w=600&q=80", GALLERY_A, GALLERY_C],
    available: false, gmRecommended: true, tags: ["Kooperatif", "Intens"],
  },
  {
    id: "g5", name: "Dixit", category: "Party",
    description: "Game imajinasi berbasis ilustrasi surreal yang indah. Ceritakan gambar dengan satu petunjuk, buat orang lain bingung — tapi jangan terlalu jelas!",
    howToPlay: [
      "Storyteller memilih 1 kartu dari tangannya dan memberi petunjuk (kata/kalimat/suara).",
      "Pemain lain pilih kartu dari tangan mereka yang paling cocok dengan petunjuk itu.",
      "Semua kartu dikocok & ditampilkan — semua orang vote kartu mana yang milik Storyteller.",
      "Storyteller skor poin jika 1–5 orang benar (bukan semua/tidak ada).",
      "Pemain lain juga skor jika vote-nya benar atau kartunya dipilih orang lain.",
    ],
    minPlayers: 3, maxPlayers: 6, duration: "30–45 mnt", durationBucket: "30-60",
    difficulty: "Mudah", minAge: 6, rating: 4.5, ratingCount: 760,
    image: "https://images.unsplash.com/photo-1672483036851-b34c69a39a83?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1672483036851-b34c69a39a83?w=600&q=80", GALLERY_B, GALLERY_A],
    available: true, gmRecommended: false, tags: ["Kreatif", "Santai"],
  },
  {
    id: "g6", name: "Azul", category: "Abstract",
    description: "Hiasi dinding istana dengan ubin mozaik. Pilih ubin, susun pola, dan ciptakan karya paling indah untuk skor tertinggi. Elegan & adiktif.",
    howToPlay: [
      "Ambil semua ubin warna yang sama dari 1 factory disc ke barismu.",
      "Sisa ubin dari factory pindah ke tengah meja.",
      "Isi baris penuh → 1 ubin pindah ke dinding, sisanya dibuang.",
      "Ubin di lantai = poin minus!",
      "Permainan berakhir ketika 1 pemain melengkapi 1 baris horizontal di dindingnya.",
    ],
    minPlayers: 2, maxPlayers: 4, duration: "30–45 mnt", durationBucket: "30-60",
    difficulty: "Mudah", minAge: 8, rating: 4.6, ratingCount: 640,
    image: "https://images.unsplash.com/photo-1643567560585-2f769e995c91?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1643567560585-2f769e995c91?w=600&q=80", GALLERY_A, GALLERY_C],
    available: true, gmRecommended: true, tags: ["Visual", "Elegan"],
  },
  {
    id: "g7", name: "Dungeons & Dragons", category: "RPG",
    description: "Game peran paling legendaris di dunia. Jelajahi dungeon, lawan monster, dan ceritakan petualangan epikmu bersama teman-teman.",
    howToPlay: [
      "Dungeon Master (DM) memimpin cerita & mengontrol dunia.",
      "Pemain lain membuat karakter: pilih ras, kelas, dan statistik.",
      "DM mendeskripsikan situasi — pemain memutuskan aksi mereka.",
      "Lempar dice untuk menentukan hasil aksi (20 = nat 20, sempurna!)",
      "Tidak ada akhir yang pasti — petualangan bisa berlanjut sesi berikutnya.",
    ],
    minPlayers: 3, maxPlayers: 6, duration: "2–4 jam", durationBucket: "120+",
    difficulty: "Expert", minAge: 12, rating: 4.9, ratingCount: 2100,
    image: "https://images.unsplash.com/photo-1549056572-75914d5d5fd4?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1549056572-75914d5d5fd4?w=600&q=80", GALLERY_C, GALLERY_B],
    available: true, gmRecommended: true, tags: ["Epik", "Imersif"],
  },
  {
    id: "g8", name: "Exploding Kittens", category: "Card",
    description: "Game kartu kacau penuh kejutan. Hindari Kucing Meledak, gunakan kartu aksi licik untuk mengelabui temanmu. Cepat, lucu, & penuh drama!",
    howToPlay: [
      "Kocok deck & bagikan kartu ke semua pemain.",
      "Setiap giliran: mainkan kartu aksi (boleh skip) lalu ambil 1 kartu dari deck.",
      "Jika ambil Exploding Kitten → kamu KALAH, kecuali punya Defuse!",
      "Kartu seperti Skip, Attack, Nope, dan See The Future bisa mengubah keadaan.",
      "Pemain terakhir yang bertahan menang.",
    ],
    minPlayers: 2, maxPlayers: 5, duration: "15–20 mnt", durationBucket: "<30",
    difficulty: "Mudah", minAge: 7, rating: 4.3, ratingCount: 890,
    image: "https://images.unsplash.com/photo-1563704205197-c170fcca7d1d?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1563704205197-c170fcca7d1d?w=600&q=80", GALLERY_B, GALLERY_A],
    available: true, gmRecommended: false, tags: ["Lucu", "Cepat"],
  },
  {
    id: "g9", name: "Werewolf", category: "Party",
    description: "Game deduski sosial klasik. Werewolf bersembunyi di antara warga desa — siapakah mereka? Temukan & eliminasi sebelum malam tiba.",
    howToPlay: [
      "Bagikan kartu peran rahasia: Werewolf, Warga, atau peran khusus (Dukun, Cupid, dll).",
      "Malam: semua tutup mata. Werewolf pilih 1 korban diam-diam.",
      "Pagi: Moderator umumkan siapa yang 'mati'. Diskusi & voting siapa yang dieksekusi.",
      "Warga menang: semua Werewolf tereleminasi. Werewolf menang: jumlah sama dengan warga.",
      "Peran khusus punya aksi malam yang berbeda-beda.",
    ],
    minPlayers: 6, maxPlayers: 18, duration: "30–60 mnt", durationBucket: "30-60",
    difficulty: "Mudah", minAge: 10, rating: 4.4, ratingCount: 530,
    image: "https://images.unsplash.com/photo-1676984937691-4262ab195e17?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1676984937691-4262ab195e17?w=600&q=80", GALLERY_B, GALLERY_C],
    available: true, gmRecommended: false, tags: ["Seru", "Sosial"],
  },
  {
    id: "g10", name: "Chess", category: "Abstract",
    description: "Permainan strategi dua pemain tertua & terlengkap di dunia. Gerakkan bidak, kendalikan papan, dan matikan Raja lawan untuk menang.",
    howToPlay: [
      "Setiap bidak bergerak dengan cara unik: Raja, Ratu, Menara, Gajah, Kuda, Pion.",
      "Tujuan: buat Raja lawan dalam posisi Checkmate (tidak bisa kemana pun).",
      "Waspadai posisi Check — Raja kamu terancam, harus segera diselamatkan.",
      "Strategi opening, middlegame, dan endgame sangat berbeda.",
      "Waktu biasanya dibatasi dengan jam catur.",
    ],
    minPlayers: 2, maxPlayers: 2, duration: "15–60 mnt", durationBucket: "30-60",
    difficulty: "Expert", minAge: 6, rating: 4.8, ratingCount: 3200,
    image: "https://images.unsplash.com/photo-1727572337756-7059053381e5?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1727572337756-7059053381e5?w=600&q=80", GALLERY_A, GALLERY_C],
    available: true, gmRecommended: false, tags: ["Klasik", "Mental"],
  },
  {
    id: "g11", name: "7 Wonders", category: "Strategy",
    description: "Bangun peradaban kuno dalam 3 era. Kembangkan ilmu, perdagangan, atau militer. Skor kartu, wonder, & simbol kemenangan menentukan pemenang.",
    howToPlay: [
      "Setiap pemain dapat 7 kartu di awal era. Pilih 1, sisa lempar ke kiri.",
      "Kartu bisa dimainkan (bayar resource), dijual (dapat koin), atau bangun Wonder.",
      "Skor dari banyak sumber: science, military, commerce, guilds, wonders.",
      "3 ronde penuh (3 era) dimainkan — total 18 kartu per pemain.",
      "Hitung semua poin di akhir untuk tentukan pemenang.",
    ],
    minPlayers: 2, maxPlayers: 7, duration: "30–45 mnt", durationBucket: "30-60",
    difficulty: "Sedang", minAge: 10, rating: 4.7, ratingCount: 990,
    image: "https://images.unsplash.com/photo-1635921152718-06a19ec70a6c?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1635921152718-06a19ec70a6c?w=600&q=80", GALLERY_C, GALLERY_B],
    available: true, gmRecommended: true, tags: ["Simultan", "Cepat"],
  },
  {
    id: "g12", name: "Coup", category: "Deduction",
    description: "Bluff & counter-bluff dalam permainan kartu intrik istana. Semua pemain berbohong — tapi kapan dan siapa? Eliminasi lawan, jadi satu-satunya yang tersisa.",
    howToPlay: [
      "Setiap pemain dapat 2 influence cards (rahasia) + 2 koin.",
      "Aksi: Income (1 koin), Foreign Aid (2 koin), Coup (7 koin, paksa buang kartu), atau aksi khusus karakter.",
      "Siapa pun bisa BLUFF memiliki karakter manapun — tapi bisa di-CHALLENGE!",
      "Jika challenge benar: yang bohong buang kartu. Jika salah: challenger yang buang.",
      "Kehilangan semua influence → out. Bertahan terakhir menang!",
    ],
    minPlayers: 2, maxPlayers: 6, duration: "15–20 mnt", durationBucket: "<30",
    difficulty: "Sedang", minAge: 10, rating: 4.5, ratingCount: 720,
    image: "https://images.unsplash.com/photo-1733297190314-b49a52ac1f98?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1733297190314-b49a52ac1f98?w=600&q=80", GALLERY_A, GALLERY_B],
    available: true, gmRecommended: false, tags: ["Bluff", "Seru"],
  },
  {
    id: "g13", name: "Sushi Go!", category: "Card",
    description: "Draft kartu sushi yang menggemaskan! Ambil yang terbaik, lempar sisa ke tetangga — skor kombinasi sushi unik untuk menang dalam 3 ronde.",
    howToPlay: [
      "Bagikan kartu ke semua pemain sesuai jumlah pemain.",
      "Semua pilih 1 kartu secara bersamaan, letakkan tertutup.",
      "Buka serempak, lalu lempar sisa tangan ke kiri.",
      "Lanjutkan hingga semua kartu habis — 1 ronde selesai.",
      "Skor kartu di meja. Main 3 ronde total, skor tertinggi menang!",
    ],
    minPlayers: 2, maxPlayers: 5, duration: "15–20 mnt", durationBucket: "<30",
    difficulty: "Mudah", minAge: 8, rating: 4.4, ratingCount: 580,
    image: "https://images.unsplash.com/photo-1563704205197-c170fcca7d1d?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1563704205197-c170fcca7d1d?w=600&q=80", GALLERY_C, GALLERY_A],
    available: true, gmRecommended: false, tags: ["Lucu", "Cepat"],
  },
  {
    id: "g14", name: "Terraforming Mars", category: "Strategy",
    description: "Kelola korporasi antariksa untuk membuat Mars bisa dihuni. Naikkan suhu, oksigen, dan isi lautan sambil kumpulkan poin dari proyek dan milestone.",
    howToPlay: [
      "Pilih korporasi dengan kemampuan unik di awal permainan.",
      "Setiap generasi: dapat pendapatan resource & kartu, lalu ambil aksi bergantian.",
      "Mainkan kartu proyek (bayar Megacredit), letakkan tile di papan Mars.",
      "Tingkatkan parameter: Suhu, Oksigen, Lautan — setiap naik = 1 TR (Terraform Rating).",
      "Permainan berakhir ketika semua 3 parameter mencapai batas maksimal.",
    ],
    minPlayers: 1, maxPlayers: 5, duration: "2–3 jam", durationBucket: "120+",
    difficulty: "Expert", minAge: 12, rating: 4.8, ratingCount: 1680,
    image: "https://images.unsplash.com/photo-1677188010559-0667a1ed33a0?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1677188010559-0667a1ed33a0?w=600&q=80", GALLERY_A, GALLERY_B],
    available: true, gmRecommended: true, tags: ["Kompleks", "Solitaire OK"],
  },
  {
    id: "g15", name: "UNO", category: "Card",
    description: "Game kartu ikonik yang tak pernah membosankan! Habiskan kartu, jebak lawan dengan Skip & Reverse, dan jangan lupa teriak UNO di kartu terakhirmu!",
    howToPlay: [
      "Bagikan 7 kartu ke setiap pemain, 1 kartu face-up sebagai starter.",
      "Setiap giliran: mainkan 1 kartu yang cocok (warna ATAU angka ATAU simbol).",
      "Kartu aksi: Skip, Reverse, Draw 2, Wild, Wild Draw 4.",
      "Jika tidak punya kartu yang cocok: ambil 1 dari deck.",
      "Tersisa 1 kartu → teriak UNO! Tidak teriak & ketahuan → ambil 2 kartu.",
    ],
    minPlayers: 2, maxPlayers: 10, duration: "20–30 mnt", durationBucket: "<30",
    difficulty: "Mudah", minAge: 6, rating: 4.2, ratingCount: 4500,
    image: "https://images.unsplash.com/photo-1563704205197-c170fcca7d1d?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1563704205197-c170fcca7d1d?w=600&q=80", GALLERY_B, GALLERY_C],
    available: true, gmRecommended: false, tags: ["Klasik", "Semua Umur"],
  },
  {
    id: "g16", name: "Gloomhaven", category: "RPG",
    description: "Dungeon crawler kooperatif mega-epic dengan 95+ skenario campaign. Karakter berkembang, kota berubah, dan setiap keputusan berdampak permanen.",
    howToPlay: [
      "Pilih karakter unik masing-masing dengan deck kartu aksi sendiri.",
      "Setiap ronde: pilih 2 kartu aksi rahasia lalu buka bersamaan.",
      "Inisiatif ditentukan dari top number kartu — urutan aksi semua entitas.",
      "Selesaikan goal skenario sambil mengelola HP dan exhaustion.",
      "Setelah sesi: buka envelope, tambah sticker, kota berkembang secara permanen!",
    ],
    minPlayers: 1, maxPlayers: 4, duration: "1.5–2.5 jam", durationBucket: "120+",
    difficulty: "Expert", minAge: 12, rating: 4.9, ratingCount: 2800,
    image: "https://images.unsplash.com/photo-1549056572-75914d5d5fd4?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1549056572-75914d5d5fd4?w=600&q=80", GALLERY_C, GALLERY_A],
    available: false, gmRecommended: true, tags: ["Epik", "Campaign"],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Filter Logic ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

interface Filters {
  categories: Set<GameCategory>;
  players: PlayerFilter | null;
  duration: DurationBucket | null;
  difficulty: Difficulty | null;
}

function emptyFilters(): Filters {
  return { categories: new Set(), players: null, duration: null, difficulty: null };
}

function countActiveFilters(f: Filters) {
  return f.categories.size + (f.players ? 1 : 0) + (f.duration ? 1 : 0) + (f.difficulty ? 1 : 0);
}

function applyFilters(games: BoardGame[], search: string, f: Filters): BoardGame[] {
  return games.filter((g) => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (f.categories.size > 0 && !f.categories.has(g.category)) return false;
    if (f.players) {
      if (f.players === "2" && !(g.minPlayers <= 2 && g.maxPlayers >= 2)) return false;
      if (f.players === "3-4" && !(g.maxPlayers >= 3 && g.minPlayers <= 4)) return false;
      if (f.players === "5-6" && !(g.maxPlayers >= 5)) return false;
      if (f.players === "6+" && !(g.maxPlayers >= 6)) return false;
    }
    if (f.duration && g.durationBucket !== f.duration) return false;
    if (f.difficulty && g.difficulty !== f.difficulty) return false;
    return true;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Filter Panel ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const ALL_CATEGORIES: GameCategory[] = ["Strategy", "Party", "Family", "Card", "RPG", "Deduction", "Co-op", "Abstract"];
const PLAYER_OPTIONS: { key: PlayerFilter; label: string }[] = [
  { key: "2", label: "2 Orang" }, { key: "3-4", label: "3–4 Orang" },
  { key: "5-6", label: "5–6 Orang" }, { key: "6+", label: "6+ Orang" },
];
const DURATION_OPTIONS: { key: DurationBucket; label: string }[] = [
  { key: "<30", label: "< 30 mnt" }, { key: "30-60", label: "30–60 mnt" },
  { key: "60-120", label: "1–2 jam" }, { key: "120+", label: "2+ jam" },
];
const DIFFICULTY_OPTIONS: Difficulty[] = ["Mudah", "Sedang", "Expert"];

type Chip = {
  label: string;
  active: boolean;
  onToggle: () => void;
};

function FilterChip({ label, active, onToggle }: Chip) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onToggle}
      className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundColor: active ? "#45A1FD" : "#F7F7F8",
        color: active ? "#fff" : "#6B4436",
        border: active ? "1.5px solid #45A1FD" : "1.5px solid #E5E7EB",
      }}
    >
      {label}
    </motion.button>
  );
}

function FilterPanel({ filters, onChange, onClear }: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
}) {
  const toggleCategory = (c: GameCategory) => {
    const next = new Set(filters.categories);
    next.has(c) ? next.delete(c) : next.add(c);
    onChange({ ...filters, categories: next });
  };

  const setPlayers = (v: PlayerFilter) =>
    onChange({ ...filters, players: filters.players === v ? null : v });
  const setDuration = (v: DurationBucket) =>
    onChange({ ...filters, duration: filters.duration === v ? null : v });
  const setDifficulty = (v: Difficulty) =>
    onChange({ ...filters, difficulty: filters.difficulty === v ? null : v });

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="px-4 py-3 bg-[#EBF5FF]/60 border-t border-[#45A1FD]/15 space-y-3">
        {/* Category */}
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-semibold text-[#6B4436] mb-1.5">
            Kategori
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                label={`${CATEGORY_CONFIG[c].emoji} ${c}`}
                active={filters.categories.has(c)}
                onToggle={() => toggleCategory(c)}
              />
            ))}
          </div>
        </div>
        {/* Players */}
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-semibold text-[#6B4436] mb-1.5">
            Jumlah Pemain
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PLAYER_OPTIONS.map((o) => (
              <FilterChip key={o.key} label={o.label} active={filters.players === o.key} onToggle={() => setPlayers(o.key)} />
            ))}
          </div>
        </div>
        {/* Duration */}
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-semibold text-[#6B4436] mb-1.5">
            Durasi Main
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DURATION_OPTIONS.map((o) => (
              <FilterChip key={o.key} label={o.label} active={filters.duration === o.key} onToggle={() => setDuration(o.key)} />
            ))}
          </div>
        </div>
        {/* Difficulty */}
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs font-semibold text-[#6B4436] mb-1.5">
            Kesulitan
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DIFFICULTY_OPTIONS.map((d) => (
              <FilterChip key={d} label={d} active={filters.difficulty === d} onToggle={() => setDifficulty(d)} />
            ))}
          </div>
        </div>
        {/* Clear */}
        {countActiveFilters(filters) > 0 && (
          <button
            onClick={onClear}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="text-xs text-red-400 font-semibold cursor-pointer hover:text-red-500 flex items-center gap-1"
          >
            <X size={12} /> Reset semua filter
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Difficulty pill ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const DIFF_STYLE: Record<Difficulty, { bg: string; text: string }> = {
  Mudah:  { bg: "#ECFDF5", text: "#059669" },
  Sedang: { bg: "#FFF8E7", text: "#D97706" },
  Expert: { bg: "#FEF2F2", text: "#DC2626" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Game Card ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function GameCard({ game, index, onPress }: { game: BoardGame; index: number; onPress: () => void }) {
  const cat = CATEGORY_CONFIG[game.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ translateY: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}
      whileTap={{ scale: 0.97 }}
      onClick={onPress}
      className="bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Cover image */}
      <div className="relative w-full" style={{ paddingTop: "75%" }}>
        <img
          src={game.image}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* Availability */}
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            backgroundColor: game.available ? "#ECFDF5" : "#F3F4F6",
            color: game.available ? "#059669" : "#9CA3AF",
          }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${game.available ? "bg-emerald-500" : "bg-gray-400"}`} />
          {game.available ? "Tersedia" : "Dipakai"}
        </div>
        {/* Category badge */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold"
          style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: cat.bg, color: cat.text }}
        >
          {cat.emoji} {game.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col flex-1 gap-1">
        <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}
           className="leading-tight">
          {game.name}
        </p>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1">
            <Users size={9} className="text-[#9CA3AF]" />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
              {game.minPlayers}–{game.maxPlayers}p
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={9} className="text-[#9CA3AF]" />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#9CA3AF" }}>
              {game.duration}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <Star size={9} fill="#F59E0B" stroke="none" />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#6B4436" }}>
              {game.rating}
            </span>
          </div>
        </div>

        {/* GM recommended */}
        {game.gmRecommended && (
          <div className="flex items-center gap-1 bg-[#EBF5FF] rounded-lg px-2 py-0.5 w-fit">
            <Zap size={9} className="text-[#45A1FD]" />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 700, color: "#45A1FD" }}>
              GM Rekomendasikan
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Accordion ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function Accordion({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#1C1410" }}>
            {title}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
          <ChevronDown size={16} className="text-[#9CA3AF]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Game Modal ───────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function GameModal({ game, onClose, onGMExplain }: {
  game: BoardGame;
  onClose: () => void;
  onGMExplain: () => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [addedToSession, setAddedToSession] = useState(false);
  const cat = CATEGORY_CONFIG[game.category];
  const diff = DIFF_STYLE[game.difficulty];

  const handleAddToSession = () => {
    setAddedToSession(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(28,20,16,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 36 }}
        className="bg-white rounded-t-3xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{ maxWidth: "512px", width: "100%", margin: "0 auto" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-0 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Scrollable area */}
        <div className="overflow-y-auto flex-1">
          {/* Hero image + gallery */}
          <div className="relative w-full" style={{ paddingTop: "60%" }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                src={game.gallery[activeImg]}
                alt={game.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center cursor-pointer"
            >
              <X size={18} className="text-white" />
            </button>
            {/* Availability */}
            <div
              className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: game.available ? "rgba(236,253,245,0.9)" : "rgba(243,244,246,0.9)",
                color: game.available ? "#059669" : "#6B7280",
              }}
            >
              <span className={`w-2 h-2 rounded-full ${game.available ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
              {game.available ? "✓ Tersedia" : "⏳ Dipakai"}
            </div>
          </div>

          {/* Gallery thumbnails */}
          {game.gallery.length > 1 && (
            <div className="flex gap-2 px-4 pt-3">
              {game.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="w-14 h-10 rounded-xl overflow-hidden shrink-0 cursor-pointer transition-all"
                  style={{ border: i === activeImg ? "2px solid #45A1FD" : "2px solid transparent" }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Game info */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-start justify-between gap-2">
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px" }} className="font-bold text-[#1C1410] leading-tight">
                {game.name}
              </h2>
              <div
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold mt-0.5"
                style={{ backgroundColor: cat.bg, color: cat.text, fontFamily: "'DM Sans', sans-serif" }}
              >
                {cat.emoji} {game.category}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={12}
                    fill={s <= Math.round(game.rating) ? "#F59E0B" : "transparent"}
                    stroke="#F59E0B" strokeWidth={1.5}
                  />
                ))}
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm font-bold text-[#1C1410]">
                {game.rating}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF]">
                ({game.ratingCount.toLocaleString("id")} ulasan)
              </span>
              {game.gmRecommended && (
                <div className="flex items-center gap-1 bg-[#EBF5FF] rounded-full px-2 py-0.5">
                  <Zap size={10} className="text-[#45A1FD]" />
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] font-bold text-[#45A1FD]">GM Pick</span>
                </div>
              )}
            </div>
          </div>

          {/* Stat chips */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
            {[
              { icon: <Users size={12} />, label: `${game.minPlayers}–${game.maxPlayers} pemain`, bg: "#EFF6FF", text: "#2563EB" },
              { icon: <Clock size={12} />, label: game.duration, bg: "#F5F3FF", text: "#7C3AED" },
              { icon: <Info size={12} />, label: game.difficulty, bg: diff.bg, text: diff.text },
              { icon: <span className="text-xs">🧒</span>, label: `${game.minAge}+ tahun`, bg: "#ECFDF5", text: "#059669" },
            ].map((stat, i) => (
              <div
                key={i}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: stat.bg, color: stat.text }}
              >
                {stat.icon} {stat.label}
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="px-4 pb-3">
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#6B4436] leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 px-4 pb-4 flex-wrap">
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#F3F4F6", color: "#6B7280" }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Accordion: Cara Main */}
          <div className="px-4 pb-4">
            <Accordion title="Cara Main Singkat" icon={<BookOpen size={14} className="text-[#45A1FD]" />}>
              <ol className="space-y-2">
                {game.howToPlay.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5"
                      style={{ backgroundColor: "#45A1FD", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {i + 1}
                    </span>
                    <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#6B4436] leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </Accordion>
          </div>
        </div>

        {/* Fixed bottom actions */}
        <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-100 flex gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { onClose(); onGMExplain(); }}
            className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer border-2 border-[#45A1FD]/30 hover:bg-[#EBF5FF] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#45A1FD", fontWeight: 700, fontSize: "13px" }}
          >
            <Phone size={14} />
            Minta GM Jelaskan
          </motion.button>

          <motion.button
            whileHover={!addedToSession ? { scale: 1.02, boxShadow: "0 8px 20px rgba(69,161,253,0.35)" } : {}}
            whileTap={!addedToSession ? { scale: 0.96 } : {}}
            onClick={handleAddToSession}
            className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "13px",
              background: addedToSession
                ? "linear-gradient(135deg, #22C55E, #16A34A)"
                : "linear-gradient(135deg, #45A1FD, #82C2FF)",
              color: "white",
              boxShadow: addedToSession ? "0 4px 12px rgba(34,197,94,0.3)" : "0 4px 12px rgba(69,161,253,0.3)",
            }}
          >
            <AnimatePresence mode="wait">
              {addedToSession ? (
                <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Ditambahkan ✓
                </motion.div>
              ) : (
                <motion.div key="add" initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="flex items-center gap-1.5">
                  <Zap size={14} /> Tambah ke Sesi
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Games Page ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export default function GamesPage() {
  const { openGMSheet } = useAppContext();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<BoardGame | null>(null);

  const filtered = useMemo(() => applyFilters(GAMES, search, filters), [search, filters]);
  const activeCount = countActiveFilters(filters);

  const handleClearFilters = () => {
    setFilters(emptyFilters());
    setSearch("");
  };

  return (
    <>
      <div className="flex flex-col pb-6">
        {/* ── Header ── */}
        <div className="px-4 pt-4 pb-0 bg-white sticky top-0 z-20"
             style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          {/* Title row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410]">
                Koleksi Game 🎲
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF] mt-0.5">
                500+ game tersedia
              </p>
            </div>
            <motion.button
              whileHover={{ translateY: -2, boxShadow: "0 6px 16px rgba(69,161,253,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openGMSheet()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl cursor-pointer"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: "linear-gradient(135deg, #45A1FD, #82C2FF)",
                color: "white",
                fontWeight: 700,
                fontSize: "12px",
              }}
            >
              <Phone size={13} />
              Minta GM Bantu
            </motion.button>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2.5 bg-[#F7F7F8] rounded-2xl px-4 py-2.5 border border-gray-100 mb-2.5">
            <Search size={15} className="text-[#9CA3AF] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari game, misal: Catan, Uno, Chess..."
              className="flex-1 bg-transparent text-sm text-[#1C1410] placeholder:text-[#C4C4C4] focus:outline-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="cursor-pointer">
                <X size={14} className="text-[#9CA3AF]" />
              </button>
            )}
          </div>

          {/* Filter toggle row */}
          <div className="flex items-center gap-2 pb-3">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setFilterOpen((p) => !p)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-pointer relative"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: filterOpen || activeCount > 0 ? "#EBF5FF" : "#F7F7F8",
                color: filterOpen || activeCount > 0 ? "#45A1FD" : "#6B4436",
                border: filterOpen || activeCount > 0 ? "1.5px solid #45A1FD30" : "1.5px solid #E5E7EB",
                fontWeight: 600, fontSize: "13px",
              }}
            >
              <SlidersHorizontal size={14} />
              Filter
              {activeCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4 rounded-full bg-[#45A1FD] text-white flex items-center justify-center text-[9px] font-bold"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {activeCount}
                </motion.span>
              )}
              <motion.div animate={{ rotate: filterOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={13} />
              </motion.div>
            </motion.button>

            {/* Active filter pills */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none flex-1">
              {Array.from(filters.categories).map((c) => (
                <motion.div
                  key={c}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer"
                  style={{ backgroundColor: CATEGORY_CONFIG[c].bg, color: CATEGORY_CONFIG[c].text, fontFamily: "'DM Sans', sans-serif" }}
                  onClick={() => {
                    const next = new Set(filters.categories);
                    next.delete(c);
                    setFilters({ ...filters, categories: next });
                  }}
                >
                  {CATEGORY_CONFIG[c].emoji} {c} <X size={10} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {filterOpen && (
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onClear={() => setFilters(emptyFilters())}
              />
            )}
          </AnimatePresence>
        </div>

        {/* ── Results info ── */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-xs text-[#9CA3AF]">
            Menampilkan <span className="font-semibold text-[#1C1410]">{filtered.length}</span> game
          </p>
          {(search || activeCount > 0) && (
            <button
              onClick={handleClearFilters}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-xs text-[#45A1FD] font-semibold cursor-pointer flex items-center gap-1"
            >
              <X size={11} /> Reset semua
            </button>
          )}
        </div>

        {/* ── Game Grid ── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-16 gap-3 px-6 text-center"
          >
            <span className="text-5xl">🎲</span>
            <h3 style={{ fontFamily: "'Fraunces', serif" }} className="font-bold text-[#1C1410]">
              Game Tidak Ditemukan
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-[#6B4436]">
              Coba ubah filter atau kata kunci pencarianmu
            </p>
            <button
              onClick={handleClearFilters}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="mt-1 px-5 py-2.5 bg-[#EBF5FF] text-[#45A1FD] rounded-2xl text-sm font-semibold cursor-pointer"
            >
              Reset Pencarian
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4">
            {filtered.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} onPress={() => setSelectedGame(game)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Game Detail Modal ── */}
      <AnimatePresence>
        {selectedGame && (
          <GameModal
            game={selectedGame}
            onClose={() => setSelectedGame(null)}
            onGMExplain={() => { setSelectedGame(null); openGMSheet(); }}
          />
        )}
      </AnimatePresence>

    </>
  );
}

