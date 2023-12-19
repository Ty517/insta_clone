const Joi = require('joi');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.validateComment = async (req, res, next) => {
  const schema = Joi.object({
    comment: Joi.string().required(),
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
