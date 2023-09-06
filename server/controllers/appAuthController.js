const App = require('../model/App');
const { FRONTEND_HOST } = require('../config/config');

const validateContinueTo = async (req, res, next) => {
  let { continueTo } = req.query;
  if (!continueTo) return next();

  // Case continueTo matches an app's name
  try {
    const foundApp = await App.findOne({ name: continueTo }).exec();
    if (foundApp) {
      req.account_singIn_continueTo = { app: foundApp, url: foundApp.origins[0] };
      return next();
    }
  } catch (err) {
  }

  // Case continueTo matches an app's origin url
  let url;
  // Check continueTo is in proper url format
  try {
    url = new URL(continueTo);
  } catch (err) {
    // If not, then continueTo matches neither an authorized app name nor origin url
    req.account_singIn_continueTo = { error: { errCode: '-', errMsg: 'The app you attempted to authenticate to does not exist or is not authorized to use with GatorApps. You may continue to sign in to view your account, or examine your request and try again' } }
    return next();
  }
  try {
    const foundApp = await App.findOne({ origins: url.origin }).exec();
    if (foundApp) {
      req.account_singIn_continueTo = { app: foundApp, url: continueTo };
    } else {
      req.account_singIn_continueTo = { error: { errCode: '-', errMsg: 'The app you attempted to authenticate to does not exist or is not authorized to use with GatorApps. You may continue to sign in to view your account, or examine your request and try again' } }
    }
  } catch (err) {
    req.account_singIn_continueTo = { error: { errCode: '-', errMsg: 'We\'re sorry, but we are unable to process your \"continueTo\" address at this time. You may continue to sign in to view your account, or try again later' } }
  }

  return next();
};

const getSignInUrl = async (req, res) => {
  const reqApp = req.reqApp;
  if (!reqApp._id) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Internal server error' });

  const continueToApp = req.account_singIn_continueTo?.app;
  const continueToUrl = req.account_singIn_continueTo?.url;

  if (continueToUrl) {
    // validateContinueTo already checks that name/origin in continueTo is valid and belongs to an internal app
    // Here checks this internal app matches the app requesting the sign in url
    if (!continueToApp._id || !reqApp._id.equals(continueToApp._id)) {
      return res.status(403).json({ 'errCode': '-', 'errMsg': '"continueTo" address does not belong to requesting app' });
    } else {
      return res.status(200).json({ errCode: '0', payload: FRONTEND_HOST + `/signin?continueTo=${encodeURI(continueToUrl)}` });
    }
  } else {
    return res.status(200).json({ errCode: '0', payload: FRONTEND_HOST + "/signin" });
  }
};

const initiateAuth = async (req, res) => {
  let continueToApp = req.account_singIn_continueTo?.app;
  let continueToUrl = req.account_singIn_continueTo?.url;
  const continueToError = req.account_singIn_continueTo?.error;

  // If no app and url to continue to after sign in, continue to to front end host
  if (!continueToApp || !continueToUrl) {
    try {
      const foundApp = await App.findOne({ origins: FRONTEND_HOST }).exec();
      if (!foundApp) return res.status(500).json({ errCode: '-', errMsg: "We're sorry, but we are unable to process your request at this time. Please try again later" });
      continueToApp = foundApp;
      continueToUrl = FRONTEND_HOST;
    } catch (err) {
      return res.status(500).json({ errCode: '-', errMsg: "We're sorry, but we are unable to process your request at this time. Please try again later" });
    }
  }

  // Case user already signed in, block re-sign in
  if (req?.userAuth?.authedUser) {
    // Case provided invalid continueTo, show warning
    if (continueToError) {
      return res.status(400).json({ errCode: '-', errMsg: 'You are already signed in, but the \"continueTo\" address you provided is invalid. Please examine your request and try again', alertSeverity: 'warning' });
      // Case valid continueTo, redirect client to continueTo
    } else {
      return res.status(400).json({ errCode: '-', errMsg: 'Already signed in', redirectUrl });
    }
  }

  if (continueToError) {
    return res.status(200).json({ errCode: continueToError.errCode || '-', alertTitle: 'Welcome', alertMessage: continueToError.errMsg || '', alertSeverity: 'warning' });
  } else {
    return res.status(200).json({ errCode: '0', alertTitle: 'Welcome', alertMessage: 'Please authenticate yourself bellow' + (continueToApp.displayName && (" to continue to " + continueToApp.displayName)) });
  }
};

module.exports = { validateContinueTo, getSignInUrl, initiateAuth };