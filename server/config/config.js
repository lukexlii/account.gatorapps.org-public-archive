const FRONTEND_HOST = 'http://localhost:3000';

// Global session
// Session id cookie name
const GLOBAL_SESSION_COOKIE_NAME = 'GATORAPPS_GLOBAL_SID';
// Session lifespan in milliseconds
const GLOBAL_SESSION_LIFESPAN = 1000 * 60 * 60 * 12; // 12 hours
// Session token (stored with user session in DB to validate session integrity) lifespan
//// For sign in status. Can have sign in status expire before global session expire. Currently same as session lifespan
const GLOBAL_USER_AUTH_TOKEN_LIFESPAN = '12h'; // 12 hours

// /globalApi/account/userAuth/getUserInfo
// Default userInfo attributes returned for getUserInfo call
// Will not return an attribute if the requesting app does not have permission to access it
const DEFAULT_GETUSERINFO_SCOPE = ['roles', 'nickName', 'primaryEmail'];

module.exports = { FRONTEND_HOST, GLOBAL_SESSION_COOKIE_NAME, GLOBAL_SESSION_LIFESPAN, GLOBAL_USER_AUTH_TOKEN_LIFESPAN, DEFAULT_GETUSERINFO_SCOPE };