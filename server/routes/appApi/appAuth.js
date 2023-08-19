const express = require('express');
const router = express.Router();
const { validateRefreshToken } = require('../../controllers/accessTokenController');
const appAuthController = require('../../controllers/appAuthController');

router.post('/validateRequest', appAuthController.validateRequest);
router.post('/validateRequest', validateRefreshToken);
router.post('/validateRequest', appAuthController.initiateAuth);

module.exports = router;