// defaultCategories.js
module.exports.DEFAULT_CATEGORIES = [
    { name: 'Rent', type: 'EXPENSE' },
    { name: 'Groceries', type: 'EXPENSE' },
    { name: 'Insurances', type: 'EXPENSE' },
    { name: 'Subscriptions', type: 'EXPENSE' },
    { name: 'Car', type: 'EXPENSE' },
    { name: 'Mobile', type: 'EXPENSE' },
    { name: 'Savings', type: 'SAVING' },
    { name: 'Loans/Credit card debt', type: 'EXPENSE' },
    { name: 'Income', type: 'INCOME' },
  ];
  
const EXPENSE_FLEXIBILITY = {
  FIXED: 'FIXED',
  FLEXIBLE: 'FLEXIBLE', 
  OPTIONAL: 'OPTIONAL'
};

const EXPENSE_TAGS = {
  HOUSING: 'HOUSING',             
  UTILITIES: 'UTILITIES',         
  TRANSPORTATION: 'TRANSPORTATION',
  FOOD: 'FOOD',                   
  DEBT: 'DEBT',                   
  INSURANCE: 'INSURANCE',         
  SUBSCRIPTION: 'SUBSCRIPTION',   
  ENTERTAINMENT: 'ENTERTAINMENT', 
  MEDICAL: 'MEDICAL',             
  MISC: 'MISC',                     
};

const EXPENSE_FREQUENCY = {
  MONTHLY: 'MONTHLY',             
  QUARTERLY: 'QUARTERLY',         
  YEARLY: 'YEARLY',           
  ONE_TIME: 'ONE_TIME',
};

module.exports.EXPENSE_FLEXIBILITY = EXPENSE_FLEXIBILITY;
module.exports.EXPENSE_TAGS = EXPENSE_TAGS;
module.exports.EXPENSE_FREQUENCY = EXPENSE_FREQUENCY;