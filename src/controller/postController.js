const _ = require('lodash');
const Post = require('../database/models/postModel');
const uploads = require('../utils/uploadHandler');

exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      userId: req.user.id,
    });

    return res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not Create Post',
      error: error.message,
    });
  }
};

exports.getallPosts = async (req, res) => {
  try {
    const userPosts = await Post.find({ userId: req.user.id });

    return res.status(200).json({
      message: 'SUCCESS',
      data: userPosts,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not find Posts',
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const onePost = await Post.findOne({ _id: postId, userId: req.user.id });

    if (!onePost) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      message: 'SUCCESS',
      data: onePost,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not find Post',
    });
  }
};

exports.changePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const onePost = await Post.findOne({ _id: postId, userId: req.user.id });

    if (!onePost) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }
    if (req.files.length > 0) {
      await uploads.deleteinCloudinary(onePost.media);
    }
    const updatedFields = _.omitBy(req.body, _.isNil);

    // Update the post
    await onePost.update(updatedFields, { runValidators: true });
    const updatedPost = await Post.findOne({ _id: postId, userId: req.user.id });
    return res.status(200).json({
      message: 'Post changed successfully!',
      data: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not update post',
    });
  }
};

exports.removePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const onePost = await Post.findOneAndRemove({ _id: postId, userId: req.user.id });
    if (!onePost) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }
    await uploads.deleteinCloudinary(onePost.instapost);
    return res.status(200).json({
      message: 'Post Removed',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not remove post',
    });
  }
};
