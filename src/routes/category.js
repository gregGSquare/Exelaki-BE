const express = require('express');
const { addCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { requireAuth } = require('../middleware/auth0Middleware');

const router = express.Router();

// Routes for category management
router.post('/', requireAuth, addCategory);
router.get('/', requireAuth, getCategories);
router.put('/:id', requireAuth, updateCategory);
router.delete('/:id', requireAuth, deleteCategory);

module.exports = router;
