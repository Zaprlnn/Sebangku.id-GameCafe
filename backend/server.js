import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Inisialisasi Database SQLite ─────────────────────────────────────────────
async function initDB() {
  try {
    // Buat tabel users jika belum ada
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'Customer',
        phone TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabel users siap');

    // Seed default users untuk testing
    const defaultUsers = [
      { name: 'Kasir Satu', username: 'kasir@boardverse.com', password: 'password123', role: 'Kasir', phone: '081234567890' },
      { name: 'Owner Boardverse', username: 'owner@boardverse.com', password: 'password123', role: 'Owner', phone: '081234567891' },
      { name: 'Customer Demo', username: 'customer@boardverse.com', password: 'password123', role: 'Customer', phone: '081234567892' },
    ];

    for (const u of defaultUsers) {
      const existing = await db.execute({
        sql: 'SELECT id FROM users WHERE username = ?',
        args: [u.username],
      });

      if (existing.rows.length === 0) {
        await db.execute({
          sql: 'INSERT INTO users (name, username, password, role, phone) VALUES (?, ?, ?, ?, ?) RETURNING id',
          args: [u.name, u.username, u.password, u.role, u.phone],
        });
        console.log(`👤 User default dibuat: ${u.username}`);
      }
    }

    console.log('🎯 Database siap digunakan!');
  } catch (error) {
    console.error('❌ Gagal inisialisasi database:', error.message);
    process.exit(1);
  }
}

// ─── API: Login ───────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: [email],
    });

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User tidak ditemukan. Periksa kembali email Anda.' });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: 'Password salah. Silakan coba lagi.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Terjadi kesalahan server. Coba lagi.' });
  }
});

// ─── API: Register ────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
  }

  try {
    // Cek email sudah ada
    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE username = ?',
      args: [email],
    });

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar. Gunakan email lain.' });
    }

    // Simpan user baru
    const result = await db.execute({
      sql: 'INSERT INTO users (name, username, password, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      args: [name, email, password, 'Customer', phone || null],
    });

    const newUserId = Number(result.lastInsertRowid);
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ').slice(1).join(' ');

    // Buat profil default
    await db.execute({
      sql: `INSERT INTO customer_profiles 
            (user_id, nama_depan, nama_belakang, status, kunjungan, waktu_bermain, win_rate, level)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      args: [newUserId, firstName, lastName, 'Active · Regular', 1, 0, 0, 1]
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      user: {
        id: newUserId,
        name,
        username: email,
        role: 'Customer',
      },
    });

  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Terjadi kesalahan server. Coba lagi.' });
  }
});

// ─── API: Daftar semua user (untuk debug/admin) ───────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const result = await db.execute(
      'SELECT id, name, username, role, phone, created_at FROM users ORDER BY id'
    );
    res.json({ success: true, users: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data user' });
  }
});
// ─── API: Customer Profile ────────────────────────────────────────────────────────
app.get('/api/customer/profile/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await db.execute({
      sql: `SELECT * FROM customer_profiles WHERE user_id = $1`,
      args: [userId]
    });
    
    if (result.rows.length === 0) {
      // Auto-create for new Supabase Auth users
      await db.execute({
        sql: `INSERT INTO customer_profiles 
              (user_id, status, kunjungan, waktu_bermain, win_rate, level)
              VALUES ($1, $2, $3, $4, $5, $6)`,
        args: [userId, 'Active · Regular', 1, 0, 0, 1]
      });
      
      const newResult = await db.execute({
        sql: `SELECT * FROM customer_profiles WHERE user_id = $1`,
        args: [userId]
      });
      return res.json({ success: true, profile: newResult.rows[0] });
    }
    
    res.json({ success: true, profile: result.rows[0] });
  } catch (error) {
    console.error('Fetch profile error:', error.message);
    res.status(500).json({ message: 'Gagal mengambil data profil' });
  }
});

app.put('/api/customer/profile/:id', async (req, res) => {
  const userId = req.params.id;
  const { nama_depan, nama_belakang, tanggal_lahir } = req.body;
  
  try {
    // Check if profile exists
    const check = await db.execute({
      sql: 'SELECT user_id FROM customer_profiles WHERE user_id = $1',
      args: [userId]
    });
    
    if (check.rows.length === 0) {
      // Insert
      await db.execute({
        sql: `INSERT INTO customer_profiles (user_id, nama_depan, nama_belakang, tanggal_lahir, kunjungan, level)
              VALUES ($1, $2, $3, $4, 1, 1)`,
        args: [userId, nama_depan, nama_belakang, tanggal_lahir]
      });
    } else {
      // Update
      await db.execute({
        sql: `UPDATE customer_profiles 
              SET nama_depan = $1, nama_belakang = $2, tanggal_lahir = $3, updated_at = NOW()
              WHERE user_id = $4`,
        args: [nama_depan, nama_belakang, tanggal_lahir, userId]
      });
    }
    
    res.json({ success: true, message: 'Profil berhasil diperbarui' });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Gagal memperbarui profil' });
  }
});

// ─── API: Customer History & Checkout ──────────────────────────────────────────
app.get('/api/customer/history/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const visits = await db.execute({ sql: 'SELECT * FROM customer_visits WHERE user_id = $1 ORDER BY id DESC', args: [userId] });
    const games = await db.execute({ sql: 'SELECT * FROM customer_game_history WHERE user_id = $1 ORDER BY id DESC', args: [userId] });
    const transactions = await db.execute({ sql: 'SELECT * FROM customer_transactions WHERE user_id = $1 ORDER BY id DESC', args: [userId] });
    
    res.json({
      success: true,
      visits: visits.rows,
      games: games.rows,
      transactions: transactions.rows
    });
  } catch (error) {
    console.error('Fetch history error:', error.message);
    res.status(500).json({ message: 'Gagal mengambil riwayat' });
  }
});

app.post('/api/customer/checkout', async (req, res) => {
  const { userId, table, items, amount, method, details, gamesList, friendsCount } = req.body;
  const date = new Date();
  const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  const fullDateTime = `${dateStr} • ${timeStr}`;

  // Parse details
  const itemsStr = items || details.map((d) => d.name).join(' • ');

  try {
    // 1. Save Transaction
    await db.execute({
      sql: `INSERT INTO customer_transactions (user_id, date, items, amount, method, details) VALUES ($1, $2, $3, $4, $5, $6)`,
      args: [userId, fullDateTime, itemsStr, amount, method, JSON.stringify(details)]
    });

    // 2. Save Visit
    // We get the first game name as representative for the visit, if any
    const mainGame = gamesList && gamesList.length > 0 ? gamesList[0].name : '-';
    const mainGameImg = gamesList && gamesList.length > 0 ? gamesList[0].image : '';
    await db.execute({
      sql: `INSERT INTO customer_visits (user_id, date, time, duration, table_name, friends, spending, game_played, game_image)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      args: [userId, dateStr, timeStr, '2h 00m', table || '-', friendsCount || 1, amount, mainGame, mainGameImg]
    });

    // 3. Save Game History
    let totalGameTimeAdded = 0;
    if (gamesList && gamesList.length > 0) {
      for (const game of gamesList) {
        await db.execute({
          sql: `INSERT INTO customer_game_history (user_id, name, rating, date, duration, table_name, players, status, comment, image)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          args: [userId, game.name, 0, dateStr, '2h 00m', table || '-', friendsCount || 1, '-', '', game.image || '']
        });
        totalGameTimeAdded += 2; // assume 2 hours per game for simplicity
      }
    }

    // 4. Update Customer Profile Stats
    await db.execute({
      sql: `UPDATE customer_profiles 
            SET kunjungan = kunjungan + 1, 
                waktu_bermain = waktu_bermain + $1 
            WHERE user_id = $2`,
      args: [totalGameTimeAdded, userId]
    });

    res.json({ success: true, message: 'Checkout berhasil direkam' });
  } catch (error) {
    console.error('Checkout error:', error.message);
    res.status(500).json({ message: 'Gagal merekam checkout' });
  }
});

// ─── API: Health check ────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '✅ Backend Sebangku berjalan normal (SQLite Lokal)',
    timestamp: new Date().toISOString(),
  });
});

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Backend Sebangku berjalan di http://localhost:${PORT}`);
    console.log(`📡 Endpoint tersedia:`);
    console.log(`   POST http://localhost:${PORT}/api/login`);
    console.log(`   POST http://localhost:${PORT}/api/register`);
    console.log(`   GET  http://localhost:${PORT}/api/users`);
    console.log(`   GET  http://localhost:${PORT}/api/health\n`);
  });
});
