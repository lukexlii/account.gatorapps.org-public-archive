const APP_ORIGINS = [
  'https://account.gatorapps.org',
  'https://account.dev.gatorapps.org',
  'http://localhost:3000'
];

const APP_CORS_OPTIONS = {
  origin: (origin, callback) => {
    // Add || !origin to allow REST or server-to-server requests
    // Recommend asynchronous for advanced access control and external apis
    if (APP_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Blocked by CORS. Origin: ' + origin));
    }
  },
  optionsSuccessStatus: 200
};


const GA_GLOBAL_ORIGINS = [
  'https://account.gatorapps.org',
  'https://account.dev.gatorapps.org',
  'http://localhost:3000'
];

module.exports = { APP_CORS_OPTIONS, GA_GLOBAL_ORIGINS };