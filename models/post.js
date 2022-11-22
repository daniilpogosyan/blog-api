const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 300,
    minLength: 3
  },
  body: {
    type: String,
    required: true,
    maxLength: 20000,
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
}, {
  timestamps: true,
  toJSON: {virtuals: true},
});

PostSchema.virtual('url').get(function() {
  return `/posts/${this.id}`;
})

module.exports = mongoose.model('Post', PostSchema);
