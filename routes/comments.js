const express = require('express');
const createError = require('http-errors');

const router = express.Router();

const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const { authorize, canUser } = require('../accessController');

// Get all comments
router.get('/', async (req, res, next) => {
  const query = Comment.find({post: req.postId}).populate('author', 'username');

  // Get document in a requested order
  if (req.query.sort) {
    query.sort(req.query.sort);
  }

  // Get limited number of documents
  if (req.query.limit) {
    query.limit(+req.query.limit);
  }

  let comments;
  try {
    comments = await query;
  } catch (err) {
    next(err);
  }

  res.json(comments);
});

// // Create a new comment
router.post('/', authorize, async (req, res, next) => {
  // Check if post that comment is written to exists
  let post;
  let comment;
  try {
    if (!canUser(req.user, 'write-comment')) {
      throw createError(403, 'You are not allowed to write comments');
    }
    post = await Post.findById(req.postId);
    if (post === null) {
      throw createError(404, 'Post that is tried to write a comment does not exist');
    }

    comment = await Comment.create({...req.body, post, author: req.user})
  } catch (err) {
    next(err);
  }

  res.send('Comment is created');
});

// Get a particular comment
router.get('/:commentId', async (req, res, next) => {
  let comment;
  try {
    comment = await Comment.findById(req.params.commentId).populate('author', 'username');
    if (comment === null) {
      throw createError(404, 'Comment does not exist');
    }
  } catch (err) {
    return next(err);
  }

  res.json(comment);
});

// Update a particular comment
router.put('/:commentId', async (req, res, next) => {
  let comment;
  try {
    comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body);
    if (comment === null) {
      throw createError(404, 'Comment does not exist');
    }
  } catch (err) {
    return next(err);
  }

  res.send('Comment is updated')
});

// Delete a particular comment
router.delete('/:commentId', async (req, res, next) => {
  let comment;
  try {
    comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (comment === null) {
      throw createError(404, 'Comment does not exist');
    }
  } catch (err) {
    return next(err);
  }

  res.send('Comment is deleted');
});



module.exports = router;
