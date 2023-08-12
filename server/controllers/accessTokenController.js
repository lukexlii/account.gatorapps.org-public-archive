const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { signAccessToken } = require('./signJWT');

const validateRefreshToken = async (req, res, next) => {
  // Check refreshToken exists
  const cookies = req.cookies;
  if (!cookies?.[process.env.REFRESH_TOKEN_COOKIE_NAME]) return res.status(401).json({ 'errCode': '-', 'errMsg': '' });
  const refreshToken = cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      // Validate refreshToken
      if (err) return res.sendStatus(403).json({ 'errCode': '-', 'errMsg': '' });
      if (!decoded.id) return res.sendStatus(403).json({ 'errCode': '-', 'errMsg': '' });

      // Find user with id stored in refreshToken
      const foundUser = await User.findOne({ _id: decoded.id }).exec();
      if (!foundUser) return res.sendStatus(403).json({ 'errCode': '-', 'errMsg': '' });

      // Check the session is active
      const foundSession = foundUser.sessions.find(session => session.refreshToken === refreshToken);
      if (!foundSession) return res.sendStatus(403).json({ 'errCode': '-', 'errMsg': '' });

      // Store foundUser is req and continue
      req.foundUser = foundUser;
      next();
    }
  );
};

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.[process.env.REFRESH_TOKEN_COOKIE_NAME]) return res.sendStatus(401);
  const refreshToken = cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.id != decoded.id) return res.sendStatus(403);
      const accessToken = signAccessToken(foundUser);
      res.json({ email: foundUser.orgEmail, firstName: foundUser.firstName, lastName: foundUser.lastName, accessToken, roles: foundUser.roles })
    }
  );
}

module.exports = { handleRefreshToken };