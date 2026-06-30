import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // 1. Find user by email (using username field as email as per schema context)
    // Wait, the schema says: username, password, name, role. 
    // The frontend sends "email". We will match it with "username" in the DB.
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found or invalid credentials' });
    }

    const user = result.rows[0];

    // 2. Check password. 
    // For simplicity right now, doing plain text comparison. 
    // In production, you would use bcrypt.compare(password, user.password)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // 3. Return user data (without password)
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper endpoint to seed dummy users for testing
app.post('/api/seed', async (req, res) => {
  try {
    // Insert some default users if they don't exist
    const users = [
      { name: 'Kasir Satu', username: 'kasir@boardverse.com', password: 'password123', role: 'Kasir' },
      { name: 'Owner Boardverse', username: 'owner@boardverse.com', password: 'password123', role: 'Owner' },
      { name: 'Customer Ceria', username: 'customer@boardverse.com', password: 'password123', role: 'Customer' },
    ];

    for (const u of users) {
      const check = await pool.query('SELECT id FROM users WHERE username = $1', [u.username]);
      if (check.rows.length === 0) {
        await pool.query(
          'INSERT INTO users (name, username, password, role) VALUES ($1, $2, $3, $4)',
          [u.name, u.username, u.password, u.role]
        );
      }
    }

    res.json({ success: true, message: 'Dummy users seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ message: 'Error seeding users', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
