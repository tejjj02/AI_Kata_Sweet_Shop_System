const UserRepository = require('../../src/repositories/UserRepository');
const User = require('../../src/models/User');

// Mock the database connection
jest.mock('../../src/database/connection', () => ({
  query: jest.fn()
}));

const db = require('../../src/database/connection');

describe('UserRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const email = 'test@example.com';
      const passwordHash = 'hashedpassword123';
      
      const mockRow = {
        id: 1,
        email: email,
        password_hash: passwordHash,
        created_at: new Date()
      };

      db.query.mockResolvedValue({ rows: [mockRow] });

      const user = await repository.create(email, passwordHash);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [email, passwordHash]
      );
      expect(user).toBeInstanceOf(User);
      expect(user.email).toBe(email);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      const mockRow = {
        id: 1,
        email: email,
        password_hash: 'hashedpassword123',
        created_at: new Date()
      };

      db.query.mockResolvedValue({ rows: [mockRow] });

      const user = await repository.findByEmail(email);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE email = $1'),
        [email]
      );
      expect(user).toBeInstanceOf(User);
      expect(user.email).toBe(email);
    });

    it('should return null if user not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const user = await repository.findByEmail('nonexistent@example.com');

      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const mockRow = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashedpassword123',
        created_at: new Date()
      };

      db.query.mockResolvedValue({ rows: [mockRow] });

      const user = await repository.findById(1);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE id = $1'),
        [1]
      );
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(1);
    });

    it('should return null if user not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const user = await repository.findById(999);

      expect(user).toBeNull();
    });
  });
});
