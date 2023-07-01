const User = require('../model/User');

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.[process.env.REFRESH_TOKEN_COOKIE_NAME]) return res.sendStatus(204);
  const refreshToken = cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME, { httpOnly: true, sameSite: 'None', secure: false });
    return res.sendStatus(204);
  }

  // Remove refreshToken in db
  foundUser.refreshToken = '';
  await foundUser.save();
  // Remove refreshToken cookie
  res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME, { httpOnly: true, sameSite: 'None', secure: false });
  res.sendStatus(204);
}

module.exports = { handleLogout }