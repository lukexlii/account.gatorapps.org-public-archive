const express = require('express');
const router = express.Router();
const userProfileController = require('../../controllers/userProfileController');

router.get('/getProfileSection', userProfileController.getProfileSection);
router.post('/updateProfile', userProfileController.updateProfile);

module.exports = router;