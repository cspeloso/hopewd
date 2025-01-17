const { Pool } = require('pg');
const dotenv = require('dotenv');
require('dotenv').config({ path: '../.env' });

// Load environment variables
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,        // Should be tiktokadmin
  host: process.env.DB_HOST,        // Should be localhost
  database: process.env.DB_NAME,    // Should be hopewd
  password: process.env.DB_PASSWORD,// Should be tikTokApp123$
  port: process.env.DB_PORT,        // Should be 5432
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

module.exports = pool;