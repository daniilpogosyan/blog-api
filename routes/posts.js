const express = require('express');
const router = express.Router();
var createError = require('http-errors');

const commentRouter = require('./comments');

const Post = require('../models/post');
const User = require('../models/user');

const { authorize, canUser } = require('../accessController');

// Get all posts
router.get('/', async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find().populate('author', 'username');
  } catch (err) {
    return next(err);
  }

  res.json(posts);
});

// Create a new post
router.post('/', authorize, async (req, res, next) => {
  let post;
  try {
    if (!canUser(req.user, 'write-post')) {
      throw createError(403, 'User are not allowed to write posts');
    }

    // Extract data from request body
    const leanPost = {
      title: req.body.title,
      body: req.body.body,
      author: req.user
    };

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
    post = await Post.findById(req.params.postId).populate('author', 'username');

    if (post === null)  {
      throw createError(404, 'Post does not exist');
    }
  } catch (err) {
    return next(err);
  }

  res.json(post);
});

// Update a particular post
router.put('/:postId', authorize, async (req, res, next) => {
  let post;
  try {
    // Check if current user is author of the post
    if (!canUser(req.user, 'write-post', post)) {
      throw createError(403, 'You do not have permission to edit this post');
    }

    post = await Post.findById(req.params.postId);
    if (post === null) {
      throw createError(404, 'Post does not exist');
    }
    
    // Extract data from request body
    const updatedPostData = {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status
    }; 

    // Update post data
    Object.assign(post, updatedPostData);
    await post.save();
  } catch (err) {
    return next(err);
  }

  res.send('Post is updated');
});

// Delete a particular post
router.delete('/:postId', authorize, async (req, res, next) => {
  let post;
  try {
    // Check if current user is author of the post
    if (!canUser(req.user, 'delete-post', post)) {
      throw createError(403, 'You do not have permission to delete this post');
    }

    post = await Post.findById(req.params.postId);

    if (post === null) {
      throw createError(404, 'Post does not exist');
    }
    await post.delete();
  } catch (err) {
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
