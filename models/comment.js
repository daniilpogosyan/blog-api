const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  author: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Post'
  }
}, { timestamps: true });


module.exports = mongoose.model('Comment', CommentSchema);
