/**
 * Configuración de la aplicación Express
 */

const express = require('express');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');

// Importación de rutas y controladores
const { verificarToken } = require('./middleware/auth.middleware');
const authController = require('./controllers/auth.controller');
const tareaRoutes = require('./routes/tarea.routes');
const personaRoutes = require('./routes/persona.routes');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true 
}));

// Middlewares base
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

//rutas de autenticacion
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);


// Dejamos las rutas sin verificarToken para que pruebes libremente en Postman
app.use('/api/tareas', tareaRoutes);
app.use('/api/personas', personaRoutes); 

// Ruta de bienvenida e información
app.get('/', (req, res) => {
  res.json({
    message: 'API de Tareas - Gestión de Usuarios Activa',
    version: '1.0.0',
    endpoints: {
      personas: 'CRUD completo en /api/personas',
      tareas: 'CRUD completo en /api/tareas'
    }
  });
});

// Middleware para manejar rutas no encontradas 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message
  });
});

module.exports = app;