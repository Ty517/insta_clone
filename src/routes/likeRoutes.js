const express = require('express');
const logged = require('../middleware/protectlog');
const likeController = require('../controller/likeController');

const router = express.Router();
router.use(logged.protect);

router
  .route('/:id')
  .delete(likeController.unlike);

module.exports = router;
