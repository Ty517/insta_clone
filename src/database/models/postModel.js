const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'User',
    },
    media: [{
      type: String,
      required: [true, 'A post must have content'],
    }],
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
postSchema.plugin(paginate);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
