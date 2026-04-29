const express = require('express');
const passport = require('passport');
const googleAuthController = require('../controllers/googleAuth.controller');
const router = express.Router();

// Ruta para iniciar el login con Google
router.get('/google/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

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