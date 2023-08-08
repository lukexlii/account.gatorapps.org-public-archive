const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { signAccessToken } = require('./signJWT');

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