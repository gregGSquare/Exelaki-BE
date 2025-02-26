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
    required: false, // No longer required for Auth0 users
  },
  auth0Id: {
    type: String,
    sparse: true, // This allows multiple documents with null values while maintaining uniqueness for non-null values
    unique: true,
  },
  isAuth0User: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

// Hash password before saving (only for non-Auth0 users)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isAuth0User) {
    return next();
  }

  this.password = await hashPassword(this.password);
  next();
});

// Compare password for login (only for non-Auth0 users)
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (this.isAuth0User) {
    return false; // Auth0 users should authenticate through Auth0
  }
  return await comparePassword(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
