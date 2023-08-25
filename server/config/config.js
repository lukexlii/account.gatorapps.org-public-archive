const FRONTEND_HOST = 'http://localhost:3000';

// Global session
// Session id cookie name
const GLOBAL_SESSION_COOKIE_NAME = 'GATORAPPS_GLOBAL_SID';
// Session lifespan in milliseconds
const GLOBAL_SESSION_LIFESPAN = 1000 * 60 * 60 * 12; // 12 hours
// Session token (stored with user session in DB to validate session integrity) lifespan
//// For sign in status. Can have sign in status expire before global session expire. Currently same as session lifespan
const GLOBAL_USER_AUTH_TOKEN_LIFESPAN = '12h'; // 12 hours

module.exports = { GLOBAL_SESSION_COOKIE_NAME, GLOBAL_SESSION_LIFESPAN, GLOBAL_USER_SESSION_TOKEN_LIFESPAN, FRONTEND_HOST };