const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ 'message': 'No proper credentials in authHeader' });
  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.status(403).json({ 'message': 'Invalid accessToken', 'invalidJWT': true });
      req.userId = decoded.userInfo.id;
      req.userRoles = decoded.userInfo.roles;
      next();
    }
  );
}

module.exports = verifyJWT