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
      DROP TABLE IF EXISTS users;
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
      sql: 'INSERT INTO users (name, username, password, role, phone) VALUES (?, ?, ?, ?, ?) RETURNING id',
      args: [name, email, password, 'Customer', phone || null],
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      user: {
        id: Number(result.lastInsertRowid),
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
