const asyncHandller = require('express-async-handler');

// Display index page
exports.index = asyncHandller(async (req, res, next) => {
  res.render('index', { title: 'Members Only'});
});

// Displays user sign up form on GET
exports.user_sign_up_get = asyncHandller(async (req, res, next) => {
  res.render('sign-up', {
     title: 'Sign Up page',
  });
});
