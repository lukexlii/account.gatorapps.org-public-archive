const User = require('../model/User');
const { google } = require('googleapis');
const { signAccessToken, signRefreshToken } = require('./signJWT');
const { MAX_WEB_SESSIONS } = require('../config/authOptions');

const handleUFGoogleSignIn = async (req, res) => {
  // Check access_token exists
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ 'message': 'Missing Google access_token' });

  // Exchange access_token for email and name from Google
  // Google OAuth: https://developers.google.com/identity/protocols/oauth2
  let email, firstName, lastName;
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: access_token });

    const people = google.people({
      version: 'v1',
      auth: oauth2Client,
    });

    const profile = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names',
    });

    // Fetch email and verify account is UF-provided
    const emailAddresses = profile.data.emailAddresses;
    if (!emailAddresses) return res.status(500).json({ 'message': 'Unable to fetch user email' });
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
    if (!email) return res.status(403).json({ 'message': 'You must authenticate with your UF-provided account ending with @ufl.edu' });

    // Fetch name
    firstName = profile.data.names[0].givenName;
    lastName = profile.data.names[0].familyName;
  } catch (error) {
    return res.status(400).json({ 'message': 'Unable to fetch user info with Google access_token provided' });
  }

  // Check if user already exists
  let foundUser = await User.findOne({ primaryEmail: email }).exec();
  // If not, create user
  if (!foundUser) {
    try {
      const result = await User.create({
        "roles": ["100001"],
        "primaryEmail": email,
        "firstName": firstName,
        "lastName": lastName
      });
      foundUser = await User.findOne({ primaryEmail: email }).exec();
    } catch (err) {
      return res.status(500).json({ 'message': 'Unable to establish user profile' });
    }
  };

  // Create JWTs
  const accessToken = signAccessToken(foundUser);
  const refreshToken = signRefreshToken(foundUser);

  // Remove old sessions so number of simultaneous sessions meet the max cap requirement
  while (foundUser.sessions.length >= MAX_WEB_SESSIONS) {
    const parsedSessions = foundUser.sessions.map(JSON.parse);
    const oldestSessionTimeStamp = parsedSessions.reduce((min, session) => Math.min(min, session.signInTimeStamp), Infinity);
    foundUser.sessions = (parsedSessions.filter((session) => session.signInTimeStamp !== oldestSessionTimeStamp)).map((session) => JSON.stringify(session));
  };

  // Save newSession with current user
  const newSession = {
    refreshToken,
    signInTimeStamp: new Date().getTime()
  };
  foundUser.sessions = [...foundUser.sessions, JSON.stringify(newSession)];
  const result = await foundUser.save();

  // Send refresh token as httpOnly cookie
  res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
  // Send access token
  res.json({ email, firstName, lastName, accessToken, roles: foundUser.roles });
};


module.exports = { handleUFGoogleSignIn };