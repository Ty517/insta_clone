const TestUser = require('../database/models/testModel');

// module.exports = async function test(req, res) {
//   try {
//     const users = await testModel.find(); // 5sec
//     return res.status(200).json({
//       data: users,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Something went wrong',
//       status: 500,
//     });
//   }
// };
exports.createUser = async (req, res) => {
  try {
    const users = await TestUser.create(req.body);
    return res.status(200).json({
      message: 'SUCCESS:)',
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allusers = await TestUser.find();
    return res.status(200).json({
      message: 'SUCCESS:)',
      data: allusers,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error,
    });
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await TestUser.findById(req.params.id);
    return res.status(200).json({
      message: 'SUCCESS:)',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error,
    });
  }
};

exports.UpdateUser = async (req, res) => {
  try {
    const uuser = await TestUser.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      message: 'SUCCESS:)',
      data: uuser,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error,
    });
  }
};

exports.DeleteUser = async (req, res) => {
  try {
    await TestUser.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      message: 'SUCCESS:)',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error,
    });
  }
};
