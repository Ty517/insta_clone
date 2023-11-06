/* eslint-disable no-unused-vars */
const User = require('../database/models/testModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  return res.status(200).json({
    message: 'SUCCESS:)',
    data: {
      user: newUser,
    },
  });
});
