const initializeReqProperties = (req, res, next) => {
  // Global client session
  delete req?.session;
  delete req?.sessionID;

  // Global client auth, stores authed user or auth error
  delete req?.userAuth;

  // "account" app: User sign in flow
  // continueTo = {
  //                app: Validated app that is requesting the sign in based on continueTo url,
  //                url: Validated url address to continue to after user signs in
  //              }
  delete req.account_singIn_continueTo;
  next();
}

module.exports = initializeReqProperties