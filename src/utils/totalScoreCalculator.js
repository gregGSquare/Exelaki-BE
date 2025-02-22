const { 
  calculateDebtToIncomeRatio, 
  calculateSavingsRatio, 
  calculateCarCostRatio, 
  calculateHomeCostRatio 
} = require('./financialIndicatorsUtils');

const {
  getDTIScore,
  getSavingsScore,
  getCarCostScore,
  getHomeCostScore,
  WEIGHTS
} = require('./financialScoring');

const calculateTotalScore = async (EntryModel, userId, budgetId) => {
  const [debtToIncome, savingsRatio, carCostRatio, homeCostRatio] = await Promise.all([
    calculateDebtToIncomeRatio(EntryModel, userId, budgetId),
    calculateSavingsRatio(EntryModel, userId, budgetId),
    calculateCarCostRatio(EntryModel, userId, budgetId),
    calculateHomeCostRatio(EntryModel, userId, budgetId)
  ]);

  if (!debtToIncome.ratio && !savingsRatio.ratio && !carCostRatio.ratio && !homeCostRatio.ratio) {
    return {
      score: null,
      status: 'NO_DATA',
      details: {}
    };
  }

  // Convert percentages to decimals and calculate individual scores
  const scores = {
    dti: debtToIncome.ratio !== null ? getDTIScore(debtToIncome.ratio / 100) : null,
    savings: savingsRatio.ratio !== null ? getSavingsScore(savingsRatio.ratio / 100) : null,
    car: carCostRatio.ratio !== null ? getCarCostScore(carCostRatio.ratio / 100) : null,
    home: homeCostRatio.ratio !== null ? getHomeCostScore(homeCostRatio.ratio / 100) : null
  };

  // Calculate weighted score
  let totalWeight = 0;
  let weightedSum = 0;

  if (scores.dti !== null) {
    weightedSum += (scores.dti / 100) * WEIGHTS.DTI;
    totalWeight += WEIGHTS.DTI;
  }
  if (scores.savings !== null) {
    weightedSum += (scores.savings / 100) * WEIGHTS.SAVINGS;
    totalWeight += WEIGHTS.SAVINGS;
  }
  if (scores.car !== null) {
    weightedSum += (scores.car / 100) * WEIGHTS.CAR;
    totalWeight += WEIGHTS.CAR;
  }
  if (scores.home !== null) {
    weightedSum += (scores.home / 100) * WEIGHTS.HOME;
    totalWeight += WEIGHTS.HOME;
  }

  // Normalize the score based on available indicators
  const finalScore = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : null;

  let status;
  if (finalScore === null) {
    status = 'NO_DATA';
  } else if (finalScore >= 90) {
    status = 'EXCELLENT';
  } else if (finalScore >= 70) {
    status = 'GOOD';
  } else if (finalScore >= 50) {
    status = 'ACCEPTABLE';
  } else {
    status = 'NEEDS_IMPROVEMENT';
  }

  return {
    score: finalScore !== null ? parseFloat(finalScore.toFixed(2)) : null,
    status,
    details: {
      dti: scores.dti,
      savings: scores.savings,
      car: scores.car,
      home: scores.home
    }
  };
};

module.exports = {
  calculateTotalScore
}; 