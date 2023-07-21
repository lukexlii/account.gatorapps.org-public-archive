const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const signAccessToken = (user) => {
  const accessJWTPrivateKey = fs.readFileSync(path.resolve(__dirname,'../config/_jwtKeyPair/private.pem'));
  const accessToken = jwt.sign(
    {
      "userInfo": {
        "id": user.id,
        "roles": user.roles
      }
    },
    accessJWTPrivateKey,
    // Time format: https://github.com/vercel/ms
    { algorithm: 'ES256', expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }
  );
  return accessToken;
}

const signRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { "id": user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_LIFESPAN }
  );
  return refreshToken;
}

module.exports = { signAccessToken, signRefreshToken };