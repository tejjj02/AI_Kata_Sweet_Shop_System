/**
 * Sweet Repository
 * Handles all database operations for sweets
 */

const db = require('../database/connection');
const Sweet = require('../models/Sweet');

class SweetRepository {
  /**
   * Get all sweets from database
   * @returns {Promise<Sweet[]>} Array of Sweet instances
   */
  async findAll() {
    try {
      const result = await db.query('SELECT * FROM sweets ORDER BY id');
      return result.rows.map(row => Sweet.fromDatabase(row));
    } catch (error) {
      throw new Error(`Failed to fetch sweets: ${error.message}`);
    }
  }

  /**
   * Find a sweet by ID
   * @param {number} id - Sweet ID
   * @returns {Promise<Sweet|null>} Sweet instance or null if not found
   */
  async findById(id) {
    try {
      const result = await db.query('SELECT * FROM sweets WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return Sweet.fromDatabase(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to fetch sweet by ID: ${error.message}`);
    }
  }

  /**
   * Create a new sweet
   * @param {Object} sweetData - Sweet data
   * @returns {Promise<Sweet>} Created sweet instance
   */
  async create(sweetData) {
    try {
      const query = `
        INSERT INTO sweets (name, category, price, quantity)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      const values = [
        sweetData.name,
        sweetData.category,
        sweetData.price,
        sweetData.quantity
      ];
      
      const result = await db.query(query, values);
      return Sweet.fromDatabase(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create sweet: ${error.message}`);
    }
  }

  /**
   * Update an existing sweet
   * @param {number} id - Sweet ID
   * @param {Object} sweetData - Updated sweet data
   * @returns {Promise<Sweet|null>} Updated sweet instance or null if not found
   */
  async update(id, sweetData) {
    try {
      const query = `
        UPDATE sweets
        SET name = $1, category = $2, price = $3, quantity = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
      `;
      
      const values = [
        sweetData.name,
        sweetData.category,
        sweetData.price,
        sweetData.quantity,
        id
      ];
      
      const result = await db.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return Sweet.fromDatabase(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to update sweet: ${error.message}`);
    }
  }

  /**
   * Delete a sweet by ID
   * @param {number} id - Sweet ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id) {
    try {
      const result = await db.query('DELETE FROM sweets WHERE id = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete sweet: ${error.message}`);
    }
  }

  /**
   * Find sweets by category
   * @param {string} category - Category name
   * @returns {Promise<Sweet[]>} Array of Sweet instances
   */
  async findByCategory(category) {
    try {
      const query = 'SELECT * FROM sweets WHERE category = $1 ORDER BY name';
      const result = await db.query(query, [category]);
      return result.rows.map(row => Sweet.fromDatabase(row));
    } catch (error) {
      throw new Error(`Failed to fetch sweets by category: ${error.message}`);
    }
  }

  /**
   * Find sweets by name (case-insensitive partial match)
   * @param {string} name - Name to search for
   * @returns {Promise<Sweet[]>} Array of Sweet instances
   */
  async findByName(name) {
    try {
      const query = 'SELECT * FROM sweets WHERE name ILIKE $1 ORDER BY name';
      const result = await db.query(query, [`%${name}%`]);
      return result.rows.map(row => Sweet.fromDatabase(row));
    } catch (error) {
      throw new Error(`Failed to fetch sweets by name: ${error.message}`);
    }
  }

  /**
   * Find sweets within a price range
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @returns {Promise<Sweet[]>} Array of Sweet instances
   */
  async findByPriceRange(minPrice, maxPrice) {
    try {
      const query = 'SELECT * FROM sweets WHERE price BETWEEN $1 AND $2 ORDER BY price';
      const result = await db.query(query, [minPrice, maxPrice]);
      return result.rows.map(row => Sweet.fromDatabase(row));
    } catch (error) {
      throw new Error(`Failed to fetch sweets by price range: ${error.message}`);
    }
  }

  /**
   * Update sweet quantity (for purchase/restock operations)
   * @param {number} id - Sweet ID
   * @param {number} newQuantity - New quantity value
   * @returns {Promise<Sweet|null>} Updated sweet instance or null if not found
   */
  async updateQuantity(id, newQuantity) {
    try {
      const query = `
        UPDATE sweets
        SET quantity = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
      
      const result = await db.query(query, [newQuantity, id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return Sweet.fromDatabase(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to update sweet quantity: ${error.message}`);
    }
  }
}

module.exports = SweetRepository;
