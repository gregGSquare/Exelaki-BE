const Category = require('../models/Category');

// Helper function to get categories by type
const getCategoriesByType = async (userId, type) => {
  const globalCategories = await Category.find({ user: null, type });
  const userCategories = await Category.find({ userId: userId, type });
  
  return [...globalCategories, ...userCategories];
};

// Get all categories (income, expense, saving)
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    const [incomeCategories, expenseCategories, savingCategories] = await Promise.all([
      getCategoriesByType(userId, 'INCOME'),
      getCategoriesByType(userId, 'EXPENSE'),
      getCategoriesByType(userId, 'SAVING'),
    ]);

    res.json({ incomeCategories, expenseCategories, savingCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Server error');
  }
};

// Add a new category
exports.addCategory = async (req, res) => {
  const { name, type } = req.body;
  const userId = req.user.id;

  try {
    // Check if the category already exists for the user
    const existingCategory = await Category.findOne({ name, userId: userId, type });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    // Create a new category
    const newCategory = new Category({ name, type, userId: userId });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding custom category:', error);
    res.status(500).send('Server error');
  }
};
