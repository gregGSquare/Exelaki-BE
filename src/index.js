require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const applyMiddleware = require('./config/middleware');
const initializeRoutes = require('./config/routes');
const Category = require('./models/Category');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Apply middleware
applyMiddleware(app);
app.use(cookieParser());

// Connect to MongoDB and ensure default categories
connectDB().then(() => {
  Category.ensureDefaults().catch((err) => {
    console.error('Error initializing default categories:', err);
  });

  // Start server after DB connection
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

// Initialize routes
initializeRoutes(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;