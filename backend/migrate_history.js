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

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Terhubung ke Supabase PostgreSQL...');

    // 1. customer_visits
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.customer_visits (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        duration TEXT,
        table_name TEXT,
        friends INTEGER,
        spending INTEGER,
        game_played TEXT,
        game_image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);
    console.log('✅ customer_visits table created.');

    // 2. customer_game_history
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.customer_game_history (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        rating INTEGER DEFAULT 0,
        date TEXT NOT NULL,
        duration TEXT,
        table_name TEXT,
        players INTEGER,
        status TEXT DEFAULT '-',
        comment TEXT,
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);
    console.log('✅ customer_game_history table created.');

    // 3. customer_transactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.customer_transactions (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        items TEXT NOT NULL,
        amount INTEGER NOT NULL,
        method TEXT NOT NULL,
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);
    console.log('✅ customer_transactions table created.');

    console.log('Migrasi history dan transaksi selesai!');
  } catch (err) {
    console.error('Error saat migrasi:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
