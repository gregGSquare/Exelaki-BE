const express = require('express');
const { getCategories, addCategory } = require('../controllers/categoryController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get all categories (both default and user-defined)
router.get('/', verifyToken, getCategories);

// Route to add a new custom category for the authenticated user
router.post('/', verifyToken, addCategory);

module.exports = router;
