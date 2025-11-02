/**
 * SweetRepository Unit Tests
 * Testing database operations following TDD approach
 */

const SweetRepository = require('../../src/repositories/SweetRepository');
const Sweet = require('../../src/models/Sweet');

// Mock the database connection
jest.mock('../../src/database/connection');
const db = require('../../src/database/connection');

describe('SweetRepository', () => {
  let repository;

  beforeEach(() => {
    // Create a new repository instance before each test
    repository = new SweetRepository();
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    
    test('should return all sweets from database', async () => {
      // Arrange: Mock database response
      const mockRows = [
        {
          id: 1,
          name: 'Chocolate Bar',
          category: 'chocolate',
          price: '2.50',
          quantity: 100,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          name: 'Gummy Bears',
          category: 'candy',
          price: '1.99',
          quantity: 150,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      db.query.mockResolvedValue({ rows: mockRows });

      // Act: Call the repository method
      const sweets = await repository.findAll();

      // Assert: Check results
      expect(sweets).toHaveLength(2);
      expect(sweets[0]).toBeInstanceOf(Sweet);
      expect(sweets[0].name).toBe('Chocolate Bar');
      expect(sweets[1].name).toBe('Gummy Bears');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM sweets ORDER BY id');
    });

    test('should return empty array when no sweets exist', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const sweets = await repository.findAll();

      expect(sweets).toEqual([]);
      expect(sweets).toHaveLength(0);
    });
  });

  describe('findById', () => {
    
    test('should return a sweet by id', async () => {
      const mockRow = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: '2.50',
        quantity: 100,
        created_at: new Date(),
        updated_at: new Date()
      };

      db.query.mockResolvedValue({ rows: [mockRow] });

      const sweet = await repository.findById(1);

      expect(sweet).toBeInstanceOf(Sweet);
      expect(sweet.id).toBe(1);
      expect(sweet.name).toBe('Chocolate Bar');
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM sweets WHERE id = $1', [1]);
    });

    test('should return null if sweet not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const sweet = await repository.findById(999);

      expect(sweet).toBeNull();
    });
  });

  describe('create', () => {
    
    test('should create a new sweet in database', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: 2.50,
        quantity: 100
      };

      const mockRow = {
        id: 1,
        ...sweetData,
        price: '2.50',
        created_at: new Date(),
        updated_at: new Date()
      };

      db.query.mockResolvedValue({ rows: [mockRow] });

      const sweet = await repository.create(sweetData);

      expect(sweet).toBeInstanceOf(Sweet);
      expect(sweet.id).toBe(1);
      expect(sweet.name).toBe('Chocolate Bar');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sweets'),
        expect.arrayContaining(['Chocolate Bar', 'chocolate', 2.50, 100])
      );
    });

    test('should throw error if creation fails', async () => {
      db.query.mockRejectedValue(new Error('Database error'));

      await expect(repository.create({ name: 'Test' }))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('update', () => {
    
    test('should update an existing sweet', async () => {
      const updateData = {
        name: 'Updated Chocolate',
        category: 'chocolate',
        price: 3.00,
        quantity: 80
      };

      const mockRow = {
        id: 1,
        ...updateData,
        price: '3.00',
        created_at: new Date(),
        updated_at: new Date()
      };

      db.query.mockResolvedValue({ rows: [mockRow] });

      const sweet = await repository.update(1, updateData);

      expect(sweet).toBeInstanceOf(Sweet);
      expect(sweet.id).toBe(1);
      expect(sweet.name).toBe('Updated Chocolate');
      expect(sweet.price).toBe(3.00);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE sweets'),
        expect.arrayContaining(['Updated Chocolate', 'chocolate', 3.00, 80, 1])
      );
    });

    test('should return null if sweet to update not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const sweet = await repository.update(999, { name: 'Test' });

      expect(sweet).toBeNull();
    });
  });

  describe('delete', () => {
    
    test('should delete a sweet by id', async () => {
      db.query.mockResolvedValue({ rowCount: 1 });

      const result = await repository.delete(1);

      expect(result).toBe(true);
      expect(db.query).toHaveBeenCalledWith('DELETE FROM sweets WHERE id = $1', [1]);
    });

    test('should return false if sweet to delete not found', async () => {
      db.query.mockResolvedValue({ rowCount: 0 });

      const result = await repository.delete(999);

      expect(result).toBe(false);
    });
  });

  describe('findByCategory', () => {
    
    test('should return sweets filtered by category', async () => {
      const mockRows = [
        {
          id: 1,
          name: 'Chocolate Bar',
          category: 'chocolate',
          price: '2.50',
          quantity: 100,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          name: 'Dark Chocolate',
          category: 'chocolate',
          price: '3.00',
          quantity: 50,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      db.query.mockResolvedValue({ rows: mockRows });

      const sweets = await repository.findByCategory('chocolate');

      expect(sweets).toHaveLength(2);
      expect(sweets[0].category).toBe('chocolate');
      expect(sweets[1].category).toBe('chocolate');
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM sweets WHERE category = $1 ORDER BY name',
        ['chocolate']
      );
    });
  });

  describe('findByName', () => {
    
    test('should return sweets matching name pattern', async () => {
      const mockRows = [
        {
          id: 1,
          name: 'Chocolate Bar',
          category: 'chocolate',
          price: '2.50',
          quantity: 100,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      db.query.mockResolvedValue({ rows: mockRows });

      const sweets = await repository.findByName('Chocolate');

      expect(sweets).toHaveLength(1);
      expect(sweets[0].name).toContain('Chocolate');
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM sweets WHERE name ILIKE $1 ORDER BY name',
        ['%Chocolate%']
      );
    });
  });

  describe('findByPriceRange', () => {
    
    test('should return sweets within price range', async () => {
      const mockRows = [
        {
          id: 1,
          name: 'Chocolate Bar',
          category: 'chocolate',
          price: '2.50',
          quantity: 100,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      db.query.mockResolvedValue({ rows: mockRows });

      const sweets = await repository.findByPriceRange(2.00, 3.00);

      expect(sweets).toHaveLength(1);
      expect(sweets[0].price).toBeGreaterThanOrEqual(2.00);
      expect(sweets[0].price).toBeLessThanOrEqual(3.00);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM sweets WHERE price BETWEEN $1 AND $2 ORDER BY price',
        [2.00, 3.00]
      );
    });
  });

  describe('updateQuantity', () => {
    
    test('should update sweet quantity', async () => {
      const mockRow = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'chocolate',
        price: '2.50',
        quantity: 90,
        created_at: new Date(),
        updated_at: new Date()
      };

      db.query.mockResolvedValue({ rows: [mockRow] });

      const sweet = await repository.updateQuantity(1, 90);

      expect(sweet).toBeInstanceOf(Sweet);
      expect(sweet.quantity).toBe(90);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE sweets'),
        [90, 1]
      );
    });

    test('should return null if sweet not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const sweet = await repository.updateQuantity(999, 50);

      expect(sweet).toBeNull();
    });
  });
});
