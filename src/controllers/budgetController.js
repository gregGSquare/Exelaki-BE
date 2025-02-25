const Budget = require('../models/Budget');
const Entry = require('../models/Entry');
const { validationResult } = require('express-validator');
const BUDGET_TYPES = require('../constants/budgetTypes');

// Create a new budget
exports.createBudget = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, month, year, currency, budgetType, description } = req.body;
  
  try {
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
        return res.status(400).json({ message: 'Monthly budget for this month and year already exists.' });
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
    res.status(201).json(newBudget);
  } catch (err) {
    console.error('Error creating budget:', err.message);
    res.status(500).json({ error: 'Server error while creating budget' });
  }
};

  

// Get a budget for a specific month and year
exports.getBudget = async (req, res) => {
  const { year, month } = req.params;

  try {
    const budget = await Budget.findOne({
      user: req.user.id,
      year: parseInt(year),
      month: parseInt(month),
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found.' });
    }

    res.status(200).json(budget);
  } catch (err) {
    console.error('Error fetching budget:', err.message);
    res.status(500).json({ error: 'Server error while fetching budget' });
  }
};

// Get all budgets for the authenticated user
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.status(200).json(budgets);
  } catch (err) {
    console.error('Error fetching all budgets:', err.message);
    res.status(500).json({ error: 'Server error while fetching budgets' });
  }
};

// Get budget by ID
exports.getBudgetById = async (req, res) => {
  const { id } = req.params;

  try {
    const budget = await Budget.findById(id);

    if (!budget || budget.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Budget not found.' });
    }

    res.status(200).json(budget);
  } catch (err) {
    console.error('Error fetching budget by ID:', err.message);
    res.status(500).json({ error: 'Server error while fetching budget by ID' });
  }
};

// Delete a budget by ID
exports.deleteBudget = async (req, res) => {
  const { id } = req.params;

  try {
    const budget = await Budget.findById(id);

    if (!budget || budget.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Budget not found.' });
    }

    // Delete all related entries
    await Entry.deleteMany({ budget: id });

    // Delete the budget itself
    await Budget.findByIdAndDelete(id);

    res.status(200).json({ message: 'Budget and related entries deleted successfully.' });
  } catch (err) {
    console.error('Error deleting budget:', err.message);
    res.status(500).json({ error: 'Server error while deleting budget' });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, currency } = req.body;
  
  try {
    // Find the budget
    const budget = await Budget.findById(id);

    if (!budget || budget.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Budget not found.' });
    }

    // Update only the fields that were provided
    if (name !== undefined) budget.name = name;
    if (currency !== undefined) budget.currency = currency;

    // Save the updated budget
    await budget.save();
    
    res.status(200).json(budget);
  } catch (err) {
    console.error('Error updating budget:', err.message);
    res.status(500).json({ error: 'Server error while updating budget' });
  }
};
