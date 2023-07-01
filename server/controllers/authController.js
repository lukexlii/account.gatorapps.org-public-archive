const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

const handleUFGoogleLogin = async (req, res) => {
  // Check access_token exists
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ 'message': 'Missing Google access_token.' });

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
    if (!emailAddresses) return res.status(500).json({ 'message': 'Failed to fetch user email.' });
    for (const e in emailAddresses) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const domain = "ufl.edu";
      if (!emailRegex.test(emailAddresses[e].value)) continue;
      const [username, emailDomain] = emailAddresses[e].value.split("@");
      if (emailDomain.toLowerCase() !== domain.toLowerCase()) continue;
      if (!emailAddresses[e].metadata.primary || !emailAddresses[e].metadata.verified) continue;
      email = emailAddresses[e].value;
      break;
    }
    if (!email) return res.status(403).json({ 'message': 'You must authenticate with your UF-provided account ending with @ufl.edu.' });

    // Fetch name
    firstName = profile.data.names[0].givenName;
    lastName = profile.data.names[0].familyName;
  } catch (error) {
    return res.status(400).json({ 'message': 'Unable to fetch user info with Google access_token provided.' });
  }

  // Check if user already exists
  let foundUser = await User.findOne({ orgEmail: email }).exec();
  // If not, create user
  if (!foundUser) {
    try {
      const result = await User.create({
        "orgEmail": email,
        "firstName": firstName,
        "lastName": lastName
      });
      foundUser = await User.findOne({ orgEmail: email }).exec();
    } catch (err) {
      res.status(500).json({ 'message': 'Failed to establish user profile.' });
    }
  };

  // Create JWTs
  const accessToken = jwt.sign(
    {
      "userInfo": {
        "id": foundUser.id
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    // Format: https://github.com/vercel/ms
    { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }
  );
  const refreshToken = jwt.sign(
    { "id": foundUser.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_LIFESPAN }
  );
  // Save refreshToken with current user
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();

  // Send refresh token as httpOnly cookie
  res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
  // Send access token
  res.json({ email, firstName, lastName, accessToken });
};


module.exports = { handleUFGoogleLogin };