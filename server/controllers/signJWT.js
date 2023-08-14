const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { REFRESH_TOKEN_LIFESPAN, ACCESS_TOKEN_LIFESPAN, APP_AUTH_STATE_LIFESPAN } = require('../config/authOptions');

const signAccessToken = (privateSigningKey, payload) => {
  const accessToken = jwt.sign(
    payload,
    privateSigningKey,
    // Time format: https://github.com/vercel/ms
    { algorithm: 'ES256', expiresIn: ACCESS_TOKEN_LIFESPAN }
  );
  return accessToken;
};

const signRefreshToken = (payload) => {
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_LIFESPAN }
  );
  return refreshToken;
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

module.exports = { signAccessToken, signRefreshToken, signAppAuthState };