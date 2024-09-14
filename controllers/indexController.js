require('dotenv').config();

const asyncHandller = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/queries');

// Helper function to convert escaped characters before displaying client side
const { convertEscape } = require('../public/javascripts/helpers');

// Display index page
exports.index = asyncHandller(async (req, res, next) => {
  const allMessages = await db.getAllMessages();
  res.render('index', { 
    title: 'Members Only',
    user: req.user,
    messages: allMessages,
    convertEscape: convertEscape,
  });
});

// Display login page
exports.login_get = asyncHandller(async (req, res, next) => {
  res.render('login', {
    title: 'Login',
    user: req.user,
    errors: req.session.messages || [],
  });
});

// Displays user sign up form on GET
exports.user_sign_up_get = asyncHandller(async (req, res, next) => {
  res.render('sign_up', {
     title: 'Sign Up',
     user: req.user,
  });
});

// Handle sign up POST
exports.user_sign_up_post = [
  body('first_name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('First Name must contain a minimum of 3 characters')
    .escape(),
  body('last_name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Last Name must contain a minimum of 3 characters')
    .escape(),
  body('username')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must contain a minimum of 3 characters')
    .custom(async value => {
      const user = await db.findUser(value);
      if (user.length > 0) {
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
  body('isAdmin')
    .trim()
    .custom((value) => {
      if (value === '' || value === `${process.env.ADMIN_ACCESS}`) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage('Incorrect Admin Access Code')
    .escape(),    

  asyncHandller(async (req, res, next) => {
    const errors = validationResult(req);
    const user = {
      id: '',
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
      member: req.body.isAdmin === `${process.env.ADMIN_ACCESS}` ? true : false,
      isAdmin: req.body.isAdmin === `${process.env.ADMIN_ACCESS}` ? true : false,
    };

    if(!errors.isEmpty()) {
      res.render('sign_up', {
        title: 'Sign Up',
        user: user,
        confirm_password: user === 'undefined' ? '' : req.body.confirm_password,
        errors: errors.array(),
      });
      return;
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if(err){
          return next(err);
        } else {
          user.password = hashedPassword;
          const newUserId = await db.createNewUser(user.first_name, user.last_name, user.username, user.password, 
            user.member, user.isAdmin);
          user.id = newUserId[0].id;
        }
      });      
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    };
  }),
];


// Displays join club page on GET
exports.join_club_get = asyncHandller(async (req, res, next) => {
  res.render('join_club', {
    title: 'Join the Club',
    user: req.user,
  }); 
});

// Handle Join club POST
exports.join_club_post = [
  body('private_access')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Passcode must be at least 3 characters in length')
    .matches(`${process.env.ACCESS_CODE}`)
    .withMessage('Invalid Access Code!!')
    .escape(),

  asyncHandller(async (req, res, next) => {
    const errors = validationResult(req);
    const allMessages = await db.getAllMessages();

    if(!errors.isEmpty()) {
      res.render('join_club', {
        title: 'Join the Club',
        private_access: req.body.private_access,
        errors: errors.array(),
        user: req.user,
      })    
    } else {
      await db.grantClubAccess(req.user.id);
      const updatedUser = await db.findUser(req.user.username);

      res.render('index', {
        title: 'Members Only',
        user: updatedUser[0],
        messages: allMessages,
        convertEscape: convertEscape
      });
    }
  })
];

// GET and display create message form
exports.new_message_get = asyncHandller(async (req, res, next) => {  
  res.render('new_message_form', {
    title: 'New Message',
    user: req.user,
  });
});

// Handle create message POST
exports.new_message_post = [
  body('message_title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters long')
    .escape(),
  body('message_text')
    .trim()
    .isLength({ min: 2, max: 250 })
    .withMessage('Message must be between 2 and 250 characters long')
    .escape(),

  asyncHandller(async (req, res, next) => {
    const errors = validationResult(req);
    const message = {
      author: req.user.id,
      message_title: req.body.message_title,
      message_text: req.body.message_text,
    };

    if(!errors.isEmpty()) {
      res.render('new_message_form', {
        title: 'New Message',
        message: message,
        errors: errors.array(),
      });
      return;
    } else {
      await db.createNewMessage(message.message_title, message.message_text, message.author);
      res.redirect('/');
    }
  }),
];

// GET message to delete
// Action can only be performed by Admin user
exports.delete_message_get = asyncHandller(async (req, res, next) => {
  const message = await db.getSelectedMessage(req.params.id);
    if (req.user.isAdmin !== true) {
      const err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    } else {
      res.render('message', {
        title: 'Message Info',
        user: req.user,
        message: message[0],
        convertEscape: convertEscape,
      });
    }
});

// POST Handle message delete
exports.delete_message_post = asyncHandller(async (req, res, next) => {
  await db.deleteSelectedMessage(req.params.id);
  res.redirect('/');
});

// GET user dashboard
exports.user_dashboard_get = asyncHandller(async (req, res, next) => {
  const user_messages = await db.getUserMessages(req.user.id);
  const user_list = await db.getAllUsers();
  const message_count = await db.getUserMessageCount(req.user.id);
  const current_user = await db.findUser(req.user.username);

  
  res.render('user_dashboard', {
    title: `${req.user.username}'s Dashboard`,
    user: current_user[0],
    messages: user_messages,
    message_count: message_count[0].count,
    user_list: user_list,
    convertEscape: convertEscape,
  });
})

// POST user dashboard
exports.user_dashboard_post = asyncHandller(async (req, res, next) => {
  if (req.body.user_list === '') {
    return;
  }

  const current_user = await db.findUser(req.user.username);
  const user_messages = await db.getUserMessages(req.user.id);
  const user_list = await db.getAllUsers();
  const message_count = await db.getUserMessageCount(req.user.id);
  const selected_user = await db.findUser(req.body.user_list);
  const user_message_count = await db.getUserMessageCount(selected_user[0].id); 

  res.render('user_dashboard', {
    title: `${req.user.username}'s Dashboard`,
    user: current_user[0],
    messages: user_messages,
    user_list: user_list,
    selected_user: selected_user[0],
    message_count: message_count[0].count,
    user_message_count: user_message_count[0].count,
    convertEscape: convertEscape,
  });
})
