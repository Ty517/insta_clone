const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const User = require('../database/models/userModel');
const sendEmail = require('../utils/email');
const tokens = require('../utils/token');
const { StatusCodes, ResponseMessages } = require('../constants/repsonseConstants');

exports.signup = (async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      password: req.body.password,
      token: tokens.authToken(req.body.email, process.env.JWT_SECRET),
    });
    const emailTemplatePath = path.join(__dirname, '..', 'views', 'emails', 'email.html');
    const emailTemplate = await fs.readFile(emailTemplatePath, 'utf-8');
    const userData = {
      name: newUser.name,
      email: newUser.email,
      gender: newUser.gender,
      createdAt: newUser.createdAt,
    };
    await sendEmail({
      email: req.body.email,
      sub: 'Welcome to My App',
      body: emailTemplate.replace('{{confirmation_link}}', `${process.env.CLIENT_URL}/auth/confirm/${newUser.token}`),
    });

    return res.status(StatusCodes.CREATED).json({
      message: ResponseMessages.SUCCESS,
      userData,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
});

exports.confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email, token });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ResponseMessages.NO_USER,
      });
    }

    user.token = undefined;
    user.confirmed = true;

    await user.save();
    const emailTemplatePath = path.join(__dirname, '..', 'views', 'emails', 'confirmed.html');
    const emailTemplate = await fs.readFile(emailTemplatePath, 'utf-8');

    await sendEmail({
      email: user.email,
      sub: 'Email was Confirmed!',
      body: emailTemplate,
    });
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user
      || !(await user.correctPassword(password, user.password)) || user.confirmed === false) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: ResponseMessages.INVALID_CREDENTIAL,
      });
    }
    // If everything ok, send token to client
    const token = tokens.authToken(user.email, process.env.JWT_LOG_SECRET);
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
      token,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
};
exports.forgotpass = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.confirmed === false) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: ResponseMessages.NO_USER,
      });
    }

    user.token = tokens.authToken(user.email, process.env.JWT_RESET_SECRET);
    await user.save();

    const emailTemplatePath = path.join(__dirname, '..', 'views', 'emails', 'forgot.html');
    const emailTemplate = await fs.readFile(emailTemplatePath, 'utf-8');

    await sendEmail({
      email: user.email,
      sub: 'Forgotten Password',
      body: emailTemplate.replace('{{confirmation_link}}', `${process.env.CLIENT_URL}/auth/reset/${user.token}`),
    });

    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
};

exports.resetpass = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email, token });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ResponseMessages.NO_USER,
      });
    }

    user.password = req.body.password;
    user.token = undefined;
    await user.save();

    const emailTemplatePath = path.join(__dirname, '..', 'views', 'emails', 'reset.html');
    const emailTemplate = await fs.readFile(emailTemplatePath, 'utf-8');

    await sendEmail({
      email: user.email,
      sub: 'Password Reset',
      body: emailTemplate,
    });

    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
};

exports.changepass = async (req, res) => {
  const { email } = req.user;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.correctPassword(req.body.password, user.password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: ResponseMessages.INVALID_CREDENTIAL,
      });
    }
    user.password = req.body.newpass;
    await user.save();
    return res.status(StatusCodes.OK).json({
      message: ResponseMessages.SUCCESS,
    });
  } catch (error) {
    return res.status(StatusCodes.SERVER_ERROR).json({
      message: ResponseMessages.FAILURE,
    });
  }
};
