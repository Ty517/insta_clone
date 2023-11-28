const Joi = require('joi');
const uploads = require('../utils/uploadHandler');

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
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details,
      });
    }
    req.body = validationData;
    return next();
  } catch (error) {
    return res.status(500).json({
      message: 'something went wrong',
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
