const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const { registerValidation, loginValidation } = require('../validators/authValidator');

// Register a new user
exports.register = [
  registerValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await authService.registerUser(email, password);

      // Generate access and refresh tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Set the refresh token in an httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(201).json({ accessToken });
    } catch (err) {
      console.error('Error during user registration:', err.message);
      res.status(500).send('Server error');
    }
  }
];

// Login an existing user
exports.login = [
  loginValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const { user, isMatch } = await authService.validateUser(email, password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate access and refresh tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Set the refresh token in an httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    } catch (err) {
      console.error('Error during user login:', err.message);
      res.status(500).send('Server error');
    }
  }
];

// Refresh the access token using a valid refresh token
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token is required' });
  }

  try {
    const { accessToken, newRefreshToken } = await authService.refreshAccessToken(refreshToken);

    // Set the new refresh token in an httpOnly cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (err) {
    console.error('Error refreshing token:', err.message);
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// Verify if the access token is still valid
exports.verifyToken = (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
};