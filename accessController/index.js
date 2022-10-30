const authorize = require('./authorize');
const issueJwt = require('./issueJwt');
const canUser = require('./canUser');

const accessControler = {
  authorize,
  issueJwt,
  canUser,
};

module.exports = accessControler;