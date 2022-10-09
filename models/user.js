const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: {
    type: [{
      type: String,
      enum: ['write-comment', 'write-post'],
    }],
  }
});

module.exports = mongoose.model('User', UserSchema);
