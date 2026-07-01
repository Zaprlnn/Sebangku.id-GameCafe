import pg from 'pg';

const connectionString = 'postgresql://postgres:2300016045@db.uetbkbvwthbqpedxscom.supabase.co:5432/postgres';

const pool = new pg.Pool({
  connectionString,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Connected to Supabase PostgreSQL');

    // Create profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        name TEXT,
        phone TEXT,
        role TEXT DEFAULT 'Customer',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log('✅ Table public.profiles is ready');

    // Enable Row Level Security on profiles
    await client.query(`ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`);
    
    // Create policies for profiles (Allow all for simplicity during migration)
    await client.query(`
      DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
      CREATE POLICY "Public profiles are viewable by everyone." 
      ON public.profiles FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
      CREATE POLICY "Users can insert their own profile." 
      ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

      DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
      CREATE POLICY "Users can update own profile." 
      ON public.profiles FOR UPDATE USING (auth.uid() = id);
    `);
    console.log('✅ RLS policies for profiles are configured');

  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
