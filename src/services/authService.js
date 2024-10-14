const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

exports.registerUser = async (email, password) => {
  let user = await User.findOne({ email });
  if (user) {
    throw new Error('User already exists');
  }

  user = new User({ email, password });
  await user.save();
  return user;
};

exports.validateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);
  return { user, isMatch };
};

exports.refreshAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const accessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);
    return { accessToken, newRefreshToken };
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
};
