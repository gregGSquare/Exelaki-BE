const express = require('express');
const { addEntry, getEntries, editEntry, deleteEntry } = require('../controllers/entryController');
const { requireAuth } = require('../middleware/auth0Middleware');

const router = express.Router();

// Route to add a new entry
router.post('/', requireAuth, addEntry);

// Route to get all entries for the authenticated user
router.get('/', requireAuth, getEntries);

// Route to edit an entry by ID
router.put('/:id', requireAuth, editEntry);

// Route to delete an entry by ID
router.delete('/:id', requireAuth, deleteEntry);

module.exports = router;
