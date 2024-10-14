const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await hashPassword(this.password);
  next();
});

// Compare password for login
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await comparePassword(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
