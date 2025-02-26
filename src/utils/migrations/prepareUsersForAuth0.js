const mongoose = require('mongoose');
const User = require('../../models/User');
require('dotenv').config();

async function migrateUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // First, check if we need to update the schema
    // This is a more complex operation that might require dropping and recreating the index
    // For simplicity, we'll just update the users without setting null values

    // Update users to add the isAuth0User field
    const updateResult = await User.updateMany(
      { isAuth0User: { $exists: false } },
      { $set: { isAuth0User: false } }
    );

    console.log(`Updated ${updateResult.modifiedCount} users with isAuth0User field`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

// Run the migration
migrateUsers(); 