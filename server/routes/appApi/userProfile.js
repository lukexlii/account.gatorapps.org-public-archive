const express = require('express');
const router = express.Router();
const requireUserAuth = require('../../middleware/requireUserAuth');
const userProfileController = require('../../controllers/userProfileController');

router.get('/getProfileSection', requireUserAuth, userProfileController.getProfileSection);
router.post('/updateProfile', requireUserAuth, userProfileController.updateProfile);

module.exports = router;