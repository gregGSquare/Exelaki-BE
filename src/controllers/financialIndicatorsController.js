const { calculateDebtToIncomeRatio } = require('../utils/financialIndicatorsUtils');
const Entry = require('../models/Entry');
const Budget = require('../models/Budget');

exports.getFinancialIndicators = async (req, res) => {
  try {
    const userId = req.user.id;
    const { budgetId } = req.params;

    // Verify budget exists and belongs to user
    const budget = await Budget.findOne({ _id: budgetId, user: userId });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Calculate debt-to-income ratio for this budget
    const debtToIncome = await calculateDebtToIncomeRatio(Entry, userId, budgetId);

    // Format the ratio and include status
    const formattedDebtToIncome = {
      value: debtToIncome.ratio !== null ? `${debtToIncome.ratio}%` : 'N/A',
      status: debtToIncome.status
    };

    // For debugging
    console.log('Monthly Income:', debtToIncome.monthlyIncome);
    console.log('Monthly Debt:', debtToIncome.monthlyDebt);
    console.log('Ratio:', debtToIncome.ratio);
    console.log('Status:', debtToIncome.status);

    res.json({
      totalScore: '75%', // Mock value
      debtToIncomeRatio: formattedDebtToIncome,
      savingsRate: '20.5%', // Mock value
      carCostRatio: '15.2%', // Mock value
      homeCostRatio: '25.8%', // Mock value
    });
  } catch (err) {
    console.error('Error calculating financial indicators:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
