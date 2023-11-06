const express = require('express');
const controller = require('../controller');
const testController = require('../controller/test');
const authController = require('../controller/authController');

const route = express.Router();
route.get('/', controller);
// route.get('/users', testController);
route.post('/users', testController.createUser);
route.get('/users', testController.getAllUsers);
route.get('/users/:id', testController.getUser);
route.patch('/users/:id', testController.UpdateUser);
route.delete('/users/:id', testController.DeleteUser);
route.post('/:signup', authController.signup);
module.exports = route;
