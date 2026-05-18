'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {

    }

    // Método para comparar contraseñas
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  Usuario.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    rol: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
    proveedor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'local',
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    sequelize,
    modelName: 'Usuario',
    
  tableName: 'usuarios',
  });
  return Usuario;
};