/**
 * Board Game Seed Data
 * Berisi data awal board game beserta metadata lengkap:
 * nama_game_designer, nama_ilustrator, durasi_permainan,
 * jumlah_pemain_min, jumlah_pemain_max, usia_minimal,
 * type, category, subjek_materi
 *
 * Urutan row mengikuti urutan tampilan game yang sudah ada di aplikasi.
 */

export interface BoardGameSeed {
  nama_game_designer: string;
  nama_ilustrator: string;
  durasi_permainan: string;
  jumlah_pemain_min: number;
  jumlah_pemain_max: number;
  usia_minimal: string; // string karena ada nilai "14+"
  type: string;
  category: string;
  subjek_materi: string;
}

export const BOARDGAMES_SEED: BoardGameSeed[] = [
  { nama_game_designer: "Hagen Temeryazey", nama_ilustrator: "Etienne Hebinger", durasi_permainan: "30 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 4, usia_minimal: "7", type: "Uncategorized", category: "Travel/Transportation", subjek_materi: "Sains" },
  { nama_game_designer: "Antonin Boccara & Yves Hirschfeld", nama_ilustrator: "Olivier Danchin", durasi_permainan: "21 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 6, usia_minimal: "6", type: "Children's", category: "Horor", subjek_materi: "Sosial" },
  { nama_game_designer: "Esteban & Antoine Bauza", nama_ilustrator: "Betowers", durasi_permainan: "25 menit", jumlah_pemain_min: 1, jumlah_pemain_max: 4, usia_minimal: "7", type: "Children's", category: "Fantasy", subjek_materi: "Bahasa Indonesia, Sosial" },
  { nama_game_designer: "Heinz Meister", nama_ilustrator: "Gabriela Silveira", durasi_permainan: "10 menit", jumlah_pemain_min: 1, jumlah_pemain_max: 4, usia_minimal: "4", type: "Children's", category: "Memory", subjek_materi: "Bahasa Inggris" },
  { nama_game_designer: "Theo Riviere", nama_ilustrator: "Piper Thibodeau", durasi_permainan: "25 menit", jumlah_pemain_min: 1, jumlah_pemain_max: 5, usia_minimal: "7", type: "Children's", category: "Educational", subjek_materi: "Bahasa Inggris" },
  { nama_game_designer: "Sylvain Menager", nama_ilustrator: "Daniel Dobner", durasi_permainan: "15 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 4, usia_minimal: "4", type: "Uncategorized", category: "Animals", subjek_materi: "Matematika" },
  { nama_game_designer: "Wikan Prabowo, Aditya Pradana, David Santoso, Adhicipta R. Wirawan", nama_ilustrator: "Liliana Harefa, Alvin Henanda", durasi_permainan: "30 menit", jumlah_pemain_min: 3, jumlah_pemain_max: 5, usia_minimal: "8", type: "Family", category: "Card Game", subjek_materi: "Matematika" },
  { nama_game_designer: "Yohan Goh", nama_ilustrator: "Agsty Im", durasi_permainan: "20 menit", jumlah_pemain_min: 1, jumlah_pemain_max: 5, usia_minimal: "8", type: "Family", category: "Puzzle", subjek_materi: "Matematika, Coding" },
  { nama_game_designer: "Nicolas Bourgin, Jean-Francois Rochas", nama_ilustrator: "Stephane Escapa", durasi_permainan: "45 menit", jumlah_pemain_min: 1, jumlah_pemain_max: 4, usia_minimal: "7", type: "Party", category: "Action/Dexterity", subjek_materi: "Coding" },
  { nama_game_designer: "Bernhard Weber", nama_ilustrator: "Michael Menzel", durasi_permainan: "20 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 4, usia_minimal: "7", type: "Children's", category: "Children's Game", subjek_materi: "Matematika" },
  { nama_game_designer: "Adhicipta R. Wirawan", nama_ilustrator: "Alvin Henanda", durasi_permainan: "15 menit", jumlah_pemain_min: 1, jumlah_pemain_max: 4, usia_minimal: "10", type: "Uncategorized", category: "Educational", subjek_materi: "Sejarah" },
  { nama_game_designer: "Ned Strongin, Howard Wexler", nama_ilustrator: "Walter Pepperle", durasi_permainan: "10 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 2, usia_minimal: "6", type: "Children's", category: "Abstract Strategy", subjek_materi: "Matematika" },
  { nama_game_designer: "Alan R. Moon", nama_ilustrator: "Cyrille Daujean, Alan R. Moon, Jean Baptiste Reynaud, Regis Torres", durasi_permainan: "30 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 4, usia_minimal: "6", type: "Family", category: "Travel/Transportation", subjek_materi: "Matematika, Coding" },
  { nama_game_designer: "Murray Heasman", nama_ilustrator: "Murray Heasman", durasi_permainan: "30 menit", jumlah_pemain_min: 1, jumlah_pemain_max: 1, usia_minimal: "10", type: "Individu", category: "Puzzle", subjek_materi: "Matematika" },
  { nama_game_designer: "Nata Chen", nama_ilustrator: "Darwin, Desyanto", durasi_permainan: "60 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 5, usia_minimal: "12", type: "Family", category: "Economic", subjek_materi: "Finansial" },
  { nama_game_designer: "Matt Leacock", nama_ilustrator: "C.B. Canga", durasi_permainan: "30 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 4, usia_minimal: "10", type: "Family", category: "Fantasy", subjek_materi: "Matematika, Bahasa Inggris, Kecerdasan Emosional" },
  { nama_game_designer: "Stefan Dorra", nama_ilustrator: "Kwanchai Moriya", durasi_permainan: "30 menit", jumlah_pemain_min: 3, jumlah_pemain_max: 6, usia_minimal: "10", type: "Family", category: "Economic", subjek_materi: "Finansial" },
  { nama_game_designer: "Bruno Cathala", nama_ilustrator: "Cyrill Bouquet", durasi_permainan: "15 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 4, usia_minimal: "8", type: "Family", category: "Fantasy", subjek_materi: "Matematika" },
  { nama_game_designer: "Susanne Galonska", nama_ilustrator: "Sabine Kondirolli", durasi_permainan: "40 menit", jumlah_pemain_min: 1, jumlah_pemain_max: 6, usia_minimal: "7", type: "Abstract", category: "Real Time", subjek_materi: "Matematika" },
  { nama_game_designer: "Agnes Largeaud", nama_ilustrator: "Mathieu Leyssenne", durasi_permainan: "20 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 5, usia_minimal: "8", type: "Family", category: "Children Game", subjek_materi: "Matematika" },
  { nama_game_designer: "Vlaada Chvatil", nama_ilustrator: "-", durasi_permainan: "15 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 7, usia_minimal: "14+", type: "Party", category: "Deduction", subjek_materi: "Bahasa Indonesia, Sejarah" },
  { nama_game_designer: "Matt Leacock", nama_ilustrator: "-", durasi_permainan: "30 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 4, usia_minimal: "8", type: "Family", category: "Medical", subjek_materi: "Matematika, Sains" },
  { nama_game_designer: "Masao Suganuma", nama_ilustrator: "Noboru Hotta", durasi_permainan: "45 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 5, usia_minimal: "10", type: "Family", category: "City Building", subjek_materi: "Matematika, Finansial" },
  { nama_game_designer: "Karsten Hartwig", nama_ilustrator: "Mathieu Leyssenne, Franz Vohwinkel", durasi_permainan: "60 menit", jumlah_pemain_min: 3, jumlah_pemain_max: 5, usia_minimal: "12", type: "Family", category: "City Building", subjek_materi: "Matematika, Finansial" },
  { nama_game_designer: "Kasper Lapp", nama_ilustrator: "Gyom", durasi_permainan: "15 menit", jumlah_pemain_min: 1, jumlah_pemain_max: 7, usia_minimal: "8", type: "Family", category: "Fantasy", subjek_materi: "Matematika, Bahasa Indonesia" },
  { nama_game_designer: "Lisa Bowman-Steenson", nama_ilustrator: "-", durasi_permainan: "30 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 4, usia_minimal: "5", type: "Uncategorized", category: "Children Games", subjek_materi: "Finansial" },
  { nama_game_designer: "Marc Andre", nama_ilustrator: "Marc Andre", durasi_permainan: "30 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 4, usia_minimal: "10", type: "Family", category: "Economic", subjek_materi: "Matematika, Finansial" },
  { nama_game_designer: "-", nama_ilustrator: "-", durasi_permainan: "90 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 4, usia_minimal: "8", type: "Family", category: "Adventure", subjek_materi: "Bahasa Inggris, Finansial, Geografi" },
  { nama_game_designer: "Eric Goldberg, Ben Grossman, Steve Marsh", nama_ilustrator: "Larry Catalano, Peter Corless, Stephen Crane, Stefan Dick", durasi_permainan: "240 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 7, usia_minimal: "16", type: "Strategy", category: "Political", subjek_materi: "Finansial, Sejarah, Ilmu Politik & Kewarganegaraan" },
  { nama_game_designer: "Hjalmar Hach", nama_ilustrator: "Sabrina Miramon", durasi_permainan: "60 menit", jumlah_pemain_min: 2, jumlah_pemain_max: 4, usia_minimal: "10", type: "Family", category: "Abstract Strategy", subjek_materi: "Matematika, IPA" },
];
