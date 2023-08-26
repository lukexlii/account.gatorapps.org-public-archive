const jwt = require('jsonwebtoken');
const User = require('../model/User');

const handleSignOut = async (req, res) => {
  delete req.session.userAuth;
  req.session.save((err) => {
    if (err) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to update client session to sign you out' });
  });

  // remove client's session from foundUser's sessions
  const foundUser = req?.userAuth?.authedUser || req?.userAuth?.error?.expiredUser;
  if (foundUser) {
    try {
      foundUser.sessions = foundUser.sessions.filter((session) => session.sessionID !== req.sessionID);
      const result = await foundUser.save();
    } catch (err) {
      return res.status(204).json({ 'errCode': '-', 'errMsg': 'Unable to remove client session from user\'s sessions' });
    }
  }

  res.status(204).json({ 'errCode': '0' });
};

module.exports = { handleSignOut }