/**
 * SweetService Unit Tests
 * Testing business logic following TDD approach
 */

const SweetService = require('../../src/services/SweetService');
const SweetRepository = require('../../src/repositories/SweetRepository');
const Sweet = require('../../src/models/Sweet');

// Mock the repository
jest.mock('../../src/repositories/SweetRepository');

describe('SweetService', () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create mock repository
    mockRepository = new SweetRepository();
    
    // Create service with mocked repository
    service = new SweetService(mockRepository);
  });

  describe('getAllSweets', () => {
    
    test('should return all sweets from repository', async () => {
      const mockSweets = [
        new Sweet({ id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 100 }),
        new Sweet({ id: 2, name: 'Gummy Bears', category: 'candy', price: 1.99, quantity: 150 })
      ];

      mockRepository.findAll.mockResolvedValue(mockSweets);

      const sweets = await service.getAllSweets();

      expect(sweets).toHaveLength(2);
      expect(sweets[0].name).toBe('Chocolate Bar');
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    test('should return empty array when no sweets exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const sweets = await service.getAllSweets();

      expect(sweets).toEqual([]);
    });
  });

  describe('getSweetById', () => {
    
    test('should return a sweet by id', async () => {
      const mockSweet = new Sweet({ 
        id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 100 
      });

      mockRepository.findById.mockResolvedValue(mockSweet);

      const sweet = await service.getSweetById(1);

      expect(sweet).toBeDefined();
      expect(sweet.name).toBe('Chocolate Bar');
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    test('should throw error if sweet not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getSweetById(999))
        .rejects
        .toThrow('Sweet with ID 999 not found');
    });
  });

  describe('addSweet', () => {
    
    test('should add a new sweet with valid data', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      };

      const mockCreatedSweet = new Sweet({ id: 1, ...sweetData });
      mockRepository.create.mockResolvedValue(mockCreatedSweet);

      const sweet = await service.addSweet(sweetData);

      expect(sweet).toBeDefined();
      expect(sweet.id).toBe(1);
      expect(sweet.name).toBe('Chocolate Bar');
      expect(mockRepository.create).toHaveBeenCalledWith(sweetData);
    });

    test('should throw error if name is missing', async () => {
      const invalidData = {
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      };

      await expect(service.addSweet(invalidData))
        .rejects
        .toThrow();
    });

    test('should throw error if price is negative', async () => {
      const invalidData = {
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: -2.50,
        quantity: 100
      };

      await expect(service.addSweet(invalidData))
        .rejects
        .toThrow();
    });
  });

  describe('updateSweet', () => {
    
    test('should update an existing sweet', async () => {
      const updateData = {
        name: 'Updated Chocolate',
        category: 'chocolate',
        price: 3.00,
        quantity: 80
      };

      const existingSweet = new Sweet({ 
        id: 1, name: 'Old Name', category: 'chocolate', price: 2.50, quantity: 100 
      });

      const mockUpdatedSweet = new Sweet({ id: 1, ...updateData });
      
      mockRepository.findById.mockResolvedValue(existingSweet);
      mockRepository.update.mockResolvedValue(mockUpdatedSweet);

      const sweet = await service.updateSweet(1, updateData);

      expect(sweet).toBeDefined();
      expect(sweet.name).toBe('Updated Chocolate');
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    test('should throw error if sweet not found', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(service.updateSweet(999, { name: 'Test' }))
        .rejects
        .toThrow('Sweet with ID 999 not found');
    });
  });

  describe('deleteSweet', () => {
    
    test('should delete an existing sweet', async () => {
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.deleteSweet(1);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    test('should throw error if sweet not found', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.deleteSweet(999))
        .rejects
        .toThrow('Sweet with ID 999 not found');
    });
  });

  describe('searchByCategory', () => {
    
    test('should return sweets by category', async () => {
      const mockSweets = [
        new Sweet({ id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 100 }),
        new Sweet({ id: 2, name: 'Dark Chocolate', category: 'chocolate', price: 3.00, quantity: 50 })
      ];

      mockRepository.findByCategory.mockResolvedValue(mockSweets);

      const sweets = await service.searchByCategory('chocolate');

      expect(sweets).toHaveLength(2);
      expect(sweets[0].category).toBe('chocolate');
      expect(mockRepository.findByCategory).toHaveBeenCalledWith('chocolate');
    });

    test('should return empty array if no sweets in category', async () => {
      mockRepository.findByCategory.mockResolvedValue([]);

      const sweets = await service.searchByCategory('unknown');

      expect(sweets).toEqual([]);
    });
  });

  describe('searchByName', () => {
    
    test('should return sweets matching name', async () => {
      const mockSweets = [
        new Sweet({ id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 100 })
      ];

      mockRepository.findByName.mockResolvedValue(mockSweets);

      const sweets = await service.searchByName('Chocolate');

      expect(sweets).toHaveLength(1);
      expect(sweets[0].name).toContain('Chocolate');
      expect(mockRepository.findByName).toHaveBeenCalledWith('Chocolate');
    });
  });

  describe('searchByPriceRange', () => {
    
    test('should return sweets within price range', async () => {
      const mockSweets = [
        new Sweet({ id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 100 })
      ];

      mockRepository.findByPriceRange.mockResolvedValue(mockSweets);

      const sweets = await service.searchByPriceRange(2.00, 3.00);

      expect(sweets).toHaveLength(1);
      expect(mockRepository.findByPriceRange).toHaveBeenCalledWith(2.00, 3.00);
    });

    test('should throw error if min price is greater than max price', async () => {
      await expect(service.searchByPriceRange(5.00, 2.00))
        .rejects
        .toThrow('Minimum price cannot be greater than maximum price');
    });

    test('should throw error if prices are negative', async () => {
      await expect(service.searchByPriceRange(-1.00, 2.00))
        .rejects
        .toThrow('Prices must be positive numbers');
    });
  });

  describe('purchaseSweet', () => {
    
    test('should decrease quantity when purchasing', async () => {
      const mockSweet = new Sweet({ 
        id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 100 
      });

      mockRepository.findById.mockResolvedValue(mockSweet);
      
      const updatedSweet = new Sweet({ 
        id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 90 
      });
      mockRepository.updateQuantity.mockResolvedValue(updatedSweet);

      const result = await service.purchaseSweet(1, 10);

      expect(result.quantity).toBe(90);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.updateQuantity).toHaveBeenCalledWith(1, 90);
    });

    test('should throw error if insufficient stock', async () => {
      const mockSweet = new Sweet({ 
        id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 5 
      });

      mockRepository.findById.mockResolvedValue(mockSweet);

      await expect(service.purchaseSweet(1, 10))
        .rejects
        .toThrow('Insufficient stock. Available: 5, Requested: 10');
    });

    test('should throw error if sweet not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.purchaseSweet(999, 10))
        .rejects
        .toThrow('Sweet with ID 999 not found');
    });

    test('should throw error if purchase quantity is zero or negative', async () => {
      await expect(service.purchaseSweet(1, 0))
        .rejects
        .toThrow('Purchase quantity must be greater than zero');

      await expect(service.purchaseSweet(1, -5))
        .rejects
        .toThrow('Purchase quantity must be greater than zero');
    });

    test('should allow purchasing all remaining stock', async () => {
      const mockSweet = new Sweet({ 
        id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 10 
      });

      mockRepository.findById.mockResolvedValue(mockSweet);
      
      const updatedSweet = new Sweet({ 
        id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 0 
      });
      mockRepository.updateQuantity.mockResolvedValue(updatedSweet);

      const result = await service.purchaseSweet(1, 10);

      expect(result.quantity).toBe(0);
    });
  });

  describe('restockSweet', () => {
    
    test('should increase quantity when restocking', async () => {
      const mockSweet = new Sweet({ 
        id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 50 
      });

      mockRepository.findById.mockResolvedValue(mockSweet);
      
      const updatedSweet = new Sweet({ 
        id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 100 
      });
      mockRepository.updateQuantity.mockResolvedValue(updatedSweet);

      const result = await service.restockSweet(1, 50);

      expect(result.quantity).toBe(100);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.updateQuantity).toHaveBeenCalledWith(1, 100);
    });

    test('should throw error if sweet not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.restockSweet(999, 50))
        .rejects
        .toThrow('Sweet with ID 999 not found');
    });

    test('should throw error if restock quantity is zero or negative', async () => {
      await expect(service.restockSweet(1, 0))
        .rejects
        .toThrow('Restock quantity must be greater than zero');

      await expect(service.restockSweet(1, -10))
        .rejects
        .toThrow('Restock quantity must be greater than zero');
    });
  });

  describe('checkStock', () => {
    
    test('should return true if sweet is in stock', async () => {
      const mockSweet = new Sweet({ 
        id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 100 
      });

      mockRepository.findById.mockResolvedValue(mockSweet);

      const inStock = await service.checkStock(1);

      expect(inStock).toBe(true);
    });

    test('should return false if sweet is out of stock', async () => {
      const mockSweet = new Sweet({ 
        id: 1, name: 'Chocolate Bar', category: 'chocolate', price: 2.50, quantity: 0 
      });

      mockRepository.findById.mockResolvedValue(mockSweet);

      const inStock = await service.checkStock(1);

      expect(inStock).toBe(false);
    });

    test('should throw error if sweet not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.checkStock(999))
        .rejects
        .toThrow('Sweet with ID 999 not found');
    });
  });
});
