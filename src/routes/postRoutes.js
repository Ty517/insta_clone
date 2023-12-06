const express = require('express');
const logged = require('../middleware/protectlog');
const postController = require('../controller/postController');
const commentController = require('../controller/commentController');
const likeController = require('../controller/likeController');
const uploads = require('../utils/uploadHandler');
const validate = require('../middleware/validatePost');
const validateC = require('../middleware/validateComment');

const router = express.Router();
router.use(logged.protect);
router
  .route('/')
  .post(uploads.upload.array('media', 5), validate.validatePost, postController.createPost)
  .get(postController.getallPosts);

router
  .route('/:id')
  .get(postController.getPost)
  .patch(uploads.upload.array('media', 5), validate.validateUpdatePost, postController.changePost)
  .delete(postController.removePost);

router
  .route('/:id/comments')
  .post(validateC.validateComment, commentController.createComment)
  .get(commentController.viewallComment);

router
  .route('/:id/likes')
  .post(likeController.like);

module.exports = router;
