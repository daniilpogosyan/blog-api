const express = require('express');
const router = express.Router();
var createError = require('http-errors');

const commentRouter = require('./comments');

const Post = require('../models/post');
const User = require('../models/user');

const { authorize } = require('../accessController');

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
    const err = createError(403, 'User are not allowed to write posts');
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
router.put('/:postId', authorize, async (req, res, next) => {
  const updatedPostData = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status
  };
  
  let post;
  try {
    post = await Post.findById(req.params.postId).exec();
    if (post === null) {
      throw createError(404, 'Post does not exist');
    }
    
    // Check if current user is author of the post
    if (!post.author._id.equals(req.user.id)) {
      throw createError(403, 'You do not have permission to edit this post');
    }
    
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
    post = await Post.findById(req.params.postId).exec();

    if (post === null) {
      throw createError(404, 'Post does not exist');
    }

    // Check if current user is author of the post
    if (!post.author._id.equals(req.user._id)) {
      throw createError(403, 'You do not have permission to delete this post');
    }
  } catch (err) {
    return next(err);
  }

  try {
    await post.delete();
  } catch (err) {
    next(err);
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
