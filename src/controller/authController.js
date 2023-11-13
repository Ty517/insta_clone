const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const User = require('../database/models/userModel');
const sendEmail = require('../utils/email');

exports.signup = (async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    password: req.body.password,
    confirmationToken: jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }),
  });
  const emailTemplatePath = path.join(__dirname, '..', 'views', 'email.html');
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
      body: emailTemplate.replace('{{confirmation_link}}', `${process.env.CLIENT_URL}/confirm/${newUser.confirmationToken}`),
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

    const user = await User.findOne({ email, confirmationToken: token });

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    user.confirmationToken = undefined;
    user.confirmed = true;

    await user.save();
    const emailTemplatePath = path.join(__dirname, '..', 'views', 'confirmed.html');
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
