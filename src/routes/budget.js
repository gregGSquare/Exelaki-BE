const express = require('express');
const { createBudget, getBudget, getAllBudgets, getBudgetById, deleteBudget } = require('../controllers/budgetController');
const verifyToken = require('../middleware/authMiddleware');
const { createBudgetValidator } = require('../validators/budgetValidator');

const router = express.Router();

router.post('/', verifyToken, createBudgetValidator, createBudget);
router.get('/:id', verifyToken, getBudgetById);
router.get('/:year/:month', verifyToken, getBudget);
router.get('/', verifyToken, (req, res, next) => {
  req.user = req.user || {};
  req.query.userId = req.user.id;
  next();
}, getAllBudgets);  // Modified route to get all budgets for the logged-in user
router.delete('/:id', verifyToken, deleteBudget);  // New route to delete a budget by ID

module.exports = router;