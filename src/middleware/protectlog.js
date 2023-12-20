const jwt = require('jsonwebtoken');
const User = require('../database/models/userModel');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.protect = async (req, res, next) => {
  try {
  // 1) Getting token and check of it's there
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: ResponseMessages.NOT_LOGGED });
    }
    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_LOG_SECRET);
    const { email } = decoded;

    // 3) Check if user still exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_USER,
      });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: ResponseMessages.INVALID_TOKEN,
    });
  }
};
