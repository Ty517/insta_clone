const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      required: [true, 'A user must pick a gender'],
      enum: {
        values: ['Male', 'Female'],
      },
    },
    password: {
      type: String,
      required: [true, 'A user must have a password'],
      trim: true,
    },
    confirmationToken: String,
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Hash the password before saving
userSchema.pre('save', async function pass(next) {
  if (!this.isModified('password')) return next;

  // Hash the password with cost of 10
  this.password = await bcrypt.hash(this.password, 10);

  return next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
