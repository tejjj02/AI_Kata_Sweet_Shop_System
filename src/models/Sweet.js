/**
 * Sweet Model
 * Represents a sweet item in the shop inventory
 */

class Sweet {
  /**
   * Create a new Sweet
   * @param {Object} data - Sweet data
   * @param {number} data.id - Unique identifier
   * @param {string} data.name - Sweet name
   * @param {string} data.category - Category (chocolate, candy, pastry)
   * @param {number} data.price - Price in currency units
   * @param {number} data.quantity - Quantity in stock
   */
  constructor(data) {
    // Validate required fields
    this.validate(data);

    // Set properties
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.price = data.price;
    this.quantity = data.quantity;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Validate sweet data
   * @param {Object} data - Data to validate
   * @throws {Error} If validation fails
   */
  validate(data) {
    // Check required fields
    if (!data.name) {
      throw new Error('Name is required');
    }

    if (!data.category) {
      throw new Error('Category is required');
    }

    if (data.price === undefined || data.price === null) {
      throw new Error('Price is required');
    }

    if (data.quantity === undefined || data.quantity === null) {
      throw new Error('Quantity is required');
    }

    // Validate price
    if (typeof data.price !== 'number' || data.price < 0) {
      throw new Error('Price must be a positive number');
    }

    // Validate quantity
    if (typeof data.quantity !== 'number' || data.quantity < 0) {
      throw new Error('Quantity must be a non-negative number');
    }
  }

  /**
   * Convert sweet to JSON object
   * @returns {Object} Sweet data as plain object
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      price: this.price,
      quantity: this.quantity,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create Sweet from database row
   * @param {Object} row - Database row
   * @returns {Sweet} Sweet instance
   */
  static fromDatabase(row) {
    return new Sweet({
      id: row.id,
      name: row.name,
      category: row.category,
      price: parseFloat(row.price),
      quantity: parseInt(row.quantity),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }
}

module.exports = Sweet;
