const _ = require('lodash');
const User = require('../database/models/userModel');
const uploads = require('../utils/uploadHandler');
const Follow = require('../database/models/followModel');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.allProfiles = async (req, res) => {
  try {
    const pageNumber = req.query.pageNumber || 1;
    const pageSize = req.query.pageSize || 10;
    const options = {
      page: pageNumber,
      limit: pageSize,
      select: '-password -token',
    };
    const profile = await User.paginate({ confirmed: true }, options);

    const profilewithfollowcount = await Promise.all(profile.docs.map(async (userProfile) => {
      const { _id: userId } = userProfile;
      const countfollowers = await Follow.countDocuments({ following: userId });
      const countfollowing = await Follow.countDocuments({ user: userId });
      return {
        ...userProfile.toObject(),
        followers: countfollowers,
        following: countfollowing,
      };
    }));

    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      data: {
        items: profilewithfollowcount,
        totalPages: profile.totalPages,
        currentPage: profile.page,
        pageSize: profile.limit,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
};

exports.oneProfile = (async (req, res) => {
  try {
    const profile = await User.findOne({ _id: req.params.id, confirmed: true }).select('-password -token').lean();
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
    if (req.body.username) {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        return res.status(StatusCodes.CONFLICT).json({
          message: ResponseMessages.EXISTING_USER,
        });
      }
    }
    if (req.file && profile.profilepic) {
      await uploads.deleteprofile(profile.profilepic);
    }
    const updatedFields = _.omitBy(req.body, _.isNil);

    const updatedProfile = await User.findByIdAndUpdate(req.user.id, updatedFields, { new: true, runValidators: true, select: '-password -token' }).lean();
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
