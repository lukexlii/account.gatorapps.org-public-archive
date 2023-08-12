const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ 'message': 'No proper credentials in authHeader' });
  const token = authHeader.split(' ')[1];
  const accessJWTPublicKey = fs.readFileSync(path.resolve(__dirname,'../config/_jwtKeyPair/public.pem'));
  jwt.verify(
    token,
    accessJWTPublicKey,
    { algorithms: ['ES256'] },
    (err, decoded) => {
      if (err) return res.status(403).json({ 'message': 'Invalid accessToken', 'invalidJWT': true });
      req.userId = decoded.userInfo.id;
      req.userRoles = decoded.userInfo.roles;
      next();
    }
  );
}

module.exports = verifyJWT