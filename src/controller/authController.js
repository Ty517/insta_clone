const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const User = require('../database/models/userModel');
const sendEmail = require('../utils/email');
const tokens = require('../utils/token');

exports.signup = (async (req, res) => {
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
  try {
    await sendEmail({
      email: req.body.email,
      sub: 'Welcome to My App',
      body: emailTemplate.replace('{{confirmation_link}}', `${process.env.CLIENT_URL}/confirm/${newUser.token}`),
    });

    return res.status(200).json({
      message: 'Signup in complete and an Email has been Sent! Please confirm your email.',
      userData,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'something went wrong',
      message: error,
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
      return res.status(400).json({
        message: 'User not found',
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
    return res.status(200).json({
      message: 'Email has been confirmed',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'An error occurred during email confirmation',
      message: error,
    });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user
      || !(await user.correctPassword(password, user.password)) || user.confirmed === false) {
      return res.status(401).json({
        status: 'Incorrect email or password',
      });
    }
    // If everything ok, send token to client
    const token = tokens.authToken(user.email, process.env.JWT_LOG_SECRET);
    return res.status(200).json({
      message: 'Successful login!',
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'something went wrong',
      message: error,
    });
  }
};
exports.forgotpass = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.confirmed === false) {
      return res.status(401).json({
        status: 'No Registered User Found',
      });
    }

    user.token = tokens.authToken(user.email, process.env.JWT_RESET_SECRET);
    await user.save();

    const emailTemplatePath = path.join(__dirname, '..', 'views', 'emails', 'forgot.html');
    const emailTemplate = await fs.readFile(emailTemplatePath, 'utf-8');

    await sendEmail({
      email: user.email,
      sub: 'Forgotten Password',
      body: emailTemplate.replace('{{confirmation_link}}', `${process.env.CLIENT_URL}/reset/${user.token}`),
    });

    return res.status(200).json({
      message: 'Email with reset link was Sent!',
    });
  } catch (error) {
    return res.status(401).json({
      status: 'An error occurred trying to reset your password',
      message: error,
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
      return res.status(404).json({
        message: 'User was not found',
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

    return res.status(200).json({
      message: 'Password was successfully Reset!',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'An error occurred during password reset',
      message: error,
    });
  }
};

exports.changepass = async (req, res) => {
  const { email } = req.user;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.correctPassword(req.body.password, user.password))) {
      return res.status(401).json({
        status: 'Incorrect password',
      });
    }
    user.password = req.body.newpass;
    await user.save();
    return res.status(200).json({
      message: 'Password changed successfuly!',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'something went wrong',
      message: error,
    });
  }
};
