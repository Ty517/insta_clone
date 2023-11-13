const express = require('express');
const authController = require('../controller/authController');
const validateSignup = require('../middleware/validateSignup');
const validatelogin = require('../middleware/validateSignup');

const route = express.Router();
route.post('/signup', validateSignup, authController.signup);
route.get('/confirm/:token', authController.confirmEmail);
route.post('/login', validatelogin, authController.login);

module.exports = route;
