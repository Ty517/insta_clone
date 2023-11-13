const jwt = require('jsonwebtoken');

const authToken = (email) => jwt.sign({ email }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

module.exports = authToken;
