'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tareaTags extends Model {
    
    static associate(models) {
      this.belongsTo(models.Tarea, { foreignKey: 'tareaId' });
      this.belongsTo(models.Tag, { foreignKey: 'tagId' });
    }
  }
  tareaTags.init({
    tagId: DataTypes.INTEGER,
    tareaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tareaTags',
  });
  return tareaTags;
};