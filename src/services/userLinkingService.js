const User = require('../models/User');

// Find or create a user based on Auth0 profile
exports.findOrCreateUserFromAuth0 = async (auth0Profile) => {
  try {
    // Extract relevant information from Auth0 profile
    const { sub: auth0Id, email } = auth0Profile;
    
    // Check if user with this Auth0 ID already exists
    let user = await User.findOne({ auth0Id });
    
    if (user) {
      return user; // User already exists
    }
    
    // If we have an email, check if user with this email exists
    if (email) {
      user = await User.findOne({ email, auth0Id: { $exists: false } });
      
      if (user) {
        // Link existing user to Auth0
        user.auth0Id = auth0Id;
        user.isAuth0User = true;
        await user.save();
        return user;
      }
      
      // Create new user with email
      const newUser = new User({
        email,
        auth0Id,
        isAuth0User: true
      });
      
      await newUser.save();
      return newUser;
    } else {
      // For M2M tokens or tokens without email, create a special service account
      // Use the auth0Id as a unique identifier
      const serviceEmail = `service-${auth0Id.replace(/[^a-zA-Z0-9]/g, '-')}@example.com`;
      
      const newServiceUser = new User({
        email: serviceEmail,
        auth0Id,
        isAuth0User: true
      });
      
      await newServiceUser.save();
      return newServiceUser;
    }
  } catch (error) {
    console.error('Error finding or creating user from Auth0:', error);
    throw error;
  }
};

// Get user by Auth0 ID
exports.getUserByAuth0Id = async (auth0Id) => {
  try {
    const user = await User.findOne({ auth0Id });
    return user;
  } catch (error) {
    console.error('Error getting user by Auth0 ID:', error);
    throw error;
  }
}; 