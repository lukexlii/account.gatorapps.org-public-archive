const express = require('express');
const router = express.Router();
const { validateRequest } = require('../../controllers/appAuthController');

router.post('/validateRequest', validateRequest);

module.exports = router;