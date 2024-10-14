const { calculateTotalAmount, calculateFinancialScoreScore } = require('../utils/financialScoreUtils');
const mongoose = require('mongoose');
const Entry = require('../models/Entry');  // Use the unified Entry model

exports.getFinancialScore = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Calculate income (filtering entries with type 'IN')
    const income = await calculateTotalAmount(Entry, userId, 'IN');

    // Calculate expenses (filtering entries with type 'OUT')
    const expenses = await calculateTotalAmount(Entry, userId, 'OUT');

    // Calculate financial score and status
    const { score, scoreStatus } = calculateFinancialScoreScore(income, expenses);

    res.json({
      totalIncome: income,
      totalExpenses: expenses,
      financialScoreScore: score,
      scoreStatus,
    });
  } catch (err) {
    console.error('Error calculating financial score:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
