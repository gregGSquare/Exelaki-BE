const express = require('express');
const { getFinancialIndicators } = require('../controllers/financialIndicatorsController');
const { requireAuth } = require('../middleware/auth0Middleware');

const router = express.Router();

// Route to get financial indicators
router.get('/:budgetId', requireAuth, getFinancialIndicators);

module.exports = router;
