const express = require('express');
const router = express.Router();

// Require controller modules
const index_controller = require('../controllers/indexController');

// GET index page
router.get('/', index_controller.index);

// GET request for create new user
router.get('/sign-up', index_controller.user_sign_up_get);

// POST request for create new user
router.post('/sign-up', index_controller.user_sign_up_post);


module.exports = router;
