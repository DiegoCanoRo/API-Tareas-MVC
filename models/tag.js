'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
  
    static associate(models) {
// un tag puede estar en muchas tareas 
  this.belongsToMany(models.Tarea, {
    through: 'tareaTags',
    foreignKey: 'tagId',
    otherKey: 'tareaId'
  });    }
  }
  Tag.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};