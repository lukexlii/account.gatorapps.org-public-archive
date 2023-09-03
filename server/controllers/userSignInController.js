const { v4: uuidv4 } = require('uuid');
const { google } = require('googleapis');
const crypto = require('crypto');
const User = require('../model/User');
const { signUserAuthToken } = require('./signJWT');
const { FRONTEND_HOST, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URIS, MAX_WEB_SESSIONS } = require('../config/config');

const initializeSignIn = async (req, res, next) => {
  // Check not already signed in
  if (req?.userAuth?.authedUser) return res.status(400).json({ 'errCode': '-', 'errMsg': 'Already signed in' });

  // Generate random state 
  const state = crypto.randomBytes(16).toString('hex');

  // Save continueTo address in req and with session, if present
  const continueToUrl = req.account_singIn_continueTo?.url || FRONTEND_HOST;
  req.account_singIn_session = { state, continueToUrl };

  if (continueToUrl) {
    // Save continueTo address with session
    if (!req.session.signInSessions) req.session.signInSessions = [];
    req.session.signInSessions.push(req.account_singIn_session);
    await req.session.save((err) => {
      if (err) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to establish sign in state' });
    });
    // Return if err and already send res in callback
    if (res.headersSent) return;
  }

  return next();
}

const getSignInUrlUfgoogle = (req, res) => {
  const { state } = req.account_singIn_session;
  if (!state) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Internal server error' });

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    null, //process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URIS[0]
  );

  const scopes = ['openid', 'email', 'profile'];
  const signInUrlUfgoogle = oauth2Client.generateAuthUrl({
    scope: scopes.join(' '),
    hd: 'ufl.edu',
    state: state
  });

  return res.status(200).json({ errCode: '0', payload: signInUrlUfgoogle });
}

const validateCallback = (req, res, next) => {
  const { state } = req.body;
  if (!state) return res.status(400).json({ 'errCode': '-', 'errMsg': 'Missing required callback parameters' });

  if (!req.session?.signInSessions) return res.status(400).json({ 'errCode': '-', 'errMsg': 'Unable to match sign in session with state provided' });
  const signInSession = req.session.signInSessions.find(session => session.state === state);;
  if (!signInSession) return res.status(400).json({ 'errCode': '-', 'errMsg': 'Unable to match sign in session with state provided' });

  // Restore sign in session
  req.account_singIn_session = signInSession;
  next();
}

const handleCallbackUfgoogle = async (req, res, next) => {
  // Check req body contains access_token
  const { code } = req.body;
  if (!code) return res.status(400).json({ 'errCode': '-', 'errMsg': 'Missing required callback parameters' });

  // Exchange oauth2 code for openid, email and name from Google
  // Google OAuth: https://developers.google.com/identity/protocols/oauth2
  let email, firstName, lastName;
  try {
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URIS[0]
    );
    google.options({ auth: oauth2Client });
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.credentials = tokens;

    const people = google.people('v1');

    const profile = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names',
    });

    // Fetch email and verify account is UF-provided
    const emailAddresses = profile.data.emailAddresses;
    if (!emailAddresses) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to fetch user email from Google' });
    for (const e in emailAddresses) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const domain = "ufl.edu";
      if (!emailRegex.test(emailAddresses[e].value)) continue;
      const [username, emailDomain] = emailAddresses[e].value.split("@");
      if (emailDomain.toLowerCase() !== domain.toLowerCase()) continue;
      if (!emailAddresses[e].metadata.primary || !emailAddresses[e].metadata.verified) continue;
      email = emailAddresses[e].value;
      break;
    };
    if (!email) return res.status(403).json({ 'errCode': '-', 'errMsg': 'You must authenticate with your UF-provided account ending with @ufl.edu' });

    // Fetch name
    firstName = profile.data.names[0].givenName;
    lastName = profile.data.names[0].familyName;
  } catch (err) {
    return res.status(400).json({ 'errCode': '-', 'errMsg': 'Unable to fetch user info with Google access_token provided' });
  }

  // TO DO: Get and store openid, update name for re login
  try {
    // Check if user with given  primaryEmail already exists
    let foundUser = await User.findOne({ emails: email }).exec();

    // If not, create user
    if (!foundUser) {
      // Generate unique UUID for new user
      let opid = uuidv4();
      while (await User.findOne({ opid }).exec()) {
        opid = uuidv4();
      };

      const result = await User.create({
        "opid": opid,
        "registerTimestamp": new Date().getTime(),
        "roles": ["100001"],
        "emails": [email],
        "firstName": firstName,
        "lastName": lastName
      });
      foundUser = await User.findOne({ opid }).exec();
    }

    // Store user and continue
    req.account_singIn_userToEstablishSession = foundUser;
    next();
  } catch (err) {
    console.log(err)
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to establish user profile' });
  };
};

const establishSession = async (req, res) => {
  const foundUser = req.account_singIn_userToEstablishSession;
  if (!foundUser) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to establish user session' });

  const signInTimeStamp = new Date().getTime();

  // Sign userAuthToken to be saved with session
  let userAuthToken;
  try {
    userAuthToken = signUserAuthToken({ opid: foundUser.opid, sessionID: req.sessionID, signInTimeStamp });
  } catch (err) {
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to sign user session' });
  }

  // If the current client sessionID has an old session with foundUser, remove the old session
  foundUser.sessions = foundUser.sessions?.filter((session) => session.sessionID !== req.sessionID);

  // Sign out older sessions so number of simultaneous sessions for foundUser meet the max cap requirement
  while (foundUser.sessions.length >= MAX_WEB_SESSIONS) {
    const oldestSessionTimeStamp = foundUser.sessions.reduce((min, session) => Math.min(min, session.signInTimeStamp.getTime()), Infinity);
    foundUser.sessions = foundUser.sessions.filter((session) => session.signInTimeStamp.getTime() !== oldestSessionTimeStamp);
    // TO DO: Also remove the session from session db
  }

  // Save new session with current user
  const newSession = {
    sessionID: req.sessionID,
    signInTimeStamp
  };
  foundUser.sessions = [...foundUser.sessions, newSession];
  const result = await foundUser.save();

  // Save auth info in session
  req.session.userAuth = {
    opid: foundUser.opid,
    token: userAuthToken
  };
  req.session.save((err) => {
    if (err) return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to update session with current sign in' });
  });

  // Delete current and all other sessions since already signed in
  delete req.session.signInSessions;
  await req.session.save();
  return res.status(200).json({ 'errCode': '0', continueToUrl: req.account_singIn_session.continueToUrl });
};

module.exports = { initializeSignIn, getSignInUrlUfgoogle, validateCallback, handleCallbackUfgoogle, establishSession };