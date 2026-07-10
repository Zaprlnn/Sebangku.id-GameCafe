import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL ||
  'postgresql://postgres:2300016045@db.uetbkbvwthbqpedxscom.supabase.co:5432/postgres';

const { Pool } = pg;
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function migrateCustomerProfile() {
  const client = await pool.connect();
  try {
    console.log('Terhubung ke Supabase PostgreSQL...');

    // Buat tabel customer_profiles jika belum ada
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.customer_profiles (
        user_id        INTEGER PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
        nama_depan     TEXT,
        nama_belakang  TEXT,
        tanggal_lahir  TEXT,
        status         TEXT DEFAULT 'Active · Regular',
        kunjungan      INTEGER DEFAULT 0,
        waktu_bermain  INTEGER DEFAULT 0,
        win_rate       INTEGER DEFAULT 0,
        level          INTEGER DEFAULT 1,
        member_sejak   TEXT,
        created_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log('✅ Tabel customer_profiles berhasil dibuat atau sudah ada.');

    // Seed data profil untuk user default (ID: 3 adalah Customer Demo jika kita lihat di server.js)
    // Cek dulu apakah customer@boardverse.com ada
    const userCheck = await client.query('SELECT id FROM public.users WHERE username = $1', ['customer@boardverse.com']);
    if (userCheck.rows.length > 0) {
      const customerId = userCheck.rows[0].id;
      
      const profileCheck = await client.query('SELECT user_id FROM public.customer_profiles WHERE user_id = $1', [customerId]);
      if (profileCheck.rows.length === 0) {
        await client.query(`
          INSERT INTO public.customer_profiles 
          (user_id, nama_depan, nama_belakang, tanggal_lahir, status, kunjungan, waktu_bermain, win_rate, level, member_sejak)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          customerId,
          'Andi',
          'Saputra',
          '15/03/1995',
          'Active · Regular',
          24,
          48,
          70,
          12,
          'Maret 2024'
        ]);
        console.log(`✅ Seed profil customer untuk user ID ${customerId} ('Andi Saputra') berhasil ditambahkan.`);
      } else {
        console.log(`Profil untuk user ID ${customerId} sudah ada.`);
      }
    } else {
      console.log('⚠️ Customer default (customer@boardverse.com) tidak ditemukan di tabel users, skip seeding.');
    }

  } catch (err) {
    console.error('❌ Gagal menjalankan migrasi:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrateCustomerProfile();
