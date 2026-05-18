const { Tag } = require('../../models');

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      attributes: ['id', 'nombre'], // Solo traemos lo que el frontend necesita
      order: [['nombre', 'ASC']]    // Ordenados alfabéticamente
    });
    
    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error("Error al obtener tags:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las etiquetas"
    });
  }
};

module.exports = {
  getAllTags
};