const express = require('express');
const router = express.Router();
const requireUserAuth = require('../../middleware/requireUserAuth');
const userSignInController = require('../../controllers/userSignInController');
const appAuthController = require('../../controllers/appAuthController');
const userInfoController = require('../../controllers/userAuthInfoController');

router.post('/signIn/ufgoogle', userSignInController.handleUFGoogleSignIn);
router.post('/signIn/*', userSignInController.establishSession);
router.get('/signIn/validateRequest', appAuthController.validateContinueTo);
router.get('/signIn/validateRequest', appAuthController.initiateAuth);

router.get('/getUserAuthInfo', requireUserAuth, userInfoController.getUserAuthInfo);

module.exports = router;