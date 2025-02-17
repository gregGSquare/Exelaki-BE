const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  category: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['INCOME', 'EXPENSE', 'SAVING'],
      required: true,
    },
  },
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
