const mongoose = require('mongoose');
const defaultCategories = require('../constants/defaultCategories');

const CATEGORY_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  SAVING: 'SAVING',
};

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  type: {
    type: String,
    enum: [CATEGORY_TYPES.INCOME, CATEGORY_TYPES.EXPENSE, CATEGORY_TYPES.SAVING],
    required: true,
  },
});

categorySchema.statics.ensureDefaults = async function () {
  try {
    for (const category of defaultCategories) {
      await this.findOneAndUpdate(
        { name: category.name, user: null, type: category.type },
        category,
        { upsert: true }
      );
    }
  } catch (error) {
    console.error('Error ensuring default categories:', error);
    throw error;
  }
};

module.exports = mongoose.model('Category', categorySchema);
