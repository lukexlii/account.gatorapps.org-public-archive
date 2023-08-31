const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { GLOBAL_USER_AUTH_TOKEN_LIFESPAN, APP_AUTH_STATE_LIFESPAN } = require('../config/config');

const signUserAuthToken = (payload) => {
  const userSessionToken = jwt.sign(
    payload,
    process.env.USR_AUTH_TOKEN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    { algorithm: 'ES256', expiresIn: GLOBAL_USER_AUTH_TOKEN_LIFESPAN }
  );
  return userSessionToken;
};

const signAppAuthState = (payload) => {
  const appAuthPrivateKey = fs.readFileSync(path.resolve(__dirname, '../config/_jwtKeyPair/appAuth_private.pem'));
  const appAuthState = jwt.sign(
    payload,
    appAuthPrivateKey,
    { algorithm: 'ES256', expiresIn: APP_AUTH_STATE_LIFESPAN }
  );
  return appAuthState;
};

module.exports = { signUserAuthToken, signAppAuthState };