const mongoose = require('mongoose');

// lists of possible action and resources
const actions = ['write', 'delete'];
const resources = ['post', 'comment'];

// return possible combination in the format:
// [action-resource1, action-resource2, ...]
const actionToResources = (action, resources) => (
  resources.map((resource) => `${action}-${resource}`)
)

// list of all possible permissions in the format: action-resource
const permissions = actions
  .flatMap((action) => actionToResources(action, resources));

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
      enum: permissions,
    }],
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);
