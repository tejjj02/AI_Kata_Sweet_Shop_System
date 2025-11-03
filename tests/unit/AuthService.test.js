const AuthService = require('../../src/services/AuthService');
const UserRepository = require('../../src/repositories/UserRepository');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

jest.mock('../../src/repositories/UserRepository');

describe('AuthService', () => {
  let authService;
  let mockRepository;

  beforeEach(() => {
    mockRepository = new UserRepository();
    authService = new AuthService(mockRepository);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'SecurePass123';
      
      mockRepository.findByEmail.mockResolvedValue(null);
      
      const mockUser = new User({
        id: 1,
        email: email,
        passwordHash: await User.hashPassword(password)
      });
      
      mockRepository.create.mockResolvedValue(mockUser);

      const result = await authService.register(email, password);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result.user).toBeInstanceOf(User);
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    it('should throw error if user already exists', async () => {
      const email = 'existing@example.com';
      const password = 'SecurePass123';
      
      const existingUser = new User({
        id: 1,
        email: email,
        passwordHash: await User.hashPassword(password)
      });
      
      mockRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(authService.register(email, password))
        .rejects.toThrow('User already exists');
        
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error if password is too short', async () => {
      const email = 'test@example.com';
      const password = '123';

      await expect(authService.register(email, password))
        .rejects.toThrow('Password must be at least 6 characters');
    });
  });

  describe('login', () => {
    it('should login user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'SecurePass123';
      const passwordHash = await User.hashPassword(password);
      
      const mockUser = new User({
        id: 1,
        email: email,
        passwordHash: passwordHash
      });
      
      mockRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.login(email, password);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(result.user).toBeInstanceOf(User);
      expect(result.token).toBeDefined();
    });

    it('should throw error if user not found', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login('nonexistent@example.com', 'password'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw error if password is incorrect', async () => {
      const email = 'test@example.com';
      const correctPassword = 'SecurePass123';
      const passwordHash = await User.hashPassword(correctPassword);
      
      const mockUser = new User({
        id: 1,
        email: email,
        passwordHash: passwordHash
      });
      
      mockRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.login(email, 'wrongPassword'))
        .rejects.toThrow('Invalid email or password');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const payload = { userId: 1, email: 'test@example.com' };
      const token = authService.generateToken(payload);

      const decoded = authService.verifyToken(token);

      expect(decoded.userId).toBe(1);
      expect(decoded.email).toBe('test@example.com');
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        authService.verifyToken('invalid-token');
      }).toThrow();
    });
  });
});
