const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { ACCESS_TOKEN_LIFESPAN, APP_AUTH_STATE_LIFESPAN } = require('../config/authOptions');
const { GLOBAL_USER_SESSION_TOKEN_LIFESPAN } = require('../config/config');

const signAccessToken = (privateSigningKey, payload) => {
  const accessToken = jwt.sign(
    payload,
    privateSigningKey,
    // Time format: https://github.com/vercel/ms
    { algorithm: 'ES256', expiresIn: ACCESS_TOKEN_LIFESPAN }
  );
  return accessToken;
};

const signUserAuthToken = (payload) => {
  try {
    const userSessionToken = jwt.sign(
      payload,
      process.env.USR_AUTH_TOKEN_PRIVATE_KEY,
      { algorithm: 'ES256', expiresIn: GLOBAL_USER_AUTH_TOKEN_LIFESPAN }
    );
    return userSessionToken;
  } catch (error) {
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to sign user session' });
  }
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

module.exports = { signAccessToken, signUserAuthToken, signAppAuthState };