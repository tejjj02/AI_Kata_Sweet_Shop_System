const AuthService = require('../services/AuthService');
const UserRepository = require('../repositories/UserRepository');

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

function authMiddleware(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Check if it's a Bearer token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    const token = parts[1];

    // Verify token
    const decoded = authService.verifyToken(token);
    
    // Add user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

module.exports = authMiddleware;
