const { body } = require('express-validator');
const currencyCodes = require('currency-codes');
const BUDGET_TYPES = require('../constants/budgetTypes');

// Validator for creating a budget
exports.createBudgetValidator = [
  body('name')
    .notEmpty()
    .withMessage('Budget name is required')
    .isString()
    .withMessage('Budget name must be a string'),
  
  body('month')
    .notEmpty()
    .withMessage('Month is required')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be a number between 1 and 12'),
  
  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be a valid year between 2000 and 2100'),
  
  body('currency')
    .optional()
    .isString()
    .withMessage('Currency must be a string')
    .custom(value => {
      if (!currencyCodes.code(value)) {
        throw new Error('Invalid currency code');
      }
      return true;
    }),
  
  body('budgetType')
    .optional()
    .isString()
    .withMessage('Budget type must be a string')
    .isIn(Object.values(BUDGET_TYPES))
    .withMessage(`Budget type must be one of: ${Object.values(BUDGET_TYPES).join(', ')}`),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
];

// Validator for updating a budget
exports.updateBudgetValidator = [
  body('name')
    .optional()
    .isString()
    .withMessage('Budget name must be a string'),
  
  body('currency')
    .optional()
    .isString()
    .withMessage('Currency must be a string')
    .custom(value => {
      if (!currencyCodes.code(value)) {
        throw new Error('Invalid currency code');
      }
      return true;
    })
]; 