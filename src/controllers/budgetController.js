const Budget = require('../models/Budget');
const Entry = require('../models/Entry');
const { validationResult } = require('express-validator');

// Create a new budget
exports.createBudget = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, month, year, currency } = req.body;
  
  try {
    // Check if a budget already exists for the given month, year, and user
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      month,
      year,
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget for this month and year already exists.' });
    }

    // Create a new budget
    const newBudget = new Budget({
      user: req.user.id,
      name,
      month,
      year,
      currency: currency || 'USD', // Use provided currency or default to USD
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
