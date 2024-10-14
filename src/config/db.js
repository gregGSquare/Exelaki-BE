const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Could not connect to MongoDB Atlas', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;