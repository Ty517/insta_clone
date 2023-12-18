const Follow = require('../database/models/followModel');

exports.follow = async (req, res) => {
  try {
    const userfollowed = await Follow.findOne({ user: req.user.id, following: req.params.id });
    if (userfollowed) {
      return res.status(409).json({
        message: 'You already follow this user!',
      });
    }
    const follow = await Follow.create({
      user: req.user.id,
      following: req.params.id,

    });
    return res.status(201).json({
      message: 'Successfully Followed User',
      data: follow,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not follow User',
      error,
    });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const following = await Follow.findOneAndRemove({
      user: req.user.id,
      following: req.params.id,
    });
    if (!following) {
      return res.status(404).json({
        message: 'You dont follow this user',
      });
    }
    return res.status(200).json({
      message: 'Successfully unfollowed user',
      data: following,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not unfollow user',
      error,
    });
  }
};

exports.seefollowing = async (req, res) => {
  try {
    const following = await Follow.find({ user: req.params.id })
      .populate({
        path: 'following',
        select: '-password',
        model: 'User',
      });
    return res.status(200).json({
      message: 'This user is following',
      data: following.map((follow) => follow.following),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not fetch followed users',
      error,
    });
  }
};

exports.seefollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.id })
      .populate({
        path: 'user',
        select: '-password',
        model: 'User',
      });
    return res.status(200).json({
      message: 'User is followed by:',
      data: followers.map((follow) => follow.user),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not fetch followers',
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
    return res.status(200).json({
      message: 'This user is following',
      data: following.map((follow) => follow.following),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not fetch followed users',
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
    return res.status(200).json({
      message: 'User is followed by:',
      data: followers.map((follow) => follow.user),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not fetch followers',
      error,
    });
  }
};
