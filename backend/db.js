import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: resolve(__dirname, '.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log(`🔗 Menghubungkan ke Supabase PostgreSQL...`);

// Wrapper agar tidak perlu mengubah semua db.execute di server.js
const db = {
  async execute(queryOrObj) {
    let sql;
    let params;
    
    if (typeof queryOrObj === 'object') {
      sql = queryOrObj.sql;
      params = queryOrObj.args || [];
    } else {
      sql = queryOrObj;
      params = [];
    }

    // Convert SQLite '?' ke PostgreSQL '$1', '$2', dll.
    let counter = 1;
    const pgSql = sql.replace(/\?/g, () => `$${counter++}`);

    try {
      const result = await pool.query(pgSql, params);
      
      // Handle array of results (multiple statements)
      const finalResult = Array.isArray(result) ? result[result.length - 1] : result;
      const rows = finalResult?.rows || [];

      return {
        rows: rows,
        lastInsertRowid: rows[0]?.id || null, 
      };
    } catch (error) {
      throw error;
    }
  }
};

export default db;
