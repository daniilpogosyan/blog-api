const express = require('express');
const router = express.Router();
var createError = require('http-errors');

const commentRouter = require('./comments');

const Post = require('../models/post');
const User = require('../models/user');

const { authorize, canUser } = require('../accessController');

// Get all posts
router.get('/', 
  // Conditional authorization
  (req, res, next) => {
    if (req.query.author === 'me') {
      return authorize(req, res, next);
    }
    next();
  },
  async (req, res, next) => {
  const query = Post.find().populate('author', 'username');
  
    if (req.user) {

      // Get all user's posts
      query.where('author').equals(req.user.id);
    } else if (req.query.author) {
      
      // Get only published user's posts if not authorized
      query.where('author').equals(req.query.author);
      query.where('status').equals('published');
    } else {

      // Get all published posts
      query.where('status').equals('published');
    }

    let posts;
    try {
      posts = await query;
    } catch (err) {
      return next(err);
    }

    res.json(posts);
  }
);

// Create a new post
router.post('/', authorize, async (req, res, next) => {
  let post;
  try {
    if (!canUser(req.user, 'write-post')) {
      throw createError(403, 'User are not allowed to write posts');
    }
    post = await Post.create({...req.body, author: req.user});
  } catch (err) {
    return next(err);
  }

  res.send('Post is created');
});

// Get a particular post
router.get('/:postId',
  // Conditional authorization
  (req, res, next) => {
    if (req.query.author === 'me') {
      return authorize(req, res, next);
    }
    next();
  },
  async (req, res, next) => {
    const query = Post.findById(req.params.postId).populate('author', 'username');
    if (req.user) {
      // Search among published documents and documents that belong to the user
      query.or([
        { status: 'published' },
        { author: req.user.id }
      ])
    } else {
      // Search among published documents
      query.where('status').equals('published');
    }

    let post;
    try {
      post = await query.exec();

      if (post === null)  {
        throw createError(404, 'Post does not exist');
      }
    } catch (err) {
      return next(err);
    }

    res.json(post);
  }
);

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

    // Update post data
    Object.assign(post, req.body);
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
