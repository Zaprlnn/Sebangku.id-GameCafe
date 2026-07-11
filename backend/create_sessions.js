import pg from 'pg';

const connectionString = 'postgresql://postgres:2300016045@db.uetbkbvwthbqpedxscom.supabase.co:5432/postgres';
const pool = new pg.Pool({ connectionString });

async function run() {
  const client = await pool.connect();
  try {
    console.log('Connected to Supabase PostgreSQL');

    // Create sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.sessions (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        table_number TEXT NOT NULL,
        game_title TEXT,
        duration TEXT,
        time_left TEXT,
        status TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log('✅ Table public.sessions created');

    // Make sure we have some data
    const res = await client.query(`SELECT count(*) FROM public.sessions`);
    if (parseInt(res.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO public.sessions (customer_name, table_number, game_title, duration, time_left, status) VALUES 
        ('Andi Saputra', 'Table A1', 'Pandemic', '2h 15m', '45m', 'Active'),
        ('Budi Laksono', 'Table B3', 'Catan', '1h 05m', '8m', 'Ending Soon'),
        ('Citra Dewi', 'Table C2', 'Ticket to Ride', '3h 00m', 'All Day', 'Active'),
        ('Dika Pratama', 'Table A2', 'Wingspan', '0h 45m', '2h 15m', 'Active'),
        ('Eva Susanti', 'Table D1', 'Root', '1h 30m', '30m', 'Active');
      `);
      console.log('✅ Inserted dummy data into sessions');
    }

    // Insert dummy data to transactions if none exists
    const txRes = await client.query(`SELECT count(*) FROM public.transactions`);
    if (parseInt(txRes.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO public.transactions (customer_name, items, fnb_total, rental_total, total_amount, payment_method, status) VALUES 
        ('Farhan Malik', 'F&B Order (Kopi, Roti)', 75000, 0, 75000, 'QRIS', 'Completed'),
        ('Budi Laksono', 'Rental Session (Catan)', 0, 45000, 45000, 'Transfer', 'Completed'),
        ('Gita Lestari', 'Rent + F&B (Mysterium + Tea)', 50000, 62000, 112000, 'Cash', 'Completed'),
        ('Hendra Wijaya', 'F&B Order (Nasi Goreng)', 38000, 0, 38000, 'QRIS', 'Completed');
      `);
      console.log('✅ Inserted dummy data into transactions');
    }

  } catch (err) {
    console.error('❌ Failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
