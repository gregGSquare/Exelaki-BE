const getDTIScore = (dtiRatio) => {
  if (dtiRatio <= 0.20) {
    return 100;
  } else if (dtiRatio >= 0.40) {
    return 0;
  } else {
    const portion = (dtiRatio - 0.20) / (0.40 - 0.20);
    return 100 - portion * 100;
  }
};

const getSavingsScore = (savingsRate) => {
  if (savingsRate <= 0) {
    return 0;
  } else if (savingsRate >= 0.20) {
    return 100;
  } else {
    return (savingsRate / 0.20) * 100;
  }
};

const getCarCostScore = (carCostRatio) => {
  if (carCostRatio <= 0.10) {
    return 100;
  } else if (carCostRatio >= 0.20) {
    return 0;
  } else {
    const portion = (carCostRatio - 0.10) / (0.20 - 0.10);
    return 100 - portion * 100;
  }
};

const getHomeCostScore = (homeCostRatio) => {
  if (homeCostRatio <= 0.20) {
    return 100;
  } else if (homeCostRatio <= 0.30) {
    const portion = (homeCostRatio - 0.20) / (0.30 - 0.20);
    return 100 - portion * 50;
  } else if (homeCostRatio < 0.40) {
    const portion = (homeCostRatio - 0.30) / (0.40 - 0.30);
    return 50 - portion * 50;
  } else {
    return 0;
  }
};

const WEIGHTS = {
  DTI: 0.30,
  SAVINGS: 0.30,
  CAR: 0.15,
  HOME: 0.25
};

module.exports = {
  getDTIScore,
  getSavingsScore,
  getCarCostScore,
  getHomeCostScore,
  WEIGHTS
}; 