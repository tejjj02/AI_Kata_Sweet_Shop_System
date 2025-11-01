/**
 * Sweet Model Unit Tests
 * Testing the Sweet class following TDD approach
 */

const Sweet = require('../../src/models/Sweet');

describe('Sweet Model', () => {
  
  describe('Creating a new Sweet', () => {
    
    test('should create a sweet with all required properties', () => {
      // Arrange: Prepare the data
      const sweetData = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      };

      // Act: Create the sweet
      const sweet = new Sweet(sweetData);

      // Assert: Check if it was created correctly
      expect(sweet.id).toBe(1);
      expect(sweet.name).toBe('Chocolate Bar');
      expect(sweet.category).toBe('chocolate');
      expect(sweet.price).toBe(2.50);
      expect(sweet.quantity).toBe(100);
    });

    test('should throw error if name is missing', () => {
      const invalidData = {
        id: 1,
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      };

      expect(() => new Sweet(invalidData)).toThrow('Name is required');
    });

    test('should throw error if category is missing', () => {
      const invalidData = {
        id: 1,
        name: 'Chocolate Bar',
        price: 2.50,
        quantity: 100
      };

      expect(() => new Sweet(invalidData)).toThrow('Category is required');
    });

    test('should throw error if price is missing', () => {
      const invalidData = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'chocolate',
        quantity: 100
      };

      expect(() => new Sweet(invalidData)).toThrow('Price is required');
    });

    test('should throw error if quantity is missing', () => {
      const invalidData = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50
      };

      expect(() => new Sweet(invalidData)).toThrow('Quantity is required');
    });

    test('should throw error if price is negative', () => {
      const invalidData = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: -5,
        quantity: 100
      };

      expect(() => new Sweet(invalidData)).toThrow('Price must be a positive number');
    });

    test('should throw error if quantity is negative', () => {
      const invalidData = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: -10
      };

      expect(() => new Sweet(invalidData)).toThrow('Quantity must be a non-negative number');
    });

    test('should accept quantity of zero', () => {
      const sweetData = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 0
      };

      const sweet = new Sweet(sweetData);
      expect(sweet.quantity).toBe(0);
    });
  });

  describe('Sweet properties', () => {
    
    test('should have timestamps when created', () => {
      const sweetData = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      };

      const sweet = new Sweet(sweetData);
      
      expect(sweet.createdAt).toBeInstanceOf(Date);
      expect(sweet.updatedAt).toBeInstanceOf(Date);
    });

    test('should convert to JSON object', () => {
      const sweetData = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      };

      const sweet = new Sweet(sweetData);
      const json = sweet.toJSON();

      expect(json).toHaveProperty('id', 1);
      expect(json).toHaveProperty('name', 'Chocolate Bar');
      expect(json).toHaveProperty('category', 'chocolate');
      expect(json).toHaveProperty('price', 2.50);
      expect(json).toHaveProperty('quantity', 100);
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });
  });

  describe('Valid categories', () => {
    
    test('should accept "chocolate" as category', () => {
      const sweet = new Sweet({
        id: 1,
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      });
      expect(sweet.category).toBe('chocolate');
    });

    test('should accept "candy" as category', () => {
      const sweet = new Sweet({
        id: 1,
        name: 'Gummy Bears',
        category: 'candy',
        price: 1.99,
        quantity: 150
      });
      expect(sweet.category).toBe('candy');
    });

    test('should accept "pastry" as category', () => {
      const sweet = new Sweet({
        id: 1,
        name: 'Croissant',
        category: 'pastry',
        price: 3.50,
        quantity: 50
      });
      expect(sweet.category).toBe('pastry');
    });
  });
});
