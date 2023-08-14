// Maximum allowed number of simultaneous sessions on web app
const MAX_WEB_SESSIONS = 2;

// refreshToken
const REFRESH_TOKEN_LIFESPAN = '1d';
const REFRESH_TOKEN_COOKIE_NAME = 'GATORAPPS_RT';

// Default userInfo attributes included in signed refreshToken and userInfo JSON with getAccessToken response
// Will not return a scope if the requesting app does not have permission to access the attribute
// opid is always return in accessToken
const ACCESS_TOKEN_LIFESPAN = '10s';
const DEFAULT_ACCESSTOKEN_SCOPE = ['opid'];
const DEFAULT_ACCESSTOKEN_RESPONSE_SCOPE = ['roles', 'firstName', 'lastName', 'primaryEmail'];

// appAuth
const APP_AUTH_STATE_LIFESPAN = '5m';

module.exports = { MAX_WEB_SESSIONS, REFRESH_TOKEN_LIFESPAN, REFRESH_TOKEN_COOKIE_NAME, ACCESS_TOKEN_LIFESPAN, DEFAULT_ACCESSTOKEN_SCOPE, DEFAULT_ACCESSTOKEN_RESPONSE_SCOPE, APP_AUTH_STATE_LIFESPAN };