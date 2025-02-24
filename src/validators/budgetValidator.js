const { body } = require('express-validator');
const currencyCodes = require('currency-codes');

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
    })
]; 