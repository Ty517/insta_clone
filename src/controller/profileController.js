const _ = require('lodash');
const User = require('../database/models/userModel');
const uploads = require('../utils/uploadHandler');
const Follow = require('../database/models/followModel');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.allProfiles = (async (req, res) => {
  try {
    const profile = await User.find().select('-password').lean();
    const profiles = profile.map(async (userProfile) => {
      const { _id: userId } = userProfile;
      const countfollowers = await Follow.countDocuments({ following: userId });
      const countfollowing = await Follow.countDocuments({ user: userId });
      return {
        ...userProfile,
        followers: countfollowers,
        following: countfollowing,
      };
    });

    const profilewithfollowcount = await Promise.all(profiles);

    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: profilewithfollowcount,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
});

exports.oneProfile = (async (req, res) => {
  try {
    const profile = await User.findById({ _id: req.params.id }).select('-password').lean();
    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_USER,
      });
    }
    const countfollowers = await Follow.countDocuments({ following: req.params.id });
    const countfollowing = await Follow.countDocuments({ user: req.params.id });
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: {
        ...profile,
        followers: countfollowers,
        following: countfollowing,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
});

exports.updateProfile = (async (req, res) => {
  try {
    const profile = await User.findById({ _id: req.user.id });
    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_USER,
      });
    }
    if (req.file && profile.profilepic) {
      await uploads.deleteprofile(profile.profilepic);
    }
    const updatedFields = _.omitBy(req.body, _.isNil);

    await User.findByIdAndUpdate(req.user.id, updatedFields, { new: true, runValidators: true });
    const updatedProfile = await User.findOne({ _id: req.user.id }).select('-password').lean();
    const countfollowers = await Follow.countDocuments({ following: req.user.id });
    const countfollowing = await Follow.countDocuments({ user: req.user.id });
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: {
        ...updatedProfile,
        followers: countfollowers,
        following: countfollowing,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
});
