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
        userId: new mongoose.Types.ObjectId(userId),
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
        userId: new mongoose.Types.ObjectId(userId),
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

const calculateMonthlySavings = async (EntryModel, userId, budgetId) => {
  const result = await EntryModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        budgetId: mongoose.Types.ObjectId.createFromHexString(budgetId),
        type: 'SAVING',
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
        totalMonthlySavings: { $sum: '$monthlyAmount' }
      }
    }
  ]);

  return result[0]?.totalMonthlySavings || 0;
};

const calculateSavingsRatio = async (EntryModel, userId, budgetId) => {
  const [monthlySavings, monthlyIncome] = await Promise.all([
    calculateMonthlySavings(EntryModel, userId, budgetId),
    calculateMonthlyIncome(EntryModel, userId, budgetId)
  ]);

  if (monthlyIncome === 0) {
    return {
      ratio: null,
      status: 'NO_INCOME',
      monthlySavings,
      monthlyIncome
    };
  }

  const ratio = (monthlySavings / monthlyIncome) * 100;

  let status;
  if (ratio >= 20) {
    status = 'EXCELLENT';
  } else if (ratio >= 15) {
    status = 'GOOD';
  } else if (ratio >= 10) {
    status = 'ACCEPTABLE';
  } else {
    status = 'NEEDS_IMPROVEMENT';
  }

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    status,
    monthlySavings,
    monthlyIncome
  };
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

const calculateMonthlyCarCosts = async (EntryModel, userId, budgetId) => {
  const result = await EntryModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        budgetId: mongoose.Types.ObjectId.createFromHexString(budgetId),
        tags: 'CAR',
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
        totalMonthlyCarCosts: { $sum: '$monthlyAmount' }
      }
    }
  ]);

  return result[0]?.totalMonthlyCarCosts || 0;
};

const calculateCarCostRatio = async (EntryModel, userId, budgetId) => {
  const [monthlyCarCosts, monthlyIncome] = await Promise.all([
    calculateMonthlyCarCosts(EntryModel, userId, budgetId),
    calculateMonthlyIncome(EntryModel, userId, budgetId)
  ]);

  if (monthlyIncome === 0) {
    return {
      ratio: null,
      status: 'NO_INCOME',
      monthlyCarCosts,
      monthlyIncome
    };
  }

  const ratio = (monthlyCarCosts / monthlyIncome) * 100;

  let status;
  if (ratio > 28) {
    status = 'BAD';
  } else if (ratio > 8) {
    status = 'OK';
  } else {
    status = 'GOOD';
  }

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    status,
    monthlyCarCosts,
    monthlyIncome
  };
};

const calculateMonthlyHouseCosts = async (EntryModel, userId, budgetId) => {
  const result = await EntryModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        budgetId: mongoose.Types.ObjectId.createFromHexString(budgetId),
        tags: 'HOUSING',
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
        totalMonthlyHouseCosts: { $sum: '$monthlyAmount' }
      }
    }
  ]);

  return result[0]?.totalMonthlyHouseCosts || 0;
};

const calculateHomeCostRatio = async (EntryModel, userId, budgetId) => {
  const [monthlyHouseCosts, monthlyIncome] = await Promise.all([
    calculateMonthlyHouseCosts(EntryModel, userId, budgetId),
    calculateMonthlyIncome(EntryModel, userId, budgetId)
  ]);

  if (monthlyIncome === 0) {
    return {
      ratio: null,
      status: 'NO_INCOME',
      monthlyHouseCosts,
      monthlyIncome
    };
  }

  const ratio = (monthlyHouseCosts / monthlyIncome) * 100;

  let status;
  if (ratio > 28) {
    status = 'BAD';
  } else if (ratio > 22) {
    status = 'OK';
  } else {
    status = 'GOOD';
  }

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    status,
    monthlyHouseCosts,
    monthlyIncome
  };
};

const calculateExpenseDistribution = async (EntryModel, userId, budgetId) => {
  const result = await EntryModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        budgetId: mongoose.Types.ObjectId.createFromHexString(budgetId),
        type: 'EXPENSE',
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
      $unwind: '$tags'  // Split array of tags into separate documents
    },
    {
      $group: {
        _id: '$tags',
        totalAmount: { $sum: '$monthlyAmount' }
      }
    },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: '$totalAmount' },
        categories: { 
          $push: { 
            tag: '$_id', 
            amount: '$totalAmount' 
          } 
        }
      }
    },
    {
      $unwind: '$categories'
    },
    {
      $project: {
        _id: 0,
        tag: '$categories.tag',
        percentage: {
          $multiply: [
            { $divide: ['$categories.amount', '$totalExpenses'] },
            100
          ]
        },
        amount: '$categories.amount'
      }
    },
    {
      $sort: { percentage: -1 }
    }
  ]);

  return result.map(item => ({
    ...item,
    percentage: parseFloat(item.percentage.toFixed(2))
  }));
};

const calculateFixedExpenses = async (EntryModel, userId, budgetId) => {
  const result = await EntryModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        budgetId: mongoose.Types.ObjectId.createFromHexString(budgetId),
        type: 'EXPENSE',
        flexibility: 'FIXED',
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
        totalFixedExpenses: { $sum: '$monthlyAmount' }
      }
    }
  ]);

  const monthlyFixedExpenses = result[0]?.totalFixedExpenses || 0;

  // Determine status based on absolute amount
  let status;
  if (monthlyFixedExpenses >= 5000) {
    status = 'CRITICAL';
  } else if (monthlyFixedExpenses >= 3000) {
    status = 'HIGH';
  } else if (monthlyFixedExpenses >= 1500) {
    status = 'MODERATE';
  } else {
    status = 'GOOD';
  }

  return {
    monthlyFixedExpenses,
    status
  };
};

const calculateFixedExpensesRatio = async (EntryModel, userId, budgetId) => {
  const [monthlyFixedExpenses, monthlyIncome] = await Promise.all([
    calculateFixedExpenses(EntryModel, userId, budgetId),
    calculateMonthlyIncome(EntryModel, userId, budgetId)
  ]);

  if (monthlyIncome === 0) {
    return {
      ratio: null,
      status: 'NO_INCOME',
      monthlyFixedExpenses,
      monthlyIncome
    };
  }

  const ratio = (monthlyFixedExpenses / monthlyIncome) * 100;

  let status;
  if (ratio >= 80) {
    status = 'CRITICAL';
  } else if (ratio >= 60) {
    status = 'HIGH';
  } else if (ratio >= 40) {
    status = 'MODERATE';
  } else {
    status = 'GOOD';
  }

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    status,
    monthlyFixedExpenses,
    monthlyIncome
  };
};

module.exports = {
  calculateTotalAmount,
  calculateFinancialScoreScore,
  calculateDebtToIncomeRatio,
  calculateSavingsRatio,
  calculateCarCostRatio,
  calculateHomeCostRatio,
  calculateExpenseDistribution,
  calculateFixedExpenses
};