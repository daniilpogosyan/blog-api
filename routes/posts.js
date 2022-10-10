const express = require('express');
const router = express.Router();
var createError = require('http-errors');

const commentRouter = require('./comments');

const Post = require('../models/post');
const User = require('../models/user');

// Get all posts
router.get('/', async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find().exec();
  } catch (err) {
    return next(err);
  }

  res.json(posts);
});

// Create a new post
router.post('/', async (req, res, next) => {
  // Find the author of the post
  let user;
  try {
    // Use mock mock user until authentication is implemented
    user = await User.findOne({username: 'testuser'}).exec();
  } catch (err) {
    return next(err);
  }

  if (user === null)  {
    const error = createError(404, 'User does not exist');
    return next(error);
  }

  const leanPost = {
    title: req.body.title,
    body: req.body.body,
    author: user
  };

  let post;
  try {
    post = await Post.create(leanPost);
  } catch (err) {
    return next(err);
  }

  res.send('Post is created');
});

// Get a particular post
router.get('/:postId', async (req, res, next) => {
  let post;
  try {
    post = await Post.findById(req.params.postId).exec();
  } catch (err) {
    return next(err);
  }
  
  if (post === null)  {
    const error = createError(404, 'Post does not exist');
    return next(error);
  }

  res.json(post);
});

// Update a particular post
router.put('/:postId', async (req, res, next) => {
  const updatedPostData = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status
  };
  
  let post;
  try {
    post = await Post.findByIdAndUpdate(req.params.postId, updatedPostData).exec()
  } catch (err) {
    return next(err);
  }

  if (post === null) {
    const err = createError(404, 'Post does not exist');
    return next(err);
  }

  res.send('Post is updated');
});

// Delete a particular post
router.delete('/:postId', async (req, res, next) => {
  let post;
  try {
    post = await Post.findByIdAndDelete(req.params.postId).exec();
  } catch (err) {
    return next(err);
  }

  if (post === null) {
    const err = createError(404, 'Post does not exist');
    return next(err);
  }

  res.send('Post is deleted');
});

// User a separate router for comments
router.use('/:postId/comments', commentRouter);

module.exports = router;
