const jwt = require('jsonwebtoken');
const { GLOBAL_USER_AUTH_TOKEN_LIFESPAN } = require('../config/config');

const signUserAuthToken = (payload) => {
  const userSessionToken = jwt.sign(
    payload,
    process.env.USR_AUTH_TOKEN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    { algorithm: 'ES256', expiresIn: GLOBAL_USER_AUTH_TOKEN_LIFESPAN }
  );
  return userSessionToken;
};

module.exports = { signUserAuthToken };