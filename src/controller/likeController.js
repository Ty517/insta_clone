const Like = require('../database/models/likeModel');
const Post = require('../database/models/postModel');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.like = async (req, res) => {
  try {
    const postliked = await Like.findOne({ user: req.user.id, post: req.params.id });
    if (postliked) {
      return res.status(StatusCodes.CONFLICT).json({
        message: ResponseMessages.ALREADY_LIKE,
      });
    }
    const post = await Post.findById({ _id: req.params.id });
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_POST,
      });
    }
    const likedpost = await Like.create({
      post: req.params.id,
      user: req.user.id,
    });

    return res.status(StatusCodes.CREATED).json({
      message: ResponseMessages.SUCCESS,
      post: likedpost,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};

exports.unlike = async (req, res) => {
  try {
    const LikeId = req.params.id;
    const post = await Post.findById({ _id: LikeId });
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_POST,
      });
    }
    const likedpost = await Like.findOneAndRemove({ _id: LikeId, user: req.user.id });
    if (!likedpost) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.DOESNT_LIKE,
      });
    }
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      post: likedpost,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};
