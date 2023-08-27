const express = require('express');
const router = express.Router();
const clientRenderController = require('../../controllers/clientRenderController');

router.get('/getLeftMenuItems', clientRenderController.getLeftMenuItems);

module.exports = router;