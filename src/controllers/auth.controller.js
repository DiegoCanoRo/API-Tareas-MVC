'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// generar un token CSRF aleatorio
const generarTokenCSRF = () => crypto.randomBytes(32).toString('hex');

const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE, 10) || 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === 'production';

// Opciones de cookie para JWT
const buildCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
  maxAge: COOKIE_MAX_AGE,
});

// controlador para manejar el login tradicional con email (sin Google)
const login = (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'El email es requerido' });
    }

    const csrfToken = generarTokenCSRF();

    // crear el payload para el token JWT con la información del usuario
    const payload = {
      id: 1,
      email: email.trim(),
      apiKey: process.env.API_KEY,
      csrfToken,
    };

    // generar el token JWT con el payload y la clave secreta
    const tokenJWT = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
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
      mensaje: 'Login exitoso',
      usuario: {
        id: payload.id,
        email: payload.email,
      },
      csrfToken,
    });
    // si no se pudo procesar el login, responder con un error
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el proceso de login' });
  }
};

// controlador para manejar el logout
const logout = (req, res) => {
  try {
    // limpiar las cookies de JWT y CSRF para cerrar la sesión
    res.clearCookie('jwt_token', buildCookieOptions());
    res.clearCookie('csrf_token', {
      secure: isProduction,
      sameSite: 'strict',
    });

    res.json({ mensaje: 'Logout exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error en el proceso de logout' });
  }
};

// controlador para verificar si el usuario está autenticado
const verificarAuth = (req, res) => {
  try {
    // si llegamos aquí, el middleware de verificación de token ya ha validado el JWT y el CSRF
    res.json({
      autenticado: true,
      usuario: req.usuario,
    });
  } catch (error) {
    console.error('Error al verificar auth:', error);
    res.status(500).json({ error: 'Error al verificar autenticación' });
  }
};

module.exports = {
  login,
  logout,
  verificarAuth,
  generarTokenCSRF,
};