const User = require('../model/User');
const jwt = require('jsonwebtoken');

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
      const accessToken = jwt.sign(
        {
          "userInfo": {
            "if": foundUser.id
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }
      );
      res.json({ accessToken })
    }
  );
}

module.exports = { handleRefreshToken }