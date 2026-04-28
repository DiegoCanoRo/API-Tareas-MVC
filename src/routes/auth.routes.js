const express = require('express');
const passport = require('passport');
const router = express.Router();

// Ruta para iniciar el login (Redirige a Google)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de retorno 
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.json({ success: true, message: 'Autenticado correctamente', user: req.user });
  }
);

module.exports = router;