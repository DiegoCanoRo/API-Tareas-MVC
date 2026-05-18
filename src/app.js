'use strict';

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Configurar Passport Google OAuth
const configurePassport = require('./passport');
const googleOAuthReady = configurePassport();

// Importación de middlewares de seguridad
const { verificarToken } = require('./middleware/auth.middleware');

// Importación de rutas
const authController = require('./controllers/auth.controller');
const googleAuthRoutes = require('./routes/auth.routes');
const tareaRoutes = require('./routes/tarea.routes');
const personaRoutes = require('./routes/persona.routes');
const adminRoutes = require('./routes/admin.routes'); 
const tagRoutes = require('./routes/tag.routes');
const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Middlewares base
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


// Google OAuth
if (googleOAuthReady) {
  app.use('/auth', googleAuthRoutes);
} else {
  const oauthError = (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Google OAuth no está configurado. Revisa el archivo .env',
    });
  };
  app.get('/auth/google/login', oauthError);
  app.get('/auth/google/callback', oauthError);
}

// Auth Tradicional y Verificación
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);
app.get('/api/auth/verify', verificarToken, authController.verificarAuth);

//rutas del api

// el middleware de seguridad ya está dentro de tareaRoutes
app.use('/api/tareas', tareaRoutes);

// gestión de usuarios y búsquedas avanzadas
app.use('/api/admin', adminRoutes);


app.use('/api/personas', personaRoutes);

app.use('/api/tags', tagRoutes);

/**
 * manejo de errores y etsados
 */

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API de Tareas - Gestión de Usuarios y Roles Activa',
    version: '1.1.0',
    endpoints: {
      auth: '/api/auth',
      tareas: '/api/tareas',
      admin: '/api/admin (Solo Admin)',
    },
  });
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message,
  });
});

module.exports = app;