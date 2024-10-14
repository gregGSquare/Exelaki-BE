const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: Number,  // Store the month (1-12)
    required: true,
  },
  year: {
    type: Number,  // Store the year (e.g., 2024)
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
