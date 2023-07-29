const App = require('../model/App');
const { signAppAuthState } = require('./signJWT');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const initiateRequest = async (req, res) => {
  const { service } = req.body;
  if (!service) return res.status(400).json({ 'errCode': '-200101', 'errMsg': 'Missing service' });

  try {
    const foundService = await App.findOne({ name: service }).exec();
    if (!foundService) return res.status(400).json({ 'errCode': '-200102', 'errMsg': 'Service not found' });

    const state = signAppAuthState(foundService);
    const authUrl = process.env.FRONTEND_HOST + '/appAuth?service=' + foundService.name + '&state=' + state;
    return res.json({ authUrl })
  } catch (error) {
    return res.status(500).json({ 'errCode': '-200199', 'errMsg': 'Unknown server error' });
  }
};

const validateRequest = async (req, res) => {
  const { service, state } = req.body;
  if (!service || !state) return res.status(400).json({ 'errCode': '-200201', 'errMsg': "We're sorry, but we are unable to process your request because the server did not receive the required parameters, please re-initiate a request or try again later" });

  try {
    const foundService = await App.findOne({ name: service }).exec();
    if (!foundService) return res.status(400).json({ 'errCode': '-200202', 'errMsg': 'The service you attempted to authenticate to does not exist, please examine your request and try again' });

    const appAuthPublicKey = fs.readFileSync(path.resolve(__dirname, '../config/_jwtKeyPair/appAuth_public.pem'));
    jwt.verify(
      state,
      appAuthPublicKey,
      { algorithms: ['ES256'] },
      (err, decoded) => {
        if (err.name === 'JsonWebTokenError') return res.status(400).json({ 'errCode': '-200203', 'errMsg': 'Your authentication state is malformed, please examine your request and try again' });
        if (err.name === 'TokenExpiredError') return res.status(400).json({ 'errCode': '-200204', 'errMsg': 'Your authentication request has expired, please re-initiate a request' });
        if (err) return res.status(400).json({ 'errCode': '-200205', 'errMsg': "We're sorry, but we are unable to validate your authentication state, possibly because the state is malformed, please re-initiate a request or try again later" });
        return res.status(200).json({ 'errCode': '0', 'serviceDisplayName': foundService.displayName });
      }
    );
  } catch (error) {
    return res.status(500).json({ 'errCode': '-200299', 'errMsg': "We're sorry, but we are unable to process your request at this time. Please try again later" });
  }
};

module.exports = { initiateRequest, validateRequest };