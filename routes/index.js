const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db/queries');

// Require controller modules
const index_controller = require('../controllers/indexController');

// Passport configuration and verify callback. Checks username and password against database users
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const temp = await db.findUser(username);
      const user = temp[0];

      if(!user) {
        return done(null, false, { message: 'Incorrect username'});
      }

      const passwordsMatch = await bcrypt.compare(
        password, 
        user.password
      );

      if (passwordsMatch) {
        return done(null, user); 
      } else {
        return done(null, false, { message: 'Incorrect password' });
      } 
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    username: user.username,
    member: user.member,
    is_admin: user.is_admin
  });
});

passport.deserializeUser(async (user, done) => {
  try {
    const temp = await db.findUser(user.username);
    console.log(temp[0]);
    done(null, {
      id: temp[0].id,
      username: temp[0].username,
      member: temp[0].member,
      is_admin: temp[0].is_admin
    });
  } catch (err) {
    done(err);
  };
});

function validationCheck(req, res, next) {
  if (!req.user) {
    const err = new Error('Unauthorized Access');
    err.status = 401;
    return next(err);
  } else {
    next();
  }
}

// GET request for index page
router.get('/', index_controller.index);

// GET request for login page
router.get('/login', index_controller.login_get);

// POST request for login page
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true,
  }),
);

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
router.get('/join', validationCheck, index_controller.join_club_get);

// POST request for join club
router.post('/join', validationCheck, index_controller.join_club_post);

// GET request for new message form
router.get('/new_message', validationCheck, index_controller.new_message_get);

// POST request for new message form
router.post('/new_message', validationCheck, index_controller.new_message_post);

// GET request for message delete
router.get('/message/:id', validationCheck, index_controller.delete_message_get);

// POST reqest for message delete
router.post('/message/:id', validationCheck, index_controller.delete_message_post);

// GET request for user dashboard
router.get('/user/:id', validationCheck, index_controller.user_dashboard_get);

// POST request for user dashboard
router.post('/user/:id', validationCheck, index_controller.user_dashboard_post);

module.exports = router;
