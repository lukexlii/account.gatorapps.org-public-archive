const App = require('../model/App');
const { signAppAuthState } = require('./signJWT');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { FRONTEND_HOST } = require('../config/globalConfig');

const initiateRequest = async (req, res) => {
  const { app, statePayload } = req.body;
  if (!app) return res.status(400).json({ 'errCode': '-200101', 'errMsg': 'Missing app' });

  try {
    const foundApp = await App.findOne({ name: app }).exec();
    if (!foundApp) return res.status(400).json({ 'errCode': '-200102', 'errMsg': 'App not found' });

    const requireState = (foundApp.authOptions && JSON.parse(foundApp.authOptions)?.requireState);
    if (requireState && !statePayload) return res.status(400).json({ 'errCode': '-200103', 'errMsg': 'App requires a state, statePayload not found' });

    if (statePayload) {
      try {
        const state = signAppAuthState(statePayload);
        const authUrl = FRONTEND_HOST + '/signin?app=' + foundApp.name + '&state=' + state;
        return res.json({ authUrl })
      } catch (error) {
        return res.status(500).json({ 'errCode': '-200104', 'errMsg': 'Unable to sign statePayload' });
      }
    };

    const authUrl = FRONTEND_HOST + '/signin?app=' + foundApp.name;
    return res.json({ authUrl })
  } catch (error) {
    return res.status(500).json({ 'errCode': '-200199', 'errMsg': 'Unknown server error' });
  }
};

const validateRequest = async (req, res, next) => {
  const { app, state } = req.body;
  if (!app && !state) return res.status(400).json({ 'errCode': '-200201', 'errMsg': "We're sorry, but we are unable to process your request because the server did not receive the required parameters, please re-initiate a request or try again later" });

  try {
    const foundApp = await App.findOne({ name: app || 'account' }).exec();
    if (!foundApp) return res.status(200).json({ 'errCode': '-200202', 'errMsg': 'The app you attempted to authenticate to does not exist. You may continue to login to view your account, or examine your request and try again', 'alertSeverity': 'warning' });
    const requireState = (foundApp.authOptions && JSON.parse(foundApp.authOptions)?.requireState);
    if (requireState && !state) return res.status(400).json({ 'errCode': '-200203', 'errMsg': 'You attempted to authenticate to ' + foundApp.displayName + ' without providing a state. ' + foundApp.displayName + ' requires a valid state to log you in, please examine your request and try again' });

    if (state) {
      const appAuthPublicKey = fs.readFileSync(path.resolve(__dirname, '../config/_jwtKeyPair/appAuth_public.pem'));
      await jwt.verify(
        state,
        appAuthPublicKey,
        { algorithms: ['ES256'] },
        (err, decoded) => {
          if (err?.name === 'JsonWebTokenError') {
            if (!requireState) return res.status(200).json({ 'errCode': '-200251', 'errMsg': 'You requested to authenticate to ' + foundApp.displayName + ' with a malformed state. However, ' + foundApp.displayName + ' does not require a valid state to log you in. You may continue to login, or examine your request and try again', 'alertSeverity': 'warning' });
            return res.status(400).json({ 'errCode': '-200271', 'errMsg': 'You attempted to authenticate to ' + foundApp.displayName + ' with a malformed state. ' + foundApp.displayName + ' requires a valid state to log you in, please examine your request and try again' });
          }
          if (err?.name === 'TokenExpiredError') {
            if (!requireState) return res.status(200).json({ 'errCode': '-200252', 'errMsg': 'You requested to authenticate to ' + foundApp.displayName + ' with an expired state. However, ' + foundApp.displayName + ' does not require a valid state to log you in. You may continue to login, or re-initiate a request', 'alertSeverity': 'warning' });
            return res.status(400).json({ 'errCode': '-200272', 'errMsg': 'You attempted to authenticate to ' + foundApp.displayName + ' with an expired state. ' + foundApp.displayName + ' requires a valid state to log you in, please re-initiate a request' });
          }
          if (err) {
            if (!requireState) return res.status(200).json({ 'errCode': '-200253', 'errMsg': 'You requested to authenticate to ' + foundApp.displayName + ". We're sorry, but we are unable to validate your authentication state, possibly because the state is malformed. However, " + foundApp.displayName + ' does not require a valid state to log you in. You may continue to login, or re-initiate a request', 'alertSeverity': 'warning' });
            return res.status(400).json({ 'errCode': '-200273', 'errMsg': 'You attempted to authenticate to ' + foundApp.displayName + ". We're sorry, but we are unable to validate your authentication state, possibly because the state is malformed. " + foundApp.displayName + ' requires a valid state to log you in, please re-initiate a request or try again later' });
          }
        }
      );
      // Return if an request has already been sent in the err block of jwt.verify
      if (res.headersSent) return;
    }
    req.foundApp = foundApp;
    next();
  } catch (error) {
    return res.status(500).json({ 'errCode': '-200299', 'errMsg': "We're sorry, but we are unable to process your request at this time. Please try again later" });
  }
};

const initiateAuth = (req, res) => {
  try {
    if (req.RTValidationResult.errCode === '0') {
      // User already has an active signed in session
      return res.status(400).json({ 'errCode': '-', 'errMsg': 'Already signed in' });
    }
    delete req.RTValidationResult;
  } catch (err) {
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Internal server error when validating refreshToken' });
  }

  return res.status(200).json({ 'errCode': '0', 'alertTitle': 'Welcome', 'alertMessage': 'Please authenticate yourself bellow' + (req.foundApp.displayName && (" to continue to " + req.foundApp.displayName)), 'appDisplayName': req.foundApp.displayName });
}

module.exports = { initiateRequest, validateRequest, initiateAuth };