const mongoose = require('mongoose');
const Budget = require('../../models/Budget');
const BUDGET_TYPES = require('../../constants/budgetTypes');
require('dotenv').config();

async function migrateBudgets() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all budgets that don't have budgetType field
    const budgetsToUpdate = await Budget.find({ budgetType: { $exists: false } });
    
    console.log(`Found ${budgetsToUpdate.length} budgets without budgetType field`);
    
    if (budgetsToUpdate.length === 0) {
      console.log('No budgets need updating');
      process.exit(0);
    }

    // Update all budgets to add the default budgetType value (MONTHLY)
    const updateResult = await Budget.updateMany(
      { budgetType: { $exists: false } },
      { $set: { budgetType: BUDGET_TYPES.MONTHLY } }
    );

    console.log(`Updated ${updateResult.modifiedCount} budgets with default budgetType value (MONTHLY)`);
    
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