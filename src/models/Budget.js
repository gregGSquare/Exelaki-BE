const mongoose = require('mongoose');
const currencyCodes = require('currency-codes');

// Get all currency codes (e.g., 'USD', 'EUR', etc.)
const validCurrencyCodes = currencyCodes.codes();

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
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: validCurrencyCodes,
    validate: {
      validator: function(code) {
        return currencyCodes.code(code) !== undefined;
      },
      message: props => `${props.value} is not a valid currency code!`
    }
  }
}, { timestamps: true });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
