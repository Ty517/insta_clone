/* eslint-disable no-console */
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      trim: true,
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
      minlength: [8, 'The password must be at least 8 characters long'],
      validate: {
        validator(value) {
          // Here, we check for at least one uppercase, lowercase, special character, and one number
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        },
        message:
          'The password should be strong with 1 uppercase, 1 lowercase, 1 special character, and 1 number, and the minimum length should be 8 characters.',
      },
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
  },
);
const TestUser = mongoose.model('TestUser', testSchema);

// const testUser = new Test({
//   name: 'Me',
//   email: 'test@gmail.com',
//   gender: 'Male',
//   password: 'test123',

// });
// testUser.save().then((doc) => {
//   console.log(doc);
// })
//   .catch((err) => {
//     console.log('Error:', err);
//   });

module.exports = TestUser;
