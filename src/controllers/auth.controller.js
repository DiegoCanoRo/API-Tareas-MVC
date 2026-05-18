'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Usuario } = require('../../models'); 

const generarTokenCSRF = () => crypto.randomBytes(32).toString('hex');

const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE, 10) || 24 * 60 * 60 * 1000;

const buildCookieOptions = () => ({
  httpOnly: false, 
  secure: true,
  sameSite: 'none',
  maxAge: COOKIE_MAX_AGE,
});

const buildCSRFCookieOptions = () => ({
  secure: true,
  sameSite: 'none',
  maxAge: COOKIE_MAX_AGE,
});

const login = async (req, res) => { 
  try {
    // extraemos email y password del cuerpo de la petición
    const { email, password } = req.body;

    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'El email es requerido' });
    }

    if (!password) {
      return res.status(400).json({ error: 'La contraseña es requerida' });
    }

    // BUSCAR EL USUARIO EN LA BASE DE DATOS
    const usuarioEncontrado = await Usuario.findOne({ 
      where: { email: email.trim() } 
    });

    if (!usuarioEncontrado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // VERIFICACIÓN DE CONTRASEÑA
    // Primero revisamos si el usuario tiene una contraseña (por si es de Google)
    if (!usuarioEncontrado.password) {
      return res.status(401).json({ 
        error: 'Este usuario no tiene contraseña configurada. Intente iniciar sesión con Google.' 
      });
    }

    // Usamos el método que creamos en el modelo Usuario
    const passwordEsValida = usuarioEncontrado.validPassword(password);
    if (!passwordEsValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // generamos el token CSRF
    const csrfToken = generarTokenCSRF();

    const payload = {
      id: usuarioEncontrado.id,
      email: usuarioEncontrado.email,
      rol: usuarioEncontrado.rol, 
      apiKey: process.env.API_KEY,
      csrfToken,
    };

    const tokenJWT = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // CONFIGURACIÓN DE COOKIES Y RESPUESTA
    res.cookie('jwt_token', tokenJWT, buildCookieOptions());
    res.cookie('csrf_token', csrfToken, buildCSRFCookieOptions());

    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuarioEncontrado.id,
        email: usuarioEncontrado.email,
        rol: usuarioEncontrado.rol
      },
      csrfToken,
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el proceso de login' });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie('jwt_token', buildCookieOptions());
    res.clearCookie('csrf_token', buildCSRFCookieOptions());
    res.json({ mensaje: 'Logout exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error en el proceso de logout' });
  }
};

// Endpoint para verificar si el usuario está autenticado y obtener su información
const verificarAuth = (req, res) => {
  try {
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