-- ============================================================
-- Supabase SQL: Tabel boardgame_metadata + Seed Data
-- Jalankan di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1. BUAT TABEL
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

-- 2. AKTIFKAN RLS
ALTER TABLE public.boardgame_metadata ENABLE ROW LEVEL SECURITY;

-- 3. POLICY: siapa saja bisa membaca (SELECT)
DROP POLICY IF EXISTS "Anyone can read boardgame_metadata" ON public.boardgame_metadata;
CREATE POLICY "Anyone can read boardgame_metadata"
  ON public.boardgame_metadata FOR SELECT USING (true);

-- 4. INSERT SEED DATA (30 baris)
INSERT INTO public.boardgame_metadata
  (nama_game_designer, nama_ilustrator, durasi_permainan, jumlah_pemain_min, jumlah_pemain_max, usia_minimal, type, category, subjek_materi)
VALUES
  ('Hagen Temeryazey', 'Etienne Hebinger', '30 menit', 2, 4, '7', 'Uncategorized', 'Travel/Transportation', 'Sains'),
  ('Antonin Boccara & Yves Hirschfeld', 'Olivier Danchin', '21 menit', 2, 6, '6', 'Children''s', 'Horor', 'Sosial'),
  ('Esteban & Antoine Bauza', 'Betowers', '25 menit', 1, 4, '7', 'Children''s', 'Fantasy', 'Bahasa Indonesia, Sosial'),
  ('Heinz Meister', 'Gabriela Silveira', '10 menit', 1, 4, '4', 'Children''s', 'Memory', 'Bahasa Inggris'),
  ('Theo Riviere', 'Piper Thibodeau', '25 menit', 1, 5, '7', 'Children''s', 'Educational', 'Bahasa Inggris'),
  ('Sylvain Menager', 'Daniel Dobner', '15 menit', 2, 4, '4', 'Uncategorized', 'Animals', 'Matematika'),
  ('Wikan Prabowo, Aditya Pradana, David Santoso, Adhicipta R. Wirawan', 'Liliana Harefa, Alvin Henanda', '30 menit', 3, 5, '8', 'Family', 'Card Game', 'Matematika'),
  ('Yohan Goh', 'Agsty Im', '20 menit', 1, 5, '8', 'Family', 'Puzzle', 'Matematika, Coding'),
  ('Nicolas Bourgin, Jean-Francois Rochas', 'Stephane Escapa', '45 menit', 1, 4, '7', 'Party', 'Action/Dexterity', 'Coding'),
  ('Bernhard Weber', 'Michael Menzel', '20 menit', 2, 4, '7', 'Children''s', 'Children''s Game', 'Matematika'),
  ('Adhicipta R. Wirawan', 'Alvin Henanda', '15 menit', 1, 4, '10', 'Uncategorized', 'Educational', 'Sejarah'),
  ('Ned Strongin, Howard Wexler', 'Walter Pepperle', '10 menit', 2, 2, '6', 'Children''s', 'Abstract Strategy', 'Matematika'),
  ('Alan R. Moon', 'Cyrille Daujean, Alan R. Moon, Jean Baptiste Reynaud, Regis Torres', '30 menit', 2, 4, '6', 'Family', 'Travel/Transportation', 'Matematika, Coding'),
  ('Murray Heasman', 'Murray Heasman', '30 menit', 1, 1, '10', 'Individu', 'Puzzle', 'Matematika'),
  ('Nata Chen', 'Darwin, Desyanto', '60 menit', 2, 5, '12', 'Family', 'Economic', 'Finansial'),
  ('Matt Leacock', 'C.B. Canga', '30 menit', 2, 4, '10', 'Family', 'Fantasy', 'Matematika, Bahasa Inggris, Kecerdasan Emosional'),
  ('Stefan Dorra', 'Kwanchai Moriya', '30 menit', 3, 6, '10', 'Family', 'Economic', 'Finansial'),
  ('Bruno Cathala', 'Cyrill Bouquet', '15 menit', 2, 4, '8', 'Family', 'Fantasy', 'Matematika'),
  ('Susanne Galonska', 'Sabine Kondirolli', '40 menit', 1, 6, '7', 'Abstract', 'Real Time', 'Matematika'),
  ('Agnes Largeaud', 'Mathieu Leyssenne', '20 menit', 2, 5, '8', 'Family', 'Children Game', 'Matematika'),
  ('Vlaada Chvatil', '-', '15 menit', 2, 7, '14+', 'Party', 'Deduction', 'Bahasa Indonesia, Sejarah'),
  ('Matt Leacock', '-', '30 menit', 2, 4, '8', 'Family', 'Medical', 'Matematika, Sains'),
  ('Masao Suganuma', 'Noboru Hotta', '45 menit', 2, 5, '10', 'Family', 'City Building', 'Matematika, Finansial'),
  ('Karsten Hartwig', 'Mathieu Leyssenne, Franz Vohwinkel', '60 menit', 3, 5, '12', 'Family', 'City Building', 'Matematika, Finansial'),
  ('Kasper Lapp', 'Gyom', '15 menit', 1, 7, '8', 'Family', 'Fantasy', 'Matematika, Bahasa Indonesia'),
  ('Lisa Bowman-Steenson', '-', '30 menit', 2, 4, '5', 'Uncategorized', 'Children Games', 'Finansial'),
  ('Marc Andre', 'Marc Andre', '30 menit', 2, 4, '10', 'Family', 'Economic', 'Matematika, Finansial'),
  ('-', '-', '90 menit', 2, 4, '8', 'Family', 'Adventure', 'Bahasa Inggris, Finansial, Geografi'),
  ('Eric Goldberg, Ben Grossman, Steve Marsh', 'Larry Catalano, Peter Corless, Stephen Crane, Stefan Dick', '240 menit', 2, 7, '16', 'Strategy', 'Political', 'Finansial, Sejarah, Ilmu Politik & Kewarganegaraan'),
  ('Hjalmar Hach', 'Sabrina Miramon', '60 menit', 2, 4, '10', 'Family', 'Abstract Strategy', 'Matematika, IPA');

-- 5. CONTOH QUERY untuk menampilkan semua board game
-- SELECT * FROM public.boardgame_metadata ORDER BY id;
-- SELECT category, COUNT(*) FROM public.boardgame_metadata GROUP BY category ORDER BY COUNT(*) DESC;
-- SELECT * FROM public.boardgame_metadata WHERE type = 'Family';
