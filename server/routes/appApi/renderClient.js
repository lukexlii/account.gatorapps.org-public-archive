const express = require('express');
const router = express.Router();
const renderClientController = require('../../controllers/renderClientController');

router.get('/getAppAlert', renderClientController.getAppAlert);
router.get('/getLeftMenuItems', renderClientController.getLeftMenuItems);

module.exports = router;