const express = require('express');
const route1 = require('../controller');
const route = express.Router();
route.get('/', route1);
module.exports = route1;

