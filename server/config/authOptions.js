// Maximum allowed number of simultaneous sessions on web app
const MAX_WEB_SESSIONS = 2;
// Session id cookie name
const SESSION_COOKIE_NAME = 'GATORAPPS_SID';
// Session expiration in milliseconds
const SESSION_LIFESPAN = 10000;
// 1000 * 60 * 60 * 24 * 1; // 1 day

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

module.exports = { MAX_WEB_SESSIONS, SESSION_COOKIE_NAME, SESSION_LIFESPAN, REFRESH_TOKEN_LIFESPAN, REFRESH_TOKEN_COOKIE_NAME, ACCESS_TOKEN_LIFESPAN, DEFAULT_ACCESSTOKEN_SCOPE, DEFAULT_ACCESSTOKEN_RESPONSE_SCOPE, APP_AUTH_STATE_LIFESPAN };