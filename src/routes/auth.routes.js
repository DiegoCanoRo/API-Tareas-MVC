const express = require('express');
const passport = require('passport');
const googleAuthController = require('../controllers/googleAuth.controller');
const router = express.Router();

// Ruta para iniciar el login con Google
router.get('/google/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/verify', (req, res) => {
  // aquí se verificas si la sesión/cookies son válidas
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

// Callback de Google OAuth
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google/login',
    session: false,
  }),
  googleAuthController.googleCallback
);

module.exports = router;