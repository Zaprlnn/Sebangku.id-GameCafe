/**
 * Script Node.js untuk insert data boardgame_metadata ke Supabase.
 * Jalankan dengan: node backend/seed_boardgames.js
 *
 * Pastikan file backend/.env berisi:
 *   SUPABASE_URL=https://uetbkbvwthbqpedxscom.supabase.co
 *   SUPABASE_SERVICE_KEY=<service_role_key>  <-- bukan anon key
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL ||
  'postgresql://postgres:2300016045@db.uetbkbvwthbqpedxscom.supabase.co:5432/postgres';

const pool = new pg.Pool({ connectionString });

const BOARDGAMES_SEED = [
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

async function seedBoardgames() {
  const client = await pool.connect();
  try {
    console.log('Terhubung ke Supabase PostgreSQL...');

    // Buat tabel jika belum ada
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.boardgame_metadata (
        id                 SERIAL PRIMARY KEY,
        nama_game_designer TEXT NOT NULL DEFAULT '-',
        nama_ilustrator    TEXT NOT NULL DEFAULT '-',
        durasi_permainan   TEXT NOT NULL,
        jumlah_pemain_min  INTEGER NOT NULL,
        jumlah_pemain_max  INTEGER NOT NULL,
        usia_minimal       TEXT NOT NULL,
        type               TEXT NOT NULL,
        category           TEXT NOT NULL,
        subjek_materi      TEXT NOT NULL,
        created_at         TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log('Tabel boardgame_metadata siap.');

    // Cek apakah data sudah ada
    const existing = await client.query('SELECT COUNT(*) FROM public.boardgame_metadata');
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`Data sudah ada (${existing.rows[0].count} baris). Skip insert. Gunakan --force untuk overwrite.`);
      if (!process.argv.includes('--force')) {
        return;
      }
      await client.query('TRUNCATE public.boardgame_metadata RESTART IDENTITY');
      console.log('Data lama dihapus (--force mode).');
    }

    // Insert semua data
    let inserted = 0;
    for (const game of BOARDGAMES_SEED) {
      await client.query(
        `INSERT INTO public.boardgame_metadata
          (nama_game_designer, nama_ilustrator, durasi_permainan, jumlah_pemain_min, jumlah_pemain_max, usia_minimal, type, category, subjek_materi)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          game.nama_game_designer,
          game.nama_ilustrator,
          game.durasi_permainan,
          game.jumlah_pemain_min,
          game.jumlah_pemain_max,
          game.usia_minimal,
          game.type,
          game.category,
          game.subjek_materi,
        ]
      );
      inserted++;
      console.log(`  [${inserted}/${BOARDGAMES_SEED.length}] Inserted: ${game.nama_game_designer} - ${game.category}`);
    }

    console.log(`\nSelesai! ${inserted} board game berhasil dimasukkan ke database.`);

    // Tampilkan ringkasan
    const summary = await client.query(
      'SELECT type, COUNT(*) as total FROM public.boardgame_metadata GROUP BY type ORDER BY total DESC'
    );
    console.log('\nRingkasan per Type:');
    summary.rows.forEach(r => console.log(`  ${r.type}: ${r.total} game`));

  } catch (err) {
    console.error('Error saat seeding:', err.message);
    throw err;
  } finally {
    client.release();
    pool.end();
  }
}

seedBoardgames();
