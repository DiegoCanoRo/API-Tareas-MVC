'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      proveedor: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'google',
      },
      rol: {
      type: Sequelize.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user'
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Usuarios');
  }
};
