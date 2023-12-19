const express = require('express');
const profileController = require('../controller/profileController');
const followController = require('../controller/followController');
const uploads = require('../utils/uploadHandler');
const validate = require('../middleware/validateProfile');
const logged = require('../middleware/protectlog');

const router = express.Router();
router.use(logged.protect);
router
  .route('/')
  .get(profileController.allProfiles)
  .patch(uploads.uploadprofile.single('profilepic'), validate.validateProfile, profileController.updateProfile);
router
  .route('/:id')
  .get(profileController.oneProfile);
router
  .route('/:id/followings')
  .get(followController.seefollowing)
  .post(followController.follow)
  .delete(followController.unfollow);

router
  .route('/:id/followers')
  .get(followController.seefollowers);

module.exports = router;
