const validateUserAuth = (req, res, next) => {
  // Check userAuth info exists in session
  const userAuth = req?.session?.userAuth;
  if (!userAuth) {
    req.userAuth = {
      error: { status: 403, errCode: '-', errMsg: 'Session missing userAuth info' }
    };
    return next();
  };

  // Check opid and userAuthToken exists in userAuth
  const opid = userAuth?.opid;
  const userAuthToken = userAuth?.token;
  if (!opid || !userAuthToken) {
    req.userAuth = {
      error: { status: 403, errCode: '-', errMsg: 'Incomplete userAuth info' }
    };
    return next();
  };

  try {
    jwt.verify(
      userAuthToken,
      process.env.USR_AUTH_TOKEN_PUBLIC_KEY,
      { algorithm: 'ES256' },
      async (err, decoded) => {
        // Validate userAuthToken
        if (err || !decoded.opid || !decoded.sessionID) {
          req.userAuth = {
            error: { status: 403, errCode: '-', errMsg: 'Invalid userAuthToken' }
          };
          return next();
        };

        // Check sessionID in userAuthToken matches sessionID of requesting client
        if (decoded.sessionID !== req.sessionID) {
          req.userAuth = {
            error: { status: 403, errCode: '-', errMsg: 'Token and client sessionID mismatch' }
          };
          return next();
        };

        // Find user with opid
        const foundUser = await User.findOne({ opid: decoded.opid }).exec();
        if (!foundUser) {
          req.userAuth = {
            error: { status: 403, errCode: '-', errMsg: 'Invalid user opid in userAuthToken' }
          };
          return next();
        };

        // Check the session is actively associated with foundUser
        const foundSession = foundUser.sessions.find(session => session.sessionID === decoded.sessionID);
        if (!foundSession) {
          req.userAuth = {
            error: { status: 403, errCode: '-', errMsg: 'Inactive user auth session' }
          };
          return next();
        };

        // Store foundUser is req.userAuth and continue
        req.userAuth = {
          authedUser: foundUser,
          error: { errCode: '0' }
        };
        return next();
      }
    );
  } catch (err) {
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to validate user auth session' });
  }
  next();
};

module.exports = validateUserAuth