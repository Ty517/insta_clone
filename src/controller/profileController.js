const _ = require('lodash');
const User = require('../database/models/userModel');
const uploads = require('../utils/uploadHandler');

exports.allProfiles = (async (req, res) => {
  try {
    const profile = await User.find();
    return res.status(200).json({
      message: 'Profile retrieved successfully',
      users: profile,

    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not get Profiles',
    });
  }
});

exports.oneProfile = (async (req, res) => {
  try {
    const profile = await User.findById({ _id: req.params.id });
    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found',
      });
    }
    return res.status(200).json({
      message: 'Profile retrieved successfully',
      user: profile,

    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not get Profiles',
    });
  }
});

exports.updateProfile = async (req, res) => {
  try {
    const profile = await User.findById({ _id: req.user.id });
    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found',
      });
    }
    if (req.file) {
      await uploads.deleteprofile(profile.profilepic);
    }
    const updatedFields = _.omitBy(req.body, _.isNil);

    await User.findByIdAndUpdate(req.user.id, updatedFields, { new: true, runValidators: true });
    const updatedProfile = await User.findOne({ _id: req.user.id });
    return res.status(200).json({
      message: 'Profile changed successfully',
      user: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not update Profile',
    });
  }
};
