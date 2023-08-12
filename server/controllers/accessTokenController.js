const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { signAccessToken } = require('./signJWT');

const validateRefreshToken = async (req, res, next) => {
  try {
    // Check refreshToken exists
    const cookies = req.cookies;
    if (!cookies?.[process.env.REFRESH_TOKEN_COOKIE_NAME]) return res.status(401).json({ 'errCode': '-', 'errMsg': 'Client missing refreshToken cookie' });
    const refreshToken = cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        // Validate refreshToken
        if (err) return res.sendStatus(403).json({ 'errCode': '-', 'errMsg': 'Invalid refreshToken' });
        if (!decoded.id) return res.status(403).json({ 'errCode': '-', 'errMsg': 'refreshToken missing user id' });

        // Find user with id stored in refreshToken
        const foundUser = await User.findOne({ _id: decoded.id }).exec();
        if (!foundUser) return res.status(403).json({ 'errCode': '-', 'errMsg': 'Invalid user id' });

        // Check the session is active
        const parsedSessions = foundUser.sessions.map(JSON.parse);
        const foundSession = parsedSessions.find(session => session.refreshToken === refreshToken);
        if (!foundSession) return res.status(403).json({ 'errCode': '-', 'errMsg': 'Invalid session' });

        // Store foundUser is req and continue
        req.foundUser = foundUser;
        next();
      }
    );
  } catch (err) {
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unknown server error when validating refreshToken' });
  }
};

const sendAccessToken = async (req, res) => {
  if (!req.foundUser) return res.status(500).json({ 'errCode': '-', 'errMsg': '' });
  const foundUser = req.foundUser;

  let ResponseUserInfo, accessTokenUserInfo;

  const accessToken = signAccessToken(foundUser);
  res.json({ email: foundUser.orgEmail, firstName: foundUser.firstName, lastName: foundUser.lastName, accessToken, roles: foundUser.roles })

};

module.exports = { validateRefreshToken, sendAccessToken };