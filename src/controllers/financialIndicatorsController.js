const { calculateDebtToIncomeRatio, calculateSavingsRatio, calculateCarCostRatio, calculateHomeCostRatio, calculateExpenseDistribution } = require('../utils/financialIndicatorsUtils');
const { calculateTotalScore } = require('../utils/totalScoreCalculator');
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

    const [debtToIncome, savingsRatio, carCostRatio, homeCostRatio, totalScore, expenseDistribution] = await Promise.all([
      calculateDebtToIncomeRatio(Entry, userId, budgetId),
      calculateSavingsRatio(Entry, userId, budgetId),
      calculateCarCostRatio(Entry, userId, budgetId),
      calculateHomeCostRatio(Entry, userId, budgetId),
      calculateTotalScore(Entry, userId, budgetId),
      calculateExpenseDistribution(Entry, userId, budgetId)
    ]);

    // Format the ratio and include status
    const formattedDebtToIncome = {
      value: debtToIncome.ratio !== null ? `${debtToIncome.ratio}%` : 'N/A',
      status: debtToIncome.status
    };

    const formattedSavingsRatio = {
      value: savingsRatio.ratio !== null ? `${savingsRatio.ratio}%` : 'N/A',
      status: savingsRatio.status
    };

    const formattedCarCostRatio = {
      value: carCostRatio.ratio !== null ? `${carCostRatio.ratio}%` : 'N/A',
      status: carCostRatio.status
    };

    const formattedHomeCostRatio = {
      value: homeCostRatio.ratio !== null ? `${homeCostRatio.ratio}%` : 'N/A',
      status: homeCostRatio.status
    };
    
    const formattedTotalScore = {
      value: totalScore.score !== null ? `${totalScore.score}%` : 'N/A',
      status: totalScore.status
    };

    res.json({
      totalScore: formattedTotalScore,
      debtToIncomeRatio: formattedDebtToIncome,
      savingsRate: formattedSavingsRatio,
      carCostRatio: formattedCarCostRatio,
      homeCostRatio: formattedHomeCostRatio,
      expenseDistribution
    });
  } catch (err) {
    console.error('Error calculating financial indicators:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
