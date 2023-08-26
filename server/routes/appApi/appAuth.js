const express = require('express');
const router = express.Router();
const appAuthController = require('../../controllers/appAuthController');

router.post('/validateRequest', appAuthController.validateRequest);
router.post('/validateRequest', appAuthController.initiateAuth);

module.exports = router;