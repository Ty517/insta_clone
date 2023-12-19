const _ = require('lodash');
const User = require('../database/models/userModel');
const uploads = require('../utils/uploadHandler');
const Follow = require('../database/models/followModel');

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

    return res.status(200).json({
      message: 'Profile retrieved successfully',
      data: profilewithfollowcount,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not get Profiles',
    });
  }
});

exports.oneProfile = (async (req, res) => {
  try {
    const profile = await User.findById({ _id: req.params.id }).select('-password').lean();
    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found',
      });
    }
    const countfollowers = await Follow.countDocuments({ following: req.params.id });
    const countfollowing = await Follow.countDocuments({ user: req.params.id });
    return res.status(200).json({
      message: 'Profile retrieved successfully',
      data: {
        ...profile,
        followers: countfollowers,
        following: countfollowing,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not get Profiles',
    });
  }
});

exports.updateProfile = (async (req, res) => {
  try {
    const profile = await User.findById({ _id: req.user.id });
    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found',
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
    return res.status(200).json({
      message: 'Profile changed successfully',
      data: {
        ...updatedProfile,
        followers: countfollowers,
        following: countfollowing,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not update Profile',
    });
  }
});
