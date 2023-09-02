const express = require('express');
const router = express.Router();
const requireUserAuth = require('../../middleware/requireUserAuth');
const userSignOutController = require('../../controllers/userSignOutController');

router.post('/signOut', userSignOutController.handleSignOut);

module.exports = router