const express = require('express');
const { getProfile, getAuth0Config } = require('../controllers/auth0Controller');
const { requireAuth } = require('../middleware/auth0Middleware');

const router = express.Router();

// Auth0 routes
router.get('/profile', requireAuth, getProfile);
router.get('/auth0-config', getAuth0Config);

// Test endpoint
router.get('/test', requireAuth, (req, res) => {
  res.json({ message: 'Authentication successful', user: req.user });
});

module.exports = router;
