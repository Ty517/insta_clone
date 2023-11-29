const express = require('express');
const logged = require('../middleware/protectlog');
const commentController = require('../controller/commentController');
const validate = require('../middleware/validateComment');

const router = express.Router();
router.use(logged.protect);

router
  .route('/:id')
  .get(commentController.viewComment)
  .patch(validate.validateComment, commentController.changeComment)
  .delete(commentController.removeComment);

module.exports = router;
