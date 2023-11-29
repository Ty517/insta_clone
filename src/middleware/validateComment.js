const Joi = require('joi');

exports.validateComment = async (req, res, next) => {
  const schema = Joi.object({
    comment: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details,
    });
  }
  return next();
};
