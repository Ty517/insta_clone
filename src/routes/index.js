const express = require('express');
const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');
const likeRoutes = require('./likeRoutes');
const profileRoutes = require('./profileRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use(express.json());
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/likes', likeRoutes);
router.use('/profiles', profileRoutes);
router.use('/profile', userRoutes);

module.exports = router;
