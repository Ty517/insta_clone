const _ = require('lodash');
const Post = require('../database/models/postModel');
const Like = require('../database/models/likeModel');
const uploads = require('../utils/uploadHandler');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      userId: req.user.id,
    });

    return res.status(StatusCodes.CREATED).json({
      message: ResponseMessages.SUCCESS,
      post: newPost,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error: error.message,
    });
  }
};

exports.getallPosts = async (req, res) => {
  try {
    const userPosts = await Post.find().lean();
    if (!userPosts) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_POST,
      });
    }
    const posts = userPosts.map(async (post) => {
      const { _id: postId } = post;
      const countLikes = await Like.countDocuments({ post: postId });
      return {
        ...post,
        likes: countLikes,
      };
    });

    const postsWithLikes = await Promise.all(posts);

    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: postsWithLikes,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const onePost = await Post.findOne({ _id: postId }).lean();

    if (!onePost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_POST,
      });
    }
    const countlikes = await Like.countDocuments({ post: postId });
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: {
        ...onePost,
        likes: countlikes,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
};

exports.changePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const onePost = await Post.findOne({ _id: postId, userId: req.user.id });

    if (!onePost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_POST,
      });
    }
    if (req.files.length > 0) {
      await uploads.deleteinCloudinary(onePost.media);
    }
    const updatedFields = _.omitBy(req.body, _.isNil);

    // Update the post
    await onePost.update(updatedFields, { runValidators: true });
    const updatedPost = await Post.findOne({ _id: postId, userId: req.user.id });
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: updatedPost,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
};

exports.removePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const onePost = await Post.findOneAndRemove({ _id: postId, userId: req.user.id });
    if (!onePost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_POST,
      });
    }
    await uploads.deleteinCloudinary(onePost.instapost);
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: onePost,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
};
