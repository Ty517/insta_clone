const testModel = require('../database/models/testModel');

module.exports = async function test(req, res) {
  try {
    const users = await testModel.find();
    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong',
      status: 500,
    });
  }
};
