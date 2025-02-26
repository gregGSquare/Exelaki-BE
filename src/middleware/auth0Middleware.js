const { auth } = require('express-oauth2-jwt-bearer');
const { getUserByAuth0Id, findOrCreateUserFromAuth0 } = require('../services/userLinkingService');

// Create middleware for validating access tokens
const validateAuth0Token = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

// Middleware to extract user info from the token and link to your user model
const extractUserFromToken = async (req, res, next) => {
  try {
    // The validateAuth0Token middleware adds the auth object to the request
    if (req.auth) {
      const auth0Profile = {
        sub: req.auth.payload.sub,
        email: req.auth.payload.email
      };
      
      // Find or create user in your database
      const user = await findOrCreateUserFromAuth0(auth0Profile);
      
      // Add user to request
      req.user = {
        id: user._id, // Your database user ID
        auth0Id: user.auth0Id,
        email: user.email
      };
    }
    next();
  } catch (error) {
    console.error('Error extracting user from token:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Combined middleware for protected routes
const requireAuth = [validateAuth0Token, extractUserFromToken];

module.exports = { requireAuth, validateAuth0Token, extractUserFromToken }; 