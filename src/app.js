/**
 * Configuración de la aplicación Express
 */

const express = require('express');
const cors = require('cors'); 
const { verificarToken } = require('./middleware/auth.middleware')
const authController = require('./controllers/auth.controller');
const tareaRoutes = require('./routes/tarea.routes');
const cookieParser = require('cookie-parser');

const app = express();


// config cors
app.use(cors({
  origin: 'http://localhost:3001', // 
  credentials: true 
}));


app.use(cookieParser());
// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


//ruta de login
app.post('/api/auth/login', authController.login);
// deslog
app.post('/api/auth/logout', authController.logout);

app.use('/api/tareas',verificarToken, tareaRoutes);


// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API de Tareas - Práctica MVC con Express',
    version: '1.0.0',
    endpoints: {
      getAll: 'GET /api/tareas',
      getByTitle: 'GET /api/tareas/buscar',
      getById: 'GET /api/tareas/:id',
      create: 'POST /api/tareas',
      updateFull: 'PUT /api/tareas/:id',
      updatePartial: 'PATCH /api/tareas/:id',
      delete: 'DELETE /api/tareas/:id'
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

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message
  });
});

module.exports = app;
