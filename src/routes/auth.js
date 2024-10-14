const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Route to register a new user
router.post('/register', register);

// Route to log in a user
router.post('/login', login);

// Route to refresh an access token
router.post('/refresh-token', refreshToken);

// Route to verify the validity of a token
router.get('/verify-token', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});

module.exports = router;
