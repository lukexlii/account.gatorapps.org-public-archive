const express = require('express');
const router = express.Router();
const signInController = require('../../controllers/signInController');
const signOutController = require('../../controllers/signOutController');

router.post('/signIn/ufgoogle', signInController.handleUFGoogleSignIn);

module.exports = router;