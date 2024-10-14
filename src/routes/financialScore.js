const express = require('express');
const { getFinancialScore } = require('../controllers/financialScoreController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Calculate and return the user's financial score score
router.get('/', getFinancialScore);

module.exports = router;
