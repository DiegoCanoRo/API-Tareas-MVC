'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Usuario } = require('../../models');

//función para generar un token CSRF
const generarTokenCSRF = () => crypto.randomBytes(32).toString('hex');

//configuración de duración de cookies y entorno
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE, 10) || 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === 'production';

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: true, // Siempre true para HTTPS
  sameSite: 'none', // Necesario para cross-site
  maxAge: COOKIE_MAX_AGE,
});

const buildCSRFCookieOptions = () => ({
  secure: true, // Siempre true para HTTPS
  sameSite: 'none', // Necesario para cross-site
  maxAge: COOKIE_MAX_AGE,
});

// controlador para manejar el callback de Google OAuth
const googleCallback = async (req, res) => {
  try {
    const googleUser = req.user;
    if (!googleUser) {
      return res.status(400).json({ success: false, message: 'No se recibió el usuario de Google' });
    }

    const usuario = await Usuario.findByPk(googleUser.id);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario de Google no encontrado en la base de datos' });
    }

    const csrfToken = generarTokenCSRF();
    const payload = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      proveedor: usuario.proveedor,
      apiKey: process.env.API_KEY,
      csrfToken,
    };
    const tokenJWT = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.cookie('jwt_token', tokenJWT, buildCookieOptions());
    res.cookie('csrf_token', csrfToken, buildCSRFCookieOptions());

    
    const frontendUrl = process.env.NODE_ENV === 'production' 
  ? 'https://localhost:3001' 
  : 'http://localhost:5173';  

res.redirect(`${frontendUrl}/auth/google/callback`);
    
  } catch (error) {
    console.error('Error en googleCallback:', error);
    res.status(500).json({ success: false, message: 'Error procesando Google OAuth' });
  }
};
module.exports = {
  googleCallback,
};
