const { Pool } = require('pg');
require('dotenv').config();

/**
 * Database connection pool
 * This creates a pool of connections to PostgreSQL that can be reused
 * instead of creating a new connection for every query
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sweet_shop',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if can't connect
});

/**
 * Test database connection
 */
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

/**
 * Query helper function
 * @param {string} text - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} - Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 */
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

/**
 * Close all database connections
 */
const closePool = async () => {
  await pool.end();
  console.log('🔒 Database pool closed');
};

module.exports = {
  query,
  getClient,
  closePool,
  pool,
};
