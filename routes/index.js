const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Require controller modules
const index_controller = require('../controllers/indexController');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if(!user) {
        return done(null, false, { error: 'Incorrect username'});
      }

      const passwordsMatch = await bcrypt.compare(
        password, 
        user.password
      );

      if (passwordsMatch) {
        return done(null, user); 
      } else {
        return done(null, false, { error: 'Incorrect password' });
      } 
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  };
});

// GET request for index page
router.get('/', index_controller.index);

// GET request for login page
router.get('/login', index_controller.login_get);

// POST request for login page
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

// POST request for logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// GET request for create new user
router.get('/sign_up', index_controller.user_sign_up_get);

// POST request for create new user
router.post('/sign_up', index_controller.user_sign_up_post);

// GET request for join club
router.get('/join', index_controller.join_club_get);

// POST request for join club
router.post('/join', index_controller.join_club_post);

// GET request for new message form
router.get('/new_message', index_controller.new_message_get);

// POST request for new message form
router.post('/new_message', index_controller.new_message_post);

module.exports = router;
