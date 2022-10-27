const jwt = require('jsonwebtoken');

function issueJwt(payload, signingOptions) {
  // default options
  signingOptions = signingOptions || {
    algorithm: 'HS256',
    expiresIn: '1d',
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, signingOptions);
  return token;
}

module.exports = issueJwt
