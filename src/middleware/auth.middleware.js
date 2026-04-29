'use strict';

const jwt = require('jsonwebtoken');

// middleware para verificar el token JWT y el token CSRF en las solicitudes protegidas
const verificarToken = (req, res, next) => {
  try {
    const tokenJWT = req.cookies.jwt_token;

    // si no se proporciona el token JWT, responder con un error de autenticación
    if (!tokenJWT) {
      return res.status(401).json({ error: 'Token JWT no proporcionado' });
    }

    
    const csrfToken = req.headers['x-csrf-token'];
    // si no se proporciona el token CSRF, responder con un error de autenticación
    if (!csrfToken) {
      return res.status(401).json({ error: 'Token CSRF no proporcionado' });
    }

    const decoded = jwt.verify(tokenJWT, process.env.JWT_SECRET);

    // verificar que el token CSRF en el JWT coincida con el token CSRF enviado en la solicitud
    if (decoded.csrfToken !== csrfToken) {
      return res.status(401).json({ error: 'Token CSRF inválido' });
    }

    // verificar que la API Key en el JWT coincida con la API Key esperada
    if (decoded.apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: 'API Key inválida' });
    }

    // si el token JWT es válido y el token CSRF coincide, adjuntar la información del usuario al objeto req para su uso en los controladores
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      apiKey: decoded.apiKey,
    };

    // continuar con la siguiente función de middleware o controlador
    next();
  } catch (error) {
    console.error('Error en verificación de token:', error.message);
    // manejar errores específicos de JWT para proporcionar mensajes de error más claros
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token JWT inválido' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token JWT expirado' });
    }

    return res.status(500).json({ error: 'Error en autenticación' });
  }
};

// middleware para validar la API Key en las solicitudes que requieren autenticación
const validarApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  // si no se proporciona la API Key, responder con un error de autenticación
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key no proporcionada' });
  }

  // si la API Key proporcionada no coincide con la API Key esperada, responder con un error de autenticación
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'API Key inválida' });
  }

  next();
};

module.exports = {
  verificarToken,
  validarApiKey,
};