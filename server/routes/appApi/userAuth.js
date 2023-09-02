const express = require('express');
const router = express.Router();
const requireUserAuth = require('../../middleware/requireUserAuth');
const userSignInController = require('../../controllers/userSignInController');
const userInfoController = require('../../controllers/userAuthInfoController');

router.post('/signIn/ufgoogle', userSignInController.handleUFGoogleSignIn);
router.post('/signIn/*', userSignInController.establishSession);

router.get('/getUserAuthInfo', requireUserAuth, userInfoController.getUserAuthInfo);

module.exports = router;