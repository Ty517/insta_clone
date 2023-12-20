const Comment = require('../database/models/commentModel');
const Post = require('../database/models/postModel');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.createComment = async (req, res) => {
  try {
    const newComment = await Comment.create({
      comment: req.body.comment,
      post: req.params.id,
      user: req.user.id,
    });
    const post = await Post.findById({ _id: req.params.id });
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_POST,
      });
    }
    return res.status(StatusCodes.CREATED).json({
      message: ResponseMessages.SUCCESS,
      data: newComment,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};

exports.viewallComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const pageNumber = req.query.pageNumber || 1;
    const pageSize = req.query.pageSize || 10;
    const options = {
      page: pageNumber,
      limit: pageSize,
    };

    const comments = await Comment.paginate({ post: postId }, options);
    if (!comments) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_COMMENT,
      });
    }
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: comments,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};

exports.viewComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById({ _id: commentId });
    if (!comment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_COMMENT,
      });
    }
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: comment,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};

exports.changeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const oldcomment = await Comment.findOne({ _id: commentId, user: req.user.id });
    if (!oldcomment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_COMMENT,
      });
    }
    oldcomment.comment = req.body.comment;
    const newComment = oldcomment;
    await newComment.save();
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: newComment,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};

exports.removeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const oldcomment = await Comment.findOneAndRemove({ _id: commentId, user: req.user.id });
    if (!oldcomment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_COMMENT,
      });
    }
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: oldcomment,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};
