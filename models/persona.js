'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Persona extends Model {
  
    static associate(models) {
      // una Persona tiene muchas Tareas
  this.hasMany(models.Tarea, {
    foreignKey: 'personaId', // 
    as: 'tareas'
    });
    }
  }
  Persona.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
  
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true //todos los usuarios nuevos están activos por defecto
    }
  }, {
    sequelize,
    modelName: 'Persona',
  });
  return Persona;
};