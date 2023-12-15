const Joi = require('joi');
const uploads = require('../utils/uploadHandler');

exports.validateProfile = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      bio: Joi.string().optional(),
      profilepic: Joi.string().optional(),
    });

    const validationData = {
      name: req.body.name,
      bio: req.body.bio,
      profilepic: req.file ? req.file.path : null,
    };
    const { error } = schema.validate(validationData);
    if (error) {
      await uploads.deleteprofile(validationData.profilepic);
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details,
      });
    }
    req.body = validationData;
    return next();
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong',
      errors: error.details,
    });
  }
};
