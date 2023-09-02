const App = require('../model/App');
const { signAppAuthState } = require('./signJWT');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { FRONTEND_HOST } = require('../config/config');

const initiateRequest = async (req, res) => {
  const { app, returnTo, statePayload } = req.body;
  if (!app) return res.status(400).json({ 'errCode': '-200101', 'errMsg': 'Missing app' });

  try {
    const foundApp = await App.findOne({ name: app }).exec();
    if (!foundApp) return res.status(400).json({ 'errCode': '-200102', 'errMsg': 'App not found' });

    const requireState = (foundApp.authOptions && JSON.parse(foundApp.authOptions)?.requireState);
    if (requireState && !statePayload) return res.status(400).json({ 'errCode': '-200103', 'errMsg': 'App requires a state, statePayload not found' });

    let authUrl = FRONTEND_HOST + '/signin?app=' + foundApp.name;

    if (statePayload) {
      try {
        const state = signAppAuthState(statePayload);
        authUrl += '&state=' + state;
      } catch (error) {
        return res.status(500).json({ 'errCode': '-200104', 'errMsg': 'Unable to sign statePayload' });
      }
    };

    if (returnTo) {
      // TODO: Validate returnTo is an authorized uri
      authUrl += '&returnTo=' + returnTo;
    };

    return res.status(200).json({ authUrl });
  } catch (error) {
    return res.status(500).json({ 'errCode': '-200199', 'errMsg': 'Unknown server error' });
  }
};

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
  } catch (error) {
  }

  // Case continueTo matches an app's origin url
  // Check continueTo is in proper url format
  let url;
  try {
    url = new URL(continueTo);
  } catch (error) {
    req.account_singIn_continueTo = { error: { errCode: '-', errMsg: 'The \"continueTo\" address you provided is malformed. You may continue to sign in to view your account, or examine your request and try again' } }
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
    } catch (error) {
      return res.status(500).json({ errCode: '-', errMsg: "We're sorry, but we are unable to process your request at this time. Please try again later" });
    }
  }

  if (req?.userAuth?.authedUser) {
    if (continueToError) {
      return res.status(400).json({ errCode: '-', errMsg: 'You are already signed in, but the \"continueTo\" address you provided is invalid. Please examine your request and try again', alertSeverity: 'warning' });
    } else {
      return res.status(400).json({ errCode: '-', errMsg: 'Already signed in', continueToUrl });
    }
  }

  if (continueToError) {
    return res.status(200).json({ errCode: continueToError.errCode || '-', alertTitle: 'Welcome', alertMessage: continueToError.errMsg || '', alertSeverity: 'warning' });
  } else {
    return res.status(200).json({ errCode: '0', alertTitle: 'Welcome', alertMessage: 'Please authenticate yourself bellow' + (continueToApp.displayName && (" to continue to " + continueToApp.displayName)) });
  }
};

module.exports = { initiateRequest, validateContinueTo, initiateAuth };