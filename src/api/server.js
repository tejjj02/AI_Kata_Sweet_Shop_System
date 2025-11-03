/**
 * Sweet Shop REST API Server
 * Express.js server for managing sweet shop operations
 */

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const authRoutes = require('./authRoutes');
const authMiddleware = require('./authMiddleware');

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

// Authentication Routes (public)
app.use('/api/auth', authRoutes);

// API Routes (protected with authentication)
app.use('/api', authMiddleware, routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🍬 Welcome to Sweet Shop API',
    version: '1.0.0',
    endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user'
      },
      sweets: {
        'GET /api/sweets': 'Get all sweets (requires auth)',
        'GET /api/sweets/:id': 'Get sweet by ID (requires auth)',
        'POST /api/sweets': 'Create new sweet (requires auth)',
        'PUT /api/sweets/:id': 'Update sweet (requires auth)',
        'DELETE /api/sweets/:id': 'Delete sweet (requires auth)'
      },
      search: {
        'GET /api/sweets/search/category/:category': 'Search by category (requires auth)',
        'GET /api/sweets/search/name/:name': 'Search by name (requires auth)',
        'GET /api/sweets/search/price?min=X&max=Y': 'Search by price range (requires auth)'
      },
      inventory: {
        'POST /api/sweets/:id/purchase': 'Purchase sweet (requires auth)',
        'POST /api/sweets/:id/restock': 'Restock sweet (requires auth)',
        'GET /api/sweets/:id/stock': 'Check stock status (requires auth)'
      }
    },
    note: 'All /api/sweets endpoints require Bearer token authentication'
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
