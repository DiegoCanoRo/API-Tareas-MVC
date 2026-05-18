'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt'); // Necesario para encriptar

module.exports = (sequelize, DataTypes) => {
  class Persona extends Model {
    static associate(models) {
      // una Persona tiene muchas Tareas
      this.hasMany(models.Tarea, {
        foreignKey: 'personaId',
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
    password: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    rol: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true 
    }
  }, {
    sequelize,
    modelName: 'Persona',
    tableName: 'usuarios', // Apunta a la tabla del login
    hooks: {
      // Encriptar antes de crear un nuevo usuario
      beforeCreate: async (persona) => {
        if (persona.password) {
          const salt = await bcrypt.genSalt(10);
          persona.password = await bcrypt.hash(persona.password, salt);
        }
      },
      // Encriptar cuando se actualiza la contraseña desde Gestión de Usuarios
      beforeUpdate: async (persona) => {
        if (persona.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          persona.password = await bcrypt.hash(persona.password, salt);
        }
      }
    }
  });

  return Persona;
};