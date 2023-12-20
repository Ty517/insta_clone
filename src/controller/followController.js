const Follow = require('../database/models/followModel');
const User = require('../database/models/userModel');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.follow = async (req, res) => {
  try {
    const userfollowed = await Follow.findOne({ user: req.user.id, following: req.params.id });
    if (userfollowed) {
      return res.status(StatusCodes.CONFLICT).json({
        message: ResponseMessages.ALREADY_FOLLOW,
      });
    }
    if (req.user.id === req.params.id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ResponseMessages.SELF_FOLLOW,
      });
    }
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_USER,
      });
    }
    const follow = await Follow.create({
      user: req.user.id,
      following: req.params.id,

    });
    return res.status(StatusCodes.CREATED).json({
      message: ResponseMessages.SUCCESS,
      data: follow,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_USER,
      });
    }
    const following = await Follow.findOneAndRemove({
      user: req.user.id,
      following: req.params.id,
    });
    if (!following) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ResponseMessages.DOESNT_FOLLOW,
      });
    }
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: following,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};

exports.seefollowing = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_USER,
      });
    }
    const following = await Follow.find({ user: req.params.id })
      .populate({
        path: 'following',
        select: '-password',
        model: 'User',
      });
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: following.map((follow) => follow.following),
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};

exports.seefollowers = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_USER,
      });
    }
    const followers = await Follow.find({ following: req.params.id })
      .populate({
        path: 'user',
        select: '-password',
        model: 'User',
      });
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: followers.map((follow) => follow.user),
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};

exports.userfollowing = async (req, res) => {
  try {
    const following = await Follow.find({ user: req.user.id })
      .populate({
        path: 'following',
        select: '-password',
        model: 'User',
      });
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: following.map((follow) => follow.following),
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};

exports.userfollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.user.id })
      .populate({
        path: 'user',
        select: '-password',
        model: 'User',
      });
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: followers.map((follow) => follow.user),
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      error,
    });
  }
};
