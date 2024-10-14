const Entry = require('../models/Entry');

// Add a new entry (Income, Expense, or Savings)
exports.addEntry = async (req, res) => {
  const { name, amount, category, budget } = req.body;
  try {
    const entry = new Entry({
      user: req.user.id,
      name,
      amount,
      category: {
        name: category.name,
        type: category.type,
      },
      budget,
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error('Error adding entry:', err);
    res.status(500).json({ error: 'Server error while adding entry' });
  }
};

// Get all entries for the logged-in user
exports.getEntries = async (req, res) => {
  try {
    const { budgetId } = req.query;
    const filter = { user: req.user.id };
    if (budgetId) {
      filter.budget = budgetId;
    }
    const entries = await Entry.find(filter);
    res.json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err.message);
    res.status(500).json({ error: 'Server error while fetching entries' });
  }
};

// Edit an existing entry
exports.editEntry = async (req, res) => {
  const { id } = req.params;
  const { name, amount, category } = req.body;

  try {
    const updatedEntry = await Entry.findByIdAndUpdate(
      id,
      { name, amount, category },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(updatedEntry);
  } catch (err) {
    console.error('Error editing entry:', err.message);
    res.status(500).json({ error: 'Server error while editing entry' });
  }
};

// Delete an entry
exports.deleteEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntry = await Entry.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting entry:', err.message);
    res.status(500).json({ error: 'Server error while deleting entry' });
  }
};
