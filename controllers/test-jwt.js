const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// This file is for testing authentication and protected routes.

// GET /test-jwt/protected
// A simple protected route to test if a token is valid.
router.get('/protected', isAuthenticated, (req, res) => {
  // If the request reaches this point, the isAuthenticated middleware has
  // successfully verified the token. We can send back a success message
  // and the user data that the middleware attached to the request.
  res.json({ message: 'Token is valid.', user: req.user });
});

module.exports = router;
