const express = require('express');
const router = express.Router();

// Require controller modules
const index_controller = require('../controllers/indexController');

// Redirect index to login
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

// GET login page
router.get('/login', index_controller.login);

// GET request for create new user
router.get('/sign-up', index_controller.user_sign_up_get);

// POST request for create new user
router.post('/sign-up', index_controller.user_sign_up_post);


module.exports = router;
