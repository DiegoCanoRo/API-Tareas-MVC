const { Persona, Usuario } = require('../../models');

const listar = async (req, res) => {
    try {
        const personas = await Persona.findAll(); 
        res.json({ success: true, data: personas });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Registro de usuario
const registrar = async (req, res) => {
    try {
        
        const nuevaPersona = await Persona.create(req.body);
        res.status(201).json({ success: true, data: nuevaPersona });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Modificación
const modificar = async (req, res) => {
    try {
        const { id } = req.params;
        let datosAActualizar = { ...req.body };

        // Si la contraseña viene vacía desde el frontend (porque el admin no quiso cambiarla),
        // la eliminamos del objeto para que no se guarde como un texto vacío.
        if (!datosAActualizar.password || datosAActualizar.password.trim() === '') {
            delete datosAActualizar.password;
        }

        const [updated] = await Persona.update(datosAActualizar, { 
            where: { id },
            individualHooks: true 
        });
        
        if (!updated) return res.status(404).json({ message: "Usuario no encontrado" });
        
        const usuario = await Persona.findByPk(id);
        res.json({ success: true, data: usuario });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Desactivación del usuario
const desactivar = async (req, res) => {
    try {
        await Persona.update({ activo: false }, { where: { id: req.params.id } });
        res.json({ success: true, message: 'Usuario desactivado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Activación del usuario
const activar = async (req, res) => {
    try {
        await Persona.update({ activo: true }, { where: { id: req.params.id } });
        res.json({ success: true, message: 'Usuario activado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Eliminación física del usuario
const eliminarFisica = async (req, res) => {
    try {
        const borrado = await Persona.destroy({ where: { id: req.params.id } });
        if (!borrado) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ success: true, message: 'Usuario borrado de la base de datos' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { registrar, modificar, desactivar, activar, eliminarFisica, listar };