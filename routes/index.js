var express = require('express');
var router = express.Router();

const postRouter = require('./posts');
const accountRouter = require('./account');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// User a separate router for posts
router.use('/posts', postRouter)


// Routes responsible for login, signup etc...
router.use('/account', accountRouter)

module.exports = router;
