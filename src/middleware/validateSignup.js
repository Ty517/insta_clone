const Joi = require('joi');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.validateSignup = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    gender: Joi.string().valid('Male', 'Female').required(),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'The password should be strong with 1 uppercase, 1 lowercase, 1 special character, 1 number, and a minimum length of 8 characters.'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ResponseMessages.VALIDATION,
      errors: error.details,
    });
  }

  return next();
};
exports.validatelogin = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ResponseMessages.VALIDATION,
      errors: error.details,
    });
  }

  return next();
};

exports.forgot = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ResponseMessages.VALIDATION,
      errors: error.details,
    });
  }
  return next();
};

exports.reset = async (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'The password should be strong with 1 uppercase, 1 lowercase, 1 special character, 1 number, and a minimum length of 8 characters.'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ResponseMessages.VALIDATION,
      errors: error.details,
    });
  }

  return next();
};

exports.change = async (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    newpass: Joi.string()
      .min(8)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'The password should be strong with 1 uppercase, 1 lowercase, 1 special character, 1 number, and a minimum length of 8 characters.'),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: ResponseMessages.VALIDATION,
      errors: error.details,
    });
  }

  return next();
};
