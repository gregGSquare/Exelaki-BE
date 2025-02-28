require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const applyMiddleware = require('./config/middleware');
const initializeRoutes = require('./config/routes');
const Category = require('./models/Category');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { auth } = require('express-openid-connect');
const auth0Config = require('./config/auth0');
const auth0Routes = require('./routes/auth0Routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const PORT = process.env.PORT || 5000;
const HEALTH_CHECK_PORT = 10000;

// Create the main app
const app = express();

// Apply middleware
applyMiddleware(app);
app.use(cookieParser());
app.use(auth(auth0Config));

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Add a simple route to check authentication status
app.get('/auth-status', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Initialize routes
initializeRoutes(app);

// Add Auth0 routes
app.use('/api/auth0', auth0Routes);

// Error handling middleware - must be after all routes
app.use(notFound); // Handle 404 errors for routes that don't exist
app.use(errorHandler); // Handle all other errors

// Connect to MongoDB and ensure default categories
connectDB().then(() => {
  Category.ensureDefaults().catch((err) => {
    console.error('Error initializing default categories:', err);
  });

  // Start server after DB connection
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Main server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  // Still start the server even if DB connection fails
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (DB connection failed)`);
  });
});

// Create and start health check server
const healthApp = express();
healthApp.get('/health', (req, res) => {
  res.status(200).send('OK');
});

healthApp.listen(HEALTH_CHECK_PORT, () => {
  console.log(`Health check server running on port ${HEALTH_CHECK_PORT}`);
});

module.exports = app;