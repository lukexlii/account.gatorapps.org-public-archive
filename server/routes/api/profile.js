const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profileController');

router.route('/name')
  .get(profileController.getName);

module.exports = router;