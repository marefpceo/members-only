const asyncHandller = require('express-async-handler');

// Display user home page
exports.user_homepage = asyncHandller(async (req, res, next) => {
  res.render('user_homepage', {
    title: 'Welcome User',
  });
});

// Display