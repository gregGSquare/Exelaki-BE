const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User id',
    required: true,
  },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget id',
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category id',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDayOfMonth: {
    type: Number,
    required: false,
  },
  flexibility: {
    type: String,
    enum: ['FIXED', 'FLEXIBLE', 'OPTIONAL'],
    required: true,
  },
  recurrence: {
    type: String,
    enum: ['MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME'],
    required: true
  },
  tags: {
    type: [String],
    enum: ['HOUSING', 'UTILITIES', 'TRANSPORTATION', 'FOOD', 'DEBT', 'INSURANCE', 'SUBSCRIPTION', 'ENTERTAINMENT', 'MEDICAL', 'MISC'],
    required: false,
  },
}, { timestamps: true });

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
