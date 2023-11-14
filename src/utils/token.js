const jwt = require('jsonwebtoken');

exports.authToken = (email, secret) => jwt.sign({ email }, secret, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});
