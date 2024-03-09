require('dotenv').config();

const asyncHandller = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Required models
const User = require('../models/userModel');


<<<<<<< HEAD
// Display login page
exports.login = asyncHandller(async (req, res, next) => {
  res.render('login', { title: 'Members Only'});
=======
// Display index page
exports.index = asyncHandller(async (req, res, next) => {
  res.render('index', { 
    title: 'Members Only',
    user: req.user,
  });
});

// Display login page
exports.login_get = asyncHandller(async (req, res, next) => {
  res.render('login', {
    title: 'Login',
  });
>>>>>>> b36c853bc0b85cd92369091414b22c684c96d75d
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
    .custom(async value => {
      const user = await User.findOne({ username: new RegExp('^'+value+'$', "i")}).exec();
      if (user) {
        throw new Error('Username already in use');
        }
      })
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 9, max: 100 })
    .withMessage('Passwords must contain a minimum of 9 characters')
    .escape(),
  body('confirm_password')
    .trim()
    .isLength({ min: 9, max: 100 })
    .withMessage('Passwords must contain a minimum of 9 characters')
    .custom((value, { req }) => {
      return value === req.body.password;
      })
    .withMessage('Passwords do not match')
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
        confirm_password: req.body.confirm_password,
        errors: errors.array(),
      });
      return;
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if(err){
          return next(err);
        } else {
          user.password = hashedPassword;
          await user.save();
        }
      });      
      res.redirect('/login');
    }
  }),
];

exports.join_club_get = asyncHandller(async (req, res, next) => {
  res.render('join_club', {
    title: 'Join the Club',
  }); 
});

exports.join_club_post = [
  body('private_access')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Access denied!')
    .matches(`${process.env.ACCESS_CODE}`)
    .withMessage('Access denied!')
    .escape(),

  asyncHandller(async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('join_club', {
        title: 'Join the Club',
        private_access: req.body.private_access,
        errors: errors.array(),
      })    
    } else {
      //////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////
      // Add code to update member status with private access //
      //////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////
      res.render('/');
    }
    
  })
];