const App = require('../model/App');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { signAccessToken } = require('./signJWT');
const { REFRESH_TOKEN_COOKIE_NAME, DEFAULT_ACCESSTOKEN_SCOPE, DEFAULT_ACCESSTOKEN_RESPONSE_SCOPE } = require('../config/authOptions');

const validateOrigin = async (req, res, next) => {
  const requestingApp = req.header('GATORAPPS_app');
  if (!requestingApp) return res.status(400).json({ 'errCode': '-', 'errMsg': 'Missing requesting app' });

  const origin = req.header('origin');
  if (!origin) return res.status(400).json({ 'errCode': '-', 'errMsg': 'Missing request origin' });

  const foundApp = await App.findOne({ name: requestingApp }).exec();
  if (!foundApp) return res.status(400).json({ 'errCode': '-', 'errMsg': 'Requesting app does not exist' });
  // This blocks mismatched origins though previous CORS check allowed all global origins
  if (!foundApp.origins.includes(origin)) return res.status(403).json({ 'errCode': '-', 'errMsg': 'Unauthorized or mismatched origin' });

  req.foundApp = foundApp;
  next();
};

const validateRefreshToken = async (req, res, next) => {
  try {
    // Check refreshToken exists
    const cookies = req.cookies;
    if (!cookies?.[REFRESH_TOKEN_COOKIE_NAME]) return res.status(401).json({ 'errCode': '-', 'errMsg': 'Client missing refreshToken cookie' });
    const refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME];

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        // Validate refreshToken
        if (err) return res.sendStatus(403).json({ 'errCode': '-', 'errMsg': 'Invalid refreshToken' });
        if (!decoded.opid) return res.status(403).json({ 'errCode': '-', 'errMsg': 'refreshToken missing user opid' });

        // Find user with id stored in refreshToken
        const foundUser = await User.findOne({ opid: decoded.opid }).exec();
        if (!foundUser) return res.status(403).json({ 'errCode': '-', 'errMsg': 'Invalid user id' });

        // Check the session is active
        const parsedSessions = foundUser.sessions.map(JSON.parse);
        const foundSession = parsedSessions.find(session => session.refreshToken === refreshToken);
        if (!foundSession) return res.status(403).json({ 'errCode': '-', 'errMsg': 'Invalid session' });

        // Store foundUser is req and continue
        req.foundUser = foundUser;
        next();
      }
    );
  } catch (err) {
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unknown server error when validating refreshToken' });
  }
};

const sendAccessToken = async (req, res) => {
  const foundUser = req.foundUser;
  if (!foundUser) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Internal server error when issuing access token' });

  const foundApp = req.foundApp;
  if (!foundApp) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Internal server error when issuing access token' });

  const privateSigningKey = process.env['ACCESS_TOKEN_PRIVATE_KEY_' + foundApp.name.toUpperCase()].replace(/\\n/g, '\n');
  if (!privateSigningKey) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Internal server error when issuing access token' });

  const tokenScope = (req.header('GATORAPPS_tokenScope') && JSON.parse(req.header('GATORAPPS_tokenScope'))) || DEFAULT_ACCESSTOKEN_SCOPE;
  const responseScope = (req.header('GATORAPPS_responseScope') && JSON.parse(req.header('GATORAPPS_responseScope'))) || DEFAULT_ACCESSTOKEN_RESPONSE_SCOPE;

  // TODO: Fine grained roles scope (global roles, app roles, other apps roles)
  const tokenUserInfo = {};
  tokenScope.forEach((attributeName) => {
    if (attributeName === 'opid') return;
    if (tokenUserInfo[attributeName]) return;
    if (!foundApp.userInfoScope.includes(attributeName)) return;
    if (!foundUser[attributeName]) return;
    tokenUserInfo[attributeName] = foundUser[attributeName];
  });

  const responseUserInfo = {};
  responseScope.forEach((attributeName) => {
    if (responseUserInfo[attributeName]) return;
    if (!foundApp.userInfoScope.includes(attributeName)) return;
    if (!foundUser[attributeName]) return;
    responseUserInfo[attributeName] = foundUser[attributeName];
  });

  try {
    const accessToken = signAccessToken(privateSigningKey, { opid: foundUser.opid, userInfo: tokenUserInfo });
    res.json({ accessToken, userInfo: responseUserInfo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to sign accessToken' });
  }
};

module.exports = { validateOrigin, validateRefreshToken, sendAccessToken };