const Entry = require('../models/Entry');

// Add a new entry (Income, Expense, or Savings)
exports.addEntry = async (req, res) => {
  const { name, amount, categoryId, budgetId, dueDayOfMonth, flexibility, recurrence, tags, type } = req.body;
  try {
    const entry = new Entry({
      userId: req.user.id,
      budgetId,
      categoryId,
      type,
      name,
      amount,
      dueDayOfMonth,
      flexibility,
      recurrence,
      tags,
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
    const filter = { userId: req.user.id };
    if (budgetId) {
      filter.budgetId = budgetId;
    }
    const entries = await Entry.find(filter)
      .populate('categoryId', 'name type');
    res.json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err.message);
    res.status(500).json({ error: 'Server error while fetching entries' });
  }
};

// Edit an existing entry
exports.editEntry = async (req, res) => {
  const { id } = req.params;
  const { name, amount, categoryId, budgetId, dueDayOfMonth, flexibility, recurrence, tags } = req.body;

  try {
    const updatedEntry = await Entry.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { name, amount, categoryId, budgetId, dueDayOfMonth, flexibility, recurrence, tags, type },
      { new: true }
    ).populate('categoryId', 'name type');

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
    const deletedEntry = await Entry.findOneAndDelete({ 
      _id: id, 
      userId: req.user.id 
    });

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting entry:', err.message);
    res.status(500).json({ error: 'Server error while deleting entry' });
  }
};
