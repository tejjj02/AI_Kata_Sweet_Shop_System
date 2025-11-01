/**
 * Database Setup Script
 * This script creates the database tables and inserts sample data
 */

const fs = require('fs');
const path = require('path');
const { pool, closePool } = require('./src/database/connection');

async function setupDatabase() {
  try {
    console.log('🔧 Starting database setup...\n');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'src', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    console.log('📋 Creating tables...');
    await pool.query(schema);
    
    console.log('✅ Tables created successfully!');
    console.log('✅ Sample data inserted!');
    console.log('\n🎉 Database setup complete!\n');
    
    // Show the sample data
    const result = await pool.query('SELECT * FROM sweets');
    console.log('📦 Sample sweets in database:');
    console.table(result.rows);

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    
    if (error.code === '3D000') {
      console.error('\n💡 Database does not exist!');
      console.error('Please create the database first:');
      console.error('   1. Open pgAdmin or psql');
      console.error('   2. Run: CREATE DATABASE sweet_shop;');
      console.error('   3. Then run this script again\n');
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed!');
      console.error('Please check your .env file and update:');
      console.error('   - DB_USER');
      console.error('   - DB_PASSWORD\n');
    }
    
    process.exit(1);
  } finally {
    await closePool();
  }
}

// Run the setup
setupDatabase();
