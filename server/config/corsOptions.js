const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    // Add || !origin to allow REST or server-to-server requests
    // Recommend asynchronous for advanced access control and external apis
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Blocked by CORS. Origin: ' + origin));
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions;