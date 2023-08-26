const express = require('express');
const router = express.Router();
const requireUserAuth = require('../../middleware/requireUserAuth');
const userInfoController = require('../../controllers/userInfoController');
const signOutController = require('../../controllers/signOutController');

router.get('/getUserInfo', requireUserAuth, userInfoController.getUserInfo);
router.post('/signOut', signOutController.handleSignOut);

module.exports = router