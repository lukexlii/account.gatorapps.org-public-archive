const express = require('express');
const router = express.Router();
const cors = require('cors');
const requireUserAuth = require('../../middleware/requireUserAuth');
const userInfoController = require('../../controllers/userInfoController');
const signOutController = require('../../controllers/signOutController');
const { GA_GLOBAL_ORIGINS } = require('../../config/corsOptions');

const corsOptions = {
  origin: (origin, callback) => {
    // Add || !origin to allow REST or server-to-server requests
    // Recommend asynchronous for advanced access control and external apis
    if (GA_GLOBAL_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Blocked by CORS. Origin: ' + origin));
    }
  },
  optionsSuccessStatus: 200
};

router.use(cors(corsOptions));
router.get('/getUserInfo', requireUserAuth, userInfoController.getUserInfo);

router.post('/signOut', signOutController.handleSignOut);

module.exports = router;