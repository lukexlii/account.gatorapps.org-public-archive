const { DEFAULT_GETUSERINFO_SCOPE } = require('../config/config');

const getUserAuthInfo = async (req, res) => {
  try {
    const foundUser = req?.userAuth?.authedUser;
    const foundApp = req?.reqApp?.foundApp;
    if (!foundUser || !foundApp) return res.status(500).json({ errCode: '-', 'errMsg': 'Internal server error while getting user info' });

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

    res.status(200).json({ errCode: '0', payload: JSON.stringify(userInfo) });
  } catch (err) {
    return res.status(500).json({ errCode: '-', 'errMsg': 'Unknown server error while getting user info' });
  }
};

module.exports = { getUserAuthInfo }