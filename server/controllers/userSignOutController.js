const jwt = require('jsonwebtoken');
const User = require('../model/User');

const removeClientSession = (req, res, next) => {
  // Remove client's user session for anti-session fixation
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to update client session to sign you out' });
    return next();
  });
}

const handleSignOut = async (req, res) => {
  // Remove user session from foundUser's sessions
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

module.exports = { removeClientSession, handleSignOut }