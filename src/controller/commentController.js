const Comment = require('../database/models/commentModel');
const Post = require('../database/models/postModel');

exports.createComment = async (req, res) => {
  try {
    const newComment = await Comment.create({
      comment: req.body.comment,
      post: req.params.id,
      user: req.user.id,
    });
    const post = await Post.findById({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({
        message: 'No Post Found',
      });
    }
    return res.status(201).json({
      message: 'Successfully commented on Post',
      comment: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not add comment',
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
      return res.status(404).json({
        message: 'Could not find comments',
      });
    }
    return res.status(200).json({
      message: 'Success',
      comment: comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not retrieve comment',
      error,
    });
  }
};

exports.viewComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById({ _id: commentId });
    if (!comment) {
      return res.status(404).json({
        message: 'Could not find comment',
      });
    }
    return res.status(200).json({
      message: 'Success',
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not retrieve comment',
      error,
    });
  }
};

exports.changeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const oldcomment = await Comment.findOne({ _id: commentId, user: req.user.id });
    if (!oldcomment) {
      return res.status(404).json({
        message: 'Could not find comment!',
      });
    }
    oldcomment.comment = req.body.comment;
    const newComment = oldcomment;
    await newComment.save();
    return res.status(200).json({
      message: 'Successfuly changed comment',
      comment: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'could not update comment',
      error,
    });
  }
};

exports.removeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const oldcomment = await Comment.findOneAndRemove({ _id: commentId, user: req.user.id });
    if (!oldcomment) {
      return res.status(404).json({
        message: 'Could not find comment',
      });
    }
    return res.status(200).json({
      message: 'Successfully removed your comment',
      comment: oldcomment,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not remove post',
      error,
    });
  }
};
