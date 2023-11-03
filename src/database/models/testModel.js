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
