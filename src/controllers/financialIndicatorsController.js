const { calculateDebtToIncomeRatio, calculateSavingsRatio, calculateCarCostRatio, calculateHomeCostRatio, calculateExpenseDistribution, calculateFixedExpenses } = require('../utils/financialIndicatorsUtils');
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

    const [debtToIncome, savingsRatio, carCostRatio, homeCostRatio, totalScore, expenseDistribution, fixedExpenses] = await Promise.all([
      calculateDebtToIncomeRatio(Entry, userId, budgetId),
      calculateSavingsRatio(Entry, userId, budgetId),
      calculateCarCostRatio(Entry, userId, budgetId),
      calculateHomeCostRatio(Entry, userId, budgetId),
      calculateTotalScore(Entry, userId, budgetId),
      calculateExpenseDistribution(Entry, userId, budgetId),
      calculateFixedExpenses(Entry, userId, budgetId)
    ]);

    // Format the ratio and include status
    const formattedDebtToIncome = {
      value: debtToIncome.ratio !== null ? `${debtToIncome.ratio}%` : 'N/A',
      status: debtToIncome.status,
      amount: debtToIncome.monthlyDebt.toFixed(2)
    };

    const formattedSavingsRatio = {
      value: savingsRatio.ratio !== null ? `${savingsRatio.ratio}%` : 'N/A',
      status: savingsRatio.status,
      amount: savingsRatio.monthlySavings.toFixed(2)
    };

    const formattedCarCostRatio = {
      value: carCostRatio.ratio !== null ? `${carCostRatio.ratio}%` : 'N/A',
      status: carCostRatio.status,
      amount: carCostRatio.monthlyCarCosts.toFixed(2)
    };

    const formattedHomeCostRatio = {
      value: homeCostRatio.ratio !== null ? `${homeCostRatio.ratio}%` : 'N/A',
      status: homeCostRatio.status,
      amount: homeCostRatio.monthlyHouseCosts.toFixed(2)
    };

    const formattedFixedExpenses = {
      value: fixedExpenses.monthlyFixedExpenses.toFixed(2),
      status: fixedExpenses.status,
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
      fixedExpenses: formattedFixedExpenses,
      expenseDistribution
    });
  } catch (err) {
    console.error('Error calculating financial indicators:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
