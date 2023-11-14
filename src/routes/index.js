const express = require('express');
const authController = require('../controller/authController');
const validate = require('../middleware/validateSignup');

const route = express.Router();
route.post('/signup', validate.validateSignup, authController.signup);
route.get('/confirm/:token', authController.confirmEmail);
route.post('/login', validate.validatelogin, authController.login);
route.post('/forgot', validate.forgot, authController.forgotpass);
route.patch('/reset/:token', validate.reset, authController.resetpass);

module.exports = route;
