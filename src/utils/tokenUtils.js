const jwt = require('jsonwebtoken');

// Generate an access token with a 15-minute expiration
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

// Generate a refresh token with a 7-day expiration
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Verify a refresh token and return a new access token if valid
const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const accessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);
    return { accessToken, newRefreshToken };
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
