const express = require('express');
const logged = require('../middleware/protectlog');
const postController = require('../controller/postController');
const uploads = require('../utils/uploadHandler');
const validate = require('../middleware/validatePost');

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
module.exports = router;
