const express = require('express');
const router = express.Router();
const { initiateRequest } = require('../../controllers/appAuthController');

router.get('/initiateAuth', initiateRequest);

module.exports = router;