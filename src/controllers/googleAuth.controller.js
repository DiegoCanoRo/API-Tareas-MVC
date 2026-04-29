'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Usuario } = require('../../models');

//función para generar un token CSRF
const generarTokenCSRF = () => crypto.randomBytes(32).toString('hex');

//configuración de duración de cookies y entorno
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE, 10) || 24 * 60 * 60 * 1000;
// determinar si estamos en producción para configurar las cookies de manera segura
const isProduction = process.env.NODE_ENV === 'production';

// Opciones de cookie para JWT
const buildCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
  maxAge: COOKIE_MAX_AGE,
});

// controlador para manejar el callback de Google OAuth
const googleCallback = async (req, res) => {
  // El usuario autenticado por Google se encuentra en req.user gracias a Passport
  try {
    const googleUser = req.user;
    if (!googleUser) {
      return res.status(400).json({ success: false, message: 'No se recibió el usuario de Google' });
    }

    // buscar el usuario en la base de datos usando su email
    const usuario = await Usuario.findByPk(googleUser.id);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario de Google no encontrado en la base de datos' });
    }

    const csrfToken = generarTokenCSRF();
    // crear el payload para el token JWT con la información del usuario autenticado
    const payload = {
      id: usuario.id,
      email: usuario.email,
      proveedor: usuario.proveedor,
      csrfToken,
    };

    // generar el token JWT con el payload y la clave secreta
    const tokenJWT = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    // configurar las cookies para el token JWT y el token CSRF
    res.cookie('jwt_token', tokenJWT, buildCookieOptions());
    res.cookie('csrf_token', csrfToken, {
      secure: isProduction,
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
    });

    // responder con la información del usuario autenticado y un mensaje de exito
    res.json({
      success: true,
      message: 'Autenticación con Google exitosa',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        proveedor: usuario.proveedor,
        avatar: usuario.avatar,
      },
    });
    // si no se pudo procesar la autenticación, responder con un error
  } catch (error) {
    console.error('Error en googleCallback:', error);
    res.status(500).json({ success: false, message: 'Error procesando Google OAuth' });
  }
};

module.exports = {
  googleCallback,
};
