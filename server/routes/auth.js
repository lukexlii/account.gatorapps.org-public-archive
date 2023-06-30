const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/ufgoogle', authController.handleUFGoogleLogin);

module.exports = router;