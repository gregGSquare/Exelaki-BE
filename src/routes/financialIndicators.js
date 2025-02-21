const express = require('express');
const { getFinancialIndicators } = require('../controllers/financialIndicatorsController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Calculate and return the user's financial indicators for a specific budget
router.get('/:budgetId', verifyToken, getFinancialIndicators);

module.exports = router;
