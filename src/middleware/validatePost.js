const Joi = require('joi');
const uploads = require('../utils/uploadHandler');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.validatePost = async (req, res, next) => {
  try {
    const schema = Joi.object({
      location: Joi.string().required(),
      media: Joi.array().min(1).required(),
    });

    const postsval = req.files.map((file) => file.path);

    const validationData = {
      location: req.body.location,
      media: postsval,
    };
    const { error } = schema.validate(validationData);

    if (error) {
      await uploads.deleteinCloudinary(postsval);
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
    });
  }
};

exports.validateUpdatePost = async (req, res, next) => {
  try {
    const schema = Joi.object({
      location: Joi.string().optional(),
      media: Joi.array().optional(),
    });

    const validationData = {
      location: req.body.location,
    };

    if (req.files?.length) {
      validationData.media = req.files.map((file) => file.path);
    }
    const { error } = schema.validate(validationData);
    if (error) {
      await uploads.deleteinCloudinary(validationData.media);
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
