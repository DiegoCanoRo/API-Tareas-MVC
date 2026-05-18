const express = require('express');
const tareaController = require('../controllers/tarea.controller');
const { verificarToken, esAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// rutas protegidas por token (cualquiera autenticado puede acceder)
router.use(verificarToken);

// rutas de busqueda avanzadas
router.get('/buscar/tag-nombre', tareaController.buscarPorNombreTag);
router.get('/buscar/por-etiquetas', tareaController.buscarPorEtiquetas);

//rutas de admin
router.get('/admin/usuarios-por-tags', esAdmin, tareaController.adminObtenerUsuariosPorTags);
router.get('/admin/tareas-por-tags', esAdmin, tareaController.adminObtenerTareasPorTags);
router.get('/admin/tags-por-usuarios', esAdmin, tareaController.adminObtenerTagsPorUsuarios);

// rutas CRUD
router.get('/', tareaController.obtenerTodas);
router.post('/', tareaController.crear);

//rutas con param
router.get('/:id', tareaController.obtenerPorId);
router.put('/:id', tareaController.actualizar);
router.patch('/:id', tareaController.actualizar);
router.delete('/:id', tareaController.eliminar);

module.exports = router;