require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const createHttpError = require('http-errors');

// Express middleware for authorization
// It must be provided before each request to a protected route
async function authorize(req, res, next) {
  // Authorization header value schema: `Bearer ${token}`
  // e.i "Bearer 12312d1c21f12f....1d12d534fs"
  const bearerToken = req.header('Authorization');

  // Get the token value itself
  const token = bearerToken.split(' ')[1];
  
  // Get decoded value of the token if the  verification was successful
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
  } catch (err) {
    err.status = 401;
    return next(err);
  }

  let user;
  try {
    user = await User.findById(decoded.id);
  } catch (err) {
    console.log(err);
    return next(err);
  }

  if (user === null) {
    const err = createHttpError(401, 'User does not exist');
    return next(err);
  }

  req.user = user;
  next();
}

module.exports = authorize;