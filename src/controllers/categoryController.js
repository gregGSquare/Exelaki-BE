const Category = require('../models/Category');
const Entry = require('../models/Entry');

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

    // Create a new category with defaultCategory set to false
    const newCategory = new Category({ 
      name, 
      type, 
      userId: userId,
      defaultCategory: false 
    });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding custom category:', error);
    res.status(500).send('Server error');
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    // Find the category
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Prevent deletion of default categories
    if (!category.user) {
      return res.status(403).json({ message: 'Cannot delete default categories' });
    }
    
    // Check if user owns this category
    if (category.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this category' });
    }

    // Check if category is being used by any entries
    const entriesUsingCategory = await Entry.findOne({ categoryId: category._id });
    if (entriesUsingCategory) {
      return res.status(400).json({ 
        message: 'Cannot delete category that is being used by entries. Please reassign or delete those entries first.' 
      });
    }
    
    // Delete the category
    await Category.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err.message);
    res.status(500).json({ error: 'Server error while deleting category' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const { name, type } = req.body;
  const userId = req.user.id;

  try {
    // Find the category
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if user owns this category
    if (category.userId && category.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this category' });
    }
    
    // Check if a category with the new name already exists for this user
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name, 
        userId: userId, 
        type: type || category.type 
      });
      
      if (existingCategory) {
        return res.status(400).json({ message: 'A category with this name already exists' });
      }
    }
    
    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, type },
      { new: true, runValidators: true }
    );
    
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
