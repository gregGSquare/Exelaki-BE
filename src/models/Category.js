const mongoose = require('mongoose');
const { DEFAULT_CATEGORIES } = require('../constants/defaultCategories');

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
  defaultCategory: {
    type: Boolean,
    default: false,
  }
});

categorySchema.statics.ensureDefaults = async function () {
  try {
    for (const category of DEFAULT_CATEGORIES) {
      await this.findOneAndUpdate(
        { name: category.name, user: null, type: category.type },
        { ...category, defaultCategory: true },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error('Error ensuring default categories:', error);
    throw error;
  }
};

module.exports = mongoose.model('Category', categorySchema);
