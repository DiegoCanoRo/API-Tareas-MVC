const { Persona } = require('../../models');

//registro de usuario
const registrar = async (req, res) => {
    try {
        const nuevaPersona = await Persona.create(req.body);
        res.status(201).json({ success: true, data: nuevaPersona });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

//modificación
const modificar = async (req, res) => {
    try {
        const { id } = req.params;
        // Validaciones robustas manuales
        if (req.body.nombre && req.body.nombre.length < 2) {
            return res.status(400).json({ message: "Nombre demasiado corto" });
        }
        
        const [updated] = await Persona.update(req.body, { where: { id } });
        if (!updated) return res.status(404).json({ message: "Usuario no encontrado" });
        
        const usuario = await Persona.findByPk(id);
        res.json({ success: true, data: usuario });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

//desactivacipon del usuario
const desactivar = async (req, res) => {
    try {
        await Persona.update({ activo: false }, { where: { id: req.params.id } });
        res.json({ success: true, message: 'Usuario desactivado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

//activación del usuario
const activar = async (req, res) => {
    try {
        await Persona.update({ activo: true }, { where: { id: req.params.id } });
        res.json({ success: true, message: 'Usuario activado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// eliminación fisica del usuario
const eliminarFisica = async (req, res) => {
    try {
        const borrado = await Persona.destroy({ where: { id: req.params.id } });
        if (!borrado) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ success: true, message: 'Usuario borrado de la base de datos' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { registrar, modificar, desactivar, activar, eliminarFisica };