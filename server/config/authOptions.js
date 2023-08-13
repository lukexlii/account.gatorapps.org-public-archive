// Maximum allowed number of simultaneous sessions on web app
const MAX_WEB_SESSIONS = 2;

// Default userInfo attributes included in signed refreshToken and userInfo JSON with getAccessToken response
// Will not return a scope if the requesting app does not have permission to access the attribute
// opid is always return in accessToken
const DEFAULT_ACCESSTOKEN_SCOPE = ['opid'];
const DEFAULT_ACCESSTOKEN_RESPONSE_SCOPE = ['roles', 'firstName', 'lastName', 'primaryEmail'];

module.exports = { MAX_WEB_SESSIONS, DEFAULT_ACCESSTOKEN_SCOPE, DEFAULT_ACCESSTOKEN_RESPONSE_SCOPE };