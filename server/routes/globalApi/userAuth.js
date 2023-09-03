const express = require('express');
const router = express.Router();
const { validateContinueTo, getSignInUrl } = require('../../controllers/appAuthController');
const userSignOutController = require('../../controllers/userSignOutController');

router.get('/getSignInUrl', validateContinueTo);
router.get('/getSignInUrl', getSignInUrl);

router.post('/signOut', userSignOutController.handleSignOut);

module.exports = router