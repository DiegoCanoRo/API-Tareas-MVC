const express = require('express');
const router = express.Router();
const personaController = require('../controllers/persona.controller');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');

// Gestión de Usuarios
router.post('/', personaController.registrar);            // Registro
router.put('/:id', personaController.modificar);          // Modificación
router.patch('/:id/desactivar', personaController.desactivar); // Desactivación
router.patch('/:id/activar', personaController.activar);       // Activación
router.delete('/:id', personaController.eliminarFisica);   // Eliminación Física
router.get('/', verificarToken, esAdmin, personaController.listar);// Listar usuarios (solo para admins)
router.put('/:id', verificarToken, esAdmin, personaController.modificar);

module.exports = router;