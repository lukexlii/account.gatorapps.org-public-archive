const { DEFAULT_GETUSERINFO_SCOPE } = require('../config/config');

const sendRefreshTokenError = (req, res, next) => {
  try {
    if (req.RTValidationResult.errCode === '0') {
      delete req.RTValidationResult;
      return next();
    }
    if (!req.RTValidationResult.status || !req?.RTValidationResult.errCode) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Internal server error when issuing access token' });
    return res.status(req.RTValidationResult.status).json({ 'errCode': req.RTValidationResult.errCode, 'errMsg': req.RTValidationResult.errMsg });
  } catch (err) {
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Internal server error when validating refreshToken' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const foundUser = req?.userAuth?.authedUser;
    if (!foundUser) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Internal server error when getting user info' });

    const foundApp = req.foundApp;
    if (!foundApp) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Internal server error when getting user info' });

    const userInfoScope = (req.header('GATORAPPS_userInfoScope') && JSON.parse(req.header('GATORAPPS_userInfoScope'))) || DEFAULT_GETUSERINFO_SCOPE;

    // TODO: Fine grained roles scope (global roles, app roles, other apps roles)
    const userInfo = {};
    userInfoScope.forEach((attributeName) => {
      // Avoid duplication if an attribute is included twice
      if (userInfo[attributeName]) return;
      // Do not include attributes that requesting app does not have permission to access
      if (!foundApp.userInfoScope.includes(attributeName)) return;
      if (!foundUser[attributeName]) return;
      userInfo[attributeName] = foundUser[attributeName];
    });

    res.status(200).json({ userInfo });
  } catch (err) {
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unknown server error while getting user info' });
  }
};

module.exports = { getUserInfo };