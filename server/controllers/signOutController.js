const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { REFRESH_TOKEN_COOKIE_NAME } = require('../config/authOptions');

const handleSignOut = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.[REFRESH_TOKEN_COOKIE_NAME]) return res.sendStatus(400);
  const refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME];

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
      const parsedSessions = foundUser.sessions.map(JSON.parse);
      const foundSession = parsedSessions.find(session => session.refreshToken === refreshToken);
      if (!foundSession) return;
      // If so, remove the session in db
      foundUser.sessions = (parsedSessions.filter((session) => session.refreshToken !== foundSession.refreshToken)).map((session) => JSON.stringify(session));
      const result = await foundUser.save();
    }
  );

  // Remove refreshToken cookie
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { httpOnly: true, secure: true, sameSite: 'None' });
  res.sendStatus(204);
};

module.exports = { handleSignOut }