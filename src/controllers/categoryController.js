const Category = require('../models/Category');

// Helper function to get categories by type
const getCategoriesByType = async (userId, type) => {
  const globalCategories = await Category.find({ user: null, type });
  const userCategories = await Category.find({ user: userId, type });
  
  return [...globalCategories, ...userCategories];
};

// Get all categories (in and out)
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    const [inCategories, outCategories] = await Promise.all([
      getCategoriesByType(userId, 'IN'),
      getCategoriesByType(userId, 'OUT'),
    ]);

    res.json({ inCategories, outCategories });
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
    const existingCategory = await Category.findOne({ name, user: userId, type });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    // Create a new category
    const newCategory = new Category({ name, type, user: userId });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding custom category:', error);
    res.status(500).send('Server error');
  }
};
