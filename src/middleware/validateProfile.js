const Joi = require('joi');
const uploads = require('../utils/uploadHandler');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.validateProfile = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      username: Joi.string(),
      gender: Joi.string().valid('Male', 'Female'),
      bio: Joi.string(),
      profilepic: Joi.string(),
    });

    const validationData = {
      name: req.body.name,
      username: req.body.username,
      gender: req.body.gender,
      bio: req.body.bio,
      profilepic: req.file ? req.file.path : undefined,
    };
    const { error } = schema.validate(validationData);
    if (error) {
      if (validationData.profilepic) {
        await uploads.deleteprofile(validationData.profilepic);
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ResponseMessages.VALIDATION,
        errors: error.details,
      });
    }
    req.body = validationData;
    return next();
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
      errors: error.details,
    });
  }
};
