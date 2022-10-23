const express = require('express');
const router = express.Router();
var createError = require('http-errors');

const commentRouter = require('./comments');

const Post = require('../models/post');
const User = require('../models/user');

const authorize = require('../authentication/authorize');

// Get all posts
router.get('/', async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find().populate('author', 'username').exec();
  } catch (err) {
    return next(err);
  }

  res.json(posts);
});

// Create a new post
router.post('/', authorize, async (req, res, next) => {
  if (!req.user.permissions.includes('write-post')) {
    const err = createHttpError(403, 'User are not allowed to write posts');
    return next(err);
  }

  const leanPost = {
    title: req.body.title,
    body: req.body.body,
    author: req.user
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
    post = await Post
      .findById(req.params.postId)
      .populate('author', 'username')
      .exec();
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
router.use('/:postId/comments',
  // Save postId inside request for use in comment router 
  // since :postId param will not be abailable in other route
  (req, res, next) => {
    req.postId = req.params.postId
    next();
  },
  commentRouter
);

module.exports = router;
