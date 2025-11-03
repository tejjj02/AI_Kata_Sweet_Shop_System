/**
 * Integration Tests
 * Testing all layers working together with real database operations
 * These tests will be skipped if database is not available
 */

const SweetService = require('../../src/services/SweetService');
const SweetRepository = require('../../src/repositories/SweetRepository');
const Sweet = require('../../src/models/Sweet');
const { pool, query } = require('../../src/database/connection');

describe('Sweet Shop Integration Tests', () => {
  let service;
  let repository;

  // Setup before all tests
  beforeAll(async () => {
    try {
      // Test database connection
      await query('SELECT 1');
      repository = new SweetRepository();
      service = new SweetService(repository);
    } catch (error) {
      console.log('⚠️  Database not available, skipping integration tests');
    }
  });

  // Cleanup after all tests
  afterAll(async () => {
    try {
      await pool.end();
    } catch (error) {
      // Database not connected, ignore
    }
  });

  // Clean up test data before each test
  beforeEach(async () => {
    try {
      // Delete test sweets (those with 'TEST_' prefix)
      await query("DELETE FROM sweets WHERE name LIKE 'TEST_%'");
    } catch (error) {
      // Database not available
    }
  });

  describe('Complete CRUD Operations', () => {
    
    test('should create, read, update, and delete a sweet', async () => {
      // Skip if database not available
      if (!repository) {
        return;
      }

      // CREATE
      const newSweet = await service.addSweet({
        name: 'TEST_Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      });

      expect(newSweet).toBeDefined();
      expect(newSweet.id).toBeDefined();
      expect(newSweet.name).toBe('TEST_Chocolate Bar');

      const sweetId = newSweet.id;

      // READ by ID
      const fetchedSweet = await service.getSweetById(sweetId);
      expect(fetchedSweet.name).toBe('TEST_Chocolate Bar');
      expect(fetchedSweet.quantity).toBe(100);

      // UPDATE
      const updatedSweet = await service.updateSweet(sweetId, {
        name: 'TEST_Updated Chocolate',
        category: 'chocolate',
        price: 3.00,
        quantity: 80
      });

      expect(updatedSweet.name).toBe('TEST_Updated Chocolate');
      expect(updatedSweet.price).toBe(3.00);

      // DELETE
      const deleted = await service.deleteSweet(sweetId);
      expect(deleted).toBe(true);

      // Verify deletion
      await expect(service.getSweetById(sweetId))
        .rejects
        .toThrow('not found');
    });
  });

  describe('Search Operations', () => {
    
    test('should search sweets by category', async () => {
      if (!repository) return;

      // Create test sweets
      await service.addSweet({
        name: 'TEST_Milk Chocolate',
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      });

      await service.addSweet({
        name: 'TEST_Dark Chocolate',
        category: 'chocolate',
        price: 3.00,
        quantity: 50
      });

      // Search by category
      const chocolates = await service.searchByCategory('chocolate');
      
      const testChocolates = chocolates.filter(s => s.name.startsWith('TEST_'));
      expect(testChocolates.length).toBeGreaterThanOrEqual(2);
    });

    test('should search sweets by name', async () => {
      if (!repository) return;

      await service.addSweet({
        name: 'TEST_Special Candy',
        category: 'candy',
        price: 1.99,
        quantity: 200
      });

      const results = await service.searchByName('TEST_Special');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].name).toContain('TEST_Special');
    });

    test('should search sweets by price range', async () => {
      if (!repository) return;

      await service.addSweet({
        name: 'TEST_Cheap Candy',
        category: 'candy',
        price: 1.00,
        quantity: 100
      });

      await service.addSweet({
        name: 'TEST_Expensive Truffle',
        category: 'chocolate',
        price: 5.00,
        quantity: 20
      });

      const results = await service.searchByPriceRange(0.50, 2.00);
      const testResults = results.filter(s => s.name.startsWith('TEST_'));
      
      expect(testResults.length).toBeGreaterThanOrEqual(1);
      expect(testResults[0].price).toBeGreaterThanOrEqual(0.50);
      expect(testResults[0].price).toBeLessThanOrEqual(2.00);
    });
  });

  describe('Inventory Management', () => {
    
    test('should handle purchase operation correctly', async () => {
      if (!repository) return;

      // Create a sweet with known quantity
      const sweet = await service.addSweet({
        name: 'TEST_Purchase Item',
        category: 'candy',
        price: 2.00,
        quantity: 50
      });

      const sweetId = sweet.id;

      // Purchase some items
      const afterPurchase = await service.purchaseSweet(sweetId, 10);
      expect(afterPurchase.quantity).toBe(40);

      // Purchase more
      const afterSecondPurchase = await service.purchaseSweet(sweetId, 15);
      expect(afterSecondPurchase.quantity).toBe(25);

      // Try to purchase more than available - should fail
      await expect(service.purchaseSweet(sweetId, 30))
        .rejects
        .toThrow('Insufficient stock');
    });

    test('should handle restock operation correctly', async () => {
      if (!repository) return;

      const sweet = await service.addSweet({
        name: 'TEST_Restock Item',
        category: 'pastry',
        price: 3.50,
        quantity: 10
      });

      const sweetId = sweet.id;

      // Restock items
      const afterRestock = await service.restockSweet(sweetId, 40);
      expect(afterRestock.quantity).toBe(50);

      // Restock again
      const afterSecondRestock = await service.restockSweet(sweetId, 50);
      expect(afterSecondRestock.quantity).toBe(100);
    });

    test('should check stock status correctly', async () => {
      if (!repository) return;

      // Create sweet with stock
      const inStockSweet = await service.addSweet({
        name: 'TEST_In Stock',
        category: 'candy',
        price: 1.50,
        quantity: 100
      });

      const inStock = await service.checkStock(inStockSweet.id);
      expect(inStock).toBe(true);

      // Purchase all stock
      await service.purchaseSweet(inStockSweet.id, 100);

      const outOfStock = await service.checkStock(inStockSweet.id);
      expect(outOfStock).toBe(false);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    
    test('should handle multiple purchases correctly', async () => {
      if (!repository) return;

      const sweet = await service.addSweet({
        name: 'TEST_Multiple Purchase Item',
        category: 'candy',
        price: 2.00,
        quantity: 100
      });

      // Make multiple purchases sequentially
      await service.purchaseSweet(sweet.id, 10);
      await service.purchaseSweet(sweet.id, 15);
      await service.purchaseSweet(sweet.id, 20);

      const finalSweet = await service.getSweetById(sweet.id);
      expect(finalSweet.quantity).toBe(55); // 100 - 10 - 15 - 20
    });

    test('should handle validation errors properly', async () => {
      if (!repository) return;

      // Try to create sweet with invalid data
      await expect(service.addSweet({
        name: '', // Empty name
        category: 'candy',
        price: 2.00,
        quantity: 100
      })).rejects.toThrow();

      await expect(service.addSweet({
        name: 'TEST_Invalid Price',
        category: 'candy',
        price: -5.00, // Negative price
        quantity: 100
      })).rejects.toThrow();
    });
  });

  describe('Database Transactions', () => {
    
    test('should maintain data consistency', async () => {
      if (!repository) return;

      // Create a sweet
      const sweet = await service.addSweet({
        name: 'TEST_Consistency Check',
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      });

      // Get the sweet multiple times - should return same data
      const fetch1 = await service.getSweetById(sweet.id);
      const fetch2 = await service.getSweetById(sweet.id);

      expect(fetch1.name).toBe(fetch2.name);
      expect(fetch1.quantity).toBe(fetch2.quantity);
      expect(fetch1.price).toBe(fetch2.price);
    });
  });
});
