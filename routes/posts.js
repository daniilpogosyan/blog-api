const express = require('express');
const router = express.Router();

const commentRouter = require('./comments');

// Get all posts
router.get('/', (req, res, next) => {
  res.send('Get all posts');
});

// Create a new post
router.post('/', (req, res, next) => {
  res.send('Create a post');
});

// Get a particular post
router.get('/:postId', (req, res, next) => {
  res.send('Get a particular post');
});

// Update a particular post
router.put('/:postId', (req, res, next) => {
  res.send('Update a particular post');
});

// Delete a particular post
router.delete('/:postId', (req, res, next) => {
  res.send('Delete a particular post');
});

// User a separate router for comments
router.use('/:postId/comments', commentRouter);

module.exports = router;
