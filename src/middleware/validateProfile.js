const Joi = require('joi');
const uploads = require('../utils/uploadHandler');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.validateProfile = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().optional(),
      bio: Joi.string().optional(),
      profilepic: Joi.string().optional(),
    });

    const validationData = {
      name: req.body.name,
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
