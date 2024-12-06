const rateLimit = require('express-rate-limit');

// Create the rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

module.exports = limiter;
