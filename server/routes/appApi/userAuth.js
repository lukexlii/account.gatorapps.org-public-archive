const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const logoutController = require('../../controllers/logoutController');

router.post('/signIn/ufgoogle', authController.handleUFGoogleLogin);

module.exports = router;