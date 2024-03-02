const asyncHandller = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Required models
const User = require('../models/userModel');


// Display index page
exports.index = asyncHandller(async (req, res, next) => {
  res.render('index', { title: 'Members Only'});
});

// Displays user sign up form on GET
exports.user_sign_up_get = asyncHandller(async (req, res, next) => {
  res.render('sign-up', {
     title: 'Sign Up',
  });
});

// Handle sign up POST
exports.user_sign_up_post = [
  body('first_name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Must contain a minimum of 3 characters')
    .escape(),
  body('last_name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Must contain a minimum of 3 characters')
    .escape(),
  body('username')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Must contain a minimum of 3 characters')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 9, max: 100 })
    .withMessage('Passwords must contain a minimum of 9 characters')
    .escape(),

  asyncHandller(async (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
      isAdmin: req.body.isAdmin === 'on' ? true : false,
    });

    if(!errors.isEmpty()) {
      res.render('sign-up', {
        title: 'Sign Up',
        user: user,
        password: req.body.password,
        errors: errors.array(),
      });
      return;
    } else {
      await user.save();
      res.redirect('/');
    }

    
  }),
];