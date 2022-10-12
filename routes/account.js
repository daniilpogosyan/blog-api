const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = express.Router();

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
  res.send('User logged in. NOT IMPLEMENTED');
});

module.exports = router;
