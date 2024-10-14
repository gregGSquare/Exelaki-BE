const express = require('express');
const { addEntry, getEntries, editEntry, deleteEntry } = require('../controllers/entryController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Route to add a new entry
router.post('/', verifyToken, addEntry);

// Route to get all entries for the authenticated user
router.get('/', verifyToken, getEntries);

// Route to edit an entry by ID
router.put('/:id', verifyToken, editEntry);

// Route to delete an entry by ID
router.delete('/:id', verifyToken, deleteEntry);

module.exports = router;
