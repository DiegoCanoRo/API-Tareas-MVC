const { Tarea, Persona, Tag } = require('../../models');
const { Op } = require('sequelize');

// GET /api/tareas
const obtenerTodas = async (req, res) => {
    try {
        const tareas = await Tarea.findAll({ 
            include: [
                { model: Persona, as: 'autor' }, 
                { model: Tag, as: 'Tags' }
            ] 
        });
        res.json({ success: true, data: tareas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/tareas/buscar?titulo=...
const obtenerPorTitulo = async (req, res) => {
    try {
        const { titulo } = req.query;
        const tareas = await Tarea.findAll({
            where: { titulo: { [Op.like]: `%${titulo}%` } },
            include: [
                { model: Persona, as: 'autor' }, 
                { model: Tag, as: 'Tags' }
            ]
        });
        res.json({ success: true, data: tareas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/tareas/:id
const obtenerPorId = async (req, res) => {
    try {
        const tarea = await Tarea.findByPk(req.params.id, { 
            include: [
                { model: Persona, as: 'autor' }, 
                { model: Tag, as: 'Tags' }
            ] 
        });
        if (!tarea) return res.status(404).json({ success: false, message: 'No encontrada' });
        res.json({ success: true, data: tarea });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST /api/tareas
const crear = async (req, res) => {
    try {
        const nuevaTarea = await Tarea.create(req.body);
        res.status(201).json({ success: true, data: nuevaTarea });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// PUT & PATCH
const actualizarCompleta = async (req, res) => {
    try {
        await Tarea.update(req.body, { where: { id: req.params.id } });
        const actualizada = await Tarea.findByPk(req.params.id);
        res.json({ success: true, data: actualizada });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const actualizarParcial = actualizarCompleta;

// DELETE /api/tareas/:id
const eliminar = async (req, res) => {
    try {
        const filas = await Tarea.destroy({ where: { id: req.params.id } });
        if (!filas) return res.status(404).json({ success: false, message: 'No encontrada' });
        res.json({ success: true, message: 'Eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// relaciones
const obtenerTareasPorPersona = async (req, res) => {
    try {
        const tareas = await Tarea.findAll({ 
            where: { personaId: req.params.personaId }, 
            include: [{ model: Tag, as: 'Tags' }] 
        });
        res.json({ success: true, data: tareas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const obtenerTareasPorTag = async (req, res) => {
    try {
       
        const tag = await Tag.findByPk(req.params.tagId, { 
            include: [{ model: Tarea, as: 'Tareas' }] 
        });
        res.json({ success: true, data: tag ? tag.Tareas : [] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const obtenerPersonasPorTag = async (req, res) => {
    try {
        const personas = await Persona.findAll({
            include: [{
                model: Tarea,
                as: 'Tareas',
                required: true,
                include: [{ 
                    model: Tag, 
                    as: 'Tags', 
                    where: { id: req.params.tagId }, 
                    required: true 
                }]
            }]
        });
        res.json({ success: true, data: personas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const agregarTagATarea = async (req, res) => {
    try {
        const { tareaId, tagId } = req.body;
        const tarea = await Tarea.findByPk(tareaId);
        const tag = await Tag.findByPk(tagId);
        if (!tarea || !tag) return res.status(404).json({ message: 'No encontrado' });
        
        await tarea.addTag(tag); 
        res.json({ success: true, message: 'Relacionado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    obtenerTodas,
    obtenerPorTitulo,
    obtenerPorId,
    crear,
    actualizarCompleta,
    actualizarParcial,
    eliminar,
    obtenerTareasPorPersona,
    obtenerTareasPorTag,
    obtenerPersonasPorTag,
    agregarTagATarea
};