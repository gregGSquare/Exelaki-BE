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
  
  module.exports = {
    calculateTotalAmount,
    calculateFinancialScoreScore
  };