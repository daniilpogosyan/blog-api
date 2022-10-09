const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 3
  },
  body: {
    type: String,
    required: true,
    maxLength: 500,
    minLength: 30,
  },
  author: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['unpublished', 'published', 'archived'],
    required: true,
    default: 'unpublished'
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
