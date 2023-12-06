const Like = require('../database/models/likeModel');
const Post = require('../database/models/postModel');

exports.like = async (req, res) => {
  try {
    const postliked = await Like.findOne({ user: req.user.id, post: req.params.id });
    if (postliked) {
      return res.status(409).json({
        message: 'Post already liked!',
      });
    }
    const likedpost = await Like.create({
      post: req.params.id,
      user: req.user.id,
    });
    const post = await Post.findById({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({
        message: 'No Post Found',
      });
    }

    return res.status(201).json({
      message: 'Successfully Liked Post',
      post: likedpost,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not like post',
      error,
    });
  }
};

exports.unlike = async (req, res) => {
  try {
    const LikeId = req.params.id;
    const likedpost = await Like.findOneAndRemove({ _id: LikeId, user: req.user.id });
    if (!likedpost) {
      return res.status(404).json({
        message: 'No Such Post Found with Your Like',
      });
    }
    return res.status(200).json({
      message: 'Successfully unliked the post',
      post: likedpost,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not unlike post',
      error,
    });
  }
};
