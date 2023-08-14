const { GA_GLOBAL_ORIGINS } = require('../config/corsOptions');

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (GA_GLOBAL_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
}

module.exports = credentials;