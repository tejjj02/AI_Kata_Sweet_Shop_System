const db = require('../database/connection');
const User = require('../models/User');

class UserRepository {
  async create(email, passwordHash) {
    const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *
    `;

    const result = await db.query(query, [email, passwordHash]);
    return User.fromDatabase(result.rows[0]);
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    return User.fromDatabase(result.rows[0]);
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return User.fromDatabase(result.rows[0]);
  }
}

module.exports = UserRepository;
