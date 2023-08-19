const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { REFRESH_TOKEN_COOKIE_NAME } = require('../config/authOptions');

const handleSignOut = async (req, res) => {
  const refreshToken = req?.session?.refreshToken;
  if (!refreshToken) return res.status(401).json({ 'errCode': '-', 'errMsg': 'Missing refreshToken' });

  // remove session from DB
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    // Ignores expiration but validates refreshToken signature
    { ignoreExpiration: true },
    async (err, decoded) => {
      if (err) return;
      if (!decoded.opid) return;

      // Find user with id stored in refreshToken
      const foundUser = await User.findOne({ opid: decoded.opid }).exec();
      if (!foundUser) return;

      // Check if session is associated with user in db
      const foundSession = foundUser.sessions.find(session => session.refreshToken === refreshToken);
      if (!foundSession) return;
      // If so, remove the session in db
      foundUser.sessions = foundUser.sessions.filter((session) => session.refreshToken !== foundSession.refreshToken);
      const result = await foundUser.save();
    }
  );

  // Remove refreshToken from session
  //res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { httpOnly: true, secure: true, sameSite: 'None' });
  req.session.refreshToken = null;
  req.session.save((err) => {
    if (err) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to update session to sign you out' });
  });
  res.sendStatus(204);
};

module.exports = { handleSignOut }