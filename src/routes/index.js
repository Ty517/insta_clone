const express = require('express');
const controller = require('../controller');
const testController = require('../controller/test');

const route = express.Router();
route.get('/', controller);
route.get('/users', testController);
module.exports = route;
