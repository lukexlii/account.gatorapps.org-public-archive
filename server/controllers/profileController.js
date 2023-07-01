const User = require('../model/User');

const getName = async (req, res) => {
  const id = req.userId;
  const foundUser = await User.findOne({ id }).exec();

  if (!foundUser) return res.sendStatus(403);
  if (!foundUser.refreshToken || foundUser.refreshToken === '') return res.sendStatus(403);

  const name = {
    firstName: foundUser.firstName,
    lastName: foundUser.lastName
  };
  res.status(200).json(name);
}


module.exports = {
  getName
}