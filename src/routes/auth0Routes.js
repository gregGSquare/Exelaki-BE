const express = require('express');
const { requireAuth } = require('../middleware/auth0Middleware');
const router = express.Router();

// Profile route - requires authentication
router.get('/profile', requireAuth, (req, res) => {
  res.json({
    user: req.oidc.user
  });
});

module.exports = router; 