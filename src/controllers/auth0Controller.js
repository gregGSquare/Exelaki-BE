const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        auth0Id: user.auth0Id
      }
    });
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Auth0 configuration endpoint
exports.getAuth0Config = (req, res) => {
  res.json({
    domain: process.env.AUTH0_ISSUER_BASE_URL.replace('https://', ''),
    clientId: process.env.AUTH0_CLIENT_ID,
    audience: process.env.AUTH0_AUDIENCE,
    redirectUri: process.env.AUTH0_CALLBACK_URL || `${process.env.BASE_URL}/callback`
  });
}; 