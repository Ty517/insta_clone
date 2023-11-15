const jwt = require('jsonwebtoken');
const User = require('../database/models/userModel');

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'You are not logged in' });
  }
  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_LOG_SECRET);
  const { email } = decoded;

  // 3) Check if user still exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: 'User was not found',
    });
  }
  req.user = user;
  return next();
};
