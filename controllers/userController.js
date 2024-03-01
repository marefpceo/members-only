const asyncHandller = require('express-async-handler');

// Display user home page
exports.user = asyncHandller(async (req, res, next) => {
  res.send('GET USER HOME PAGE: NOT COMPLETE');
});