const mongoose = require('mongoose');

const calculateTotalAmount = async (EntryModel, userId, type) => {
  const result = await EntryModel.aggregate([
    { $match: { userId: userId, 'categoryId.type': type } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  return result[0] ? result[0].total : 0;
};
  
const calculateFinancialScoreScore = (income, expenses) => {
  const score = expenses > 0 ? (income / expenses).toFixed(2) : (income > 0 ? 'Infinity' : 'N/A');
  let scoreStatus;

  if (score === 'Infinity') {
    scoreStatus = 'Excellent';
  } else if (score >= 2) {
    scoreStatus = 'Good';
  } else if (score >= 1) {
    scoreStatus = 'Moderate';
  } else {
    scoreStatus = 'Poor';
  }

  return { score, scoreStatus };
};

const calculateMonthlyDebt = async (EntryModel, userId, budgetId) => {
  const result = await EntryModel.aggregate([
    {
      $match: {
        userId: userId,
        budgetId: mongoose.Types.ObjectId.createFromHexString(budgetId),
        tags: 'DEBT',
        recurrence: { $in: ['MONTHLY', 'QUARTERLY', 'YEARLY'] }
      }
    },
    {
      $addFields: {
        monthlyAmount: {
          $switch: {
            branches: [
              { case: { $eq: ['$recurrence', 'MONTHLY'] }, then: '$amount' },
              { case: { $eq: ['$recurrence', 'QUARTERLY'] }, then: { $divide: ['$amount', 3] } },
              { case: { $eq: ['$recurrence', 'YEARLY'] }, then: { $divide: ['$amount', 12] } }
            ],
            default: '$amount'
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        totalMonthlyDebt: { $sum: '$monthlyAmount' }
      }
    }
  ]);

  return result[0]?.totalMonthlyDebt || 0;
};

const calculateMonthlyIncome = async (EntryModel, userId, budgetId) => {
  const result = await EntryModel.aggregate([
    {
      $match: {
        userId: userId,
        budgetId: mongoose.Types.ObjectId.createFromHexString(budgetId),
        type: 'INCOME',
        recurrence: { $in: ['MONTHLY', 'QUARTERLY', 'YEARLY'] }
      }
    },
    {
      $addFields: {
        monthlyAmount: {
          $switch: {
            branches: [
              { case: { $eq: ['$recurrence', 'MONTHLY'] }, then: '$amount' },
              { case: { $eq: ['$recurrence', 'QUARTERLY'] }, then: { $divide: ['$amount', 3] } },
              { case: { $eq: ['$recurrence', 'YEARLY'] }, then: { $divide: ['$amount', 12] } }
            ],
            default: '$amount'
          }
        }
      }
    },
    {
      $group: {
        _id: null,
        totalMonthlyIncome: { $sum: '$monthlyAmount' }
      }
    }
  ]);

  return result[0]?.totalMonthlyIncome || 0;
};

const calculateDebtToIncomeRatio = async (EntryModel, userId, budgetId) => {
  const [monthlyDebt, monthlyIncome] = await Promise.all([
    calculateMonthlyDebt(EntryModel, userId, budgetId),
    calculateMonthlyIncome(EntryModel, userId, budgetId)
  ]);

  if (monthlyIncome === 0) {
    return {
      ratio: null,
      status: 'NO_INCOME',
      monthlyDebt,
      monthlyIncome
    };
  }

  const ratio = (monthlyDebt / monthlyIncome) * 100;

  let status;
  if (ratio < 28) {
    status = 'GOOD';
  } else if (ratio <= 30) {
    status = 'ACCEPTABLE';
  } else {
    status = 'BAD';
  }

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    status,
    monthlyDebt,
    monthlyIncome
  };
};

module.exports = {
  calculateTotalAmount,
  calculateFinancialScoreScore,
  calculateDebtToIncomeRatio
};