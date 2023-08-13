// Maximum allowed number of simultaneous sessions on web app
const MAX_WEB_SESSIONS = 2;

// Default userInfo attributes included in signed refreshToken and userInfo JSON with getAccessToken response
// Will not return a scope if the requesting app does not have permission to access the attribute
const DEFAULT_ACCESSTOKEN_SCOPE = [];
const DEFAULT_ACCESSTOKEN_RESPONSE_SCOPE = [];

module.exports = { MAX_WEB_SESSIONS };