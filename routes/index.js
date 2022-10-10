var express = require('express');
var router = express.Router();

const postRouter = require('./posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// User a separate router for posts
router.use('/posts', postRouter)

module.exports = router;
