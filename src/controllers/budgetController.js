const Budget = require('../models/Budget');
const Entry = require('../models/Entry');
const { validationResult } = require('express-validator');
const BUDGET_TYPES = require('../constants/budgetTypes');
const { ApiError, asyncHandler, ErrorTypes, sendErrorResponse } = require('../utils/errorUtils');
const { successResponses } = require('../utils/responseUtils');

// Create a new budget
exports.createBudget = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(
      res, 
      ErrorTypes.VALIDATION_ERROR.code, 
      'Validation failed', 
      errors.array()
    );
  }

  const { name, month, year, currency, budgetType, description } = req.body;
  
  // Only check for existing monthly budgets if this is a monthly budget
  if (budgetType === BUDGET_TYPES.MONTHLY || !budgetType) {
    // Check if a monthly budget already exists for the given month, year, and user
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      month,
      year,
      budgetType: BUDGET_TYPES.MONTHLY
    });

    if (existingBudget) {
      return sendErrorResponse(
        res,
        ErrorTypes.BAD_REQUEST.code,
        'Monthly budget for this month and year already exists.'
      );
    }
  }

  // Create a new budget
  const newBudget = new Budget({
    user: req.user.id,
    name,
    month,
    year,
    currency: currency || 'USD',
    budgetType: budgetType || BUDGET_TYPES.MONTHLY,
    description
  });

  await newBudget.save();
  
  // Return success response
  return successResponses.CREATED(res, 'Budget created successfully', newBudget);
});

// Get a budget by id
exports.getBudget = asyncHandler(async (req, res) => {
  const { budgetId } = req.params;

  const budget = await Budget.findOne({
    _id: budgetId,
    user: req.user.id
  });

  if (!budget) {
    throw new ApiError(
      ErrorTypes.NOT_FOUND.code,
      'Budget not found'
    );
  }

  return successResponses.OK(res, 'Budget retrieved successfully', budget);
});

// Get all budgets for the authenticated user
exports.getAllBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user.id });
  return successResponses.OK(res, 'Budgets retrieved successfully', budgets);
});

// Delete a budget by ID
exports.deleteBudget = asyncHandler(async (req, res) => {
  const { budgetId } = req.params;
  
  const budget = await Budget.findById(budgetId);
  
  if (!budget) {
    throw new ApiError(
      ErrorTypes.NOT_FOUND.code,
      'Budget not found'
    );
  }
  
  // Convert both IDs to strings before comparing
  const budgetUserId = budget.user.toString();
  const requestUserId = req.user.id.toString();
  
  if (budgetUserId !== requestUserId) {
    throw new ApiError(
      ErrorTypes.FORBIDDEN.code,
      'Not authorized to delete this budget'
    );
  }

  // Delete all related entries
  const deleteEntriesResult = await Entry.deleteMany({ budgetId });

  // Delete the budget itself
  await Budget.findByIdAndDelete(budgetId);

  return successResponses.OK(res, 'Budget and related entries deleted successfully', {
    entriesDeleted: deleteEntriesResult.deletedCount
  });
});

// Update a budget
exports.updateBudget = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(
      res, 
      ErrorTypes.VALIDATION_ERROR.code, 
      'Validation failed', 
      errors.array()
    );
  }

  const { budgetId } = req.params;
  const { name, currency, month, year, budgetType, description } = req.body;
  
  // Find the budget
  const budget = await Budget.findById(budgetId);

  if (!budget) {
    throw new ApiError(
      ErrorTypes.NOT_FOUND.code,
      'Budget not found'
    );
  }
  
  // Convert both IDs to strings before comparing
  const budgetUserId = budget.user.toString();
  const requestUserId = req.user.id.toString();
  
  if (budgetUserId !== requestUserId) {
    throw new ApiError(
      ErrorTypes.FORBIDDEN.code,
      'Not authorized to update this budget'
    );
  }

  // Update only the fields that were provided
  if (name !== undefined) budget.name = name;
  if (currency !== undefined) budget.currency = currency;
  if (month !== undefined) budget.month = month;
  if (year !== undefined) budget.year = year;
  if (budgetType !== undefined) budget.budgetType = budgetType;
  if (description !== undefined) budget.description = description;

  // Save the updated budget
  await budget.save();
  
  return successResponses.OK(res, 'Budget updated successfully', budget);
});
