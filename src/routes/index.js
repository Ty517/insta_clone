const express = require('express');
const authController = require('../controller/authController');
const validate = require('../middleware/validateSignup');
const logged = require('../middleware/protectlog');

const route = express.Router();
route.post('/signup', validate.validateSignup, authController.signup);
route.get('/confirm/:token', authController.confirmEmail);
route.post('/login', validate.validatelogin, authController.login);
route.post('/forgot', validate.forgot, authController.forgotpass);
route.patch('/reset/:token', validate.reset, authController.resetpass);
route.patch('/change', validate.change, logged.protect, authController.changepass);

module.exports = route;
