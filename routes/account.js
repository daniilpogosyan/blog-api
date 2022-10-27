const express = require('express');
const bcrypt = require('bcryptjs');
const createHttpError = require('http-errors');

const User = require('../models/user');
const { authorize, issueJwt } = require('../accessController');

const router = express.Router();

// Send data about user
router.get('/', authorize, (req, res, next) => {
  res.json(req.user)
});

router.post('/signup', async (req, res, next) => {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(req.body.password, salt);
  
  const leanUser = {
    username: req.body.username,
    email: req.body.email,
    passwordHash
  };

  try {
    const user = await User.create(leanUser);
    return res.send('User created');
  } catch (err) {
    return next(err);
  }
});

router.post('/login', async (req, res, next) => {
  let user;
  try {
    user = await User.findOne({email: req.body.email});
  } catch (err) {
    return next(err);
  }

  if (user === null) {
    const err = createHttpError(401, 'Wrong email address');
    return next(err);
  }

  const isValidPassword = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!isValidPassword) {
    const err = createHttpError(401, 'Wrong password');
    return next(err);
  }
  
  const token = issueJwt({ id: user.id });
  res.json(token);
});

module.exports = router;
