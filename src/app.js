/**
 * Sweet Shop Management System
 * Main application entry point
 */

const { closePool } = require('./database/connection');

console.log('🍬 Sweet Shop Management System Starting...');
console.log('📦 System initialized successfully!');

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closePool();
  process.exit(0);
});

module.exports = {};
