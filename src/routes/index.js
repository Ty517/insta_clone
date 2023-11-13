const express = require('express');
const authController = require('../controller/authController');
const validateSignup = require('../middleware/validateSignup');
const validatelogin = require('../middleware/validateSignup');
const forgot = require('../middleware/validateSignup');

const route = express.Router();
route.post('/signup', validateSignup.validateSignup, authController.signup);
route.get('/confirm/:token', authController.confirmEmail);
route.post('/login', validatelogin.validatelogin, authController.login);
route.post('/forgot', forgot.forgot, authController.forgotpass);

module.exports = route;
