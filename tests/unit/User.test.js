const User = require('../../src/models/User');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  describe('Constructor', () => {
    it('should create a user with valid data', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        createdAt: new Date()
      });

      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('hashedpassword123');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error if email is missing', () => {
      expect(() => {
        new User({ passwordHash: 'hashedpassword123' });
      }).toThrow('Email is required');
    });

    it('should throw error if email is invalid', () => {
      expect(() => {
        new User({ email: 'invalid-email', passwordHash: 'hashedpassword123' });
      }).toThrow('Invalid email format');
    });

    it('should throw error if password hash is missing', () => {
      expect(() => {
        new User({ email: 'test@example.com' });
      }).toThrow('Password hash is required');
    });
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'mySecurePassword123';
      const hash = await User.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should create different hashes for same password', async () => {
      const password = 'mySecurePassword123';
      const hash1 = await User.hashPassword(password);
      const hash2 = await User.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'mySecurePassword123';
      const hash = await User.hashPassword(password);
      const user = new User({
        email: 'test@example.com',
        passwordHash: hash
      });

      const isValid = await user.verifyPassword(password);
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'mySecurePassword123';
      const hash = await User.hashPassword(password);
      const user = new User({
        email: 'test@example.com',
        passwordHash: hash
      });

      const isValid = await user.verifyPassword('wrongPassword');
      expect(isValid).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return user data without password hash', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        createdAt: new Date('2025-01-01')
      });

      const json = user.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('email');
      expect(json).toHaveProperty('createdAt');
      expect(json).not.toHaveProperty('passwordHash');
      expect(json).not.toHaveProperty('password_hash');
    });
  });

  describe('fromDatabase', () => {
    it('should create user from database row', () => {
      const dbRow = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashedpassword123',
        created_at: new Date()
      };

      const user = User.fromDatabase(dbRow);

      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('hashedpassword123');
      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });
});
