const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.jwtExpiration = '24h';
  }

  async register(email, password) {
    // Validate password length
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await User.hashPassword(password);

    // Create user
    const user = await this.userRepository.create(email, passwordHash);

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email
    });

    return {
      user: user,
      token: token
    };
  }

  async login(email, password) {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email
    });

    return {
      user: user,
      token: token
    };
  }

  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = AuthService;
