/**
 * Rutas de Tareas
 * Define los endpoints de la API
 */

const express = require('express');
const tareaController = require('../controllers/tarea.controller');

const router = express.Router();

// GET /api/tareas - Obtener todas las tareas
router.get('/', tareaController.obtenerTodas);

//GET /api/tareas/buscar?titulo=nombre - Obtener tareas por título
router.get('/buscar', tareaController.obtenerPorTitulo); // GET /api/tareas/buscar?titulo=express

// Relaciones Directas
router.get('/persona/:personaId', tareaController.obtenerTareasPorPersona);
router.get('/tag/:tagId', tareaController.obtenerTareasPorTag);

// Relación Indirecta
router.get('/personas-por-tag/:tagId', tareaController.obtenerPersonasPorTag);

// Vincular datos
router.post('/vincular-tag', tareaController.agregarTagATarea);


// GET /api/tareas/:id - Obtener una tarea por ID
router.get('/:id', tareaController.obtenerPorId);

// POST /api/tareas - Crear una nueva tarea
router.post('/', tareaController.crear);

// PUT /api/tareas/:id - Actualizar tarea completamente
router.put('/:id', tareaController.actualizarCompleta);

// PATCH /api/tareas/:id - Actualizar tarea parcialmente
router.patch('/:id', tareaController.actualizarParcial);

// DELETE /api/tareas/:id - Eliminar una tarea
router.delete('/:id', tareaController.eliminar);

module.exports = router;
