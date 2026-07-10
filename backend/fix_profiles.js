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

async function fix() {
  const client = await pool.connect();
  try {
    console.log('Dropping customer_profiles...');
    await client.query('DROP TABLE IF EXISTS public.customer_profiles CASCADE');
    
    console.log('Creating customer_profiles with TEXT user_id...');
    await client.query(`
      CREATE TABLE public.customer_profiles (
        user_id        TEXT PRIMARY KEY,
        nama_depan     TEXT,
        nama_belakang  TEXT,
        tanggal_lahir  TEXT,
        status         TEXT DEFAULT 'Active · Regular',
        kunjungan      INTEGER DEFAULT 1,
        waktu_bermain  INTEGER DEFAULT 0,
        win_rate       INTEGER DEFAULT 0,
        level          INTEGER DEFAULT 1,
        member_sejak   TEXT,
        created_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    
    // Seed demo user (id 3)
    await client.query(`
      INSERT INTO public.customer_profiles 
      (user_id, nama_depan, nama_belakang, tanggal_lahir, status, kunjungan, waktu_bermain, win_rate, level, member_sejak)
      VALUES 
      ('3', 'Andi', 'Saputra', '1995-03-15', 'Active · Regular', 24, 48, 70, 12, 'Maret 2024')
    `);
    
    console.log('Fix complete!');
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

fix();
