const express = require('express');
const router = express.Router();
const signInController = require('../../controllers/signInController');

router.post('/signIn/ufgoogle', signInController.handleUFGoogleSignIn);
router.post('/signIn/*', signInController.establishSession);

module.exports = router;