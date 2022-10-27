const authorize = require('./authorize');
const issueJwt = require('./issueJwt');

const accessControler = {
  authorize,
  issueJwt
};

module.exports = accessControler;