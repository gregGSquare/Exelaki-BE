const mongoose = require('mongoose');
const Budget = require('../../models/Budget');
require('dotenv').config();

async function migrateBudgets() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all budgets that don't have a currency field
    const budgetsToUpdate = await Budget.find({ currency: { $exists: false } });
    
    console.log(`Found ${budgetsToUpdate.length} budgets without currency field`);
    
    if (budgetsToUpdate.length === 0) {
      console.log('No budgets need updating');
      process.exit(0);
    }

    // Update all budgets to add the default currency (USD)
    const updateResult = await Budget.updateMany(
      { currency: { $exists: false } },
      { $set: { currency: 'USD' } }
    );

    console.log(`Updated ${updateResult.modifiedCount} budgets with default currency (USD)`);
    
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
migrateBudgets(); 