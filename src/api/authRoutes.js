const express = require('express');
const UserRepository = require('../repositories/UserRepository');
const AuthService = require('../services/AuthService');

const router = express.Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const result = await authService.register(email, password);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user.toJSON(),
        token: result.token
      }
    });
  } catch (error) {
    if (error.message === 'User already exists' || 
        error.message.includes('Password must be')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error registering user: ' + error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user.toJSON(),
        token: result.token
      }
    });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error logging in: ' + error.message
    });
  }
});

module.exports = router;
