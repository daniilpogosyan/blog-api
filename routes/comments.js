const express = require('express');
const createError = require('http-errors');

const router = express.Router();

const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const { authorize } = require('../accessController');

// Get all comments
router.get('/', async (req, res, next) => {
  let comments;
  try {
    comments = await Comment.find({post: req.postId}).populate('author', 'username').exec();
  } catch (err) {
    next(err);
  }

  res.json(comments);
});

// // Create a new comment
router.post('/', authorize, async (req, res, next) => {
  if (!req.user.permissions.includes('write-comment')) {
    const err = createError(403, 'You are not allowed to write comments');
    return next(err);
  }

  // Check if post that comment is written to exists
  let post;
  try {
    post = await Post.findById(req.postId);
  } catch (err) {
    next(err);
  }

  if (post === null) {
    const err = createError(404, 'Post that is tried to write a comment does not exist');
    return next(err);
  }

  // Create the comment
  let comment;
  const leanComment = {
    post: post,
    author: req.user,
    body: req.body.body
  };

  try {
    comment = await Comment.create(leanComment)
  } catch (err) {
    return next(err);
  }

  res.send('Comment is created');
});

// Get a particular comment
router.get('/:commentId', async (req, res, next) => {
  let comment;
  try {
    comment = await Comment.findById(req.params.commentId).populate('author', 'username');
  } catch (err) {
    return next(err);
  }

  if (comment === null) {
    const err = createError(404, 'Comment does not exist');
    return next(err);
  }

  res.json(comment);
});

// Update a particular comment
router.put('/:commentId', async (req, res, next) => {
  const leanComment = {
    body: req.body.body
  };

  let comment;
  try {
    comment = await Comment
      .findByIdAndUpdate(req.params.commentId, leanComment);
  } catch (err) {
    return next(err);
  }

  if (comment === null) {
    const err = createError(404, 'Comment does not exist');
    return next(err);
  }

  res.send('Comment is updated')
});

// Delete a particular comment
router.delete('/:commentId', async (req, res, next) => {
  let comment;
  try {
    comment = await Comment.findByIdAndDelete(req.params.commentId);
  } catch (err) {
    return next(err);
  }

  if (comment === null) {
    const err = createError(404, 'Comment does not exist');
    return next(err);
  }

  res.send('Comment is deleted');
});



module.exports = router;
