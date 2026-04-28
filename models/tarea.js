'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tarea extends Model {
    
    static associate(models) {
      // Una tarea pertenece a una persona 
  this.belongsTo(models.Persona, {
    foreignKey: 'personaId',
    as: 'autor'
  });

  // Una tarea tiene muchos tags 
  this.belongsToMany(models.Tag, {
    through: 'tareaTags',
    foreignKey: 'tareaId',
    otherKey: 'tagId'
  });
    }
  }
  Tarea.init({
  titulo: DataTypes.STRING,
  descripcion: DataTypes.STRING,
  categoria: DataTypes.STRING,
  completada: DataTypes.BOOLEAN,
  personaId: DataTypes.INTEGER 
}, {
  sequelize,
  modelName: 'Tarea',
});
  return Tarea;
};