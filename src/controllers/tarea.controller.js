'use strict';

const { Tarea, Persona, Tag } = require('../../models');
const { Op } = require('sequelize');

/**
 * cada Usuario puede gestionar sus Tareas
 * Obtiene todas las tareas pertenecientes al usuario autenticado.
 */
const obtenerTodas = async (req, res) => {
    try {
        const tareas = await Tarea.findAll({ 
            where: { personaId: req.usuario.id }, 
            include: [
                { model: Tag, as: 'Tags' }
            ] 
        });
        res.json({ success: true, data: tareas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Buscar tareas por etiquetas por su ID (Usuario normal)
 * Ejemplo: /api/tareas/buscar?tagIds=1,2
 */
const buscarPorEtiquetas = async (req, res) => {
    try {
        const { tagIds } = req.query; 
        if (!tagIds) {
            return res.status(400).json({ success: false, message: 'Debe proporcionar IDs de etiquetas' });
        }
        
        const ids = tagIds.split(',').map(id => parseInt(id));

        const tareas = await Tarea.findAll({
            where: { personaId: req.usuario.id },
            include: [{
                model: Tag,
                as: 'Tags',
                where: { id: { [Op.in]: ids } },
                required: true 
            }]
        });
        res.json({ success: true, data: tareas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * GET /api/tareas/:id
 * Solo permite ver la tarea si pertenece al usuario.
 */
const obtenerPorId = async (req, res) => {
    try {
        const tarea = await Tarea.findOne({ 
            where: { 
                id: req.params.id,
                personaId: req.usuario.id 
            },
            include: [{ model: Tag, as: 'Tags' }] 
        });
        if (!tarea) return res.status(404).json({ success: false, message: 'Tarea no encontrada o sin acceso' });
        res.json({ success: true, data: tarea });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * crear Tarea con Etiquetas asociadas
 * Recibe titulo, descripcion, categoria y un array de tagIds.
 */
const crear = async (req, res) => {
    try {
        const { titulo, descripcion, categoria, tags } = req.body;
        
        const nuevaTarea = await Tarea.create({
            titulo,
            descripcion,
            categoria,
            completada: false,
            personaId: req.usuario.id 
        });

        // Si se envían IDs de etiquetas en el body, se crean las relaciones en tareaTags
        if (tags && Array.isArray(tags) && tags.length > 0) {
            await nuevaTarea.setTags(tags);
        }

        const tareaCompleta = await Tarea.findByPk(nuevaTarea.id, { 
            include: [{ model: Tag, as: 'Tags' }] 
        });

        res.status(201).json({ success: true, data: tareaCompleta });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Actualizar tarea (Solo si es propia)
 */
const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, categoria, completada, tags } = req.body;

        //buscamos la tarea primero para asegurarnos de que existe y es del usuario
        const tarea = await Tarea.findOne({ 
            where: { id, personaId: req.usuario.id } 
        });

        if (!tarea) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
        }

        // actualizamos solo los campos propios de la tabla Tarea
        await tarea.update({
            titulo: titulo || tarea.titulo,
            descripcion: descripcion || tarea.descripcion,
            categoria: categoria || tarea.categoria,
            completada: completada !== undefined ? (completada === true || completada === 'true') : tarea.completada
        });

        // actualizamos las etiquetas
        if (tags && Array.isArray(tags)) {
            await tarea.setTags(tags);
        }

        // devolvemos la tarea nueva con sus etiquetas
        const resultado = await Tarea.findByPk(id, { 
            include: [{ model: Tag, as: 'Tags' }] 
        });

        res.json({ success: true, data: resultado });
    } catch (error) {
        console.error("Error en actualizar:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
/**
 * Eliminar tarea (Solo si es propia)
 */
const eliminar = async (req, res) => {
    try {
        const filas = await Tarea.destroy({ 
            where: { 
                id: req.params.id,
                personaId: req.usuario.id 
            } 
        });
        if (!filas) return res.status(404).json({ success: false, message: 'No encontrada o sin acceso' });
        res.json({ success: true, message: 'Eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



/**
 * Admin: Usuarios asociados a una o varias etiquetas
 */
const adminObtenerUsuariosPorTags = async (req, res) => {
    try {
        const { tagIds } = req.query; 
        if (!tagIds) return res.json({ success: true, data: [] }); // Evita errores si está vacío

        const ids = tagIds.split(',').map(id => parseInt(id));

        const personas = await Persona.findAll({
            include: [{
                model: Tarea,
                as: 'tareas', 
                required: true,
                include: [{ 
                    model: Tag, 
                    as: 'Tags', 
                    where: { id: { [Op.in]: ids } },
                    required: true 
                }]
            }]
        });
        res.json({ success: true, data: personas });
    } catch (error) {
        console.error("Error en adminObtenerUsuariosPorTags:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

//buscar tareas por nombre de etiqueta (Usuario normal)
const buscarPorNombreTag = async (req, res) => {
    try {
        const { nombre } = req.query; 
        const tareas = await Tarea.findAll({
            where: { personaId: req.usuario.id },
            include: [{
                model: Tag,
                as: 'Tags',
                where: { 
                    nombre: { [Op.like]: `%${nombre}%` } 
                },
                required: true 
            }]
        });
        res.json({ success: true, data: tareas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


/**
 * Admin: Tareas asociadas a una o varias Etiquetas
 */
const adminObtenerTareasPorTags = async (req, res) => {
    try {
        const { tagIds } = req.query;
        const ids = tagIds.split(',').map(id => parseInt(id));

        const tareas = await Tarea.findAll({
            include: [{
                model: Tag,
                as: 'Tags',
                where: { id: { [Op.in]: ids } },
                required: true
            }, {
                model: Persona,
                as: 'autor'
            }]
        });
        res.json({ success: true, data: tareas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Admin: Etiquetas asociadas a uno o varios Usuarios
 */
const adminObtenerTagsPorUsuarios = async (req, res) => {
    try {
        const { userIds } = req.query; 
        const ids = userIds.split(',').map(id => parseInt(id));

        const tags = await Tag.findAll({
            include: [{
                model: Tarea,
                as: 'Tareas',
                where: { personaId: { [Op.in]: ids } },
                required: true
            }]
        });
        res.json({ success: true, data: tags });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
    buscarPorEtiquetas,
    adminObtenerUsuariosPorTags,
    adminObtenerTareasPorTags,
    adminObtenerTagsPorUsuarios,
    buscarPorNombreTag
};