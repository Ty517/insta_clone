const express = require('express');
const followController = require('../controller/followController');
const logged = require('../middleware/protectlog');

const router = express.Router();
router.use(logged.protect);
router.get('/followings', followController.userfollowing);
router.get('/followers', followController.userfollowers);

module.exports = router;
