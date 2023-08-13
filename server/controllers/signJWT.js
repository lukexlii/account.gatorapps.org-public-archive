const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const signAccessToken = (privateSigningKey, payload) => {
  const accessToken = jwt.sign(
    payload,
    privateSigningKey,
    // Time format: https://github.com/vercel/ms
    { algorithm: 'ES256', expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }
  );
  return accessToken;
};

const signRefreshToken = (payload) => {
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_LIFESPAN }
  );
  return refreshToken;
};

const signAppAuthState = (payload) => {
  const appAuthPrivateKey = fs.readFileSync(path.resolve(__dirname, '../config/_jwtKeyPair/appAuth_private.pem'));
  const appAuthState = jwt.sign(
    payload,
    appAuthPrivateKey,
    { algorithm: 'ES256', expiresIn: process.env.APP_AUTH_STATE_LIFESPAN }
  );
  return appAuthState;
};

module.exports = { signAccessToken, signRefreshToken, signAppAuthState };