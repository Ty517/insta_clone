const express = require('express');
const controller = require('../controller');

const route = express.Router();
route.get('/', controller);
module.exports = route;
