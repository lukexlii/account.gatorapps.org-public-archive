const express = require('express');
const router = express.Router();
const cors = require('cors');
const refreshTokenController = require('../../controllers/accessTokenController');

const allowedOrigins = ['http://localhost:3000'];
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

router.use(cors(corsOptions));
router.get('/getAccessToken', refreshTokenController.handleRefreshToken);

module.exports = router;