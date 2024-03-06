const express = require('express');
const router = express.Router();

// Require controller modules
const user_controller = require('../controllers/userController');

// GET user homepage
router.get('/homepage', user_controller.user_homepage);

module.exports = router;
