const express = require('express');
const router = express.Router();
const personaController = require('../controllers/persona.controller');

// Gestión de Usuarios
router.post('/', personaController.registrar);            // Registro
router.put('/:id', personaController.modificar);          // Modificación
router.patch('/:id/desactivar', personaController.desactivar); // Desactivación
router.patch('/:id/activar', personaController.activar);       // Activación
router.delete('/:id', personaController.eliminarFisica);   // Eliminación Física

module.exports = router;