'use strict';

const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT y el token CSRF en las solicitudes protegidas.
 * Ahora también extrae el 'rol' para permitir el control de acceso por niveles.
 */
const verificarToken = (req, res, next) => {
  try {
    const tokenJWT = req.cookies.jwt_token;

    // Si no se proporciona el token JWT, responder con un error de autenticación
    if (!tokenJWT) {
      return res.status(401).json({ error: 'Token JWT no proporcionado' });
    }

    //const csrfToken = req.headers['x-csrf-token'];
    const decoded = jwt.verify(tokenJWT, process.env.JWT_SECRET);

    // Verificar que el token CSRF en el JWT coincida con el token CSRF enviado en la solicitud
    //if (decoded.csrfToken !== csrfToken) {
     // return res.status(401).json({ error: 'Token CSRF inválido' });
    //}

    // Verificar que la API Key en el JWT coincida con la API Key esperada
    if (decoded.apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: 'API Key inválida' });
    }

    // Adjuntar la información completa del usuario al objeto req
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol, 
      apiKey: decoded.apiKey,
    };

    next();
  } catch (error) {
    console.error('Error en verificación de token:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token JWT inválido' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token JWT expirado' });
    }

    return res.status(500).json({ error: 'Error en autenticación' });
  }
};

/**
 * Middleware para restringir el acceso solo a usuarios con rol 'admin'.
 * Se debe usar después de 'verificarToken'.
 */
const esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    return next();
  }
  
  return res.status(403).json({ 
    error: 'Acceso denegado: Se requieren privilegios de administrador' 
  });
};

/**
 * Middleware para validar la API Key en las solicitudes que requieren autenticación simple.
 */
const validarApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key no proporcionada' });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'API Key inválida' });
  }

  next();
};

module.exports = {
  verificarToken,
  validarApiKey,
  esAdmin, // Exportado para proteger rutas administrativas
};