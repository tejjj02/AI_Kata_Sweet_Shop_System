/**
 * REST API Routes for Sweet Shop
 * Handles all HTTP requests for sweet operations
 */

const express = require('express');
const SweetService = require('../services/SweetService');

const router = express.Router();
const sweetService = new SweetService();

/**
 * GET /api/sweets
 * Get all sweets
 */
router.get('/sweets', async (req, res) => {
  try {
    const sweets = await sweetService.getAllSweets();
    res.json({
      success: true,
      count: sweets.length,
      data: sweets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sweets/:id
 * Get a single sweet by ID
 */
router.get('/sweets/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sweet = await sweetService.getSweetById(id);
    
    res.json({
      success: true,
      data: sweet
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sweets
 * Create a new sweet
 */
router.post('/sweets', async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    
    const sweet = await sweetService.addSweet({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity)
    });
    
    res.status(201).json({
      success: true,
      message: 'Sweet created successfully',
      data: sweet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/sweets/:id
 * Update an existing sweet
 */
router.put('/sweets/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, category, price, quantity } = req.body;
    
    const sweet = await sweetService.updateSweet(id, {
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity)
    });
    
    res.json({
      success: true,
      message: 'Sweet updated successfully',
      data: sweet
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/sweets/:id
 * Delete a sweet
 */
router.delete('/sweets/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await sweetService.deleteSweet(id);
    
    res.json({
      success: true,
      message: 'Sweet deleted successfully'
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sweets/search/category/:category
 * Search sweets by category
 */
router.get('/sweets/search/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const sweets = await sweetService.searchByCategory(category);
    
    res.json({
      success: true,
      count: sweets.length,
      data: sweets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sweets/search/name/:name
 * Search sweets by name
 */
router.get('/sweets/search/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const sweets = await sweetService.searchByName(name);
    
    res.json({
      success: true,
      count: sweets.length,
      data: sweets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sweets/search/price?min=X&max=Y
 * Search sweets by price range
 */
router.get('/sweets/search/price', async (req, res) => {
  try {
    const minPrice = parseFloat(req.query.min) || 0;
    const maxPrice = parseFloat(req.query.max) || Number.MAX_VALUE;
    
    const sweets = await sweetService.searchByPriceRange(minPrice, maxPrice);
    
    res.json({
      success: true,
      count: sweets.length,
      data: sweets
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sweets/:id/purchase
 * Purchase sweets (decrease quantity)
 */
router.post('/sweets/:id/purchase', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;
    
    const sweet = await sweetService.purchaseSweet(id, parseInt(quantity));
    
    res.json({
      success: true,
      message: `Purchased ${quantity} units successfully`,
      data: sweet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sweets/:id/restock
 * Restock sweets (increase quantity)
 */
router.post('/sweets/:id/restock', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;
    
    const sweet = await sweetService.restockSweet(id, parseInt(quantity));
    
    res.json({
      success: true,
      message: `Restocked ${quantity} units successfully`,
      data: sweet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sweets/:id/stock
 * Check stock status
 */
router.get('/sweets/:id/stock', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const inStock = await sweetService.checkStock(id);
    
    res.json({
      success: true,
      inStock: inStock,
      message: inStock ? 'Sweet is in stock' : 'Sweet is out of stock'
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
