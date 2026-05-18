'use strict';

const express = require('express');
const router = express.Router();

const tareaController = require('../controllers/tarea.controller');
const personaController = require('../controllers/persona.controller');

// importamos los middlewares de seguridad
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');

//middleware
router.use(verificarToken, esAdmin);

//gestion de usuarios

// Listar todos los usuarios del sistema
router.get('/usuarios', personaController.listar);

// Crear un nuevo usuario
router.post('/usuarios', personaController.registrar);

// Actualizar datos 
router.put('/usuarios/:id', personaController.modificar);

// Eliminar un usuario 
router.delete('/usuarios/:id', personaController.eliminarFisica);


//busqueda avanzada de admin
router.get('/buscar/usuarios-por-tags', tareaController.adminObtenerUsuariosPorTags);
router.get('/buscar/tareas-por-tags', tareaController.adminObtenerTareasPorTags);
router.get('/buscar/tags-por-usuarios', tareaController.adminObtenerTagsPorUsuarios);

module.exports = router;