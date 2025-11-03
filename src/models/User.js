const bcrypt = require('bcryptjs');

class User {
  constructor({ id, email, passwordHash, createdAt }) {
    this.validate(email, passwordHash);
    
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt || new Date();
  }

  validate(email, passwordHash) {
    if (!email) {
      throw new Error('Email is required');
    }

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (!passwordHash) {
      throw new Error('Password hash is required');
    }
  }

  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt
    };
  }

  static fromDatabase(row) {
    return new User({
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: row.created_at
    });
  }
}

module.exports = User;
