const express = require('express');
const { createBudget, getAllBudgets, getBudget, deleteBudget, updateBudget } = require('../controllers/budgetController');
const { requireAuth } = require('../middleware/auth0Middleware');
const { createBudgetValidator, updateBudgetValidator } = require('../validators/budgetValidator');

const router = express.Router();

router.post('/', requireAuth, createBudgetValidator, createBudget);
router.get('/:budgetId', requireAuth, getBudget);
router.get('/', requireAuth, (req, res, next) => {
  req.user = req.user || {};
  req.query.userId = req.user.id;
  next();
}, getAllBudgets);  // Modified route to get all budgets for the logged-in user
router.delete('/:budgetId', requireAuth, deleteBudget);  // New route to delete a budget by ID
router.put('/:budgetId', requireAuth, updateBudgetValidator, updateBudget);

module.exports = router;