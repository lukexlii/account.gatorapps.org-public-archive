const express = require('express');
const router = express.Router();
const requireUserAuth = require('../../middleware/requireUserAuth');
const userSignInController = require('../../controllers/userSignInController');
const appAuthController = require('../../controllers/appAuthController');
const userInfoController = require('../../controllers/userAuthInfoController');

router.get('/signIn/validateRequest', appAuthController.validateContinueTo);
router.get('/signIn/validateRequest', appAuthController.initiateAuth);

router.post('/signIn/initialize/*', appAuthController.validateContinueTo);
router.post('/signIn/initialize/*', userSignInController.initializeSignIn);
router.post('/signIn/initialize/ufgoogle', userSignInController.getSignInUrlUfgoogle);

router.post('/signIn/callback/*', userSignInController.validateCallback);
router.post('/signIn/callback/ufgoogle', userSignInController.handleCallbackUfgoogle);
router.post('/signIn/callback/*', userSignInController.establishSession);

router.get('/getUserAuthInfo', requireUserAuth, userInfoController.getUserAuthInfo);

module.exports = router;