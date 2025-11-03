/**
 * Sweet Shop REST API Server
 * Express.js server for managing sweet shop operations
 */

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🍬 Welcome to Sweet Shop API',
    version: '1.0.0',
    endpoints: {
      sweets: {
        'GET /api/sweets': 'Get all sweets',
        'GET /api/sweets/:id': 'Get sweet by ID',
        'POST /api/sweets': 'Create new sweet',
        'PUT /api/sweets/:id': 'Update sweet',
        'DELETE /api/sweets/:id': 'Delete sweet'
      },
      search: {
        'GET /api/sweets/search/category/:category': 'Search by category',
        'GET /api/sweets/search/name/:name': 'Search by name',
        'GET /api/sweets/search/price?min=X&max=Y': 'Search by price range'
      },
      inventory: {
        'POST /api/sweets/:id/purchase': 'Purchase sweet (decrease quantity)',
        'POST /api/sweets/:id/restock': 'Restock sweet (increase quantity)',
        'GET /api/sweets/:id/stock': 'Check stock status'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🍬 Sweet Shop API Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
