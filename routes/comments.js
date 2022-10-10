const express = require('express');

const router = express.Router();

// Get all comments
router.get('/', (req, res, next) => {
  res.send('Get all comments of the post');
});

// Create a new comment
router.post('/', (req, res, next) => {
  res.send('Create a comment');
});

// Get a particular comment
router.get('/:commentId', (req, res, next) => {
  res.send('Get a particular comment');
});

// Update a particular comment
router.put('/:commentId', (req, res, next) => {
  res.send('Update a particular comment');
});

// Delete a particular comment
router.delete('/:commentId', (req, res, next) => {
  res.send('Delete a particular comment');
});



module.exports = router;
