const authRoutes = require('../routes/auth');
const entryRoutes = require('../routes/entry');
const financialScoreRoutes = require('../routes/financialScore');
const categoryRoutes = require('../routes/category');
const budgetRoutes = require('../routes/budget');

module.exports = function(app) {
  // Define routes
  app.use('/api/auth', authRoutes);
  app.use('/api/entries', entryRoutes); 
  app.use('/api/financial-score', financialScoreRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/budget', budgetRoutes);

  // Basic route
  app.get('/', (req, res) => {
    res.send('Welcome to the Exelaki Backend!');
  });
};
